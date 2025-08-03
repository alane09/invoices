import type { ExtractedField } from '@/lib/koncile';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { NextRequest, NextResponse } from 'next/server';

/**
 * Advanced Invoice Save API with Professional Data Processing
 * Handles extracted invoice data with confidence scores and metadata
 */

interface SaveInvoiceRequest {
  invoiceType: 'electricity' | 'gas' | 'water';
  fileName: string;
  data: Record<string, ExtractedField | string>;
  metadata?: {
    confidence?: number;
    fieldsExtracted?: number;
    processingTime?: number;
    extractedAt?: string;
    fileSize?: number;
    fileType?: string;
  };
}

// Field mapping for extracting date and month information
const FIELD_MAPPINGS = {
  electricity: {
    dateFields: ['Date de facture', 'Date limite de paiement'],
    monthFields: ['Période de facturation', 'Mois de facturation']
  },
  gas: {
    dateFields: ['Date de facture', 'Date d\'émission'],
    monthFields: ['Période de facturation', 'Mois de facturation']
  },
  water: {
    dateFields: ['Date de facture', 'Date d\'émission'],
    monthFields: ['Période de facturation', 'Trimestre', 'Mois de facturation']
  }
} as const;

// Utility functions
function extractFieldValue(field: ExtractedField | string): string {
  if (typeof field === 'string') {
    return field;
  }
  return field.value || '';
}

function findFieldValue(data: Record<string, ExtractedField | string>, fieldNames: readonly string[]): string {
  for (const fieldName of fieldNames) {
    if (data[fieldName]) {
      const value = extractFieldValue(data[fieldName]);
      if (value.trim()) {
        return value.trim();
      }
    }
  }
  return '';
}

function calculateAverageConfidence(data: Record<string, ExtractedField | string>): number {
  const confidenceScores: number[] = [];
  
  Object.values(data).forEach(field => {
    if (typeof field === 'object' && field.confidence !== undefined) {
      confidenceScores.push(field.confidence);
    }
  });
  
  if (confidenceScores.length === 0) return 0;
  
  const average = confidenceScores.reduce((sum, score) => sum + score, 0) / confidenceScores.length;
  return Math.round(average * 100) / 100; // Round to 2 decimal places
}

function normalizeData(data: Record<string, ExtractedField | string>): Record<string, any> {
  const normalized: Record<string, any> = {};
  
  Object.entries(data).forEach(([key, value]) => {
    if (typeof value === 'object') {
      normalized[key] = {
        value: value.value || '',
        confidence: value.confidence || 0,
        position: value.position || undefined
      };
    } else {
      normalized[key] = {
        value: value || '',
        confidence: 1.0 // Assume manual entries have full confidence
      };
    }
  });
  
  return normalized;
}

function validateRequest(body: any): { valid: boolean; error?: string; data?: SaveInvoiceRequest } {
  if (!body) {
    return { valid: false, error: 'Request body is required' };
  }

  const { invoiceType, fileName, data } = body;

  if (!invoiceType) {
    return { valid: false, error: 'Invoice type is required' };
  }

  if (!['electricity', 'gas', 'water'].includes(invoiceType)) {
    return { valid: false, error: 'Invalid invoice type. Must be electricity, gas, or water' };
  }

  if (!fileName || typeof fileName !== 'string' || fileName.trim().length === 0) {
    return { valid: false, error: 'Valid file name is required' };
  }

  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Invoice data is required' };
  }

  if (Object.keys(data).length === 0) {
    return { valid: false, error: 'Invoice data cannot be empty' };
  }

  return { valid: true, data: body as SaveInvoiceRequest };
}

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    // Connect to database
    await dbConnect();

    // Parse and validate request
    const body = await request.json();
    const validation = validateRequest(body);
    
    if (!validation.valid) {
      console.warn(`❌ Save validation failed: ${validation.error}`);
      return NextResponse.json(
        { 
          success: false, 
          error: validation.error,
          code: 'VALIDATION_ERROR'
        },
        { status: 400 }
      );
    }

    const { invoiceType, fileName, data, metadata } = validation.data!;

    console.log(`💾 Saving ${invoiceType} invoice: ${fileName}`);

    // Extract date and month information
    const fieldMapping = FIELD_MAPPINGS[invoiceType];
    const date = findFieldValue(data, fieldMapping.dateFields);
    const month = findFieldValue(data, fieldMapping.monthFields);

    // Normalize data and calculate confidence
    const normalizedData = normalizeData(data);
    const averageConfidence = metadata?.confidence || calculateAverageConfidence(data);
    const fieldsCount = Object.keys(normalizedData).length;

    // Create invoice record with enhanced metadata
    const invoice = new Invoice({
      type: invoiceType,
      fileName: fileName.trim(),
      date: date || '',
      month: month || '',
      data: normalizedData,
      status: 'completed',
      createdAt: new Date(),
      updatedAt: new Date()
    });

    // Save to database
    const savedInvoice = await invoice.save();
    const processingTime = Date.now() - startTime;

    // Log successful save
    console.log(`✅ Invoice saved successfully:`, {
      invoiceId: savedInvoice._id,
      type: invoiceType,
      fileName,
      fieldsCount,
      averageConfidence: `${averageConfidence}%`,
      processingTime: `${processingTime}ms`
    });

    // Return comprehensive response
    return NextResponse.json({
      success: true,
      invoiceId: savedInvoice._id,
      message: `${invoiceType.charAt(0).toUpperCase() + invoiceType.slice(1)} invoice saved successfully`,
      metadata: {
        type: invoiceType,
        fileName,
        fieldsCount,
        averageConfidence,
        processingTime,
        extractedDate: date,
        extractedMonth: month,
        savedAt: new Date().toISOString(),
        ...metadata
      }
    });

  } catch (error) {
    const processingTime = Date.now() - startTime;
    
    // Enhanced error logging
    console.error('❌ Save API critical error:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      processingTime: `${processingTime}ms`,
      timestamp: new Date().toISOString()
    });

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'An invoice with this information already exists',
            code: 'DUPLICATE_INVOICE',
            processingTime
          },
          { status: 409 }
        );
      }

      if (error.message.includes('validation')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Invalid invoice data format',
            code: 'VALIDATION_ERROR',
            processingTime
          },
          { status: 400 }
        );
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save invoice to database',
        code: 'DATABASE_ERROR',
        processingTime,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Health check for save endpoint
export async function GET() {
  try {
    await dbConnect();
    
    return NextResponse.json({
      status: 'healthy',
      service: 'invoice-save',
      database: 'connected',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: 'unhealthy',
        service: 'invoice-save',
        database: 'disconnected',
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}
