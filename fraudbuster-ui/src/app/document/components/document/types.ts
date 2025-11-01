// =========================
// file: src/components/document/types.ts
// =========================
export type Status = "Awaiting OCR" | "Processing" | "Issues Found" | "Verified" | "Queued";

export interface Prospect {
  id: string;
  name: string;
  region: string;
  owner: string;
}

export interface DocumentRow {
  id: string;
  prospectId: string;
  name: string;
  type: string;
  pages: number;
  status: Status;
  risk: number; // 0-100
  issues: number;
  uploadedAt: string; // ISO
}