import { Burger, Ingredient, AnalysisResult, SupplyItem } from '../types';
import { analyzeBurgerCost } from '../services/geminiService';
import { uploadBurgerImage } from '../services/firebaseService';
import { Calculator, Download, RefreshCw, Euro, ChevronDown, Image as ImageIcon, Plus, Trash2, Package, GripVertical, Link as LinkIcon, Lock, Wand2, TrendingUp, AlertCircle, Sparkles, CupSoda, Utensils, Upload } from 'lucide-react';
import React, { useState, useEffect, useRef } from 'react';

interface ProductSheetProps {
  burger: Burger;
  availableBurgers: Burger[];
  supplies: SupplyItem[];
  userId: string;
  onUpdate: (burger: Burger) => void;
  onSwitchBurger: (id: string) => void;
  onAddBurger: () => void;
  onDeleteBurger: (id: string) => void;
  onBack: () => void;
}

const TVA_RATE = 1.10; // 10% TVA

type PriceType = 'single' | 'menu' | 'student';

const PRICE_LABELS: Record<PriceType, string> = {
  single: 'À la carte (Seul)',
  menu: 'En Menu',
  student: 'En Menu étudiant'
};

// Helper for pluralizing specific units
const formatUnitLabel = (label: string = '') => {
  const targets = ['unité', 'boule', 'tranche', 'feuille'];
  const lowerLabel = label.toLowerCase();
  if (targets.some(t => lowerLabel.includes(t))) {
    // Avoid double (s) if already present
    if (lowerLabel.includes('(s)')) return label;
    return `${label}(s)`;
  }
  return label;
};

export const ProductSheet: React.FC<ProductSheetProps> = ({ burger, availableBurgers, supplies, userId, onUpdate, onSwitchBurger, onAddBurger, onDeleteBurger }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const compositionRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showStockSelector, setShowStockSelector] = useState(false);
  const [selectedSupplyId, setSelectedSupplyId] = useState('');
  const [supplyQuantity, setSupplyQuantity] = useState(1);
  const [isDownloading, setIsDownloading] = useState(false);
  const [draggedItemIndex, setDraggedItemIndex] = useState<number | null>(null);
  const [selectedPriceType, setSelectedPriceType] = useState<PriceType>('single');
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  
  const getIngredientCost = (ing: Ingredient): number => {
    if (ing.supplyId) {
      const supply = supplies.find(s => s.id === ing.supplyId);
      if (supply && supply.packageQuantity > 0) {
        return (supply.packagePrice / supply.packageQuantity) * (ing.quantityValue || 0);
      }
    }
    return ing.cost || 0;
  };

  const getSupplyItemCost = (id?: string): number => {
    if (!id) return 0;
    const supply = supplies.find(s => s.id === id);
    if (!supply || supply.packageQuantity === 0) return 0;
    return supply.packagePrice / supply.packageQuantity;
  };

  // Reset price type to single if we switch to a burger that doesn't support student menu
  useEffect(() => {
    const studentMenuBurgers = ['smash', 'doublecheese'];
    if (!studentMenuBurgers.includes(burger.id) && selectedPriceType === 'student') {
        setSelectedPriceType('single');
    }
  }, [burger.id, selectedPriceType]);

  const isMenuMode = selectedPriceType !== 'single';
  
  const burgerBaseCostHT = burger.ingredients.reduce((sum, item) => sum + getIngredientCost(item), 0);
  const menuAddonsCostHT = isMenuMode ? (getSupplyItemCost(burger.menuSideId) + getSupplyItemCost(burger.menuDrinkId)) : 0;
  const totalCostHT = burgerBaseCostHT + menuAddonsCostHT;
  
  const sellingPriceTTC = burger.sellingPrices[selectedPriceType];
  const sellingPriceHT = sellingPriceTTC / TVA_RATE;
  const marginHT = sellingPriceHT - totalCostHT;
  const marginPercent = sellingPriceHT > 0 ? (marginHT / sellingPriceHT) * 100 : 0;
  
  const recommendedPriceHT = totalCostHT > 0 ? totalCostHT / 0.30 : 0;
  const recommendedPriceTTC = recommendedPriceHT * TVA_RATE;

  useEffect(() => {
    setAnalysis(null);
  }, [burger.id]);

  useEffect(() => {
    const textarea = compositionRef.current;
    if (textarea) {
        textarea.style.height = 'auto';
        textarea.style.height = `${textarea.scrollHeight}px`;
    }
  }, [burger.composition, burger.id]);

  const handleIngredientChange = (id: string, field: keyof Ingredient, value: string | number) => {
    const newIngredients = burger.ingredients.map(ing => 
      ing.id === id ? { ...ing, [field]: value } : ing
    );
    onUpdate({ ...burger, ingredients: newIngredients });
  };

  const handleAddIngredient = () => {
    const newId = Date.now().toString();
    const newIng: Ingredient = { id: newId, name: '', quantityLabel: '', cost: 0 };
    onUpdate({ ...burger, ingredients: [...burger.ingredients, newIng] });
  };

  const handleAddFromStock = () => {
      const supply = supplies.find(s => s.id === selectedSupplyId);
      if (!supply) return;
      const newId = Date.now().toString();
      const newIng: Ingredient = {
          id: newId,
          name: supply.name,
          quantityLabel: supply.unitLabel.toLowerCase(), 
          cost: 0, 
          supplyId: supply.id,
          quantityValue: supplyQuantity
      };
      onUpdate({ ...burger, ingredients: [...burger.ingredients, newIng] });
      setShowStockSelector(false);
      setSelectedSupplyId('');
      setSupplyQuantity(1);
  };

  const handleRemoveIngredient = (id: string) => {
      onUpdate({ ...burger, ingredients: burger.ingredients.filter(i => i.id !== id) });
  };

  const onDragStart = (index: number) => setDraggedItemIndex(index);
  const onDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedItemIndex === null || draggedItemIndex === index) return;
    const newIngredients = [...burger.ingredients];
    const draggedItem = newIngredients[draggedItemIndex];
    newIngredients.splice(draggedItemIndex, 1);
    newIngredients.splice(index, 0, draggedItem);
    setDraggedItemIndex(index);
    onUpdate({ ...burger, ingredients: newIngredients });
  };
  const onDragEnd = () => {
  setDraggedItemIndex(null);
  if (draggedItemIndex !== null) {
    onUpdate({ ...burger });
  }
};

  const handlePriceChange = (field: PriceType, newVal: string) => {
    const val = parseFloat(newVal);
    if (isNaN(val)) return;
    onUpdate({ ...burger, sellingPrices: { ...burger.sellingPrices, [field]: val } });
  };

  const handleMenuAddonUpdate = (field: 'menuSideId' | 'menuDrinkId', id: string) => {
    onUpdate({ ...burger, [field]: id });
  };

  const triggerAnalysis = async () => {
    setIsAnalyzing(true);
    const result = await analyzeBurgerCost({ 
        ...burger, 
        ingredients: burger.ingredients.map(i => ({ ...i, cost: getIngredientCost(i) })) 
    });
    setAnalysis(result);
    setIsAnalyzing(false);
  };

  const handleDownloadPdf = () => {
    setIsDownloading(true);
    const element = document.getElementById('printable-product-sheet');
    const opt = {
      margin: 5,
      filename: `Fiche_Cout_${burger.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      // Force windowWidth to 1280px to ensure the 2-column layout (Price Top Right) is preserved in PDF
      html2canvas: { scale: 2, useCORS: true, windowWidth: 1280 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    // @ts-ignore
    window.html2pdf().set(opt).from(element).save().then(() => setIsDownloading(false));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && userId) {
      setIsUploadingImage(true);
      const imageUrl = await uploadBurgerImage(userId, burger.id, file);
      if (imageUrl) {
        onUpdate({ ...burger, imagePlaceholder: imageUrl });
      }
      setIsUploadingImage(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div id="printable-product-sheet" className="space-y-6 pb-12 animate-in fade-in duration-500">
      
      {/* SECTION DU HAUT : COMPOSITION & PRIX (LAYOUT FIXE: PRIX À DROITE) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* BLOC GAUCHE: NOM & COMPOSITION */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex flex-wrap items-center gap-3 mb-8" data-html2canvas-ignore="true">
                <div className="relative w-full sm:w-auto">
                    <select 
                        value={burger.id} 
                        onChange={(e) => onSwitchBurger(e.target.value)}
                        className="appearance-none bg-white border border-slate-200 text-slate-800 font-extrabold py-2.5 pl-4 pr-10 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-100 transition-all cursor-pointer shadow-sm w-full sm:min-w-[280px] lg:min-w-[320px]"
                    >
                        {availableBurgers.map(b => (
                            <option key={b.id} value={b.id}>{b.name.toUpperCase()}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
                <div className="flex items-center gap-2">
                    <button 
                        onClick={onAddBurger} 
                        className="bg-brand-300 hover:bg-brand-400 text-white p-2.5 rounded-lg transition-all shadow-sm active:scale-95"
                        title="Ajouter un produit"
                    >
                        <Plus className="w-5 h-5" />
                    </button>
                    <button 
                        onClick={() => onDeleteBurger(burger.id)} 
                        className="bg-white border border-slate-100 text-slate-300 hover:text-red-500 p-2.5 rounded-lg transition-colors shadow-sm"
                    >
                        <Trash2 className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2 block">Nom du Produit</label>
                    <input 
                        type="text" 
                        value={burger.name}
                        onChange={(e) => onUpdate({...burger, name: e.target.value})}
                        className="w-full text-lg sm:text-xl font-black text-slate-800 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 focus:ring-2 focus:ring-brand-100 outline-none transition-all placeholder:text-slate-300 uppercase"
                        placeholder="NOM DU BURGER..."
                    />
                </div>

                <div>
                    <h4 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Composition</h4>
                    <div className="flex flex-col-reverse sm:flex-row items-center gap-6">
                        <div className="w-full flex-1 bg-slate-50/50 border border-slate-100 rounded-xl p-4 min-h-[90px] flex items-center">
                            <textarea 
                                ref={compositionRef}
                                value={burger.composition}
                                onChange={(e) => onUpdate({...burger, composition: e.target.value})}
                                className="w-full text-slate-700 font-semibold text-[14px] leading-relaxed bg-transparent border-none p-0 focus:ring-0 transition-all resize-none overflow-hidden"
                                placeholder="Description de la recette..."
                            />
                        </div>
                        <div 
                            className="w-40 h-40 sm:w-28 sm:h-28 shrink-0 relative group cursor-pointer"
                            onClick={triggerFileInput}
                            title="Cliquez pour changer la photo"
                        >
                            <input 
                                type="file" 
                                ref={fileInputRef} 
                                className="hidden" 
                                accept="image/*" 
                                onChange={handleImageUpload} 
                            />
                            <div className="w-full h-full rounded-full bg-slate-50 flex items-center justify-center border-4 border-white shadow-inner overflow-hidden relative z-10">
                                {isUploadingImage ? (
                                    <RefreshCw className="w-6 h-6 text-slate-400 animate-spin" />
                                ) : burger.imagePlaceholder ? (
                                    <img src={burger.imagePlaceholder} alt={burger.name} className="w-full h-full object-cover transition-transform group-hover:scale-105 duration-300" />
                                ) : (
                                    <div className="flex flex-col items-center justify-center text-slate-200 group-hover:text-slate-300 transition-colors">
                                        <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                                        <span className="text-[9px] font-black tracking-tighter opacity-50 uppercase">Img</span>
                                    </div>
                                )}
                            </div>
                            <div className="absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/20 rounded-full">
                                <Upload className="w-6 h-6 text-white drop-shadow-md" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* BLOC DROITE: PRIX DE VENTE (GARANTI EN HAUT À DROITE) */}
        <div className="lg:col-span-4 bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col">
            <div className="flex items-center justify-between gap-2 mb-6">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Euro className="w-4 h-4 text-brand-500" /> Prix de Vente
                </h3>
                <span className="text-[10px] bg-slate-100 text-slate-500 px-2 py-0.5 rounded font-bold uppercase">TTC (10%)</span>
            </div>
            
            <div className="space-y-5">
                {/* CONFIGURATION */}
                <div className="relative">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 block">Configuration</label>
                    <div className="relative h-[42px]">
                        <select 
                            value={selectedPriceType}
                            onChange={(e) => setSelectedPriceType(e.target.value as PriceType)}
                            className="w-full h-full appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-semibold px-4 rounded-lg text-sm focus:ring-2 focus:ring-brand-100 outline-none transition-all cursor-pointer"
                        >
                            <option value="single">{PRICE_LABELS.single}</option>
                            <option value="menu">{PRICE_LABELS.menu}</option>
                            {(burger.id === 'smash' || burger.id === 'doublecheese') && (
                                <option value="student">{PRICE_LABELS.student}</option>
                            )}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                </div>

                {/* PRIX DE VENTE */}
                <div className="group">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1.5 block">Prix de vente (€)</label>
                    <div className="relative h-[42px]">
                        <input 
                            type="number" step="0.1" 
                            value={sellingPriceTTC}
                            onChange={(e) => handlePriceChange(selectedPriceType, e.target.value)}
                            className="w-full h-full bg-white border border-slate-200 pl-4 pr-10 rounded-lg font-bold text-sm text-slate-800 focus:ring-2 focus:ring-brand-100 outline-none transition-all shadow-sm"
                            placeholder="0.00"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 font-bold pointer-events-none">€</span>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-50">
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wide">
                    <span className="text-slate-400 font-medium">Valeur nette HT :</span>
                    <span className="font-bold text-slate-600">{sellingPriceHT.toFixed(2)} €</span>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION DU MILIEU: INGRÉDIENTS & INDICATEURS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* TABLEAU INGRÉDIENTS */}
        <div className="lg:col-span-8 bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-bold text-slate-700 flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-brand-500" /> Détail des Ingrédients <span className="text-[10px] font-normal text-slate-400">(HT)</span>
                </h3>
                <div className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 bg-slate-50 border border-slate-100 rounded text-[9px] font-bold text-slate-400 uppercase tracking-tight">
                    <Lock className="w-2.5 h-2.5" /> Prix d'achat lié
                </div>
            </div>
            
            <div className="overflow-hidden">
                <table className="w-full text-left table-fixed">
                    <thead className="text-[10px] text-slate-400 uppercase border-b border-slate-50">
                        <tr>
                            <th className="py-2 w-5 sm:w-6" data-html2canvas-ignore="true"></th>
                            <th className="py-2 font-semibold">Ingrédient</th>
                            <th className="py-2 font-semibold w-16 sm:w-32 text-center sm:text-left">Qté(s)</th>
                            <th className="py-2 font-semibold text-right w-16 sm:w-28">Coût HT</th>
                            <th className="py-2 w-6 sm:w-8" data-html2canvas-ignore="true"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                        {/* SECTION BURGER */}
                        <tr className="bg-slate-50/50">
                            <td colSpan={5} className="py-2 px-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest border-y border-slate-100/50">Partie Burger</td>
                        </tr>
                        {burger.ingredients.map((ing, index) => {
                            const currentCost = getIngredientCost(ing);
                            const supply = supplies.find(s => s.id === ing.supplyId);
                            return (
                                <tr 
                                    key={ing.id} 
                                    draggable 
                                    onDragStart={() => onDragStart(index)}
                                    onDragOver={(e) => onDragOver(e, index)}
                                    onDragEnd={onDragEnd}
                                    className={`group transition-colors ${draggedItemIndex === index ? 'opacity-20' : ''}`}
                                >
                                    <td className="py-3 cursor-grab text-slate-200 hover:text-slate-400" data-html2canvas-ignore="true">
                                        <GripVertical className="w-3.5 h-3.5" />
                                    </td>
                                    <td className="py-3 pr-2">
                                        <input 
                                            type="text" 
                                            value={ing.name}
                                            onChange={(e) => handleIngredientChange(ing.id, 'name', e.target.value)}
                                            className="w-full bg-transparent border-none p-0 text-slate-700 font-medium text-[13px] sm:text-sm focus:ring-0 overflow-hidden text-ellipsis"
                                            placeholder="Nom"
                                        />
                                    </td>
                                    <td className="py-3">
                                        <div className="flex flex-col sm:flex-row items-center justify-center sm:justify-start gap-0.5 sm:gap-1">
                                            {ing.supplyId ? (
                                                <>
                                                    <input 
                                                        type="number"
                                                        step="0.01"
                                                        className="w-10 sm:w-20 bg-slate-50/50 border border-slate-100 rounded px-1 py-0.5 text-slate-600 font-medium text-[10px] sm:text-[11px] focus:border-brand-200 outline-none transition-all text-center"
                                                        value={ing.quantityValue || 0}
                                                        onChange={(e) => handleIngredientChange(ing.id, 'quantityValue', parseFloat(e.target.value))}
                                                    />
                                                    <span className="text-[8px] sm:text-[10px] text-slate-400 lowercase whitespace-nowrap leading-none">
                                                        {formatUnitLabel(supply?.unitLabel || 'un.')}
                                                    </span>
                                                </>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    value={formatUnitLabel(ing.quantityLabel)}
                                                    onChange={(e) => handleIngredientChange(ing.id, 'quantityLabel', e.target.value)}
                                                    className="w-full bg-transparent border-none p-0 text-slate-400 text-[9px] sm:text-[10px] focus:ring-0 italic text-center sm:text-left"
                                                    placeholder="Qté..."
                                                />
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-0.5 sm:gap-1 select-none">
                                            <span className="text-slate-500 font-mono text-[11px] sm:text-[13px]">{currentCost.toFixed(2)}</span>
                                            <div className="hidden sm:flex w-4 justify-center">
                                                {ing.supplyId ? (
                                                    <LinkIcon className="w-2.5 h-2.5 text-brand-300" />
                                                ) : (
                                                    <div className="w-2.5" />
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center" data-html2canvas-ignore="true">
                                        <button onClick={() => handleRemoveIngredient(ing.id)} className="text-slate-200 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 className="w-3.5 h-3.5" /></button>
                                    </td>
                                </tr>
                            );
                        })}

                        {/* SECTION MENU (SI ACTIF) */}
                        {isMenuMode && (
                            <>
                                <tr className="bg-brand-50/30">
                                    <td colSpan={5} className="py-2 px-6 text-[10px] font-bold text-brand-400 uppercase tracking-widest border-y border-brand-100/50">Partie Menu</td>
                                </tr>
                                {/* ACCOMPAGNEMENT */}
                                <tr className="group transition-colors">
                                    <td className="py-3" data-html2canvas-ignore="true"></td>
                                    <td className="py-3 pr-2">
                                        <div className="flex items-center gap-2">
                                            <Utensils className="w-3.5 h-3.5 text-brand-300" />
                                            <select 
                                                className="w-full bg-transparent border-none p-0 text-slate-700 font-medium text-[13px] sm:text-sm focus:ring-0 cursor-pointer"
                                                value={burger.menuSideId || ''}
                                                onChange={(e) => handleMenuAddonUpdate('menuSideId', e.target.value)}
                                            >
                                                <option value="">-- Choisir Accompagnement --</option>
                                                {supplies.filter(s => s.unitLabel === 'portion').map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center sm:text-left">
                                        <span className="text-[10px] text-slate-400 italic">1 portion</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-0.5 sm:gap-1 select-none">
                                            <span className="text-brand-600 font-mono text-[11px] sm:text-[13px]">{getSupplyItemCost(burger.menuSideId).toFixed(2)}</span>
                                            <div className="hidden sm:flex w-4 justify-center">
                                                <LinkIcon className="w-2.5 h-2.5 text-brand-200" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3" data-html2canvas-ignore="true"></td>
                                </tr>
                                {/* BOISSON */}
                                <tr className="group transition-colors">
                                    <td className="py-3" data-html2canvas-ignore="true"></td>
                                    <td className="py-3 pr-2">
                                        <div className="flex items-center gap-2">
                                            <CupSoda className="w-3.5 h-3.5 text-brand-300" />
                                            <select 
                                                className="w-full bg-transparent border-none p-0 text-slate-700 font-medium text-[13px] sm:text-sm focus:ring-0 cursor-pointer"
                                                value={burger.menuDrinkId || ''}
                                                onChange={(e) => handleMenuAddonUpdate('menuDrinkId', e.target.value)}
                                            >
                                                <option value="">-- Choisir Boisson --</option>
                                                {supplies.filter(s => s.unitLabel === 'unité' && s.id !== 'pain-martins').map(s => (
                                                    <option key={s.id} value={s.id}>{s.name}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </td>
                                    <td className="py-3 text-center sm:text-left">
                                        <span className="text-[10px] text-slate-400 italic">1 {formatUnitLabel('unité')}</span>
                                    </td>
                                    <td className="py-3 text-right">
                                        <div className="flex items-center justify-end gap-0.5 sm:gap-1 select-none">
                                            <span className="text-brand-600 font-mono text-[11px] sm:text-[13px]">{getSupplyItemCost(burger.menuDrinkId).toFixed(2)}</span>
                                            <div className="hidden sm:flex w-4 justify-center">
                                                <LinkIcon className="w-2.5 h-2.5 text-brand-200" />
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-3" data-html2canvas-ignore="true"></td>
                                </tr>
                            </>
                        )}
                    </tbody>
                    <tfoot className="border-t border-slate-100">
                        <tr>
                            <th colSpan={3} className="py-5 font-bold text-slate-400 text-[10px] uppercase tracking-wider text-left pl-6">Total Food Cost HT {isMenuMode && '(Menu)'}</th>
                            <td className="py-5 text-right">
                                <span className="font-black text-slate-800 text-sm sm:text-base whitespace-nowrap">{totalCostHT.toFixed(2)} €</span>
                            </td>
                            <td></td>
                        </tr>
                    </tfoot>
                </table>

                <div className="mt-4 pt-2 border-t border-slate-50 flex flex-wrap items-center gap-4" data-html2canvas-ignore="true">
                    {!showStockSelector ? (
                        <>
                            <button onClick={handleAddIngredient} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 flex items-center gap-1 transition-colors"><Plus className="w-3 h-3" /> Libre</button>
                            <button onClick={() => setShowStockSelector(true)} className="text-[11px] font-bold text-brand-500 hover:text-brand-600 flex items-center gap-1 transition-colors"><Package className="w-3 h-3" /> Stock</button>
                        </>
                    ) : (
                        <div className="w-full bg-slate-50 p-3 rounded border border-slate-100 flex flex-wrap items-center gap-3 animate-in slide-in-from-top-1">
                            <select 
                                className="flex-1 bg-white border border-slate-200 text-xs rounded px-2 py-1 outline-none min-w-[140px]"
                                value={selectedSupplyId}
                                onChange={(e) => setSelectedSupplyId(e.target.value)}
                            >
                                <option value="">-- Article --</option>
                                {supplies.map(s => <option key={s.id} value={s.id}>{s.name} ({s.supplier})</option>)}
                            </select>
                            <div className="flex items-center gap-1">
                                <input 
                                    type="number" step="0.1" className="w-16 bg-white border border-slate-200 text-[11px] rounded px-1.5 py-1 text-center outline-none"
                                    value={supplyQuantity} onChange={(e) => setSupplyQuantity(parseFloat(e.target.value))}
                                />
                                <span className="text-[10px] text-slate-400">qté(s)</span>
                            </div>
                            <button onClick={handleAddFromStock} disabled={!selectedSupplyId} className="bg-slate-800 text-white text-[10px] font-bold px-3 py-1 rounded hover:bg-slate-700 disabled:opacity-50 transition-colors">OK</button>
                            <button onClick={() => setShowStockSelector(false)} className="text-[10px] text-slate-400 hover:text-slate-600">Annuler</button>
                        </div>
                    )}
                </div>
            </div>
        </div>

        {/* INDICATEURS */}
        <div className="lg:col-span-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                <div className={`p-6 rounded-xl border flex flex-col justify-center ${marginPercent < 70 ? 'bg-red-50/50 border-red-100 text-red-700' : 'bg-emerald-50/50 border-emerald-100 text-emerald-700'}`}>
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Marge Brute HT</p>
                    <p className="text-3xl font-black">{marginHT.toFixed(2)}€</p>
                    <p className="text-xs font-medium opacity-60 lowercase mt-1">{marginPercent.toFixed(1)}% de marge</p>
                </div>
                <div className="p-6 rounded-xl border bg-white border-slate-200 flex flex-col justify-center">
                    <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-2">Cible TTC (30% Ratio)</p>
                    <p className="text-3xl font-black text-slate-700">{recommendedPriceTTC.toFixed(2)}€</p>
                    <p className="text-xs font-medium text-slate-400 mt-1">Prix de vente suggéré</p>
                </div>
            </div>
        </div>
      </div>

      {/* SECTION DU BAS: ANALYSE IA */}
      <div className="space-y-4">
        <div className="bg-slate-900 rounded-xl overflow-hidden shadow-xl border border-slate-800">
            <div className="px-6 py-4 bg-slate-800/50 border-b border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                    <div className="bg-brand-500 p-2 rounded-lg shrink-0">
                        <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-white leading-tight">Analyseur Intelligent Gemini</h3>
                        <p className="text-[10px] text-slate-400 font-medium uppercase tracking-tight">Rentabilité & Stratégie</p>
                    </div>
                </div>
                <button 
                    onClick={triggerAnalysis} 
                    disabled={isAnalyzing}
                    className="w-full sm:w-auto bg-brand-500 hover:bg-brand-600 disabled:opacity-30 text-white px-5 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                    data-html2canvas-ignore="true"
                >
                    {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                    {isAnalyzing ? "Analyse..." : "LANCER L'ANALYSE IA"}
                </button>
            </div>

            <div className="p-6">
                {!analysis ? (
                    <div className="text-center py-8">
                        <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-white/10">
                            <TrendingUp className="w-8 h-8 text-slate-600" />
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Obtenez un diagnostic complet de votre marge par l'IA.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-2 duration-500">
                        <div className="lg:col-span-1 space-y-4">
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Score Financier</p>
                                <div className="flex items-baseline gap-2">
                                    <span className="text-5xl font-black text-brand-400">{analysis.score}</span>
                                    <span className="text-xl font-bold text-slate-500">/ 100</span>
                                </div>
                            </div>
                            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Verdict</p>
                                <p className="text-slate-200 text-sm font-medium leading-relaxed italic">"{analysis.profitability}"</p>
                            </div>
                        </div>
                        <div className="lg:col-span-2">
                             <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4">Recommandations</p>
                             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {analysis.suggestions.map((s, i) => (
                                    <div key={i} className="flex gap-3 bg-white/5 p-4 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                                        <AlertCircle className="w-5 h-5 text-brand-400 shrink-0" />
                                        <span className="text-slate-300 text-xs leading-relaxed font-medium">{s}</span>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>

        <button 
            className="w-full bg-slate-200 hover:bg-slate-300 text-slate-800 font-extrabold py-5 rounded-xl shadow-sm transition-all flex items-center justify-center gap-3 text-sm tracking-wide uppercase" 
            onClick={handleDownloadPdf} 
            disabled={isDownloading} 
            data-html2canvas-ignore="true"
        >
            {isDownloading ? <RefreshCw className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />} 
            {isDownloading ? "EXPORT PDF..." : "EXPORTER LA FICHE PRODUIT"}
        </button>
      </div>
    </div>
  );
};
