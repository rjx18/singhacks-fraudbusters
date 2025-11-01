// =========================
// file: src/components/document/DocumentTable.tsx
// =========================
"use client";
import React from "react";
import type { DocumentRow } from "./types";

function RiskPill({ score }: { score: number }) {
  const cls = score > 80 ? "bg-red-100 text-red-700" : score >= 60 ? "bg-amber-100 text-amber-700" : score >= 40 ? "bg-yellow-50 text-yellow-700" : "bg-green-100 text-green-700";
  return <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cls}`}>{score}</span>;
}

function StatusPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    "Awaiting OCR": "bg-neutral-100 text-neutral-700",
    Processing: "bg-blue-100 text-blue-700",
    "Issues Found": "bg-rose-100 text-rose-700",
    Verified: "bg-green-100 text-green-700",
    Queued: "bg-amber-100 text-amber-700",
  };
  return <span className={`px-2 py-1 rounded-lg text-xs ${map[value] || map["Queued"]}`}>{value}</span>;
}

export function DocumentTable({
  rows,
  onOpenReport,
}: {
  rows: DocumentRow[];
  onOpenReport: (id: string) => void;
}) {
  return (
    <div className="rounded-2xl border bg-white overflow-hidden">
      <table className="min-w-full text-sm">
        <thead className="bg-neutral-50 text-neutral-600">
          <tr>
            <th className="px-4 py-3 text-left">Document</th>
            <th className="px-4 py-3 text-left">Type</th>
            <th className="px-4 py-3 text-left">Pages</th>
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Risk</th>
            <th className="px-4 py-3 text-left">Issues</th>
            <th className="px-4 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {rows.map((d) => (
            <tr key={d.id} className="hover:bg-neutral-50">
              <td className="px-4 py-3">
                <div className="font-medium">{d.name}</div>
                <div className="text-xs text-neutral-500">{d.id}</div>
              </td>
              <td className="px-4 py-3">{d.type}</td>
              <td className="px-4 py-3">{d.pages || "—"}</td>
              <td className="px-4 py-3">
                <StatusPill value={d.status} />
              </td>
              <td className="px-4 py-3">
                <RiskPill score={d.risk} />
              </td>
              <td className="px-4 py-3">{d.issues}</td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onOpenReport(d.id)}
                  className="rounded-xl border px-3 py-1.5 bg-white text-xs"
                >
                  View Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}