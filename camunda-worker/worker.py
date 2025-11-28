import asyncio
import logging
from pyzeebe import ZeebeClient, ZeebeWorker, ZeebeTaskRouter, create_camunda_cloud_channel, Job, JobController
from pyzeebe.errors import BusinessError
from datetime import datetime, date
import requests
from openai import OpenAI
import os
from agent import run_non_deterministic
import json
import time

client = OpenAI(
    api_key=os.getenv("AZURE_OPENAI_API_KEY"),  
    base_url="https://YOUR-RESOURCE-NAME.openai.azure.com/openai/v1/"
    )

worker = None
client = None

# Define tasks
router = ZeebeTaskRouter()

# Setup logging
# logging.basicConfig(level=logging.Debug)

from datetime import datetime, date

# -------------------------------
# Helpers
# -------------------------------
def _to_iso_dt(s: str) -> datetime | None:
    if not s or not s.strip():
        return None
    try:
        return datetime.fromisoformat(s)
    except ValueError:
        return None

def _to_dmy_date(s: str) -> date | None:
    if not s or not s.strip():
        return None
    try:
        return datetime.strptime(s, "%d/%m/%Y").date()
    except ValueError:
        return None

def _to_float(s) -> float:
    try:
        return float(s)
    except (ValueError, TypeError):
        return 0.0

def _to_int(s) -> int:
    try:
        return int(s)
    except (ValueError, TypeError):
        return 0

def _status(results: dict) -> str:
    if all(results.values()):
        return "pass"
    elif any(results.values()):
        return "needs_advice"
    return "fail"

# -------------------------------
# A. Wire transparency & travel rule
# -------------------------------
def tr_001(d): 
    return not (
        d.get("channel") in {"SWIFT", "RTGS"} and
        d.get("originator_country") != d.get("beneficiary_country") and
        _to_float(d.get("amount")) > 2000 and
        any(not d.get(f) for f in ["originator_name", "originator_account"])
    )

def tr_002(d): 
    return not (d.get("swift_mt") and (not d.get("swift_f50_present") or not d.get("swift_f59_present")))

def tr_003(d): 
    return not (d.get("channel") == "SWIFT" and d.get("ordering_institution_bic") and not d.get("originator_name"))

def tr_004(d): 
    return not (d.get("travel_rule_complete") is False and d.get("transaction_executed", True))

@router.task("wire-transparency")
def wire_transparency_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {
        "TR-001": tr_001(d),
        "TR-002": tr_002(d),
        "TR-003": tr_003(d),
        "TR-004": tr_004(d)
    }
    return {"wire": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# B. CDD / KYC freshness & EDD
# -------------------------------
def cdd_005(d):
    booking_dt = _to_iso_dt(d.get("booking_datetime"))
    due_dt = _to_dmy_date(d.get("kyc_due_date"))
    if not booking_dt or not due_dt:
        return False
    return booking_dt <= datetime.combine(due_dt, datetime.min.time())

def cdd_006(d): 
    return not (d.get("customer_is_pep") and (not d.get("edd_required") or not d.get("edd_performed")))

def cdd_007(d):
    if d.get("customer_risk_rating") == "High":
        last_completed = _to_dmy_date(d.get("kyc_last_completed"))
        due_date = _to_dmy_date(d.get("kyc_due_date"))
        if not last_completed or not due_date:
            return False
        return last_completed <= due_date
    return True

def cdd_008(d): 
    return not ((not d.get("sow_documented")) and (d.get("customer_is_pep") or d.get("customer_type") in {"domiciliary_company", "trust"}))

@router.task("cdd-kyc")
def cdd_kyc_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {
        "CDD-005": cdd_005(d),
        "CDD-006": cdd_006(d),
        "CDD-007": cdd_007(d),
        "CDD-008": cdd_008(d)
    }
    return {"cdd": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# C. STR / Suspicion handling
# -------------------------------
def str_009(d):
    fmt = "%Y-%m-%dT%H:%M:%S"
    s_dt, f_dt = d.get("suspicion_determined_datetime"), d.get("str_filed_datetime")
    if s_dt and f_dt and s_dt.strip() and f_dt.strip():
        try:
            delta = datetime.strptime(f_dt, fmt) - datetime.strptime(s_dt, fmt)
            return delta.total_seconds() <= 172800
        except ValueError:
            return False
    return True

def str_010(d): 
    return not (d.get("sanctions_screening") == "potential" and d.get("transaction_executed", True))

@router.task("str-handling")
def str_handling_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"STR-009": str_009(d), "STR-010": str_010(d)}
    return {"str": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# D. Sanctions & geography
# -------------------------------
def san_011(d): 
    return not (d.get("originator_country") in {"IR", "KP"} or d.get("beneficiary_country") in {"IR", "KP"})

def san_012(d): 
    return not (d.get("high_risk_corridor") and not d.get("swift_f70_purpose"))

@router.task("sanctions")
def sanctions_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"SAN-011": san_011(d), "SAN-012": san_012(d)}
    return {"sanctions": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# E. Cash structuring & ID
# -------------------------------
def cash_013(d): 
    return not (d.get("product_type") in {"cash_deposit", "cash_withdrawal"} and not d.get("cash_id_verified"))

def cash_014(d): 
    return not (_to_float(d.get("daily_cash_total_customer")) > 20000 or _to_int(d.get("daily_cash_txn_count")) >= 5)

@router.task("cash-transactions")
def cash_transactions_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"CASH-013": cash_013(d), "CASH-014": cash_014(d)}
    return {"cash": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# F. Purpose & narrative quality
# -------------------------------
def pur_016(d): 
    return not ("EDU" in d.get("purpose_code", "") and "copper" in (d.get("narrative", "")).lower())

@router.task("purpose-checks")
def purpose_checks_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"PUR-016": pur_016(d)}
    return {"purpose": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# G. FX reasonableness & fair dealing
# -------------------------------
def fx_017(d): 
    return not (d.get("fx_indicator") and abs(_to_int(d.get("fx_spread_bps"))) > 150)

def fx_018(d): 
    return not (d.get("is_advised") and d.get("product_complex", False) and not d.get("suitability_assessed"))

@router.task("fx-checks")
def fx_checks_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"FX-017": fx_017(d), "FX-018": fx_018(d)}
    return {"fx": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# H. Suitability / appropriateness
# -------------------------------
def suit_019(d): 
    return not (d.get("is_advised") and not d.get("suitability_assessed"))

def suit_020(d): 
    return not (d.get("suitability_assessedsuitability-checks") and d.get("suitability_result") == "mismatch" and d.get("transaction_proceeds", True))

def suit_021(d): 
    return not (d.get("product_complex") and d.get("client_risk_profile") == "Low" and not d.get("risk_acknowledgement", False))

def suit_022(d): 
    return not (d.get("product_has_va_exposure") and not d.get("va_disclosure_provided"))

@router.task("suitability-checks")
def suitability_checks_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {
        "SUIT-019": suit_019(d),
        "SUIT-020": suit_020(d),
        "SUIT-021": suit_021(d),
        "SUIT-022": suit_022(d)
    }
    return {"suitability": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# I. Virtual assets
# -------------------------------
def va_024(d): 
    return not (d.get("product_has_va_exposure") and d.get("counterparty", "").lower() in {"unlicensed_vasp"})

def va_025(d): 
    return not (d.get("product_has_va_exposure") and any(not d.get(f) for f in ["originator_name", "beneficiary_name", "beneficiary_account"]))

@router.task("virtual-assets")
def virtual_assets_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"VA-024": va_024(d), "VA-025": va_025(d)}
    return {"virtual": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# J. Channel & field consistency
# -------------------------------
def con_026(d): 
    return not (d.get("channel") == "SWIFT" and (not d.get("ordering_institution_bic") or not d.get("beneficiary_institution_bic")))

def con_027(d):
    if d.get("channel") == "RTGS":
        vdate = _to_dmy_date(d.get("value_date"))
        bdate = _to_iso_dt(d.get("booking_datetime"))
        if not vdate or not bdate:
            return False
        return vdate <= bdate.date()
    return True

def con_028(d): 
    return not (d.get("channel") in {"FAST", "FPS"} and d.get("originator_country") != d.get("beneficiary_country"))

@router.task("channel-consistency")
def channel_consistency_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"CON-026": con_026(d), "CON-027": con_027(d), "CON-028": con_028(d)}
    return {"channel": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# K. Counterparty & correspondent banking
# -------------------------------
def cor_029(d): 
    return not d.get("respondent_shell_bank", False)

def cor_030(d): 
    return not (d.get("payable_through") and not d.get("respondent_cdd_done"))

@router.task("correspondent-banking")
def correspondent_banking_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"COR-029": cor_029(d), "COR-030": cor_030(d)}
    return {"counterparty": {"overall_status": _status(tests), "tests": tests}}

# -------------------------------
# L. Record-keeping & reconstruction
# -------------------------------
def rec_031(d): 
    return all(d.get(f) for f in ["value_date", "amount", "beneficiary_name"])

def rec_032(d): 
    return not (d.get("is_str_related") and _to_int(d.get("retention_years")) < 5)

@router.task("record-keeping")
def record_keeping_task(job: Job) -> dict:
    d = job.variables.get("data", {})
    tests = {"REC-031": rec_031(d), "REC-032": rec_032(d)}
    return {"record": {"overall_status": _status(tests), "tests": tests}}


# -------------------------------
# O. Data quality
# -------------------------------
def dq_038(d):
    acct = (d.get("beneficiary_account") or "").strip()
    # must not be empty, alphanumeric, and between 15–34 chars
    return bool(acct) and acct.isalnum() and 15 <= len(acct) <= 34


def dq_039(d):
    name = (d.get("beneficiary_name") or "").lower().strip()
    acct = (d.get("beneficiary_account") or "").lower().strip()

    # guard for empty values
    if not name or not acct:
        return False

    # determine company / personal type by keywords and character composition
    is_company = any(x in name for x in [" ltd", " inc", " co", " pty", " llc"])
    is_personal = name.replace(" ", "").isalpha() and not is_company

    acct_personal_like = acct.startswith(("retail", "pers"))
    acct_business_like = acct.startswith(("biz", "corp"))

    # fail if company name uses personal-like account or vice versa
    return not ((is_company and acct_personal_like) or (is_personal and acct_business_like))


def dq_040(d):
    originator_name = (d.get("originator_name") or "").strip()
    beneficiary_name = (d.get("beneficiary_name") or "").strip()
    originator_country = (d.get("originator_country") or "").strip()
    beneficiary_country = (d.get("beneficiary_country") or "").strip()
    narrative = (d.get("narrative") or "").lower().strip()

    same_name = bool(originator_name and beneficiary_name and originator_name == beneficiary_name)
    cross_border = bool(originator_country and beneficiary_country and originator_country != beneficiary_country)
    third_party = any(k in narrative for k in ["third", "on behalf", "obo"])

    # suspicious if same name, cross-border, and mentions third-party
    return not (same_name and cross_border and third_party)


@router.task("data-quality")
def data_quality_task(job: Job) -> dict:
    d = job.variables.get("data", {})  # safe default
    tests = {
        "DQ-038": dq_038(d),
        "DQ-039": dq_039(d),
        "DQ-040": dq_040(d)
    }
    return {"dataquality": {"overall_status": _status(tests), "tests": tests}}

@router.task("pricing-conflicts")
def pricing_conflicts_task(job: Job) -> dict:
    return {}


@router.task("behavioural-tests")
def behavioural_task(job: Job) -> dict:
    return {}

@router.task("non-deterministic-tests")
def handle_non_deterministic(job: Job):
    result = run_non_deterministic(agent_id="asst_Fx3yFSNAjijmM5xLPK871GZz", message_text=json.dumps(dict(job.variables)))
    print("getting non deterministic tests")
    return result

@router.task("ai-report")
def handle_ai_report(job: Job):
    result = run_non_deterministic(agent_id="asst_8njckKJMwvDFd7mHabUIz8AL", message_text=json.dumps(dict(job.variables)))
    print(result)
    time.sleep(10)
    return {"report": result}

@router.task("ai-advisor")
def handle_non_deterministic(job: Job):
    result = run_non_deterministic(agent_id="asst_kxtuR7cEFyyRUh58CPC3ex8c", message_text=json.dumps(dict(job.variables)))
    print(result)
    time.sleep(10)
    return {"assessment": result}

# Create a channel, the worker and include the router with tasks
async def main():
    global client, worker
    print("Worker starting")
    
    # ADD YOUR CREDENTIALS HERE
    grpc_channel = create_camunda_cloud_channel(client_id="",
                                    client_secret="",
                                    cluster_id="",
                                    region="")
    worker = ZeebeWorker(grpc_channel)
    client = ZeebeClient(grpc_channel)
    worker.include_router(router)
    await worker.work()

asyncio.run(main())
