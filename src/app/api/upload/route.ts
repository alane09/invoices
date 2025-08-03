import { extractInvoiceData, testKoncileConnection } from '@/lib/koncile';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced File Upload API with Professional Error Handling
 * Supports PDF, images, and Excel files with comprehensive validation
 */

// File validation configuration
const FILE_CONFIG = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: [
    'application/pdf',
    'image/jpeg',
    'image/jpg', 
    'image/png',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
    'application/vnd.ms-excel' // .xls
  ],
  ALLOWED_EXTENSIONS: ['.pdf', '.jpg', '.jpeg', '.png', '.xlsx', '.xls']
} as const;

const INVOICE_TYPES = ['electricity', 'gas', 'water'] as const;
type InvoiceType = typeof INVOICE_TYPES[number];

// Validation utilities
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file existence
  if (!file || file.size === 0) {
    return { valid: false, error: 'No file provided or file is empty' };
  }

  // Check file size
  if (file.size > FILE_CONFIG.MAX_SIZE) {
    const maxSizeMB = FILE_CONFIG.MAX_SIZE / (1024 * 1024);
    return { valid: false, error: `File size too large. Maximum allowed: ${maxSizeMB}MB` };
  }

  // Check file type
  if (!FILE_CONFIG.ALLOWED_TYPES.includes(file.type as typeof FILE_CONFIG.ALLOWED_TYPES[number])) {
    return { 
      valid: false, 
      error: `Unsupported file type: ${file.type}. Allowed types: PDF, JPG, PNG, XLSX, XLS` 
    };
  }

  // Check file extension as additional validation
  const fileExtension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
  if (!FILE_CONFIG.ALLOWED_EXTENSIONS.includes(fileExtension as '.pdf' | '.jpg' | '.jpeg' | '.png' | '.xlsx' | '.xls')) {
    return { 
      valid: false, 
      error: `Unsupported file extension: ${fileExtension}. Allowed: ${FILE_CONFIG.ALLOWED_EXTENSIONS.join(', ')}` 
    };
  }

  return { valid: true };
}

function validateInvoiceType(invoiceType: string): { valid: boolean; error?: string } {
  if (!invoiceType) {
    return { valid: false, error: 'Invoice type is required' };
  }

  if (!INVOICE_TYPES.includes(invoiceType as InvoiceType)) {
    return { 
      valid: false, 
      error: `Invalid invoice type: ${invoiceType}. Allowed types: ${INVOICE_TYPES.join(', ')}` 
    };
  }

  return { valid: true };
}

// Request logging utility
function logRequest(file: File, invoiceType: string, userAgent?: string) {
  const timestamp = new Date().toISOString();
  const fileInfo = {
    name: file.name,
    size: `${(file.size / 1024).toFixed(2)}KB`,
    type: file.type
  };
  
  console.log(`📤 [${timestamp}] Upload Request:`, {
    invoiceType,
    file: fileInfo,
    userAgent: userAgent?.substring(0, 100) || 'Unknown'
  });
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Parse form data
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const invoiceType = formData.get('invoiceType') as string;
    const userAgent = request.headers.get('user-agent') || undefined;

    // Log the request
    if (file) {
      logRequest(file, invoiceType, userAgent);
    }

    // Validate file
    const fileValidation = validateFile(file);
    if (!fileValidation.valid) {
      console.warn(`❌ File validation failed: ${fileValidation.error}`);
      return NextResponse.json(
        { 
          success: false, 
          error: fileValidation.error,
          code: 'INVALID_FILE'
        },
        { status: 400 }
      );
    }

    // Validate invoice type
    const typeValidation = validateInvoiceType(invoiceType);
    if (!typeValidation.valid) {
      console.warn(`❌ Invoice type validation failed: ${typeValidation.error}`);
      return NextResponse.json(
        { 
          success: false, 
          error: typeValidation.error,
          code: 'INVALID_INVOICE_TYPE'
        },
        { status: 400 }
      );
    }

    // Skip connection test and proceed directly with upload
    // The real test is whether the upload succeeds
    console.log(`🔗 Proceeding with Koncile API (${process.env.KONCILE_API_URL})`);

    console.log(`🚀 Processing ${invoiceType} invoice: ${file.name} (${(file.size / 1024).toFixed(2)}KB)`);

    // Convert file to buffer
    const arrayBuffer = await file.arrayBuffer();
    const fileBuffer = Buffer.from(arrayBuffer);

    // Extract data using advanced Koncile.ai integration
    const result = await extractInvoiceData(fileBuffer, file.name, invoiceType as 'electricity' | 'gas' | 'water');
    const processingTime = Date.now() - startTime;

    if (!result.success) {
      // Enhanced error handling for Koncile.ai API
      let errorCode = 'EXTRACTION_FAILED';
      let status = 500;
        const koncileError = result.error || '';

      // Detect rate limit or quota errors from Koncile.ai
      if (koncileError.match(/rate limit|quota|too many requests|429/i)) {
        errorCode = 'RATE_LIMIT_EXCEEDED';
        status = 429;
      } else if (koncileError.match(/unauthorized|401|invalid api key/i)) {
        errorCode = 'UNAUTHORIZED';
        status = 401;
      } else if (koncileError.match(/not found|404|template/i)) {
        errorCode = 'TEMPLATE_NOT_FOUND';
        status = 404;
      }

      // Log detailed error
      console.error(`❌ Extraction failed for ${file.name}:`, {
        error: koncileError,
        code: errorCode,
        invoiceType,
        fileName: file.name,
        processingTime,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json(
        {
          success: false,
          error: koncileError,
          code: errorCode,
          processingTime,
          invoiceType,
          fileName: file.name,
          timestamp: new Date().toISOString()
        },
        { status }
      );
    }

    // Log successful extraction
    console.log(`✅ Extraction succeeded for ${file.name}`);

    return NextResponse.json({
      success: true,
      data: result.data,
      fileName: file.name,
      processingTime,
      metadata: {
        ...result.metadata,
        fileSize: file.size,
        fileType: file.type,
        invoiceType,
        extractedAt: new Date().toISOString()
      },
      message: `Invoice data extracted successfully with ${result.metadata?.confidence || 0}% average confidence`
    });
  } catch (error) {
    const processingTime = Date.now() - startTime;
    // Enhanced error logging
    console.error('❌ Upload API critical error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    // Return user-friendly error response
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Internal server error occurred',
        code: 'INTERNAL_ERROR',
        processingTime,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check endpoint
export async function GET() {
  try {
    const connectionTest = await testKoncileConnection();
    
    return NextResponse.json({
      status: 'healthy',
      services: {
        koncile: connectionTest.connected,
        api: true
      },
      details: connectionTest.details,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
