/**
 * Individual PDF Export API Endpoint
 * Generates and downloads individual PDF reports with COFICAB branding
 */

import { generateIndividualPDFFile, getIndividualExportFilename } from '@/lib/export-utils-individual';
import dbConnect from '@/lib/mongodb';
import Invoice from '@/models/Invoice';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Connect to database
    await dbConnect();

    // Parse query parameters
    const { searchParams } = new URL(request.url);
    const invoiceId = searchParams.get('id');

    if (!invoiceId) {
      return NextResponse.json(
        { success: false, error: 'ID de facture requis' },
        { status: 400 }
      );
    }

    // Fetch specific invoice
    const invoice = await Invoice.findById(invoiceId);

    if (!invoice) {
      return NextResponse.json(
        { success: false, error: 'Facture non trouvée' },
        { status: 404 }
      );
    }

    // Generate individual PDF file
    const pdfBuffer = generateIndividualPDFFile(invoice);

    // Generate filename
    const filename = getIndividualExportFilename(invoice, 'pdf');

    // Return file as download
    return new NextResponse(new Uint8Array(pdfBuffer), {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Individual PDF export error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Erreur lors de la génération du fichier PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
