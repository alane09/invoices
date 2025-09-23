/**
 * Excel Export API Endpoint
 * Generates and downloads Excel files with COFICAB branding
 */

import { generateExcelFile, getExportFilename } from '@/lib/export-utils-fixed';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { NextRequest, NextResponse } from 'next/server';

// Define Query interface for both GET and POST functions
interface Query {
  type?: string;
  createdAt?: {
    $gte?: Date;
    $lte?: Date;
  };
  _id?: { $in: string[] };
}

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'all';
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Build query
    const query: Query = {};
    if (type !== 'all') {
      query.type = type;
    }

    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Fetch invoices
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    if (invoices.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune facture trouvée pour les critères sélectionnés' },
        { status: 404 }
      );
    }

    // Generate Excel file
    const excelBuffer = generateExcelFile(invoices, {
      title: 'COFICAB - Extraction de Factures IA',
      includeSummary: true,
      coficabBranding: true
    });

    // Generate filename
    const filename = getExportFilename('excel', type);

    // Return file as download
    return new NextResponse(new Uint8Array(excelBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Excel export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la génération du fichier Excel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse request body for selected invoice IDs
    const body = await request.json();
    const { invoiceIds, type = 'all' } = body;

    const query: Query = {};

    // If specific invoice IDs are provided, use them
    if (invoiceIds && Array.isArray(invoiceIds) && invoiceIds.length > 0) {
      query._id = { $in: invoiceIds };
    } else {
      // Otherwise, use type filter
      if (type !== 'all') {
        query.type = type;
      }
    }

    // Fetch invoices
    const invoices = await Invoice.find(query).sort({ createdAt: -1 });

    if (invoices.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Aucune facture trouvée' },
        { status: 404 }
      );
    }

    // Generate Excel file
    const excelBuffer = generateExcelFile(invoices, {
      title: 'COFICAB - Extraction de Factures IA',
      includeSummary: true,
      coficabBranding: true
    });

    // Generate filename
    const filename = getExportFilename('excel', type);

    // Return file as download
    return new NextResponse(new Uint8Array(excelBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Excel export POST error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la génération du fichier Excel',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
