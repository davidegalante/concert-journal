import React, { useState, useMemo } from 'react';
import { useConcerts } from './hooks/useConcerts';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { ConcertTable } from './components/ConcertTable';
import { Statistics } from './components/Statistics';
import { ConcertForm } from './components/ConcertForm';
import { AuthModal } from './components/AuthModal';
import { Concert } from './types';
import { Loader2, Ticket } from 'lucide-react';

function App() {
  const { concerts, loading, addConcert, updateConcert, deleteConcert } = useConcerts();
  const { user, signOut } = useAuth();
  
  const [view, setView] = useState<'list' | 'stats' | 'upcoming'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | undefined>(undefined);

  const handleAddClick = () => {
    setEditingConcert(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (concert: Concert) => {
    setEditingConcert(concert);
    setIsFormOpen(true);
  };

  const handleFormSubmit = (data: Omit<Concert, 'id'>) => {
    if (editingConcert) {
      updateConcert(editingConcert.id, data);
    } else {
      addConcert(data);
    }
  };

  const handleSetView = (newView: 'list' | 'stats' | 'upcoming') => {
    setView(newView);
    // Force scroll to top when changing views to prevent being stuck in the middle of the page
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Filter Logic for Views
  const { visibleConcerts, defaultSort } = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize today to start of day

    if (view === 'upcoming') {
      const future = concerts.filter(c => new Date(c.date) >= today);
      return { 
        visibleConcerts: future, 
        defaultSort: 'asc' as const // Sort future events nearest first
      };
    } else if (view === 'list') {
      // List view usually implies history, but usually users want to see everything or just past.
      // Based on prompt "tracker concerti fatti e che farò", list shows ALL but we let the Table handle the visual distinction.
      // Alternatively, we could filter just past. Let's show ALL in main list for completeness, 
      // but prioritize DESC sort (most recent added/happened).
      return { 
        visibleConcerts: concerts, 
        defaultSort: 'desc' as const 
      };
    }
    return { visibleConcerts: concerts, defaultSort: 'desc' as const };
  }, [concerts, view]);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 selection:bg-indigo-500 selection:text-white pb-32 md:pb-24">
      {/* Changed max-w-3xl to max-w-7xl for full width experience */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 md:pt-12">
        
        {/* Header - Centered as requested */}
        <header className="mb-8 md:mb-12 flex flex-col items-center text-center gap-4">
          <div className="animate-in zoom-in duration-700 delay-100 relative group">
             <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 group-hover:opacity-30 transition-opacity rounded-full"></div>
             <div className="relative p-4 bg-slate-800/50 rounded-2xl border border-slate-700/50 shadow-2xl backdrop-blur-sm transform group-hover:scale-105 transition-transform duration-300">
               <Ticket size={48} className="text-indigo-400 drop-shadow-[0_0_15px_rgba(129,140,248,0.5)]" />
             </div>
          </div>
          <div>
            <h1 className="text-4xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 animate-in fade-in slide-in-from-top-4 duration-700">
              {view === 'upcoming' ? 'Prossimi Eventi' : view === 'stats' ? 'Statistiche' : 'My Concert Journal'}
            </h1>
            <p className="text-slate-400 text-sm md:text-lg mt-3 max-w-2xl mx-auto leading-relaxed">
              {view === 'upcoming' 
                ? 'Il calendario dei tuoi futuri appuntamenti musicali.' 
                : 'Il tuo diario musicale digitale.'} 
              {loading ? (
                 <span className="inline-flex items-center gap-2 ml-2 text-indigo-400 animate-pulse">
                   <Loader2 size={14} className="animate-spin" /> Sync...
                 </span>
              ) : (
                 view !== 'upcoming' && view !== 'stats' && <> Hai partecipato a <strong className="text-white">{concerts.length}</strong> eventi finora.</>
              )}
            </p>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="w-full">
          {loading && concerts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 size={48} className="text-indigo-500 animate-spin" />
              <p className="text-slate-400 text-sm">Caricamento concerti dal cloud...</p>
            </div>
          ) : (
            <>
              {view === 'stats' ? (
                <Statistics concerts={concerts} />
              ) : (
                <ConcertTable 
                  concerts={visibleConcerts} 
                  onEdit={handleEditClick} 
                  onDelete={deleteConcert}
                  user={user}
                  defaultSortOrder={defaultSort}
                  emptyMessage={view === 'upcoming' ? "Nessun concerto in programma. Aggiungine uno!" : "Nessun concerto trovato."}
                />
              )}
            </>
          )}
        </main>
      </div>

      {/* Floating UI Elements */}
      {user && (
        <ConcertForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleFormSubmit}
          initialData={editingConcert}
        />
      )}

      <AuthModal 
        isOpen={isAuthOpen} 
        onClose={() => setIsAuthOpen(false)} 
      />

      <Navbar 
        currentView={view} 
        setView={handleSetView} 
        onAddClick={handleAddClick}
        user={user}
        onLoginClick={() => setIsAuthOpen(true)}
        onLogoutClick={() => {
           if(window.confirm("Vuoi davvero uscire?")) signOut();
        }}
      />
    </div>
  );
}

export default App;