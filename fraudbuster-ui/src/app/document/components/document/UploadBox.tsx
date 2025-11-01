// =========================
// file: src/components/document/UploadBox.tsx
// =========================
"use client";
import React, { useState } from "react";

export function UploadBox({
  onChoose,
  onDropFiles,
  activeProspectName,
}: {
  onChoose: () => void;
  onDropFiles: (files: FileList) => void;
  activeProspectName: string;
}) {
  const [dragOver, setDragOver] = useState(false);
  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onDrop={(e) => {
        e.preventDefault();
        setDragOver(false);
        if (e.dataTransfer.files?.length) onDropFiles(e.dataTransfer.files);
      }}
      className={`rounded-2xl border-2 border-dashed p-6 text-center ${dragOver ? "border-[#002B45] bg-neutral-50" : "border-neutral-200"}`}
    >
      <div className="text-sm text-neutral-700">
        Drop files here to upload for <span className="font-medium">{activeProspectName}</span>
      </div>
      <div className="mt-2 text-xs text-neutral-500">PDF, PNG, JPG supported</div>
      <div className="mt-3">
        <button onClick={onChoose} className="rounded-xl border px-3 py-2 text-sm bg-white">
          Choose Files
        </button>
      </div>
    </div>
  );
}
