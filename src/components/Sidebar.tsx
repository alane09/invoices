'use client';

import {
  ChevronLeft,
  ChevronRight,
  Droplets,
  Flame,
  History,
  Home,
  Menu,
  X,
  Zap
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

const navigation = [
  { name: 'Accueil', href: '/', icon: Home },
  { name: 'Électricité', href: '/electricity', icon: Zap },
  { name: 'Gaz', href: '/gas', icon: Flame },
  { name: 'Eau', href: '/water', icon: Droplets },
  { name: 'Historique', href: '/historique', icon: History },
];

export default function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={`fixed left-0 top-0 h-full bg-white border-r border-gray-200 transition-all duration-300 z-40 ${
        isCollapsed ? 'w-16' : 'w-64'
      }`}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          {!isCollapsed && (
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center shadow-soft">
                <span className="text-white font-bold text-lg">C</span>
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">COFICAB</h1>
                <p className="text-xs text-neutral">Invoice AI</p>
              </div>
            </div>
          )}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-neutral" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-neutral" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-primary-600' : 'text-neutral'}`} />
                {!isCollapsed && (
                  <span className="ml-3 font-medium">{item.name}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        {!isCollapsed && (
          <div className="absolute bottom-4 left-4 right-4">
            <div className="bg-gradient-to-r from-primary-50 to-tertiary-50 rounded-xl p-4 border border-primary-100">
              <div className="flex items-center space-x-2 mb-2">
                <div className="w-2 h-2 bg-success rounded-full animate-pulse"></div>
                <span className="text-sm font-semibold text-gray-900">Système actif</span>
              </div>
              <p className="text-xs text-neutral">
                IA prête pour l&apos;extraction
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-3 bg-white rounded-xl shadow-medium border border-gray-200"
        >
          {isCollapsed ? (
            <Menu className="h-5 w-5 text-neutral" />
          ) : (
            <X className="h-5 w-5 text-neutral" />
          )}
        </button>
      </div>

      {/* Mobile Overlay */}
      {!isCollapsed && (
        <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30" onClick={() => setIsCollapsed(true)} />
      )}
    </>
  );
}
