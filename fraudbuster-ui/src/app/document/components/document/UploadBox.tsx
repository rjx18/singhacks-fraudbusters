// =========================
// file: src/components/document/UploadBox.tsx
// =========================
"use client";
import React, { useState } from "react";

export function UploadBox({
  onChoose,
  onDropFiles,
  activeProspectName,
  disabled = false,
}: {
  onChoose: () => void;
  onDropFiles: (files: FileList) => void;
  activeProspectName: string;
  disabled?: boolean;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => {
        if (disabled) return;
        setDragOver(false);
      }}
      onDrop={(e) => {
        if (disabled) return;
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) onDropFiles(e.dataTransfer.files);
      }}
      className={`rounded-2xl border-2 border-dashed p-6 text-center transition-colors ${
        disabled 
          ? "border-gray-200 bg-gray-50 cursor-not-allowed" 
          : dragOver 
          ? "border-[#002B45] bg-neutral-50" 
          : "border-neutral-200"
      }`}
    >
      <div className={`text-sm ${disabled ? "text-gray-400" : "text-neutral-700"}`}>
        {disabled ? (
          "Backend service required for file upload"
        ) : (
          <>
            Drop files here to upload for <span className="font-medium">{activeProspectName}</span>
          </>
        )}
      </div>
      <div className={`mt-2 text-xs ${disabled ? "text-gray-400" : "text-neutral-500"}`}>
        PDF, Word documents, PNG, JPG, GIF supported
      </div>
      <div className="mt-3">
        <button 
          onClick={disabled ? undefined : onChoose} 
          disabled={disabled}
          className={`rounded-xl border px-3 py-2 text-sm transition-colors ${
            disabled 
              ? "bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed" 
              : "bg-white hover:bg-gray-50 text-gray-700"
          }`}
        >
          Choose Files
        </button>
      </div>
    </div>
  );
}
