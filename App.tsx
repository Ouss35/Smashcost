import React, { useState, useEffect, useRef } from 'react';
import { Layout } from './components/Layout';
import { ProductSheet } from './components/ProductSheet';
import { Dashboard } from './components/Dashboard';
import { StockManager } from './components/StockManager';
import { AuthPage } from './components/AuthPage';
import { BURGERS_DATA, INITIAL_SUPPLIES } from './constants';
import { Burger, SupplyItem, User } from './types';
import { onAuthChange, logOut } from './services/authService';
import { saveBurgers, loadBurgers, saveSupplies, loadSupplies } from './services/firestoreService';
import { LogOut } from 'lucide-react';

const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [burgers, setBurgers] = useState<Burger[]>(BURGERS_DATA);
  const [supplies, setSupplies] = useState<SupplyItem[]>(INITIAL_SUPPLIES);
  const [selectedBurgerId, setSelectedBurgerId] = useState<string>(BURGERS_DATA[0].id);
  const [view, setView] = useState<'dashboard' | 'sheet' | 'stock'>('sheet');
  const dataLoaded = useRef(false);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthChange(async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        const loadedBurgers = await loadBurgers(currentUser.uid);
        const loadedSupplies = await loadSupplies(currentUser.uid);
        
        if (loadedBurgers) setBurgers(loadedBurgers);
        if (loadedSupplies) setSupplies(loadedSupplies);
        dataLoaded.current = true;
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Save burgers to Firestore (only after data is loaded)
  useEffect(() => {
    if (user && dataLoaded.current) {
      saveBurgers(user.uid, burgers);
    }
  }, [burgers, user]);

  // Save supplies to Firestore (only after data is loaded)
  useEffect(() => {
    if (user && dataLoaded.current) {
      saveSupplies(user.uid, supplies);
    }
  }, [supplies, user]);

  const currentBurger = burgers.find(b => b.id === selectedBurgerId) || burgers[0];

  const handleUpdateBurger = (updatedBurger: Burger) => {
    setBurgers(prev => prev.map(b => b.id === updatedBurger.id ? updatedBurger : b));
  };

  const handleAddBurger = () => {
    const newId = `custom-${Date.now()}`;
    const newBurger: Burger = {
      id: newId,
      name: 'NOUVEAU PRODUIT',
      composition: 'Description du produit...',
      ingredients: [],
      sellingPrices: { single: 0, menu: 0, student: 0 },
      imagePlaceholder: '',
    };
    setBurgers(prev => [...prev, newBurger]);
    setSelectedBurgerId(newId);
    setView('sheet');
  };

  const handleDeleteBurger = (id: string) => {
    if (burgers.length <= 1) return;
    if (confirm("Voulez-vous vraiment supprimer ce produit ?")) {
      const newList = burgers.filter(b => b.id !== id);
      setBurgers(newList);
      setSelectedBurgerId(newList[0].id);
    }
  };

  const handleAddSupply = (item: SupplyItem) => {
    setSupplies(prev => [...prev, item]);
  };

  const handleUpdateSupply = (item: SupplyItem) => {
    setSupplies(prev => prev.map(s => s.id === item.id ? item : s));
  };

  const handleDeleteSupply = (id: string) => {
    if(confirm("Supprimer cet article du stock ?")) {
      setSupplies(prev => prev.filter(s => s.id !== id));
    }
  };

  const handleLogout = async () => {
    await logOut();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-50 to-brand-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-500 mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  return (
    <Layout currentView={view} onViewChange={setView}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-end mb-4">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Déconnexion
          </button>
        </div>

        {view === 'sheet' && (
          <ProductSheet 
            burger={currentBurger} 
            availableBurgers={burgers}
            supplies={supplies}
            userId={user.uid}
            onUpdate={handleUpdateBurger}
            onSwitchBurger={setSelectedBurgerId}
            onAddBurger={handleAddBurger}
            onDeleteBurger={handleDeleteBurger}
            onBack={() => setView('dashboard')} 
          />
        )}
        {view === 'stock' && (
          <StockManager 
            supplies={supplies}
            onAddSupply={handleAddSupply}
            onUpdateSupply={handleUpdateSupply}
            onDeleteSupply={handleDeleteSupply}
          />
        )}
        {view === 'dashboard' && <Dashboard />}
      </div>
    </Layout>
  );
};

export default App;
