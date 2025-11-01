// =========================
// file: src/components/document/DocumentTable.tsx
// =========================
"use client";
import React from "react";
import type { DocumentRow } from "./types";

function StatusPill({ value }: { value: string }) {
  const map: Record<string, string> = {
    "Uploaded": "bg-blue-100 text-blue-700",
    Processing: "bg-amber-100 text-amber-700",
    "Completed": "bg-green-100 text-green-700",
    Error: "bg-red-100 text-red-700",
    Queued: "bg-neutral-100 text-neutral-700",
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
            <th className="px-4 py-3 text-left">Status</th>
            <th className="px-4 py-3 text-left">Uploaded</th>
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
              <td className="px-4 py-3">
                <StatusPill value={d.status} />
              </td>
              <td className="px-4 py-3 text-xs text-neutral-500">
                {new Date(d.uploadedAt).toLocaleDateString()}
              </td>
              <td className="px-4 py-3 text-right">
                <button
                  onClick={() => onOpenReport(d.id)}
                  disabled={d.status !== "Completed"}
                  className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                    d.status === "Completed"
                      ? "bg-white text-gray-700 hover:bg-gray-50"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
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