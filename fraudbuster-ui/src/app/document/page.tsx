// =========================
// file: src/app/document/page.tsx
// =========================
"use client";
import React, { useMemo, useRef, useState, useEffect } from "react";
import { ProspectSummary } from "./components/document/ProspectSummary";
import { UploadBox } from "./components/document/UploadBox";
import { DocumentTable } from "./components/document/DocumentTable";
import { ReportDrawer } from "./components/document/ReportDrawer";
import type { DocumentRow, Prospect } from "./components/document/types";
import { documentService } from "./services/documentService";

// NOTE: Sidebar intentionally omitted (you'll add later). This page works standalone at /document
// TailwindCSS assumed. All components are client-side and self-contained.

const PROSPECTS: Prospect[] = [
  { id: "P-8842", name: "Müller AG", region: "CH", owner: "John Wong" },
  { id: "P-7710", name: "Kai Tak Holdings", region: "HK", owner: "Amy Lee" },
  { id: "P-6601", name: "Lion City Ventures", region: "SG", owner: "G. Tan" },
];

const INITIAL_DOCS: DocumentRow[] = [
  { id: "DOC-8842-A", prospectId: "P-8842", name: "Swiss_Home_Purchase_Agreement.pdf", type: "Agreement", status: "Completed", uploadedAt: "2025-11-01T08:57:00Z" },
  { id: "DOC-8842-B", prospectId: "P-8842", name: "Passport_Scan.png", type: "Identity", status: "Processing", uploadedAt: "2025-11-01T08:58:20Z" },
  { id: "DOC-7710-A", prospectId: "P-7710", name: "Bank_Statement_Q3.pdf", type: "Bank Statement", status: "Completed", uploadedAt: "2025-10-28T12:10:00Z" },
];

export default function DocumentPage() {
  const [activeProspect, setActiveProspect] = useState<Prospect>(PROSPECTS[0]);
  const [docs, setDocs] = useState<DocumentRow[]>(INITIAL_DOCS);
  const [search, setSearch] = useState("");
  const [detailId, setDetailId] = useState<string | null>(null);
  const [backendConnected, setBackendConnected] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Check backend connection on mount
  useEffect(() => {
    async function checkBackend() {
      try {
        const health = await documentService.healthCheck();
        setBackendConnected(health.status === "healthy");
        console.log("Backend health:", health);
      } catch (error) {
        console.error("Backend connection failed:", error);
        setBackendConnected(false);
      }
    }
    checkBackend();
  }, []);

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

  async function handleFiles(files: FileList) {
    const incoming: DocumentRow[] = Array.from(files).map((f, idx) => ({
      id: `UP-${Date.now()}-${idx}`,
      prospectId: activeProspect.id,
      name: f.name,
      type: inferType(f.name),
      status: "Uploaded",
      uploadedAt: new Date().toISOString(),
    }));
    
    // Add documents to state immediately
    setDocs((prev) => [...incoming, ...prev]);

    // Process each file with the backend
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const docId = incoming[i].id;
      
      try {
        // Update status to processing
        setDocs((prev) => prev.map((d) => 
          d.id === docId ? { ...d, status: "Processing" } : d
        ));

        console.log(`Processing file: ${file.name}`);
        const result = await documentService.processDocument(file);
        
        // Update document with processing results
        setDocs((prev) => prev.map((d) => 
          d.id === docId ? { 
            ...d, 
            status: "Completed",
            processingResult: result
          } : d
        ));

        console.log(`Successfully processed: ${file.name}`, result);
      } catch (error) {
        console.error(`Failed to process ${file.name}:`, error);
        
        // Update status to error
        setDocs((prev) => prev.map((d) => 
          d.id === docId ? { 
            ...d, 
            status: "Error",
            processingResult: {
              task_id: docId,
              status: "error",
              validation: {
                report: `Error processing document: ${error instanceof Error ? error.message : 'Unknown error'}`
              }
            }
          } : d
        ));
      }
    }
  }

  const prospectDocs = docs.filter((d) => d.prospectId === activeProspect.id);
  const completedCount = prospectDocs.filter((d) => d.status === "Completed").length;
  const processingCount = prospectDocs.filter((d) => d.status === "Processing").length;

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      {/* Backend Status Banner */}
      {!backendConnected && (
        <div className="bg-yellow-50 border-b border-yellow-200 px-4 py-2">
          <div className="max-w-7xl mx-auto text-sm text-yellow-800">
            ⚠️ Backend service is not connected. Please ensure the Python backend is running at http://localhost:8000
          </div>
        </div>
      )}

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
              disabled={!backendConnected}
              className={`rounded-2xl border px-3 py-2 text-sm transition-colors ${
                backendConnected 
                  ? "bg-white hover:bg-neutral-50 text-gray-700" 
                  : "bg-gray-100 text-gray-400 cursor-not-allowed"
              }`}
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
          completed={completedCount}
          processing={processingCount}
        />
      </div>

      {/* Upload zone */}
      <div className="px-4 sm:px-6 lg:px-8 mt-4">
        {!backendConnected && (
          <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
            <div className="flex items-start gap-2">
              <div className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0">⚠️</div>
              <div className="text-sm">
                <p className="font-medium text-yellow-800">Backend Service Unavailable</p>
                <p className="text-yellow-700">
                  Please ensure the backend service is running at http://localhost:8000
                </p>
              </div>
            </div>
          </div>
        )}
        <UploadBox
          onChoose={() => fileInputRef.current?.click()}
          onDropFiles={(files) => handleFiles(files)}
          activeProspectName={activeProspect.name}
          disabled={!backendConnected}
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