"use client";
import React from "react";
import type { DocumentRow, Prospect } from "./types";

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="px-2 py-1 rounded-lg text-xs bg-neutral-100 text-neutral-700">{children}</span>
  );
}

function RiskPill({ score }: { score: number }) {
  const cls = score >= 80 ? "bg-rose-100 text-rose-700" : score >= 60 ? "bg-amber-100 text-amber-700" : score >= 30 ? "bg-yellow-50 text-yellow-700" : "bg-green-100 text-green-700";
  return <span className={`px-2 py-1 rounded-lg text-xs font-semibold ${cls}`}>{score}</span>;
}

export function ReportDrawer({
  open,
  onClose,
  doc,
  prospect,
}: {
  open: boolean;
  onClose: () => void;
  doc: DocumentRow | null;
  prospect: Prospect;
}) {
  if (!open || !doc) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[560px] bg-white shadow-xl border-l">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="text-base font-semibold">{doc.id} · Document Report</h3>
          <button className="rounded-xl border px-3 py-1.5 text-xs bg-white" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="p-4 space-y-4 text-sm">
          <section className="grid grid-cols-2 gap-3">
            <Field label="Prospect" value={`${prospect.name} (${prospect.id})`} />
            <Field label="File Name" value={doc.name} />
            <Field label="Type" value={doc.type} />
            <Field label="Pages" value={doc.pages || "—"} />
            <Field label="Uploaded" value={new Date(doc.uploadedAt).toLocaleString()} />
            <Field label="Status" value={<Pill>{doc.status}</Pill>} />
            <Field label="Risk" value={<RiskPill score={doc.risk} />} />
          </section>

          <section className="rounded-xl border p-3">
            <div className="text-sm font-medium">Checks</div>
            <ul className="mt-2 list-disc pl-5 text-neutral-700">
              <li>OCR extracted entities (names, dates, amounts) — <b>OK</b></li>
              <li>Format validation (headers, sections, fonts) — <b>{doc.status === "Issues Found" ? "Issues detected" : "OK"}</b></li>
              <li>Image forensics (metadata, noise, splice) — <b>{doc.risk > 60 ? "Anomalies" : "Clear"}</b></li>
              <li>Template match (Home Purchase Agreement v2) — <b>{doc.type === "Agreement" ? "Deviation" : "N/A"}</b></li>
            </ul>
          </section>

          <section className="rounded-xl border p-3">
            <div className="text-sm font-medium">Audit Trail</div>
            <ul className="mt-2 text-neutral-700 space-y-1">
              <li>2025-11-01 09:12 — Uploaded by John Wong</li>
              <li>2025-11-01 09:13 — OCR complete</li>
              <li>2025-11-01 09:15 — Forensics queued</li>
              <li>2025-11-01 09:18 — Validation finished</li>
            </ul>
          </section>

          <section className="rounded-xl border p-3">
            <div className="text-sm font-medium">Actions</div>
            <div className="mt-2 flex flex-wrap gap-2">
              <button className="rounded-xl border px-3 py-1.5 bg-white text-xs">Mark Verified</button>
              <button className="rounded-xl border px-3 py-1.5 bg-white text-xs">Open Case</button>
              <button className="rounded-xl border px-3 py-1.5 bg-white text-xs">Download Report</button>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div>
      <div className="text-xs text-neutral-500">{label}</div>
      <div className="mt-0.5 text-neutral-800">{value}</div>
    </div>
  );
}