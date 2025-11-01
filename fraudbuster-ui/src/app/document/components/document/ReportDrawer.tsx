"use client";
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { DocumentRow, Prospect } from "./types";

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

  const markdownReport = doc.processingResult?.validation?.report;
  const hasReport = markdownReport && doc.status === "Completed";

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/20" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[800px] bg-white shadow-xl border-l overflow-hidden flex flex-col">
        <div className="p-4 border-b flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-semibold">{doc.id} · Document Report</h3>
          <button className="rounded-xl border px-3 py-1.5 text-xs bg-white hover:bg-gray-50" onClick={onClose}>
            Close
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Markdown Report Section */}
          {hasReport ? (
            <div className="p-6">
              <div className="prose prose-slate max-w-none">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {markdownReport}
                </ReactMarkdown>
              </div>
            </div>
          ) : doc.status === "Processing" ? (
            <div className="p-6 text-center">
              <div className="text-lg font-medium text-gray-700">Processing Document...</div>
              <div className="text-sm text-gray-500 mt-2">
                Document is being analyzed. Report will appear here when complete.
              </div>
              <div className="mt-4">
                <div className="inline-block w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              </div>
            </div>
          ) : doc.status === "Error" ? (
            <div className="p-6 text-center">
              <div className="text-lg font-medium text-red-700">Processing Error</div>
              <div className="text-sm text-red-500 mt-2">
                {markdownReport || "An error occurred while processing this document."}
              </div>
            </div>
          ) : (
            <div className="p-6 text-center">
              <div className="text-lg font-medium text-gray-700">No Report Available</div>
              <div className="text-sm text-gray-500 mt-2">
                Document has not been processed yet.
              </div>
            </div>
          )}
        </div>

        {/* Bottom sections - Audit Trail and Actions */}
        <div className="border-t bg-gray-50 flex-shrink-0">
          <div className="p-4 space-y-4 text-sm">
            <section className="rounded-xl border bg-white p-3">
              <div className="text-sm font-medium text-gray-900">Audit Trail</div>
              <ul className="mt-2 text-gray-700 space-y-1">
                <li>{new Date(doc.uploadedAt).toLocaleString()} — Uploaded by {prospect.owner}</li>
                {doc.status === "Processing" && (
                  <li>{new Date().toLocaleString()} — Document processing in progress</li>
                )}
                {doc.status === "Completed" && (
                  <li>{new Date().toLocaleString()} — Document analysis completed</li>
                )}
                {doc.status === "Error" && (
                  <li>{new Date().toLocaleString()} — Processing failed</li>
                )}
              </ul>
            </section>

            <section className="rounded-xl border bg-white p-3">
              <div className="text-sm font-medium text-gray-900">Actions</div>
              <div className="mt-2 flex flex-wrap gap-2">
                <button 
                  disabled={doc.status !== "Completed"}
                  className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                    doc.status === "Completed"
                      ? "bg-white hover:bg-gray-50 text-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Mark Verified
                </button>
                <button 
                  disabled={doc.status !== "Completed"}
                  className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                    doc.status === "Completed"
                      ? "bg-white hover:bg-gray-50 text-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Open Case
                </button>
                <button 
                  disabled={doc.status !== "Completed"}
                  className={`rounded-xl border px-3 py-1.5 text-xs transition-colors ${
                    doc.status === "Completed"
                      ? "bg-white hover:bg-gray-50 text-gray-700"
                      : "bg-gray-100 text-gray-400 cursor-not-allowed"
                  }`}
                >
                  Download Report
                </button>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}