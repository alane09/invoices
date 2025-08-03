'use client';

import { CheckCircle, FileText, Upload, X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onUpload: (file: File) => void;
  isUploading: boolean;
}

export default function FileUpload({ onUpload, isUploading }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      onUpload(file);
    }
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: false
  });

  const removeFile = () => {
    setSelectedFile(null);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (selectedFile && !isUploading) {
    return (
      <div className="card-modern p-8">
        <div className="text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Fichier sélectionné</h3>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <p className="font-medium text-gray-900">{selectedFile.name}</p>
                  <p className="text-sm text-gray-500">{formatFileSize(selectedFile.size)}</p>
                </div>
              </div>
              <button
                onClick={removeFile}
                className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              >
                <X className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
          
          <p className="text-gray-600 mb-4">
            Fichier prêt pour l'extraction. Cliquez sur "Extraire les données" pour commencer.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-modern p-8">
      <div
        {...getRootProps()}
        className={`upload-zone ${isDragActive ? 'drag-active' : ''} ${isUploading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}`}
      >
        <input {...getInputProps()} />
        
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Upload className="h-8 w-8 text-blue-600" />
          </div>
          
          {isUploading ? (
            <div>
              <div className="loading-spinner mx-auto mb-4"></div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Téléchargement en cours...</h3>
              <p className="text-gray-600">Veuillez patienter pendant le traitement</p>
            </div>
          ) : isDragActive ? (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Déposez votre fichier ici</h3>
              <p className="text-gray-600">Relâchez pour télécharger</p>
            </div>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Glissez-déposez votre facture ici
              </h3>
              <p className="text-gray-600 mb-4">
                ou <span className="text-blue-600 font-medium">cliquez pour parcourir</span>
              </p>
              
              <div className="text-sm text-gray-500 space-y-1">
                <p>Formats acceptés: PDF, PNG, JPG, JPEG</p>
                <p>Taille maximale: 10 MB</p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {!isUploading && (
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-start space-x-3">
            <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center mt-0.5">
              <span className="text-white text-xs font-bold">i</span>
            </div>
            <div className="text-sm text-blue-800">
              <p className="font-medium mb-1">Conseils pour une meilleure extraction :</p>
              <ul className="space-y-1 text-blue-700">
                <li>• Assurez-vous que le document est lisible et bien éclairé</li>
                <li>• Les fichiers PDF donnent généralement de meilleurs résultats</li>
                <li>• Évitez les documents flous ou partiellement masqués</li>
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
