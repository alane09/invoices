# COFICAB Invoice AI Extractor

A professional Next.js application that uses AI-powered OCR technology to automatically extract data from utility invoices (electricity, gas, and water bills) with COFICAB brand styling.

## 🚀 Features

- **AI-Powered Extraction**: Intelligent document processing using Koncile.ai API
- **Multi-Format Support**: PDF, images (PNG, JPG), Excel files (XLSX, XLS)
- **Three Invoice Types**: 
  - Electricity (STEG) bills
  - Gas bills
  - Water (SONEDE) bills
- **Professional UI**: COFICAB brand colors with responsive design
- **Data Management**: MongoDB storage with complete invoice history
- **Real-time Processing**: Direct extraction with confidence scoring
- **Modern Stack**: Next.js 15, TypeScript, Tailwind CSS, MongoDB

## 🎨 COFICAB Brand Colors

- **Primary Green**: `#1B6254`
- **Secondary Purple**: `#7030A0`
- **Tertiary Blue**: `#3656A2`
- **Accent Gold**: `#D4AF37`

## 📋 Prerequisites

- Node.js 18+ and npm/pnpm
- MongoDB database (local or cloud)
- Koncile.ai API account (optional - uses mock data by default)

## 🛠️ Installation

1. **Clone and install dependencies:**
```bash
cd invoice-extractor
npm install
```

2. **Environment setup:**
```bash
cp .env.example .env.local
```

3. **Configure environment variables in `.env.local`:**
```env
# MongoDB Configuration
MONGODB_URI=mongodb://localhost:27017/invoice-extractor

# Koncile.ai API (Optional - currently using mock data)
KONCILE_API_KEY=your_koncile_api_key_here
KONCILE_API_URL=https://api.koncile.ai/v1

# Next.js Configuration
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=http://localhost:3000
```

4. **Start the development server:**
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🏗️ Project Structure

```
invoice-extractor/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   │   ├── upload/        # File upload & extraction
│   │   │   ├── save/          # Save extracted data
│   │   │   └── invoices/      # Invoice CRUD operations
│   │   ├── electricity/       # Electricity bills page
│   │   ├── gas/              # Gas bills page
│   │   ├── water/            # Water bills page
│   │   ├── historique/       # Invoice history page
│   │   ├── globals.css       # COFICAB styling system
│   │   ├── layout.tsx        # Root layout with sidebar
│   │   └── page.tsx          # Home page
│   ├── components/           # Reusable components
│   │   ├── Sidebar.tsx       # Navigation sidebar
│   │   ├── FileUpload.tsx    # Drag-and-drop upload
│   │   └── InvoiceForm.tsx   # Data extraction form
│   ├── lib/                  # Utility libraries
│   │   ├── mongodb.ts        # Database connection
│   │   ├── koncile.ts        # AI API integration
│   │   └── utils.ts          # Helper functions
│   ├── models/               # Data models
│   │   └── Invoice.ts        # Invoice schema
│   └── types/                # TypeScript definitions
│       ├── electricity.ts    # STEG field mappings
│       ├── gas.ts           # Gas field mappings
│       └── water.ts         # SONEDE field mappings
├── public/                   # Static assets
├── tailwind.config.js       # COFICAB color configuration
├── next.config.js           # Next.js configuration
└── package.json             # Dependencies
```

## 🔧 API Endpoints

### File Upload & Extraction
```
POST /api/upload
Content-Type: multipart/form-data

Body:
- file: File (PDF, PNG, JPG, XLSX, XLS)
- invoiceType: string ("electricity" | "gas" | "water")

Response:
{
  "success": true,
  "data": {
    "field_name": {
      "value": "extracted_value",
      "confidence": 0.95
    }
  },
  "fileName": "invoice.pdf",
  "message": "Invoice data extracted successfully"
}
```

### Save Invoice
```
POST /api/save
Content-Type: application/json

Body:
{
  "invoiceType": "electricity",
  "fileName": "invoice.pdf",
  "data": {
    "field_name": "value"
  }
}

Response:
{
  "success": true,
  "invoiceId": "mongodb_object_id",
  "message": "Invoice saved successfully"
}
```

### Get Invoices
```
GET /api/invoices?type=electricity&page=1&limit=10

Response:
{
  "success": true,
  "invoices": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

### Delete Invoice
```
DELETE /api/invoices?id=mongodb_object_id

Response:
{
  "success": true,
  "message": "Invoice deleted successfully"
}
```

## 📊 Field Mappings

### Electricity Bills (STEG)
- Numéro de facture (Invoice Number)
- Date de facture (Invoice Date)
- Période de facturation (Billing Period)
- Index ancien (Previous Reading)
- Index nouveau (Current Reading)
- Consommation en kWh (Consumption kWh)
- Montant net à payer (Net Amount)
- Date limite de paiement (Due Date)

### Gas Bills
- Numéro de facture (Invoice Number)
- Date de facture (Invoice Date)
- Index précédent (Previous Reading)
- Index actuel (Current Reading)
- Consommation en m3 (Consumption m3)
- NET A PAYER (Net Amount)

### Water Bills (SONEDE)
- Numéro de facture (Invoice Number)
- Date de facture (Invoice Date)
- Ancien index (Previous Reading)
- Nouvel index (Current Reading)
- Consommation en m3 (Water Consumption)
- Frais d'assainissement (Sanitation Fees)
- Total des frais de consommation eau et assainissement TTC (Total Amount)

## 🎯 Usage Instructions

### 1. Upload Invoice
1. Navigate to the appropriate service page (Electricity/Gas/Water)
2. Drag and drop your invoice file or click to browse
3. Wait for AI processing (2-3 seconds with mock data)
4. Review extracted data with confidence scores
5. Edit any incorrect fields if needed
6. Save to database

### 2. View History
1. Go to "Historique" page
2. Filter by invoice type
3. Search by filename
4. View detailed invoice data
5. Delete invoices if needed

## 🔒 Security Features

- File validation (type and size limits)
- Input sanitization
- MongoDB injection protection
- CORS configuration
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)
```bash
npm i -g vercel
vercel --prod
```

Set environment variables in Vercel dashboard.

### Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

## 🐛 Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Verify MONGODB_URI in .env.local
   - Ensure MongoDB service is running
   - Check network connectivity

2. **File Upload Issues**
   - Check file size (max 10MB)
   - Verify file format is supported
   - Clear browser cache

3. **Styling Issues**
   - Run `npm run build` to regenerate CSS
   - Check Tailwind configuration
   - Verify COFICAB colors are loaded

## 🔄 Development

### Real Koncile.ai Integration
The application now uses **real Koncile.ai API integration** with auto-discovery:

1. **Auto-Discovery System**: Automatically finds working API endpoints
2. **Template Detection**: Discovers template IDs from your folder (3927)
3. **Real Data Extraction**: No mock data - only genuine AI results
4. **Smart Fallbacks**: Multiple backup strategies for reliability

**Current API Key**: `pO-kPRnJZUReTMNNZyw9q8OZPhihMUtflROvF1lYEls`

For complete API documentation, see **[📖 API_REFERENCE.md](./API_REFERENCE.md)**

### Adding New Invoice Types
1. Create new type definition in `src/types/`
2. Add field mappings
3. Update API endpoints
4. Create new page component
5. Add navigation link

## 📝 License

This project is proprietary software developed for COFICAB.

## 🤝 Support

For technical support:
- Check console for error messages
- Review API response logs
- Verify environment variables
- Ensure dependencies are installed

---

**COFICAB Invoice AI Extractor** - Streamlining invoice processing with AI technology.
