import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { useConcerts } from './hooks/useConcerts';
import { useAuth } from './hooks/useAuth';
import { Navbar } from './components/Navbar';
import { ConcertTable } from './components/ConcertTable';
import { Statistics } from './components/Statistics';
import { ConcertForm } from './components/ConcertForm';
import { AuthModal } from './components/AuthModal';
import { Concert } from './types';
import { Loader2, Ticket, Music, X, MapPin } from 'lucide-react';

function App() {
  const { concerts, loading, addConcert, updateConcert, deleteConcert } = useConcerts();
  const { user, signOut } = useAuth();
  
  const [view, setView] = useState<'list' | 'stats' | 'upcoming'>('list');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [editingConcert, setEditingConcert] = useState<Concert | undefined>(undefined);
  
  // State for Artist History Modal
  const [selectedArtistHistory, setSelectedArtistHistory] = useState<string | null>(null);

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

  // Lock scroll when artist modal is open
  useEffect(() => {
    if (selectedArtistHistory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtistHistory]);

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
      return { 
        visibleConcerts: concerts, 
        defaultSort: 'desc' as const 
      };
    }
    return { visibleConcerts: concerts, defaultSort: 'desc' as const };
  }, [concerts, view]);

  // Helper for Artist History
  const normalizeArtist = (name: string) => {
    const n = name.trim();
    const lower = n.toLowerCase();
    if (lower.replace(/\s/g, '') === 'bnkr44') return 'Bnkr44';
    if (lower === 'wel') return 'WEL';
    if (lower === 'wet') return 'WET';
    if (lower === 'poe') return 'POE';
    return n.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const selectedArtistConcerts = useMemo(() => {
    if (!selectedArtistHistory) return [];
    return concerts.filter(c => {
      const artists = c.band.split(',').map(s => normalizeArtist(s));
      return artists.includes(selectedArtistHistory);
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [concerts, selectedArtistHistory]);

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

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
                  onArtistClick={setSelectedArtistHistory}
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

      {/* Artist History Modal */}
      {selectedArtistHistory && createPortal(
        <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedArtistHistory(null)}>
          <div 
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Music size={20} className="text-indigo-400" />
                  {selectedArtistHistory}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hai visto questo artista <span className="text-white font-bold">{selectedArtistConcerts.length}</span> volte.
                </p>
              </div>
              <button onClick={() => setSelectedArtistHistory(null)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {selectedArtistConcerts.length === 0 ? (
                <div className="p-8 text-center text-slate-500 text-sm">
                  Nessun concerto trovato per questo artista.
                </div>
              ) : (
                selectedArtistConcerts.map((concert, i) => (
                  <div key={i} className="p-4 border-b border-slate-800/50 last:border-0 hover:bg-slate-800/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-indigo-300 bg-indigo-900/30 px-2 py-0.5 rounded border border-indigo-500/20">
                        {formatDate(concert.date)}
                      </span>
                      <span className={`text-sm font-bold ${concert.cost === 0 ? 'text-green-400' : 'text-slate-300'}`}>
                        {concert.cost === 0 ? 'FREE' : `€${concert.cost}`}
                      </span>
                    </div>
                    <div className="font-semibold text-white mb-1 line-clamp-1">{concert.event}</div>
                    <div className="flex items-center gap-1.5 text-xs text-slate-400">
                      <MapPin size={12} />
                      {concert.city}
                    </div>
                    <div className="mt-2 text-xs text-slate-500 italic line-clamp-1">
                      Lineup: {concert.band}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
}

export default App;