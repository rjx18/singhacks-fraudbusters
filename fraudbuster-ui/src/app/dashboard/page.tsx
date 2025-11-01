"use client";
import React, { useState } from "react";

export default function DashboardPage() {

  return (
    <div className="flex min-h-screen bg-neutral-50 text-neutral-900">

      <main className="flex-1">
        {/* Header */}
        <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
          <div className="px-6 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <h1 className="text-xl font-semibold">Dashboard</h1>

            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  placeholder="Search transactions, rules, or documents  ⌘K"
                  className="w-80 rounded-2xl border border-neutral-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B45]"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">⌘K</span>
              </div>
              <button className="rounded-2xl border px-3 py-2 text-sm bg-white hover:bg-neutral-50">
                New Rule
              </button>
              <button className="rounded-2xl border px-3 py-2 text-sm bg-white hover:bg-neutral-50">
                Upload Docs
              </button>
            </div>
          </div>
        </div>

        {/* Content grid: main + right rail */}
        <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Stat tiles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              <StatCard title="Open Alerts" value="42" sub="+8 today" />
              <StatCard title="High-Risk Tx (24h)" value="17" sub="P95 latency 380ms" />
              <StatCard title="Doc Issues (Today)" value="2" sub="1 critical" />
              <StatCard title="Rules Active" value="40" sub="3 pending review" />
            </div>

            {/* Real-Time Alerts list */}
            <div className="rounded-2xl border bg-white">
              <div className="px-4 py-3 border-b text-base font-semibold">Real-Time Alerts</div>
              <ul className="divide-y">
                <AlertItem
                  id="AL-2025-0019"
                  severity="High"
                  title="Structuring pattern across 4 jurisdictions"
                  desc="Client 8842 triggered FINMA SR rule v1.6 & MAS 626-8 red-flag (amount split over 48h)."
                  meta="5m ago · Routed to Compliance"
                />
                <AlertItem
                  id="AL-2025-0018"
                  severity="Medium"
                  title="Unusual beneficiary in HK"
                  desc="Deviation from historic profile; KYC review recommended. HKMA circular 12-2025 matched."
                  meta="22m ago · Awaiting triage"
                />
              </ul>
            </div>
          </div>

          {/* Right rail */}
          <div className="space-y-6">
            <RightCard title="Document Queue">
              <DocItem name="Swiss_Home_Purchase_Agreement.pdf" sub="12 issues found" risk={68} />
              <DocItem name="Passport_Scan.png" sub="Likely AI-gen" risk={42} />
            </RightCard>

            <RightCard title="Regulatory Updates">
              <RegItem source="FINMA" time="2h ago" text="Revision of SR on transaction monitoring v1.6" />
              <RegItem source="MAS" time="7h ago" text="Notice 626 update: additional red-flags guidance" />
            </RightCard>
          </div>
        </div>
      </main>
    </div>
  );
}

/* ---------- small components ---------- */

function StatCard({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="rounded-2xl border bg-white p-4 shadow-sm">
      <div className="text-sm font-medium text-neutral-500">{title}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
      {sub ? <div className="text-xs text-neutral-500 mt-1">{sub}</div> : null}
    </div>
  );
}

function Chip({ children, color }: { children: React.ReactNode; color: "High" | "Medium" | "Low" }) {
  const map = {
    High: "bg-rose-100 text-rose-700",
    Medium: "bg-amber-100 text-amber-700",
    Low: "bg-green-100 text-green-700",
  } as const;
  return <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${map[color]}`}>{children}</span>;
}

function AlertItem({
  id,
  severity,
  title,
  desc,
  meta,
}: {
  id: string;
  severity: "High" | "Medium" | "Low";
  title: string;
  desc: string;
  meta: string;
}) {
  return (
    <li className="p-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="text-xs text-neutral-500">{id} · <span className="font-medium">{severity}</span></div>
          <div className="text-sm font-semibold mt-1">{title}</div>
          <div className="text-sm text-neutral-700 mt-1">{desc}</div>
          <div className="text-xs text-neutral-500 mt-1">{meta}</div>
        </div>
        <div className="flex gap-2">
          <button className="rounded-xl border px-3 py-1.5 bg-white text-xs">Open</button>
          <button className="rounded-xl border px-3 py-1.5 bg-white text-xs">Assign</button>
        </div>
      </div>
    </li>
  );
}

function RightCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border bg-white">
      <div className="px-4 py-3 border-b text-base font-semibold">{title}</div>
      <div className="p-3 space-y-2">{children}</div>
    </div>
  );
}

function DocItem({ name, sub, risk }: { name: string; sub: string; risk: number }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-neutral-50">
      <div>
        <div className="text-sm font-medium">{name}</div>
        <div className="text-xs text-neutral-500">{sub}</div>
      </div>
      <Chip color={risk >= 60 ? "High" : risk >= 30 ? "Medium" : "Low"}>{`Risk ${risk}`}</Chip>
    </div>
  );
}

function RegItem({ source, time, text }: { source: string; time: string; text: string }) {
  return (
    <div className="flex items-center justify-between rounded-xl px-3 py-2 hover:bg-neutral-50">
      <div>
        <div className="text-sm font-medium">{source}</div>
        <div className="text-xs text-neutral-500">{text}</div>
      </div>
      <div className="text-xs text-neutral-400">{time}</div>
    </div>
  );
}
