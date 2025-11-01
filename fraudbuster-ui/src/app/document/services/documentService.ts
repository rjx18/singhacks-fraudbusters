// API service for document processing integration with Python backend
const API_BASE_URL = 'http://localhost:8000';

export interface ProcessingResponse {
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

export interface HealthResponse {
  status: string;
  version: string;
  services: {
    document_intelligence: boolean;
    mistral_service: boolean;
    blob_storage: boolean;
    visualization: boolean;
  };
}

export class DocumentProcessingService {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async healthCheck(): Promise<HealthResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/health`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  }

  async processDocument(file: File): Promise<ProcessingResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.baseUrl}/process-document`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Document processing result:', result);
      return result;
    } catch (error) {
      console.error('Document processing failed:', error);
      throw error;
    }
  }

  async processDocumentUrl(url: string): Promise<ProcessingResponse> {
    try {
      const response = await fetch(`${this.baseUrl}/process-document-url`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.detail || errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      console.error('Document URL processing failed:', error);
      throw error;
    }
  }

  async getProcessingStatus(taskId: string): Promise<any> {
    try {
      const response = await fetch(`${this.baseUrl}/status/${taskId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Status check failed: ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Status check failed:', error);
      throw error;
    }
  }
}

// Create a singleton instance
export const documentService = new DocumentProcessingService();