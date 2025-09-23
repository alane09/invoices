# 📋 Invoice Extraction Project: API, Endpoints, and Links Reference

## 1. 🔗 Koncile.ai API (External)

### API Documentation
- **Main Docs**: https://docs.koncile.ai/
- **Template Library**: https://www.koncile.ai/librairie-ocr-templates
- **Website**: https://www.koncile.ai/

### Main Extraction Endpoint
```bash
POST https://api.koncile.ai/api/templates/{template_id}/extract/
```

**Headers:**
```bash
Authorization: Bearer pO-kPRnJZUReTMNNZyw9q8OZPhihMUtflROvF1lYEls
Content-Type: multipart/form-data
```

**Body:**
```bash
file: <binary_file_data>
```

**Example:**
```bash
curl -X POST "https://api.koncile.ai/api/templates/18982/extract/" \
  -H "Authorization: Bearer pO-kPRnJZUReTMNNZyw9q8OZPhihMUtflROvF1lYEls" \
  -F "file=@invoice.pdf"
```

### List Templates (if supported)
```bash
GET https://api.koncile.ai/api/templates/
GET https://api.koncile.ai/api/folders/3927/templates/
```

---

## 2. 🚀 Your Next.js API Endpoints (Internal)

### Health Check - Upload API
```bash
GET http://localhost:3000/api/upload
```
**Purpose**: Checks connection to Koncile.ai and template availability.

**Response:**
```json
{
  "status": "healthy",
  "services": {
    "koncile": true,
    "api": true
  },
  "details": "Connected via /api/ (Status: 200)",
  "timestamp": "2025-01-03T14:39:18.641Z"
}
```

### Invoice Upload & Extraction
```bash
POST http://localhost:3000/api/upload
```
**Purpose**: Receives file and invoice type, calls Koncile.ai, returns extracted data.

**Headers:**
```bash
Content-Type: multipart/form-data
```

**Body:**
```bash
file: <binary_file_data>
invoiceType: electricity|gas|water
```

**Validation Rules:**
- File types allowed: PDF, JPG, PNG, XLSX, XLS
- Max file size: 10MB
- Invoice types allowed: electricity, gas, water

**Example:**
```bash
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@invoice.pdf" \
  -F "invoiceType=electricity"
```

**Success Response:**
```json
{
  "success": true,
  "data": {
    "Date de facture": {
      "value": "2024-01-15",
      "confidence": 0.95
    },
    "Montant total": {
      "value": "125.50 TND",
      "confidence": 0.92
    }
  },
  "fileName": "invoice.pdf",
  "processingTime": 3500,
  "metadata": {
    "confidence": 0.93,
    "fieldsExtracted": 12,
    "processingTime": 3500,
    "fileSize": 145408,
    "fileType": "application/pdf",
    "invoiceType": "electricity",
    "extractedAt": "2025-01-03T14:39:18.641Z"
  },
  "message": "Invoice data extracted successfully with 93% average confidence"
}
```

**Error Codes:**
- `INVALID_FILE`: File validation failed (size/type/extension)
- `INVALID_INVOICE_TYPE`: Invoice type invalid
- `EXTRACTION_FAILED`: Extraction failed due to API or processing error
- `RATE_LIMIT_EXCEEDED`: API rate limit exceeded
- `UNAUTHORIZED`: Invalid API key or unauthorized
- `TEMPLATE_NOT_FOUND`: Template not found for invoice type
- `INTERNAL_ERROR`: Internal server error

---

### Save Extracted Invoice Data
```bash
POST http://localhost:3000/api/save
```
**Purpose**: Saves extracted invoice data to MongoDB.

**Headers:**
```bash
Content-Type: application/json
```

**Body:**
```json
{
  "invoiceType": "electricity",
  "fileName": "invoice.pdf",
  "data": {
    "Date de facture": {
      "value": "2024-01-15",
      "confidence": 0.95
    }
  },
  "metadata": {
    "confidence": 0.93,
    "fieldsExtracted": 12,
    "processingTime": 3500,
    "extractedAt": "2025-01-03T14:39:18.641Z",
    "fileSize": 145408,
    "fileType": "application/pdf"
  }
}
```

**Response:**
```json
{
  "success": true,
  "invoiceId": "63f1a2b4c9e77a0012345678",
  "message": "Electricity invoice saved successfully",
  "metadata": {
    "type": "electricity",
    "fileName": "invoice.pdf",
    "fieldsCount": 12,
    "averageConfidence": 0.93,
    "processingTime": 3500,
    "extractedDate": "2024-01-15",
    "extractedMonth": "January",
    "savedAt": "2025-01-03T14:39:18.641Z"
  }
}
```

**Error Codes:**
- `VALIDATION_ERROR`: Request validation failed
- `DUPLICATE_INVOICE`: Invoice already exists
- `DATABASE_ERROR`: Database save error

---

### List/History of Invoices
```bash
GET http://localhost:3000/api/invoices?type=electricity&limit=10&page=1&sortBy=createdAt&sortOrder=desc
```
**Purpose**: Lists all extracted invoices with pagination and filtering.

**Response:**
```json
{
  "success": true,
  "invoices": [
    {
      "_id": "63f1a2b4c9e77a0012345678",
      "type": "electricity",
      "fileName": "invoice.pdf",
      "date": "2024-01-15",
      "month": "January",
      "data": { ... },
      "status": "completed",
      "createdAt": "2025-01-03T14:39:18.641Z",
      "updatedAt": "2025-01-03T14:39:18.641Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "pages": 10
  }
}
```

---

### Delete Invoice
```bash
DELETE http://localhost:3000/api/invoices?id=63f1a2b4c9e77a0012345678
```
**Purpose**: Deletes an invoice by ID.

**Response:**
```json
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

---

### Deprecated Status Endpoint
```bash
GET http://localhost:3000/api/status
```
**Response:**
```json
{
  "success": false,
  "error": "This endpoint is deprecated. Use /api/upload for direct extraction."
}
```

---

## 3. 📦 Export APIs

### Excel Export
```bash
GET http://localhost:3000/api/export/excel?type=electricity&startDate=2025-01-01&endDate=2025-01-31
```
**Purpose**: Generates and downloads Excel files with COFICAB branding.

**Response**: Excel file download with invoice data filtered by type and date range.

**POST**: Accepts JSON body with `invoiceIds` array or `type` filter to generate Excel.

---

### PDF Export
```bash
GET http://localhost:3000/api/export/pdf?type=gas&startDate=2025-01-01&endDate=2025-01-31
```
**Purpose**: Generates and downloads PDF reports with COFICAB branding.

**Response**: PDF file download with invoice data filtered by type and date range.

**POST**: Accepts JSON body with `invoiceIds` array or `type` filter to generate PDF.

---

## 4. 🛡️ Best Practices

### Security
- ✅ Always include `Authorization` header with Bearer token for Koncile.ai requests.
- ✅ Validate file type and size before upload.
- ✅ Handle and log all error responses from the API.
- ✅ Never expose your API key to the frontend.
- ✅ Use environment variables for all sensitive data.

### File Handling
- ✅ Support multiple file formats: PDF, JPG, PNG, XLSX, XLS.
- ✅ Validate file extensions and MIME types.
- ✅ Handle file upload errors gracefully.
- ✅ Clean up temporary files after processing.

### Error Handling
- ✅ Provide user-friendly error messages.
- ✅ Implement retry mechanisms with exponential backoff.
- ✅ Log detailed error information for debugging.
- ✅ Handle network timeouts and connection issues.

---

## 5. 🧪 Testing Examples

### Test Health Check
```bash
curl -X GET "http://localhost:3000/api/upload"
```

### Test File Upload
```bash
curl -X POST "http://localhost:3000/api/upload" \
  -F "file=@test-invoice.pdf" \
  -F "invoiceType=electricity"
```

### Test Save Invoice
```bash
curl -X POST "http://localhost:3000/api/save" \
  -H "Content-Type: application/json" \
  -d '{
    "invoiceType": "electricity",
    "fileName": "test-invoice.pdf",
    "data": {
      "Date de facture": {"value": "2024-01-15", "confidence": 0.95}
    }
  }'
```

---

*Complete API reference for the COFICAB Invoice Extraction System with auto-discovery Koncile.ai integration.*
