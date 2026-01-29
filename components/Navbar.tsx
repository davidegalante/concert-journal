import React from 'react';
import { Music, BarChart3, Plus, LogIn, LogOut, CalendarClock } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  currentView: 'list' | 'stats' | 'upcoming';
  setView: (view: 'list' | 'stats' | 'upcoming') => void;
  onAddClick: () => void;
  user: User | null;
  onLoginClick: () => void;
  onLogoutClick: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentView, 
  setView, 
  onAddClick, 
  user, 
  onLoginClick, 
  onLogoutClick 
}) => {
  return (
    <nav className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 text-white rounded-2xl px-2 py-2 shadow-2xl flex items-center gap-1 sm:gap-2">
      
      <button
        onClick={() => setView('list')}
        className={`flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-xl transition-all ${
          currentView === 'list' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <Music size={20} className="mb-1" />
        <span className="text-[9px] sm:text-[10px] font-medium">Storico</span>
      </button>

      <button
        onClick={() => setView('upcoming')}
        className={`flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-xl transition-all ${
          currentView === 'upcoming' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <CalendarClock size={20} className="mb-1" />
        <span className="text-[9px] sm:text-[10px] font-medium">Futuri</span>
      </button>

      <button
        onClick={() => setView('stats')}
        className={`flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-xl transition-all ${
          currentView === 'stats' ? 'bg-slate-800 text-indigo-400' : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
        }`}
      >
        <BarChart3 size={20} className="mb-1" />
        <span className="text-[9px] sm:text-[10px] font-medium">Stats</span>
      </button>

      {/* Divider */}
      <div className="w-px h-8 bg-slate-700 mx-1"></div>

      {user ? (
        <>
          <button
            onClick={onAddClick}
            className="flex items-center justify-center w-12 sm:w-14 h-14 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-lg shadow-indigo-900/50 transition-transform active:scale-95"
            title="Aggiungi Concerto"
          >
            <Plus size={24} />
          </button>
          
          <button
            onClick={onLogoutClick}
            className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
            title="Esci"
          >
            <LogOut size={20} className="mb-1" />
            <span className="text-[9px] sm:text-[10px] font-medium">Esci</span>
          </button>
        </>
      ) : (
        <button
          onClick={onLoginClick}
          className="flex flex-col items-center justify-center w-14 sm:w-16 h-14 rounded-xl text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
        >
          <LogIn size={20} className="mb-1" />
          <span className="text-[9px] sm:text-[10px] font-medium">Accedi</span>
        </button>
      )}

    </nav>
  );
};