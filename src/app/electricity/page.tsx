'use client';

import FileUpload from '@/components/FileUpload';
import InvoiceForm from '@/components/InvoiceForm';
import { electricityFieldLabels } from '@/types/electricity';
import axios from 'axios';
import { AlertCircle, CheckCircle, Loader2, Zap } from 'lucide-react';
import { useState } from 'react';

export default function ElectricityPage() {
  const [isUploading, setIsUploading] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null);
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleFileUpload = async (file: File) => {
    setIsUploading(true);
    setIsProcessing(true);
    setError('');
    setFileName(file.name);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('invoiceType', 'electricity');

      const uploadResponse = await axios.post('/api/upload', formData);
      
      if (uploadResponse.data.success) {
        setExtractedData(uploadResponse.data.data);
      } else {
        setError(uploadResponse.data.error || 'Échec de l\'extraction des données');
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Une erreur est survenue');
    } finally {
      setIsUploading(false);
      setIsProcessing(false);
    }
  };

  const handleSave = async (data: Record<string, unknown>) => {
    setIsSaving(true);
    setError('');

    try {
      const response = await axios.post('/api/save', {
        invoiceType: 'electricity',
        fileName,
        data
      });

      if (response.data.success) {
        setSuccess('Facture sauvegardée avec succès !');
        setTimeout(() => {
          window.location.href = '/historique';
        }, 2000);
      } else {
        setError('Échec de la sauvegarde');
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Erreur lors de la sauvegarde');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen service-electricity">
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-6 mb-8">
              <div className="icon-wrapper icon-electricity">
                <Zap className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Factures d&apos;Électricité</h1>
                <p className="text-lg text-neutral">Extraction automatique des données STEG</p>
              </div>
            </div>
          </div>

          {/* Alerts */}
          {error && (
            <div className="alert-error mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="alert-success mb-8">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 mr-3" />
                <span>{success}</span>
              </div>
            </div>
          )}

          {/* Content */}
          {!extractedData ? (
            <div className="max-w-4xl mx-auto">
              {isProcessing ? (
                <div className="card-modern p-16 text-center">
                  <div className="w-24 h-24 bg-accent-100 rounded-full flex items-center justify-center mx-auto mb-8">
                    <Loader2 className="h-12 w-12 text-accent-600 animate-spin" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-6">Extraction en cours...</h3>
                  <p className="text-xl text-neutral mb-8 max-w-2xl mx-auto">
                    Notre IA analyse votre facture STEG et extrait toutes les données importantes
                  </p>
                  <div className="bg-accent-50 rounded-xl p-6 border border-accent-200 max-w-md mx-auto">
                    <p className="text-accent-800 font-medium">
                    ⚡ Analyse des données de consommation, index et montants en cours...
                    </p>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="text-center mb-12">
                    <h2 className="section-header">Télécharger une facture STEG</h2>
                    <p className="section-subtitle max-w-3xl mx-auto">
                      Sélectionnez votre facture d&apos;électricité pour une extraction automatique et précise des données
                    </p>
                  </div>
                  <FileUpload
                    onUpload={handleFileUpload}
                    isUploading={isUploading}
                  />
                </div>
              )}
            </div>
          ) : (
            <InvoiceForm
              fields={Object.entries(extractedData).map(([key, value]) => ({
                key,
                label: electricityFieldLabels[key as keyof typeof electricityFieldLabels] || key,
                value: typeof value === 'object' && value !== null ? (value as { value?: string }).value || '' : String(value || ''),
                confidence: typeof value === 'object' && value !== null ? (value as { confidence?: number }).confidence : undefined
              }))}
              fileName={fileName}
              onSave={handleSave}
              isSaving={isSaving}
            />
          )}
        </div>
      </div>
    </div>
  );
}
