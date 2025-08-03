'use client';

import axios from 'axios';
import { AlertCircle, Calendar, Droplets, Eye, FileText, Filter, Flame, History, Search, Trash2, Zap } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

interface Invoice {
  _id: string;
  type: 'electricity' | 'gas' | 'water';
  fileName: string;
  date?: string;
  month?: string;
  uploadedAt: string;
  data: Record<string, unknown>;
}

export default function HistoriquePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

  const fetchInvoices = useCallback(async () => {
    try {
      setLoading(true);
      const params = filter !== 'all' ? `?type=${filter}` : '';
      const response = await axios.get(`/api/invoices${params}`);
      
      if (response.data.success) {
        setInvoices(response.data.invoices);
      } else {
        setError('Erreur lors du chargement des factures');
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Erreur lors du chargement');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchInvoices();
  }, [fetchInvoices]);

  const deleteInvoice = async (id: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette facture ?')) {
      return;
    }

    try {
      const response = await axios.delete(`/api/invoices?id=${id}`);
      
      if (response.data.success) {
        setInvoices(invoices.filter(invoice => invoice._id !== id));
      } else {
        setError('Erreur lors de la suppression');
      }
    } catch (err: unknown) {
      setError((err as { response?: { data?: { error?: string } } }).response?.data?.error || 'Erreur lors de la suppression');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'electricity':
        return <Zap className="h-5 w-5 text-accent-600" />;
      case 'gas':
        return <Flame className="h-5 w-5 text-warning" />;
      case 'water':
        return <Droplets className="h-5 w-5 text-tertiary-600" />;
      default:
        return <FileText className="h-5 w-5 text-neutral" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'electricity':
        return 'Électricité';
      case 'gas':
        return 'Gaz';
      case 'water':
        return 'Eau';
      default:
        return type;
    }
  };

  const getTypeBadgeClass = (type: string) => {
    switch (type) {
      case 'electricity':
        return 'bg-accent-100 text-accent-800 border-accent-200';
      case 'gas':
        return 'bg-warning/20 text-warning border-warning/30';
      case 'water':
        return 'bg-tertiary-100 text-tertiary-800 border-tertiary-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMainAmount = (invoice: Invoice) => {
    const data = invoice.data;
    
    if (invoice.type === 'electricity') {
      return (data['Montant net à payer'] as { value?: string })?.value || (data['Montant total en chiffres coupon'] as { value?: string })?.value || 'N/A';
    } else if (invoice.type === 'gas') {
      return (data['NET A PAYER'] as { value?: string })?.value || 'N/A';
    } else if (invoice.type === 'water') {
      return (data['Total des frais de consommation eau et assainissement TTC'] as { value?: string })?.value || 'N/A';
    }
    
    return 'N/A';
  };

  const filteredInvoices = invoices.filter(invoice =>
    invoice.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getTypeLabel(invoice.type).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const stats = {
    total: invoices.length,
    electricity: invoices.filter(i => i.type === 'electricity').length,
    gas: invoices.filter(i => i.type === 'gas').length,
    water: invoices.filter(i => i.type === 'water').length,
  };

  return (
    <div className="min-h-screen service-history">
      <div className="px-8 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-12">
            <div className="flex items-center space-x-6 mb-8">
              <div className="icon-wrapper icon-history">
                <History className="h-10 w-10" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-gray-900 mb-2">Historique des Factures</h1>
                <p className="text-lg text-neutral">Consultez et gérez toutes vos factures traitées</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            <div className="stats-card">
              <div className="stats-number text-primary-600">{stats.total}</div>
              <div className="stats-label">Total factures</div>
            </div>
            <div className="stats-card">
              <div className="stats-number text-accent-600">{stats.electricity}</div>
              <div className="stats-label">Électricité</div>
            </div>
            <div className="stats-card">
              <div className="stats-number text-warning">{stats.gas}</div>
              <div className="stats-label">Gaz</div>
            </div>
            <div className="stats-card">
              <div className="stats-number text-tertiary-600">{stats.water}</div>
              <div className="stats-label">Eau</div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="card-modern p-8 mb-12">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
              <div className="flex items-center space-x-6">
                <Filter className="h-5 w-5 text-neutral" />
                <div className="flex flex-wrap gap-3">
                  <button
                    className={filter === 'all' ? 'btn-primary' : 'btn-secondary'}
                    onClick={() => setFilter('all')}
                  >
                    Toutes
                  </button>
                  <button
                    className={filter === 'electricity' ? 'btn-accent' : 'btn-secondary'}
                    onClick={() => setFilter('electricity')}
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Électricité
                  </button>
                  <button
                    className={filter === 'gas' ? 'btn-secondary bg-warning/20 text-warning border-warning/30' : 'btn-secondary'}
                    onClick={() => setFilter('gas')}
                  >
                    <Flame className="h-4 w-4 mr-2" />
                    Gaz
                  </button>
                  <button
                    className={filter === 'water' ? 'btn-tertiary' : 'btn-secondary'}
                    onClick={() => setFilter('water')}
                  >
                    <Droplets className="h-4 w-4 mr-2" />
                    Eau
                  </button>
                </div>
              </div>
              
              <div className="relative">
                <Search className="h-5 w-5 text-neutral absolute left-4 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Rechercher une facture..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-12 w-80"
                />
              </div>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="alert-error mb-8">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 mr-3" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Invoices List */}
          {loading ? (
            <div className="card-modern p-16 text-center">
              <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="h-10 w-10 text-primary-600 animate-pulse" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Chargement...</h3>
              <p className="text-neutral">Récupération de vos factures</p>
            </div>
          ) : filteredInvoices.length === 0 ? (
            <div className="card-modern p-16 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <History className="h-10 w-10 text-neutral" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                {searchTerm ? 'Aucun résultat trouvé' : 'Aucune facture trouvée'}
              </h3>
              <p className="text-neutral mb-6">
                {searchTerm 
                  ? 'Essayez avec d\'autres termes de recherche'
                  : 'Commencez par traiter votre première facture'
                }
              </p>
              {!searchTerm && (
                <button
                  onClick={() => window.location.href = '/'}
                  className="btn-primary"
                >
                  Traiter une facture
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredInvoices.map((invoice) => (
                <div key={invoice._id} className="card-modern p-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-6">
                      <div className="flex items-center space-x-4">
                        {getTypeIcon(invoice.type)}
                        <span className={`px-4 py-2 rounded-xl text-sm font-semibold border ${getTypeBadgeClass(invoice.type)}`}>
                          {getTypeLabel(invoice.type)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-2">{invoice.fileName}</h3>
                        <div className="flex items-center space-x-6 text-sm text-neutral">
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>Traité le {formatDate(invoice.uploadedAt)}</span>
                          </div>
                          {(invoice.date || invoice.month) && (
                            <span>• Période: {invoice.date || invoice.month}</span>
                          )}
                          <span>• Montant: {getMainAmount(invoice)}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-3">
                      <button
                        className="btn-secondary p-3"
                        onClick={() => setSelectedInvoice(invoice)}
                        title="Voir les détails"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        className="btn-secondary p-3 text-danger hover:bg-danger/10 border-danger/30"
                        onClick={() => deleteInvoice(invoice._id)}
                        title="Supprimer"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Invoice Details Modal */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-strong">
            <div className="p-8 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  {getTypeIcon(selectedInvoice.type)}
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{selectedInvoice.fileName}</h3>
                    <p className="text-neutral">Détails de la facture</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedInvoice(null)}
                  className="btn-secondary"
                >
                  Fermer
                </button>
              </div>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {Object.entries(selectedInvoice.data).map(([key, value]) => (
                  <div key={key} className="border border-gray-200 rounded-xl p-4">
                    <div className="text-sm font-semibold text-neutral mb-2">{key}</div>
                    <div className="text-gray-900 font-medium">
                      {typeof value === 'object' && value !== null 
                        ? (value as { value?: string }).value || 'N/A'
                        : String(value || 'N/A')
                      }
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
