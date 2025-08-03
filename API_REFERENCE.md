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

### Health Check
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
  }
}
```

### List/History of Invoices
```bash
GET http://localhost:3000/api/invoices
```
**Purpose**: Lists all extracted invoices, supports filtering and pagination.

**Query Parameters:**
```bash
?type=electricity&limit=10&page=1&sortBy=createdAt&sortOrder=desc
```

### Delete Invoice (if implemented)
```bash
DELETE http://localhost:3000/api/invoices/{id}
```
**Purpose**: Deletes an invoice by ID.

---

## 3. 🔗 Useful Links

### Koncile.ai Resources
- **API Documentation**: https://docs.koncile.ai/
- **Website**: https://www.koncile.ai/
- **Template Library**: https://www.koncile.ai/librairie-ocr-templates

### Local Development
- **Application**: http://localhost:3000
- **API Health Check**: http://localhost:3000/api/upload
- **Upload Endpoint**: http://localhost:3000/api/upload
- **Save Endpoint**: http://localhost:3000/api/save
- **Invoices List**: http://localhost:3000/api/invoices

---

## 4. 🛡️ Best Practices

### Security
- ✅ Always include `Authorization: Bearer pO-kPRnJZUReTMNNZyw9q8OZPhihMUtflROvF1lYEls` header for Koncile.ai requests
- ✅ Validate file type and size before upload
- ✅ Handle and log all error responses from the API
- ✅ Never expose your API key to the frontend
- ✅ Use environment variables for all sensitive data

### File Handling
- ✅ Support multiple file formats: PDF, JPG, PNG, XLSX, XLS
- ✅ Validate file extensions and MIME types
- ✅ Handle file upload errors gracefully
- ✅ Clean up temporary files after processing

### Error Handling
- ✅ Provide user-friendly error messages
- ✅ Implement retry mechanisms with exponential backoff
- ✅ Log detailed error information for debugging
- ✅ Handle network timeouts and connection issues

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
