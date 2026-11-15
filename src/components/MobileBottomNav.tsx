import React from 'react';
import { useApp } from '../context/AppContext';
import { Home, ShoppingBag, Home as HouseIcon, AlertOctagon, User } from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { currentTab, setCurrentTab, setIsSosModalOpen } = useApp();

  return (
    <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#0A0F1D]/95 backdrop-blur-md border-t border-slate-800/90 px-3 py-1.5 flex items-center justify-around">
      <button
        onClick={() => setCurrentTab('dashboard')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'dashboard' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <Home className="w-4 h-4" />
        <span>Home</span>
      </button>

      <button
        onClick={() => setCurrentTab('marketplace')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'marketplace' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <ShoppingBag className="w-4 h-4" />
        <span>Market</span>
      </button>

      {/* Prominent Center SOS */}
      <button
        onClick={() => setIsSosModalOpen(true)}
        className="flex flex-col items-center justify-center -mt-4 bg-gradient-to-tr from-red-600 to-rose-600 text-white w-12 h-12 rounded-full shadow-lg shadow-red-900/50 border-2 border-[#0A0F1D] active:scale-95 transition-transform"
        aria-label="Campus SOS Emergency"
      >
        <AlertOctagon className="w-5 h-5 animate-pulse" />
      </button>

      <button
        onClick={() => setCurrentTab('rentals')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'rentals' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <HouseIcon className="w-4 h-4" />
        <span>Rentals</span>
      </button>

      <button
        onClick={() => setCurrentTab('profile')}
        className={`flex flex-col items-center gap-0.5 py-1 px-2.5 rounded-lg text-[10px] font-medium transition-colors ${
          currentTab === 'profile' ? 'text-cyan-400 font-bold' : 'text-slate-400'
        }`}
      >
        <User className="w-4 h-4" />
        <span>Profile</span>
      </button>
    </div>
  );
};
