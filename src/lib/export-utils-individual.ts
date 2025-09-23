/**
 * Individual Export Utilities for COFICAB Invoice Extractor
 * Handles individual invoice exports with COFICAB branding
 */

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

interface Invoice {
  _id: string;
  type: 'electricity' | 'gas' | 'water';
  fileName: string;
  date?: string;
  month?: string;
  uploadedAt: string;
  data: Record<string, unknown>;
}

// COFICAB Brand Colors
const COFICAB_COLORS = {
  primary: '#1B6254',
  secondary: '#7030A0',
  tertiary: '#3656A2',
  accent: '#D4AF37',
  text: '#333333',
  lightGray: '#F5F5F5'
};

/**
 * Get invoice type label in French
 */
function getInvoiceTypeLabel(type: string): string {
  switch (type) {
    case 'electricity': return 'Électricité';
    case 'gas': return 'Gaz';
    case 'water': return 'Eau';
    default: return type;
  }
}

/**
 * Get main amount from invoice data based on type
 */
function getMainAmount(invoice: Invoice): string {
  const data = invoice.data;

  if (invoice.type === 'electricity') {
    return (data['Montant net à payer'] as { value?: string })?.value ||
           (data['Montant total en chiffres coupon'] as { value?: string })?.value || 'N/A';
  } else if (invoice.type === 'gas') {
    return (data['NET A PAYER'] as { value?: string })?.value || 'N/A';
  } else if (invoice.type === 'water') {
    return (data['Total des frais de consommation eau et assainissement TTC'] as { value?: string })?.value || 'N/A';
  }

  return 'N/A';
}

/**
 * Generate individual Excel file for a single invoice
 */
export function generateIndividualExcelFile(invoice: Invoice): Buffer {
  const workbook = XLSX.utils.book_new();

  // Create invoice details sheet
  const invoiceData = [
    ['COFICAB - Extraction de Facture IA'],
    [''],
    ['Informations générales'],
    ['Nom du fichier:', invoice.fileName],
    ['Type de facture:', getInvoiceTypeLabel(invoice.type)],
    ['Date de traitement:', new Date(invoice.uploadedAt).toLocaleDateString('fr-FR')],
    ['Période:', invoice.date || invoice.month || 'N/A'],
    ['Montant principal:', getMainAmount(invoice)],
    [''],
    ['Données extraites']
  ];

  // Add extracted data
  Object.entries(invoice.data).forEach(([key, value]) => {
    let displayValue = 'N/A';
    let confidence = '';

    if (typeof value === 'object' && value !== null) {
      const objValue = value as { value?: string; confidence?: number };
      displayValue = objValue.value || 'N/A';
      if (objValue.confidence) {
        confidence = `${(objValue.confidence * 100).toFixed(1)}%`;
      }
    } else {
      displayValue = String(value || 'N/A');
    }

    invoiceData.push([key, displayValue]);
    if (confidence) {
      invoiceData.push([`${key} (Confiance)`, confidence]);
    }
  });

  const worksheet = XLSX.utils.aoa_to_sheet(invoiceData);

  // Style the header
  if (worksheet['A1']) worksheet['A1'].s = { font: { bold: true, sz: 16, color: { rgb: COFICAB_COLORS.primary.replace('#', '') } } };

  XLSX.utils.book_append_sheet(workbook, worksheet, 'Facture');

  return XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
}

/**
 * Generate individual PDF file for a single invoice
 */
export function generateIndividualPDFFile(invoice: Invoice): Buffer {
  const doc = new jsPDF();

  // Title
  doc.setFontSize(24);
  doc.setTextColor(COFICAB_COLORS.primary);
  doc.text('COFICAB', 105, 30, { align: 'center' });

  doc.setFontSize(18);
  doc.setTextColor(COFICAB_COLORS.text);
  doc.text('Facture Extraite - IA', 105, 45, { align: 'center' });

  // Invoice info box
  doc.setDrawColor(COFICAB_COLORS.primary);
  doc.setFillColor(240, 240, 240);
  doc.rect(20, 60, 170, 40, 'FD');

  doc.setFontSize(12);
  doc.setTextColor(COFICAB_COLORS.primary);
  doc.text('Informations de la Facture', 25, 75);

  doc.setFontSize(10);
  doc.setTextColor(COFICAB_COLORS.text);
  doc.text(`Fichier: ${invoice.fileName}`, 25, 85);
  doc.text(`Type: ${getInvoiceTypeLabel(invoice.type)}`, 25, 92);
  doc.text(`Traitée le: ${new Date(invoice.uploadedAt).toLocaleDateString('fr-FR')}`, 25, 99);
  doc.text(`Période: ${invoice.date || invoice.month || 'N/A'}`, 25, 106);
  doc.text(`Montant: ${getMainAmount(invoice)}`, 25, 113);

  // Extracted data table
  const tableData: (string | number)[][] = [];

  Object.entries(invoice.data).forEach(([key, value]) => {
    let displayValue = 'N/A';
    let confidence = '';

    if (typeof value === 'object' && value !== null) {
      const objValue = value as { value?: string; confidence?: number };
      displayValue = objValue.value || 'N/A';
      if (objValue.confidence) {
        confidence = `${(objValue.confidence * 100).toFixed(1)}%`;
      }
    } else {
      displayValue = String(value || 'N/A');
    }

    tableData.push([key, displayValue]);
    if (confidence) {
      tableData.push([`${key} (Confiance)`, confidence]);
    }
  });

  // Generate table
  autoTable(doc, {
    startY: 120,
    head: [['Champ', 'Valeur extraite']],
    body: tableData,
    theme: 'grid',
    styles: {
      fontSize: 9,
      cellPadding: 4
    },
    headStyles: {
      fillColor: COFICAB_COLORS.primary,
      textColor: '#FFFFFF',
      fontStyle: 'bold'
    },
    alternateRowStyles: {
      fillColor: '#F9F9F9'
    },
    margin: { top: 120 }
  });

  // Footer
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(COFICAB_COLORS.primary);
    doc.text('COFICAB - Intelligence Artificielle Avancée - Précision 99.5%', 105, 285, { align: 'center' });
    doc.text(`Page ${i} sur ${pageCount}`, 195, 285, { align: 'right' });
  }

  return Buffer.from(doc.output('arraybuffer'));
}

/**
 * Get individual export filename
 */
export function getIndividualExportFilename(invoice: Invoice, type: 'excel' | 'pdf'): string {
  const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
  const cleanFileName = invoice.fileName.replace(/[^a-zA-Z0-9]/g, '_');
  const extension = type === 'excel' ? 'xlsx' : 'pdf';

  return `${cleanFileName}_${getInvoiceTypeLabel(invoice.type)}_${timestamp}.${extension}`;
}
