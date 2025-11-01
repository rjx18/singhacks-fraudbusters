// =========================
// file: src/components/document/ProspectSummary.tsx
// =========================
"use client";
import type { Prospect } from "./types";

export function ProspectSummary({
  prospect,
  total,
  completed,
  processing,
}: {
  prospect: Prospect;
  total: number;
  completed: number;
  processing: number;
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
        <div className="text-sm text-neutral-500">Completed</div>
        <div className="mt-1 text-2xl font-semibold text-green-700">{completed}</div>
      </div>
      <div className="rounded-2xl border bg-white p-4">
        <div className="text-sm text-neutral-500">Processing</div>
        <div className="mt-1 text-2xl font-semibold text-amber-700">{processing}</div>
      </div>
    </div>
  );
}