# Document Processing Integration

This integration connects the Next.js frontend with the Python backend for document processing.

## Setup Instructions

### 1. Start the Python Backend

Navigate to the reference backend folder and start the service:

```bash
cd reference/backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
python start.py
```

The backend will be available at `http://localhost:8000`

### 2. Start the Next.js Frontend

In a separate terminal:

```bash
cd fraudbuster-ui
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000`

### 3. Test the Integration

1. Navigate to `http://localhost:3000/document`
2. Select "Müller AG" from the prospect dropdown
3. Upload a document (PDF, Word, or Image file)
4. Watch the status change from "Uploaded" → "Processing" → "Completed"
5. Click "View Report" to see the markdown analysis from the backend

## Features Implemented

### Frontend Changes:
- ✅ Removed `pages`, `risk`, and `issues` columns from DocumentTable
- ✅ Added `status` tracking with states: Uploaded, Processing, Completed, Error
- ✅ Updated ProspectSummary to show completed vs processing counts
- ✅ Backend connection status indicator
- ✅ Disabled upload when backend unavailable
- ✅ Real-time processing status updates

### Backend Integration:
- ✅ File upload to Python backend at `localhost:8000`
- ✅ Document processing via Document Intelligence + Mistral
- ✅ Image processing via direct Mistral analysis
- ✅ Error handling and status reporting

### Report Display:
- ✅ Markdown report rendering with proper table styling
- ✅ Loading states during processing
- ✅ Error states for failed processing
- ✅ Audit trail showing upload and processing timestamps
- ✅ Action buttons (disabled until processing complete)

## API Endpoints Used

- `GET /health` - Check backend service status
- `POST /process-document` - Upload and process documents
- Response includes markdown report in `validation.report` field

## File Types Supported

- **Documents**: PDF, Word (.doc, .docx) → OCR + AI validation
- **Images**: JPG, PNG, GIF, BMP, TIFF → Direct AI forensic analysis

## Flow

1. **Upload**: File uploaded to backend and stored in Azure Blob Storage
2. **Processing**: 
   - Documents: Azure Document Intelligence → Mistral validation
   - Images: Direct Mistral forensic analysis
3. **Report**: Markdown table returned with validation results
4. **Display**: Report rendered in sidebar with audit trail and actions