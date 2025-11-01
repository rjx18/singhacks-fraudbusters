// =========================
// file: src/app/document/page.tsx
// =========================
"use client";
import React, { useMemo, useRef, useState } from "react";
import { ProspectSummary } from "./components/document/ProspectSummary";
import { UploadBox } from "./components/document/UploadBox";
import { DocumentTable } from "./components/document/DocumentTable";
import { ReportDrawer } from "./components/document/ReportDrawer";
import type { DocumentRow, Prospect } from "./components/document/types";

// NOTE: Sidebar intentionally omitted (you'll add later). This page works standalone at /document
// TailwindCSS assumed. All components are client-side and self-contained.

const PROSPECTS: Prospect[] = [
  { id: "P-8842", name: "Müller AG", region: "CH", owner: "John Wong" },
  { id: "P-7710", name: "Kai Tak Holdings", region: "HK", owner: "Amy Lee" },
  { id: "P-6601", name: "Lion City Ventures", region: "SG", owner: "G. Tan" },
];

const INITIAL_DOCS: DocumentRow[] = [
  { id: "DOC-8842-A", prospectId: "P-8842", name: "Swiss_Home_Purchase_Agreement.pdf", type: "Agreement", pages: 18, status: "Issues Found", risk: 82, issues: 12, uploadedAt: "2025-11-01T08:57:00Z" },
  { id: "DOC-8842-B", prospectId: "P-8842", name: "Passport_Scan.png", type: "Identity", pages: 1, status: "Processing", risk: 42, issues: 0, uploadedAt: "2025-11-01T08:58:20Z" },
  { id: "DOC-7710-A", prospectId: "P-7710", name: "Bank_Statement_Q3.pdf", type: "Bank Statement", pages: 6, status: "Verified", risk: 15, issues: 1, uploadedAt: "2025-10-28T12:10:00Z" },
];

export default function DocumentPage() {
  const [activeProspect, setActiveProspect] = useState<Prospect>(PROSPECTS[0]);
  const [docs, setDocs] = useState<DocumentRow[]>(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    return docs
      .filter((d) => d.prospectId === activeProspect.id)
      .filter(
        (d) =>
          q === "" ||
          d.name.toLowerCase().includes(q) ||
          d.type.toLowerCase().includes(q) ||
          d.id.toLowerCase().includes(q)
      );
  }, [docs, activeProspect, search]);

  function inferType(name: string) {
    const n = name.toLowerCase();
    if (n.includes("passport")) return "Identity";
    if (n.includes("statement")) return "Bank Statement";
    if (n.endsWith(".png") || n.endsWith(".jpg") || n.endsWith(".jpeg")) return "Image";
    if (n.endsWith(".pdf")) return "PDF";
    return "Document";
  }

  function handleFiles(files: FileList) {
    const incoming: DocumentRow[] = Array.from(files).map((f, idx) => ({
      id: `UP-${Date.now()}-${idx}`,
      prospectId: activeProspect.id,
      name: f.name,
      type: inferType(f.name),
      pages: 0,
      status: "Queued",
      risk: 0,
      issues: 0,
      uploadedAt: new Date().toISOString(),
    }));
    setDocs((prev) => [...incoming, ...prev]);
  }

  const prospectDocs = docs.filter((d) => d.prospectId === activeProspect.id);
  const verifiedCount = prospectDocs.filter((d) => d.status === "Verified").length;
  const issuesCount = prospectDocs.filter((d) => d.status === "Issues Found").length;
  const avgRisk = Math.round(
    prospectDocs.reduce((acc, d) => acc + d.risk, 0) / Math.max(1, prospectDocs.length)
  );

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b">
        <div className="px-4 sm:px-6 lg:px-8 py-3 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-semibold">Documents</h1>
            <span className="text-xs text-neutral-500">Prospect</span>
            <select
              className="rounded-xl border px-3 py-2 text-sm"
              value={activeProspect.id}
              onChange={(e) =>
                setActiveProspect(
                  PROSPECTS.find((p) => p.id === e.target.value) || PROSPECTS[0]
                )
              }
            >
              {PROSPECTS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.id})
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search file name or type…"
                className="w-72 rounded-2xl border border-neutral-200 bg-white px-4 py-2 pr-10 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-[#002B45]"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 text-xs">⌘K</span>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="rounded-2xl border px-3 py-2 text-sm bg-white hover:bg-neutral-50"
            >
              Upload
            </button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(e) => e.target.files && handleFiles(e.target.files)}
            />
          </div>
        </div>
      </div>

      {/* Prospect summary */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <ProspectSummary
          prospect={activeProspect}
          total={prospectDocs.length}
          verified={verifiedCount}
          issues={issuesCount}
          avgRisk={avgRisk}
        />
      </div>

      {/* Upload zone */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        <UploadBox
          onChoose={() => fileInputRef.current?.click()}
          onDropFiles={(files) => handleFiles(files)}
          activeProspectName={activeProspect.name}
        />
      </div>

      {/* Table */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4 pb-16">
        <DocumentTable
          rows={rows}
          onOpenReport={(id) => setDetailId(id)}
        />
      </div>

      {/* Report drawer */}
      <ReportDrawer
        open={!!detailId}
        onClose={() => setDetailId(null)}
        doc={docs.find((d) => d.id === detailId) || null}
        prospect={activeProspect}
      />
    </div>
  );
}