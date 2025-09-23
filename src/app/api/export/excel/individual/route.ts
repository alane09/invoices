/**
 * Individual Excel Export API Endpoint
 * Generates and downloads individual Excel reports with COFICAB branding
 */

import { generateIndividualExcelFile, getIndividualExportFilename } from '@/lib/export-utils-individual';
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

    // Generate individual Excel file
    const excelBuffer = generateIndividualExcelFile(invoice);

    // Generate filename
    const filename = getIndividualExportFilename(invoice, 'excel');

    // Return file as download
    return new NextResponse(new Uint8Array(excelBuffer), {
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': excelBuffer.length.toString()
      }
    });

  } catch (error) {
    console.error('Individual Excel export error:', error);
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
