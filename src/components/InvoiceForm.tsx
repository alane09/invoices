'use client';

import { AlertCircle, CheckCircle, Edit3, FileText, Save } from 'lucide-react';
import { useEffect, useState } from 'react';

interface InvoiceField {
  key: string;
  label: string;
  value: string;
  confidence?: number;
}

interface InvoiceFormProps {
  fields: InvoiceField[];
  fileName: string;
  onSave: (data: Record<string, unknown>) => void;
  isSaving: boolean;
}

export default function InvoiceForm({ fields, fileName, onSave, isSaving }: InvoiceFormProps) {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingField, setEditingField] = useState<string | null>(null);

  useEffect(() => {
    const initialData: Record<string, string> = {};
    fields.forEach(field => {
      initialData[field.key] = field.value;
    });
    setFormData(initialData);
  }, [fields]);

  const handleFieldChange = (key: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = () => {
    onSave(formData);
  };

  const getConfidenceColor = (confidence?: number) => {
    if (!confidence) return 'confidence-medium';
    if (confidence >= 0.8) return 'confidence-high';
    if (confidence >= 0.5) return 'confidence-medium';
    return 'confidence-low';
  };

  const getConfidenceText = (confidence?: number) => {
    if (!confidence) return 'Moyen';
    if (confidence >= 0.8) return 'Élevé';
    if (confidence >= 0.5) return 'Moyen';
    return 'Faible';
  };

  const groupFields = (fields: InvoiceField[]) => {
    const groups: { [key: string]: InvoiceField[] } = {
      'Informations générales': [],
      'Consommation': [],
      'Montants': [],
      'Autres': []
    };

    fields.forEach(field => {
      const key = field.key.toLowerCase();
      if (key.includes('date') || key.includes('période') || key.includes('client') || key.includes('adresse')) {
        groups['Informations générales'].push(field);
      } else if (key.includes('consommation') || key.includes('index') || key.includes('kwh') || key.includes('m3')) {
        groups['Consommation'].push(field);
      } else if (key.includes('montant') || key.includes('prix') || key.includes('tarif') || key.includes('total') || key.includes('tva')) {
        groups['Montants'].push(field);
      } else {
        groups['Autres'].push(field);
      }
    });

    return groups;
  };

  const fieldGroups = groupFields(fields);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="card-modern p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Données extraites</h2>
              <p className="text-gray-600">{fileName}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="text-right">
              <p className="text-sm text-gray-500">Champs détectés</p>
              <p className="text-2xl font-bold text-gray-900">{fields.length}</p>
            </div>
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="btn-primary"
            >
              {isSaving ? (
                <>
                  <div className="loading-spinner mr-2"></div>
                  Sauvegarde...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Sauvegarder
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      {Object.entries(fieldGroups).map(([groupName, groupFields]) => {
        if (groupFields.length === 0) return null;
        
        return (
          <div key={groupName} className="card-modern p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
              <div className="w-2 h-2 bg-blue-600 rounded-full mr-3"></div>
              {groupName}
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {groupFields.map((field) => (
                <div key={field.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="form-label">{field.label}</label>
                    {field.confidence && (
                      <div className="flex items-center space-x-2">
                        <span className={`${getConfidenceColor(field.confidence)} text-xs`}>
                          {getConfidenceText(field.confidence)}
                        </span>
                        {field.confidence < 0.8 && (
                          <AlertCircle className="h-4 w-4 text-amber-500" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="relative">
                    {editingField === field.key ? (
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={formData[field.key] || ''}
                          onChange={(e) => handleFieldChange(field.key, e.target.value)}
                          className="form-input"
                          autoFocus
                        />
                        <button
                          onClick={() => setEditingField(null)}
                          className="btn-secondary px-3"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <div className="form-input bg-gray-50 flex-1">
                          {formData[field.key] || 'Non détecté'}
                        </div>
                        <button
                          onClick={() => setEditingField(field.key)}
                          className="btn-secondary px-3"
                          title="Modifier"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {field.confidence && field.confidence < 0.5 && (
                      <p className="text-xs text-amber-600 flex items-center">
                        <AlertCircle className="h-3 w-3 mr-1" />
                        Vérifiez cette valeur - confiance faible
                      </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        );
      })}

      {/* Summary */}
      <div className="card-modern p-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Résumé de l&apos;extraction</h3>
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>
                  {fields.filter(f => f.confidence && f.confidence >= 0.8).length} champs haute confiance
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <span>
                  {fields.filter(f => f.confidence && f.confidence >= 0.5 && f.confidence < 0.8).length} champs moyenne confiance
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>
                  {fields.filter(f => !f.confidence || f.confidence < 0.5).length} champs à vérifier
                </span>
              </div>
            </div>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-600">Précision globale</p>
            <p className="text-2xl font-bold text-blue-600">
              {Math.round((fields.filter(f => f.confidence && f.confidence >= 0.8).length / fields.length) * 100)}%
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
