
import React, { useState } from 'react';
import { SupplyItem } from '../types';
import { Plus, Trash2, Package, Save } from 'lucide-react';

interface StockManagerProps {
  supplies: SupplyItem[];
  onAddSupply: (item: SupplyItem) => void;
  onUpdateSupply: (item: SupplyItem) => void;
  onDeleteSupply: (id: string) => void;
}

// Helper for pluralizing specific units
const formatUnitLabel = (label: string = '') => {
  const targets = ['unité', 'boule', 'tranche', 'feuille'];
  const lowerLabel = label.toLowerCase();
  if (targets.some(t => lowerLabel.includes(t))) {
    if (lowerLabel.includes('(s)')) return label;
    return `${label}(s)`;
  }
  return label;
};

export const StockManager: React.FC<StockManagerProps> = ({ supplies, onAddSupply, onUpdateSupply, onDeleteSupply }) => {
  const [newSupply, setNewSupply] = useState<Partial<SupplyItem>>({
    name: '',
    packagePrice: 0,
    packageQuantity: 1,
    unitLabel: '',
    supplier: ''
  });

  const handleAdd = () => {
    if (!newSupply.name || !newSupply.packagePrice || !newSupply.packageQuantity) return;
    
    const item: SupplyItem = {
      id: Date.now().toString(),
      name: newSupply.name,
      packagePrice: Number(newSupply.packagePrice),
      packageQuantity: Number(newSupply.packageQuantity),
      unitLabel: (newSupply.unitLabel || 'unité').toLowerCase(),
      supplier: newSupply.supplier || 'Inconnu'
    };
    
    onAddSupply(item);
    setNewSupply({ name: '', packagePrice: 0, packageQuantity: 1, unitLabel: '', supplier: '' });
  };

  const handleUpdate = (id: string, field: keyof SupplyItem, value: any) => {
    const item = supplies.find(s => s.id === id);
    if (item) {
        onUpdateSupply({ ...item, [field]: value });
    }
  };

  const getUnitCost = (item: SupplyItem) => {
    if (item.packageQuantity === 0) return 0;
    return item.packagePrice / item.packageQuantity;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 py-2">
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 flex items-center gap-2">
            <Package className="w-5 h-5 text-brand-500" />
            Stock & Coûts d'Achat
          </h2>
          <p className="text-slate-400 text-xs mt-0.5 italic">
            Mettez à jour les prix fournisseurs ici pour impacter toutes les fiches produits.
          </p>
        </div>
      </div>

      <div className="bg-slate-900 rounded-lg shadow-lg p-5 text-white">
        <h3 className="text-xs font-bold mb-4 flex items-center gap-2 text-brand-300 uppercase tracking-widest">
            Nouvel Article
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
            <div className="lg:col-span-2">
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">Nom du produit</label>
                <input 
                    type="text" 
                    placeholder="Ex: Cheddar tranches..."
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-brand-400 outline-none"
                    value={newSupply.name}
                    onChange={e => setNewSupply({...newSupply, name: e.target.value})}
                />
            </div>
             <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">Fournisseur</label>
                <input 
                    type="text" 
                    placeholder="DPS..."
                    className="w-full bg-slate-800 border border-slate-700 rounded px-3 py-1.5 text-sm text-white focus:ring-1 focus:ring-brand-400 outline-none"
                    value={newSupply.supplier}
                    onChange={e => setNewSupply({...newSupply, supplier: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">Prix HT</label>
                <div className="relative">
                    <input 
                        type="number" 
                        step="0.01"
                        className="w-full bg-slate-800 border border-slate-700 rounded pl-3 pr-6 py-1.5 text-sm text-white outline-none"
                        value={newSupply.packagePrice || ''}
                        onChange={e => setNewSupply({...newSupply, packagePrice: parseFloat(e.target.value)})}
                    />
                    <span className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 text-[10px]">€</span>
                </div>
            </div>
            <div>
                <label className="block text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-tighter">Colisage</label>
                <div className="flex gap-1">
                    <input 
                        type="number" 
                        className="w-full bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-sm text-white outline-none"
                        value={newSupply.packageQuantity || ''}
                        onChange={e => setNewSupply({...newSupply, packageQuantity: parseFloat(e.target.value)})}
                    />
                     <input 
                        type="text" 
                        placeholder="unité"
                        className="w-16 bg-slate-800 border border-slate-700 rounded px-2 py-1.5 text-xs text-white italic outline-none"
                        value={newSupply.unitLabel}
                        onChange={e => setNewSupply({...newSupply, unitLabel: e.target.value})}
                    />
                </div>
            </div>
            <button 
                onClick={handleAdd}
                className="bg-brand-500 hover:bg-brand-600 text-white font-bold py-1.5 px-4 rounded transition-colors flex items-center justify-center gap-2 h-[34px] text-xs"
            >
                <Plus className="w-3.5 h-3.5" /> Ajouter
            </button>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-100 text-[10px] text-slate-400 uppercase tracking-wider">
                    <tr>
                        <th className="px-6 py-3 font-semibold">Produit</th>
                        <th className="px-6 py-3 font-semibold text-right w-28">Achat HT (€)</th>
                        <th className="px-6 py-3 font-semibold text-right w-32">Qté(s) / Colis</th>
                        <th className="px-6 py-3 font-semibold text-right w-36 text-brand-700 bg-brand-50/30">Coût / Unité(s)</th>
                        <th className="px-6 py-3 w-16"></th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {supplies.map(item => (
                        <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                            <td className="px-6 py-3">
                                <div className="font-bold text-slate-700 text-sm">{item.name}</div>
                                <div className="text-[10px] text-slate-300 font-medium uppercase mt-0.5 tracking-tight">{item.supplier}</div>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <div className="relative inline-block w-20">
                                    <input 
                                        type="number"
                                        step="0.01"
                                        className="w-full text-right bg-transparent border-transparent group-hover:bg-white group-hover:border-slate-100 rounded px-1 py-1 text-slate-600 font-mono text-xs focus:ring-0 outline-none transition-all"
                                        value={item.packagePrice}
                                        onChange={(e) => handleUpdate(item.id, 'packagePrice', parseFloat(e.target.value))}
                                    />
                                </div>
                            </td>
                            <td className="px-6 py-3 text-right">
                                <div className="flex items-center justify-end gap-1.5 text-slate-400 text-xs">
                                    <span className="font-bold text-slate-600">{item.packageQuantity}</span>
                                    <span className="text-[10px] lowercase italic">{formatUnitLabel(item.unitLabel)}</span>
                                </div>
                            </td>
                            <td className="px-6 py-3 text-right font-black text-brand-600 bg-brand-50/10 text-sm">
                                {getUnitCost(item).toFixed(4)} €
                            </td>
                            <td className="px-6 py-3 text-right">
                                <button 
                                    onClick={() => onDeleteSupply(item.id)}
                                    className="text-slate-200 hover:text-red-400 p-1 transition-colors opacity-0 group-hover:opacity-100"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
      </div>
    </div>
  );
};
