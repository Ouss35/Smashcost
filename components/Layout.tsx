
import React from 'react';
import { ChefHat, Package, FileText } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView?: 'dashboard' | 'sheet' | 'stock';
  onViewChange?: (view: 'dashboard' | 'sheet' | 'stock') => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView = 'sheet', onViewChange }) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="bg-brand-500 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onViewChange?.('dashboard')}>
            <h1 className="text-xl font-extrabold tracking-tight">SMASH EATS <span className="font-light opacity-80">| RENNES</span></h1>
          </div>
          <div className="flex items-center gap-1 sm:gap-2">
             <button 
                onClick={() => onViewChange?.('sheet')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'sheet' ? 'bg-white text-brand-600' : 'text-brand-50 hover:bg-brand-600'}`}
             >
                <FileText className="w-4 h-4"/>
                <span className="hidden sm:inline">Fiches Produits</span>
             </button>
             <button 
                onClick={() => onViewChange?.('stock')}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${currentView === 'stock' ? 'bg-white text-brand-600' : 'text-brand-50 hover:bg-brand-600'}`}
             >
                <Package className="w-4 h-4"/>
                <span className="hidden sm:inline">Stock & Coûts</span>
             </button>
          </div>
        </div>
      </header>
      <main className="flex-grow">
        {children}
      </main>
      <footer className="bg-slate-900 text-slate-400 py-6">
        <div className="max-w-7xl mx-auto px-4 text-center text-sm">
          &copy; {new Date().getFullYear()} Smash Eats Rennes. Tous droits réservés.
        </div>
      </footer>
    </div>
  );
};
