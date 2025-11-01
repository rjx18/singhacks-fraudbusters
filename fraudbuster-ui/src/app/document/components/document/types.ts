// =========================
// file: src/components/document/types.ts
// =========================
export type Status = "Uploaded" | "Processing" | "Completed" | "Error" | "Queued";

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
  status: Status;
  uploadedAt: string; // ISO
  processingResult?: ProcessingResult;
}

export interface ProcessingResult {
  task_id: string;
  status: string;
  extracted_text?: string;
  annotated_images?: string[];
  validation?: ValidationResult;
}

export interface ValidationResult {
  risk_score?: string;
  confidence?: number;
  findings?: Finding[];
  summary?: string;
  recommendations?: string[];
  status?: string;
  report?: string;  // Markdown report from Mistral
  file_type?: string;  // File type (PDF, Word, Image)
  image_url?: string;  // For image processing
}

export interface Finding {
  type: string;
  severity: string;
  description: string;
  location?: string;
  evidence?: string;
}