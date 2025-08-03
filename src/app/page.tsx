'use client';

import { ArrowRight, BarChart3, CheckCircle, Cpu, Droplets, Flame, Shield, Zap } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-tertiary-50">
      {/* Hero Section */}
      <div className="px-8 py-16">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-4 py-2 bg-primary-100 border border-primary-200 rounded-full text-sm font-semibold text-primary-700 mb-8">
              <Cpu className="w-4 h-4 mr-2" />
              Intelligence Artificielle Avancée
            </div>
            <h1 className="text-6xl font-bold text-gray-900 mb-8 leading-tight">
              Extraction Automatique<br />
              <span className="text-primary-600">de Factures</span>
            </h1>
            <p className="text-xl text-neutral max-w-4xl mx-auto leading-relaxed mb-12">
              COFICAB utilise l'IA de pointe pour extraire automatiquement et avec précision 
              les données de vos factures d'électricité, gaz et eau en quelques secondes.
            </p>
            
            {/* Stats */}
            <div className="flex items-center justify-center space-x-12 text-sm text-neutral mb-16">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">Précision 99.5%</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">Traitement instantané</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-success" />
                <span className="font-medium">Sécurité entreprise</span>
              </div>
            </div>
          </div>

          {/* Main Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <Link href="/electricity">
              <div className="group card-modern p-8 cursor-pointer service-electricity">
                <div className="icon-wrapper icon-electricity mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Zap className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Factures d'Électricité</h3>
                <p className="text-neutral text-center mb-8 leading-relaxed">
                  Extraction complète des données STEG : consommation, index, montants, 
                  et tous les détails de facturation automatiquement.
                </p>
                <div className="flex items-center justify-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <span>Commencer l'extraction</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            <Link href="/gas">
              <div className="group card-modern p-8 cursor-pointer service-gas">
                <div className="icon-wrapper icon-gas mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Flame className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Factures de Gaz</h3>
                <p className="text-neutral text-center mb-8 leading-relaxed">
                  Analyse précise des factures de gaz : index de consommation, 
                  tarification détaillée et calculs automatiques.
                </p>
                <div className="flex items-center justify-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <span>Commencer l'extraction</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>

            <Link href="/water">
              <div className="group card-modern p-8 cursor-pointer service-water">
                <div className="icon-wrapper icon-water mx-auto group-hover:scale-110 transition-transform duration-300">
                  <Droplets className="h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4 text-center">Factures d'Eau</h3>
                <p className="text-neutral text-center mb-8 leading-relaxed">
                  Extraction SONEDE complète : consommation d'eau, frais d'assainissement, 
                  et tous les détails tarifaires.
                </p>
                <div className="flex items-center justify-center text-primary-600 font-semibold group-hover:text-primary-700">
                  <span>Commencer l'extraction</span>
                  <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </div>
              </div>
            </Link>
          </div>

          {/* Features Section */}
          <div className="card-modern p-12">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-6">Pourquoi choisir COFICAB ?</h2>
              <p className="text-xl text-neutral max-w-3xl mx-auto">
                Notre solution d'IA avancée transforme la gestion de vos factures d'énergie
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BarChart3 className="h-8 w-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Précision Maximale</h3>
                <p className="text-neutral leading-relaxed">
                  Notre IA atteint 99.5% de précision dans l'extraction des données de factures
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-success/20 to-success/30 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="h-8 w-8 text-success" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">Sécurité Garantie</h3>
                <p className="text-neutral leading-relaxed">
                  Vos données sont protégées par un chiffrement de niveau entreprise
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-gradient-to-br from-secondary-100 to-secondary-200 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Cpu className="h-8 w-8 text-secondary-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">IA Avancée</h3>
                <p className="text-neutral leading-relaxed">
                  Technologie Koncile.ai pour une extraction intelligente et rapide
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
