export interface AMLRuleMetadata {
  id: string
  category: string
  title: string
  description: string // Markdown-formatted
  jurisdictions: string[]
  references: { label: string; url: string }[]
}

export const AML_RULE_DESCRIPTIONS: Record<string, AMLRuleMetadata> = {
  // =========================
  // A. Wire transparency & travel rule (SWIFT / cross-border)
  // =========================
  'TR-001': {
    id: 'TR-001',
    category: 'A. Wire transparency & travel rule (SWIFT / cross-border)',
    title: 'Travel Rule breach – missing originator info',
    description: `
*If* \`channel in {SWIFT, RTGS}\` **AND** cross-border (\`originator_country != beneficiary_country\`) **AND** \`amount > S$2,000 (or local equiv)\` **AND** (missing any of \`originator_name\`, \`originator_account\`, \`originator address/ID/DOB\`), *then* flag **Travel Rule breach**.

**(MAS 626 §9.4)**
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'TR-002': {
    id: 'TR-002',
    category: 'A. Wire transparency & travel rule (SWIFT / cross-border)',
    title: 'Incomplete SWIFT :50/:59 originator/beneficiary data',
    description: `
*If* \`swift_mt=TRUE\` **AND** (\`swift_f50_present=FALSE\` **OR** \`swift_f59_present=FALSE\`), *then* flag **incomplete originator/beneficiary data**. *(SWIFT :50/:59)*
`,
    jurisdictions: ['SWIFT'],
    references: [
      {
        label: 'Swift',
        url: 'https://www.swift.com/sites/default/files/documents/pmpg_structured_customer_data_mpg.pdf?utm_source=chatgpt.com',
      },
    ],
  },
  'TR-003': {
    id: 'TR-003',
    category: 'A. Wire transparency & travel rule (SWIFT / cross-border)',
    title: 'Cover payment missing end-to-end originator data',
    description: `
*If* \`channel=SWIFT\` **AND** MT202 COV cover payment is implied (you have intermediary BICs) **AND** missing end-to-end originator data when reaching beneficiary, *then* flag **cover-payment transparency failure**.

*(HKMA cover payments; BIS paper)*
`,
    jurisdictions: ['HKMA (Hong Kong)', 'BIS'],
    references: [
      {
        label: 'brdr.hkma.gov.hk+1',
        url: 'https://brdr.hkma.gov.hk/eng/doc-ldg/docId/getPdf/20100208-2-EN/20100208-2-EN.pdf?utm_source=chatgpt.com',
      },
    ],
  },
  'TR-004': {
    id: 'TR-004',
    category: 'A. Wire transparency & travel rule (SWIFT / cross-border)',
    title: 'Beneficiary-bank accepted incomplete originator data',
    description: `
*If* \`travel_rule_complete=FALSE\` **AND** transaction credited anyway, *then* flag **beneficiary-bank control gap** (HKMA AML-2 calls for handling incoming payments lacking complete originator data).
`,
    jurisdictions: ['HKMA (Hong Kong)'],
    references: [
      {
        label: 'Hong Kong Monetary Authority',
        url: 'https://www.hkma.gov.hk/eng/key-functions/banking/anti-money-laundering-and-counter-financing-of-terrorism/ordinances-statutory-guidelines/?utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // B. CDD / KYC freshness & EDD
  // =========================
  'CDD-005': {
    id: 'CDD-005',
    category: 'B. CDD / KYC freshness & EDD',
    title: 'KYC overdue beyond due date',
    description: `
*If* \`booking_datetime > kyc_due_date\`, *then* flag **KYC overdue** *(MAS CDD & ongoing review; similar under AMLO/AMLA)*.
`,
    jurisdictions: ['MAS (Singapore)', 'AMLO (Hong Kong)', 'AMLA (Malaysia)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'CDD-006': {
    id: 'CDD-006',
    category: 'B. CDD / KYC freshness & EDD',
    title: 'PEP without required EDD',
    description: `
*If* \`customer_is_pep=TRUE\` **AND** (\`edd_required=FALSE\` **OR** \`edd_performed=FALSE\`), *then* flag **PEP EDD deficiency**.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'CDD-007': {
    id: 'CDD-007',
    category: 'B. CDD / KYC freshness & EDD',
    title: 'High-risk customer overdue periodic review',
    description: `
*If* \`customer_risk_rating=High\` **AND** \`kyc_last_completed\` older than your high-risk cycle, *then* flag **overdue periodic review**.

*(FINMA expects documented risk analysis driving controls)*
`,
    jurisdictions: ['FINMA (Switzerland)'],
    references: [
      {
        label: 'finma.ch',
        url: 'https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20230824-finma-aufsichtsmitteilung-05-2023.pdf?hash=FB586B5AE576D12DC77ED9AF0A92D387&sc_lang=en&utm_source=chatgpt.com',
      },
    ],
  },
  'CDD-008': {
    id: 'CDD-008',
    category: 'B. CDD / KYC freshness & EDD',
    title: 'Missing SOW for PEP or high-risk entity',
    description: `
*If* \`sow_documented=FALSE\` **AND** \`customer_is_pep=TRUE\` or \`customer_type in {domiciliary_company, trust}\`, *then* flag **SOW gap** *(EDD)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },

  // =========================
  // C. STR / Suspicion handling
  // =========================
  'STR-009': {
    id: 'STR-009',
    category: 'C. STR / Suspicion handling',
    title: 'Late STR filing beyond SLA',
    description: `
*If* \`suspicion_determined_datetime\` exists **AND** \`str_filed_datetime - suspicion_determined_datetime\` > internal SLA (e.g., 24–48h), *then* flag **late STR** *(timely filing is expected; SG STRO/JFIU/MROS)*.
`,
    jurisdictions: ['Singapore (STRO)', 'Hong Kong (JFIU)', 'Switzerland (MROS)'],
    references: [
      {
        label: 'Singapore Police Force+2jfiu.gov.hk+2',
        url: 'https://www.police.gov.sg/Advisories/Commercial-Crimes/Suspicious-Transaction-Reporting-Office?utm_source=chatgpt.com',
      },
    ],
  },
  'STR-010': {
    id: 'STR-010',
    category: 'C. STR / Suspicion handling',
    title: 'Sanctions potential hit executed without clearance',
    description: `
*If* \`sanctions_screening="potential"\` **AND** txn executed without clearing false positives, *then* flag **breach of sanctions controls** *(SECO/HKMA expectations)*.
`,
    jurisdictions: ['FINMA/SECO (Switzerland)', 'HKMA (Hong Kong)'],
    references: [
      {
        label: 'finma.ch+1',
        url: 'https://www.finma.ch/en/documentation/international-sanctions-and-combating-terrorism/international-sanctions-and-independent-freezing-measures/?utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // D. Sanctions & geography
  // =========================
  'SAN-011': {
    id: 'SAN-011',
    category: 'D. Sanctions & geography',
    title: 'Counterparty in sanctioned country/list',
    description: `
*If* \`originator_country\` **or** \`beneficiary_country\` is under **Swiss/EU/UN sanctions** (**SECO** lists) **OR** counterparties match SECO lists, *then* **block/alert**.
`,
    jurisdictions: ['SECO (Switzerland)', 'UN', 'EU'],
    references: [
      {
        label: 'seco.admin.ch+1',
        url: 'https://www.seco.admin.ch/seco/en/home/Aussenwirtschaftspolitik_Wirtschaftliche_Zusammenarbeit/Wirtschaftsbeziehungen/exportkontrollen-und-sanktionen/sanktionen-embargos.html?utm_source=chatgpt.com',
      },
    ],
  },
  'SAN-012': {
    id: 'SAN-012',
    category: 'D. Sanctions & geography',
    title: 'High-risk corridor with vague purpose',
    description: `
*If* high-risk corridor (your HR country list) **AND** \`swift_f70_purpose\` vague/empty, *then* **heightened alert** for potential sanctions evasion / ML typologies. *(HKMA/MAS risk-based approach)*
`,
    jurisdictions: ['HKMA (Hong Kong)', 'MAS (Singapore)'],
    references: [
      {
        label: 'Hong Kong Monetary Authority+1',
        url: 'https://www.hkma.gov.hk/eng/regulatory-resources/regulatory-guides/by-subject-current/anti-money-laundering-and-counter-financing-of-terrorism/',
      },
    ],
  },

  // =========================
  // E. Cash structuring & identification
  // =========================
  'CASH-013': {
    id: 'CASH-013',
    category: 'E. Cash structuring & identification',
    title: 'Missing ID verification for cash transaction',
    description: `
*If* \`product_type in {cash_deposit, cash_withdrawal}\` **AND** (\`cash_id_verified=FALSE\`), *then* flag **ID verification failure**.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'CASH-014': {
    id: 'CASH-014',
    category: 'E. Cash structuring & identification',
    title: 'Structuring pattern below reporting thresholds',
    description: `
*If* \`daily_cash_total_customer\` exceeds internal threshold (e.g., S$20,000/US$10,000 equiv.) **OR** \`daily_cash_txn_count\` spikes with increments just below reporting thresholds, *then* flag **structuring** *(626 §4.29–4.30 aggregation principle)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },

  // =========================
  // F. Purpose & narrative quality
  // =========================
  'PUR-015': {
    id: 'PUR-015',
    category: 'F. Purpose & narrative quality',
    title: 'Generic or missing purpose in high-risk corridor',
    description: `
*If* \`swift_f70_purpose\` is **missing/“N/A”/generic phrases** (e.g., “payment”, “transfer”) in high-risk corridors or unusual amounts, *then* flag **insufficient purpose info** for EDD/STR consideration. *(MAS/HKMA expectations to reconstruct transactions)*
`,
    jurisdictions: ['MAS (Singapore)', 'HKMA (Hong Kong)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'PUR-016': {
    id: 'PUR-016',
    category: 'F. Purpose & narrative quality',
    title: 'Purpose code conflicts with narrative',
    description: `
*If* \`purpose_code\` conflicts with narrative (e.g., \`purpose_code=EDU\` but narrative mentions “invoice # for copper cathodes”), *then* flag **purpose inconsistency**. *(CDD reasonableness)*
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },

  // =========================
  // G. FX reasonableness & fair dealing
  // =========================
  'FX-017': {
    id: 'FX-017',
    category: 'G. FX reasonableness & fair dealing',
    title: 'FX spread outlier for fairness review',
    description: `
*If* \`fx_indicator=TRUE\` **AND** \`abs(fx_spread_bps)\` > policy threshold (e.g., > 150 bps for major pairs), *then* flag **spread outlier** for fairness review *(MAS Fair Dealing; client treatment)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'Reed Smith',
        url: 'https://www.reedsmith.com/en/perspectives/2024/06/mas-updates-guidelines-on-fair-dealing?utm_source=chatgpt.com',
      },
    ],
  },
  'FX-018': {
    id: 'FX-018',
    category: 'G. FX reasonableness & fair dealing',
    title: 'Advised FX trade without suitability',
    description: `
*If* \`is_advised=TRUE\` **AND** **complex/leveraged FX** but no \`suitability_assessed\`, *then* flag **advised FX w/o suitability** *(SFC 5.2; FINMA conduct)*.
`,
    jurisdictions: ['SFC (Hong Kong)', 'FINMA (Switzerland)'],
    references: [
      {
        label: 'sfc.hk+1',
        url: 'https://www.sfc.hk/en/Rules-and-standards/Suitability-requirement?utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // H. Suitability / appropriateness (advised or complex products)
  // =========================
  'SUIT-019': {
    id: 'SUIT-019',
    category: 'H. Suitability / appropriateness (advised or complex products)',
    title: 'Missing suitability for advised trade',
    description: `
*If* \`is_advised=TRUE\` **AND** \`suitability_assessed=FALSE\`, *then* flag **missing suitability** *(SFC 5.2; FINMA circular)*.
`,
    jurisdictions: ['SFC (Hong Kong)', 'FINMA (Switzerland)'],
    references: [
      {
        label: 'sfc.hk+1',
        url: 'https://www.sfc.hk/en/Rules-and-standards/Suitability-requirement?utm_source=chatgpt.com',
      },
    ],
  },
  'SUIT-020': {
    id: 'SUIT-020',
    category: 'H. Suitability / appropriateness (advised or complex products)',
    title: 'Override after mismatch without justification',
    description: `
*If* \`suitability_assessed=TRUE\` **AND** \`suitability_result="mismatch"\` **AND** transaction proceeds, *then* flag **override w/o justification**.
`,
    jurisdictions: ['SFC (Hong Kong)'],
    references: [
      {
        label: 'sfc.hk',
        url: 'https://www.sfc.hk/en/Rules-and-standards/Suitability-requirement?utm_source=chatgpt.com',
      },
    ],
  },
  'SUIT-021': {
    id: 'SUIT-021',
    category: 'H. Suitability / appropriateness (advised or complex products)',
    title: 'Complex product sold to low-risk client',
    description: `
*If* \`product_complex=TRUE\` **AND** customer \`client_risk_profile=Low\`, *then* flag **complex product to low-risk client** unless risk acknowledgement documented. *(SFC 5.2; FinSA)*
`,
    jurisdictions: ['SFC (Hong Kong)', 'FinSA (Switzerland)'],
    references: [
      {
        label: 'sfc.hk+1',
        url: 'https://www.sfc.hk/en/Rules-and-standards/Suitability-requirement?utm_source=chatgpt.com',
      },
    ],
  },
  'SUIT-022': {
    id: 'SUIT-022',
    category: 'H. Suitability / appropriateness (advised or complex products)',
    title: 'VA exposure missing risk disclosure',
    description: `
*If* \`product_has_va_exposure=TRUE\` **AND** \`va_disclosure_provided=FALSE\`, *then* flag **VA risk disclosure gap** *(MAS PSN08; SFC VASP)*.
`,
    jurisdictions: ['MAS (Singapore)', 'SFC (Hong Kong)'],
    references: [
      {
        label: 'Monetary Authority of Singapore+1',
        url: 'https://www.mas.gov.sg/-/media/mas-media-library/regulation/notices/pso/psn08-notice-on-disclosures-and-communications/psn08---phase-2.pdf?hash=32CEA4C3A79F31BF756C6196EB5746D7&sc_lang=en&utm_source=chatgpt.com',
      },
    ],
  },
  'SUIT-023': {
    id: 'SUIT-023',
    category: 'H. Suitability / appropriateness (advised or complex products)',
    title: 'Suggest PBA process for de facto portfolio advice',
    description: `
*If* \`is_advised=TRUE\` **AND** not portfolio-based but many trades clearly pursuing a portfolio outcome, suggest **PBA** process per HKMA circular.
`,
    jurisdictions: ['HKMA (Hong Kong)'],
    references: [
      {
        label: 'brdr.hkma.gov.hk+1',
        url: 'https://brdr.hkma.gov.hk/eng/doc-ldg/docId/getPdf/20240223-2-EN/20240223-2-EN.pdf?utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // I. Virtual assets (VA / DPT)
  // =========================
  'VA-024': {
    id: 'VA-024',
    category: 'I. Virtual assets (VA / DPT)',
    title: 'VASP unlicensed/unauthorised',
    description: `
*If* \`product_has_va_exposure=TRUE\` **AND** counterparty is a VASP **without** proper licensing/registration (HK SFC VASP; SG DPT lists), *then* **block/alert**.
`,
    jurisdictions: ['SFC (Hong Kong)', 'MAS (Singapore)'],
    references: [
      {
        label: 'sfc.hk+1',
        url: 'https://www.sfc.hk/-/media/EN/assets/components/codes/files-current/web/guidelines/guideline-on-anti-money-laundering-and-counter-financing-of-terrorism-for-licensed-corporations/AML-Guideline-for-LCs-and-SFC-licensed-VASPs_Eng_1-Jun-2023.pdf?rev=d250206851484229ab949a4698761cb7&utm_source=chatgpt.com',
      },
    ],
  },
  'VA-025': {
    id: 'VA-025',
    category: 'I. Virtual assets (VA / DPT)',
    title: 'VA travel-rule breach for VA wire-like transfer',
    description: `
*If* VA transfer mimics **wire transfer** (value transfer between two parties) **AND** missing originator/beneficiary info (name, account/wallet, address/ID), *then* flag **VA travel-rule breach** *(FINMA 02/2019; FATF VA/VASP guidance; MAS PSN02)*.
`,
    jurisdictions: ['FINMA (Switzerland)', 'FATF', 'MAS (Singapore)'],
    references: [
      {
        label: 'finma.ch+2FATF+2',
        url: 'https://www.finma.ch/en/~/media/finma/dokumente/dokumentencenter/myfinma/4dokumentation/finma-aufsichtsmitteilungen/20190826-finma-aufsichtsmitteilung-02-2019.pdf?la=en&utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // J. Channel & field consistency
  // =========================
  'CON-026': {
    id: 'CON-026',
    category: 'J. Channel & field consistency',
    title: 'Incomplete SWIFT payment chain',
    description: `
*If* \`channel=SWIFT\` **AND** \`ordering_institution_bic\` or \`beneficiary_institution_bic\` missing, *then* flag **incomplete payment chain**.
`,
    jurisdictions: ['HKMA (Hong Kong)'],
    references: [
      {
        label: 'brdr.hkma.gov.hk',
        url: 'https://brdr.hkma.gov.hk/eng/doc-ldg/docId/getPdf/20100208-2-EN/20100208-2-EN.pdf?utm_source=chatgpt.com',
      },
    ],
  },
  'CON-027': {
    id: 'CON-027',
    category: 'J. Channel & field consistency',
    title: 'RTGS timing anomaly',
    description: `
*If* \`channel=RTGS\` **AND** \`value_date\` far from \`booking_datetime\` (e.g., > 1 business day), *then* flag **timing anomaly** *(RTGS normally same-day)*.
`,
    jurisdictions: [],
    references: [],
  },
  'CON-028': {
    id: 'CON-028',
    category: 'J. Channel & field consistency',
    title: 'FAST/FPS used cross-border',
    description: `
*If* \`channel in {FAST (SG), FPS (HK)}\` **AND** cross-border countries detected, *then* flag **rail/jurisdiction inconsistency** *(fast schemes are domestic)*.
`,
    jurisdictions: ['SG (FAST)', 'HK (FPS)'],
    references: [],
  },

  // =========================
  // K. Counterparty & correspondent banking
  // =========================
  'COR-029': {
    id: 'COR-029',
    category: 'K. Counterparty & correspondent banking',
    title: 'Shell bank / unsupervised correspondent',
    description: `
*If* respondent/correspondent indicators suggest **shell bank** or **not effectively supervised**, *then* **block/alert** and escalate *(MAS 626 §8)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'COR-030': {
    id: 'COR-030',
    category: 'K. Counterparty & correspondent banking',
    title: 'Payable-through w/o respondent assurance',
    description: `
*If* payable-through account use is detected **AND** no assurance of respondent CDD/monitoring, *then* flag per **MAS 626 §8.4**.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },

  // =========================
  // L. Record-keeping & reconstruction
  // =========================
  'REC-031': {
    id: 'REC-031',
    category: 'L. Record-keeping & reconstruction',
    title: 'Record sufficiency breach',
    description: `
*If* key reconstruction fields missing (\`value_date\`, amount/currency, beneficiary details), *then* flag **record sufficiency breach** *(MAS 626 §9.3–§10)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },
  'REC-032': {
    id: 'REC-032',
    category: 'L. Record-keeping & reconstruction',
    title: 'Retention gap for STR-related transactions',
    description: `
*If* STR-related transactions do not have extended retention flag (≥ 5 years or as required), *then* flag **retention gap** *(MAS 626 §10.4)*.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'sg.ccb.com',
        url: 'https://sg.ccb.com/singapore/uploadfile/ggxx/201301251359094518/626RevisedNoticeBanks.pdf',
      },
    ],
  },

  // =========================
  // M. Pricing & conflicts
  // =========================
  'PRC-033': {
    id: 'PRC-033',
    category: 'M. Pricing & conflicts',
    title: 'Affiliate pricing worse than market',
    description: `
*If* \`fx_counterparty\` is affiliate **AND** pricing is consistently worse than market by > X bps vs peers, *then* flag **conflict/fair dealing** review.
`,
    jurisdictions: ['MAS (Singapore)'],
    references: [
      {
        label: 'Reed Smith',
        url: 'https://www.reedsmith.com/en/perspectives/2024/06/mas-updates-guidelines-on-fair-dealing?utm_source=chatgpt.com',
      },
    ],
  },
  'PRC-034': {
    id: 'PRC-034',
    category: 'M. Pricing & conflicts',
    title: '“OUR” charge pattern – heightened alert',
    description: `
*If* charges \`swift_f71_charges="OUR"\` **and** corridor is commonly used for sanctions evasion typologies, *then* **heightened alert** (fees paid by sender to conceal deductions). *(Typologies + risk-based expectation)*
`,
    jurisdictions: ['BCBS/BIS (typologies)'],
    references: [
      {
        label: 'bis.org',
        url: 'https://www.bis.org/publ/bcbs154.htm?utm_source=chatgpt.com',
      },
    ],
  },

  // =========================
  // N. Behavioral / patterning
  // =========================
  'PAT-035': {
    id: 'PAT-035',
    category: 'N. Behavioral / patterning',
    title: 'Layering via rapid in/out & redemption',
    description: `
Rapid sequence of **fund_subscription → redemption → external wire** with minimal holding period → **flag layering typology** *(use risk-based EDD)*.

*(MROS typologies; National AML strategies)*
`,
    jurisdictions: ['Switzerland (MROS)', 'National AML strategies'],
    references: [
      {
        label: 'fedpol.admin.ch+1',
        url: 'https://www.fedpol.admin.ch/fedpol/en/home/kriminalitaet/geldwaescherei/publikationen.html?utm_source=chatgpt.com',
      },
    ],
  },
  'PAT-036': {
    id: 'PAT-036',
    category: 'N. Behavioral / patterning',
    title: 'Round-tripping via FX',
    description: `
**Round-tripping**: incoming wires from Country A → FX → outgoing to same party in Country A with small residual → flag. *(Risk-based expectation)*
`,
    jurisdictions: [],
    references: [],
  },
  'PAT-037': {
    id: 'PAT-037',
    category: 'N. Behavioral / patterning',
    title: 'Dormant customer sudden high-value SWIFT wires',
    description: `
**Dormant** customer with sudden high-value SWIFT wires with vague purpose → flag. *(Generic AML good practice across regimes)*
`,
    jurisdictions: [],
    references: [],
  },

  // =========================
  // O. Data quality
  // =========================
  'DQ-038': {
    id: 'DQ-038',
    category: 'O. Data quality',
    title: 'Invalid account number format (IBAN/BIC)',
    description: `
*If* account numbers not IBAN/BIC-valid where expected (e.g., GB IBAN format for UK accounts), *then* flag **format anomaly** *(investigate)*.
`,
    jurisdictions: [],
    references: [],
  },
  'DQ-039': {
    id: 'DQ-039',
    category: 'O. Data quality',
    title: 'Beneficiary type mismatch',
    description: `
*If* \`beneficiary_name\` appears as **company** but \`beneficiary_account\` is **retail individual** (or vice versa), *then* flag **mismatch**.
`,
    jurisdictions: [],
    references: [],
  },
  'DQ-040': {
    id: 'DQ-040',
    category: 'O. Data quality',
    title: 'Originator equals beneficiary with conflicting purpose',
    description: `
*If* \`originator_name == beneficiary_name\` **AND** cross-border **AND** purpose describes third-party payment, *then* flag **name inconsistency**.
`,
    jurisdictions: [],
    references: [],
  },
}
