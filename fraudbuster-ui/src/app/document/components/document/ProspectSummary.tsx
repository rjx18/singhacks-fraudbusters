// =========================
// file: src/components/document/ProspectSummary.tsx
// =========================
"use client";
import type { Prospect } from "./types";

function RiskPill({ score }: { score: number }) {
  const cls =
    score >= 80
      ? "bg-rose-100 text-rose-700"
      : score >= 60
      ? "bg-amber-100 text-amber-700"
      : score >= 30
      ? "bg-yellow-50 text-yellow-700"
      : "bg-green-100 text-green-700";
  return (
    <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cls}`}>{score}</span>
  );
}

export function ProspectSummary({
  prospect,
  total,
  verified,
  issues,
  avgRisk,
}: {
  prospect: Prospect;
  total: number;
  verified: number;
  issues: number;
  avgRisk: number;
}) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-neutral-500">Prospect</div>
        <div className="mt-1 text-base font-semibold">{prospect.name}</div>
        <div className="text-xs text-neutral-500">{prospect.id} · {prospect.region} · Owner: {prospect.owner}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-neutral-500">Total Docs</div>
        <div className="mt-1 text-2xl font-semibold">{total}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-neutral-500">Verified</div>
        <div className="mt-1 text-2xl font-semibold">{verified}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-neutral-500">Avg Risk</div>
        <div className="mt-1 text-2xl font-semibold"><RiskPill score={avgRisk} /></div>
      </div>
    </div>
  );
}