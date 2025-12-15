import React, { useState, useMemo } from 'react';
import { Concert, PriceRange } from '../types';
import { Search, MapPin, Calendar, Edit2, Trash2, Tag, Filter, X, ChevronDown, Mic2, Users } from 'lucide-react';
import { User } from '@supabase/supabase-js';

interface ConcertTableProps {
  concerts: Concert[];
  onEdit: (concert: Concert) => void;
  onDelete: (id: string) => void;
  user: User | null;
}

export const ConcertTable: React.FC<ConcertTableProps> = ({ concerts, onEdit, onDelete, user }) => {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<'date' | 'cost'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  
  // Advanced Filters State
  const [showFilters, setShowFilters] = useState(false);
  const [selectedYear, setSelectedYear] = useState<string>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [selectedPrice, setSelectedPrice] = useState<PriceRange>('all');
  const [selectedArtist, setSelectedArtist] = useState<string>('all');

  // Normalization helpers
  const normalizeArtist = (name: string) => {
    const n = name.trim();
    const lower = n.toLowerCase();
    if (lower.replace(/\s/g, '') === 'bnkr44') return 'Bnkr44';
    if (lower === 'wel') return 'WEL';
    if (lower === 'wet') return 'WET';
    if (lower === 'poe') return 'POE';
    
    // Standard Title Case for filter grouping
    return n.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const normalizeEvent = (event: string) => {
    const e = event.trim();
    const lower = e.toLowerCase();
    // Inclusive check for PPMP to handle simple "PPMP" or full "PPMP - Pop Punk Mosh Party"
    if (lower.includes('ppmp') || lower.includes('pop punk mosh party')) return 'PPMP - Pop Punk Mosh Party';
    if (lower === 'blaster') return 'Blaster';
    return e;
  };

  // Derive unique options for filters
  const availableYears = useMemo(() => {
    const years = Array.from(new Set(concerts.map(c => Number(c.year)))).sort((a: number, b: number) => b - a);
    return years;
  }, [concerts]);

  const availableTypes = useMemo(() => {
    const types = new Set<string>();
    concerts.forEach(c => {
       types.add(normalizeEvent(c.event));
    });
    return Array.from(types).sort();
  }, [concerts]);

  // Derive unique artists (splitting by comma)
  const availableArtists = useMemo(() => {
    const allArtists = new Set<string>();
    concerts.forEach(c => {
      c.band.split(',').forEach(artist => {
        allArtists.add(normalizeArtist(artist));
      });
    });
    return Array.from(allArtists).sort((a, b) => a.localeCompare(b));
  }, [concerts]);

  const filteredAndSortedConcerts = useMemo(() => {
    let result = [...concerts];

    // 1. Search Text
    if (search) {
      const lowerSearch = search.toLowerCase();
      result = result.filter(
        c => 
          c.band.toLowerCase().includes(lowerSearch) || 
          c.city.toLowerCase().includes(lowerSearch) ||
          c.event.toLowerCase().includes(lowerSearch)
      );
    }

    // 2. Year Filter
    if (selectedYear !== 'all') {
      result = result.filter(c => c.year === parseInt(selectedYear));
    }

    // 3. Type Filter
    if (selectedType !== 'all') {
      result = result.filter(c => normalizeEvent(c.event) === selectedType);
    }

    // 4. Price Filter
    if (selectedPrice !== 'all') {
      switch (selectedPrice) {
        case 'free': result = result.filter(c => c.cost === 0); break;
        case 'under-30': result = result.filter(c => c.cost > 0 && c.cost < 30); break;
        case '30-60': result = result.filter(c => c.cost >= 30 && c.cost <= 60); break;
        case 'over-60': result = result.filter(c => c.cost > 60); break;
      }
    }

    // 5. Artist Filter
    if (selectedArtist !== 'all') {
      result = result.filter(c => {
        // Check if ANY of the artists in the band string match the selected artist (normalized)
        const artists = c.band.split(',').map(s => normalizeArtist(s));
        return artists.includes(selectedArtist);
      });
    }

    // 6. Sorting
    result.sort((a, b) => {
      let valA, valB;
      
      if (sortField === 'date') {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      } else {
        valA = a.cost;
        valB = b.cost;
      }

      return sortOrder === 'asc' ? valA - valB : valB - valA;
    });

    return result;
  }, [concerts, search, sortField, sortOrder, selectedYear, selectedType, selectedPrice, selectedArtist]);

  const toggleSort = (field: 'date' | 'cost') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); 
    }
  };

  const getDayAndMonth = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      const day = d.getDate();
      const month = d.toLocaleDateString('it-IT', { month: 'short' }).toUpperCase();
      const year = d.getFullYear();
      return { day, month, year };
    } catch {
      return { day: '?', month: '???', year: '????' };
    }
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedYear('all');
    setSelectedType('all');
    setSelectedPrice('all');
    setSelectedArtist('all');
  };

  const activeFiltersCount = 
    (selectedYear !== 'all' ? 1 : 0) + 
    (selectedType !== 'all' ? 1 : 0) + 
    (selectedPrice !== 'all' ? 1 : 0) + 
    (selectedArtist !== 'all' ? 1 : 0);

  return (
    <div className="space-y-6">
      
      {/* Search and Sort Bar */}
      <div className="sticky top-0 z-30 pt-4 -mx-2 px-2 pb-4 bg-gradient-to-b from-slate-900 via-slate-900/95 to-transparent">
        <div className="flex flex-col gap-3 max-w-4xl mx-auto lg:max-w-none">
          
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <div className="relative flex-1 group">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl blur opacity-25 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-slate-900 rounded-xl flex items-center border border-slate-700 focus-within:border-indigo-500 transition-colors">
                <Search className="ml-4 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Cerca band, città..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-white py-3 px-3 outline-none placeholder-slate-500"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="mr-3 text-slate-500 hover:text-white">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Filter Toggle */}
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`relative px-4 py-3 sm:py-0 rounded-xl border transition-all flex items-center justify-center gap-2 ${
                showFilters || activeFiltersCount > 0
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/20' 
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Filter size={20} />
              <span className="inline">Filtri</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border border-slate-900">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          
          {/* Data Count */}
          <div className="flex justify-end px-1">
             <div className="text-[10px] text-slate-500 italic">
               {filteredAndSortedConcerts.length} eventi visualizzati
             </div>
          </div>

          {/* Expanded Filter Dashboard */}
          <div className={`overflow-hidden transition-all duration-300 ease-in-out ${showFilters ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className="glass-panel p-4 rounded-xl space-y-4 mt-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Artist Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Artista / Band</label>
                  <div className="relative">
                    <select 
                      value={selectedArtist}
                      onChange={(e) => setSelectedArtist(e.target.value)}
                      className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="all">Tutti gli artisti</option>
                      {availableArtists.map(artist => (
                        <option key={artist} value={artist}>{artist}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                {/* Type Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Evento</label>
                  <div className="relative">
                    <select 
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm capitalize"
                    >
                      <option value="all">Tutti i tipi</option>
                      {availableTypes.map(t => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                {/* Price Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Costo</label>
                  <div className="relative">
                    <select 
                      value={selectedPrice}
                      onChange={(e) => setSelectedPrice(e.target.value as PriceRange)}
                      className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="all">Tutti i prezzi</option>
                      <option value="free">Gratis</option>
                      <option value="under-30">&lt; €30</option>
                      <option value="30-60">€30 - €60</option>
                      <option value="over-60">&gt; €60</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

                {/* Year Filter */}
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Anno</label>
                  <div className="relative">
                    <select 
                      value={selectedYear}
                      onChange={(e) => setSelectedYear(e.target.value)}
                      className="w-full appearance-none bg-slate-900 border border-slate-700 text-white rounded-lg py-2 px-3 focus:ring-2 focus:ring-indigo-500 outline-none text-sm"
                    >
                      <option value="all">Tutti gli anni</option>
                      {availableYears.map(y => (
                        <option key={y} value={y}>{y}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" size={14} />
                  </div>
                </div>

              </div>

              {/* Quick Sort Actions within filter area */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-t border-slate-700/50 pt-3 gap-3">
                <div className="flex gap-2 w-full sm:w-auto">
                   <button 
                    onClick={() => toggleSort('date')}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sortField === 'date' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Calendar size={12} /> Data {sortField === 'date' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                  <button 
                    onClick={() => toggleSort('cost')}
                    className={`flex-1 sm:flex-none flex justify-center items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      sortField === 'cost' ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/30' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    <Tag size={12} /> Costo {sortField === 'cost' && (sortOrder === 'asc' ? '↑' : '↓')}
                  </button>
                </div>
                <button onClick={clearFilters} className="text-xs text-slate-500 hover:text-white underline decoration-slate-600 underline-offset-2 w-full sm:w-auto text-center">
                  Reset Filtri
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout to fill screen edges */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredAndSortedConcerts.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-slate-500 animate-in fade-in zoom-in duration-500">
            <div className="w-20 h-20 bg-slate-800/50 rounded-full flex items-center justify-center mb-4">
              <Mic2 size={40} className="text-slate-600" />
            </div>
            <p className="text-lg font-medium">Nessun concerto trovato.</p>
            <p className="text-sm">Prova a cambiare i filtri.</p>
            <button onClick={clearFilters} className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-500 transition-colors">
              Mostra tutti
            </button>
          </div>
        ) : (
          filteredAndSortedConcerts.map((concert, index) => {
            const { day, month, year } = getDayAndMonth(concert.date);
            // Calculate delay for staggered animation based on index (max 10 items)
            const animationDelay = index < 15 ? `${index * 0.05}s` : '0s';

            return (
              <div 
                key={concert.id}
                className="animate-card group relative bg-slate-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 border border-slate-700/50 hover:border-indigo-500/30 flex flex-col h-full"
                style={{ animationDelay }}
              >
                {/* Background Decoration */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/5 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none"></div>

                {/* Card Header with Date and Price */}
                <div className="flex bg-slate-900/50 border-b border-slate-700/50">
                   {/* Date Stub */}
                   <div className="p-4 flex flex-col items-center justify-center border-r border-slate-700/50 min-w-[80px]">
                      <span className="text-xl font-black text-white">{day}</span>
                      <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">{month}</span>
                      <span className="text-[10px] text-slate-500 mt-1">{year}</span>
                   </div>
                   
                   {/* Top Info */}
                   <div className="flex-1 p-3 flex justify-between items-center gap-4 overflow-hidden">
                      <div className="px-2 py-1 rounded-md bg-slate-700/50 border border-slate-600/50 text-[10px] font-bold uppercase text-slate-300 tracking-wider truncate" title={concert.event}>
                          {concert.event}
                      </div>
                      <div className="text-right shrink-0">
                         <div className={`font-bold text-lg leading-tight ${concert.cost === 0 ? 'text-green-400' : 'text-white'}`}>
                            {concert.cost === 0 ? 'FREE' : `€${concert.cost.toFixed(2)}`}
                          </div>
                      </div>
                   </div>
                </div>

                {/* Main Content */}
                <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold text-white leading-tight group-hover:text-indigo-300 transition-colors line-clamp-2" title={concert.band}>
                      {concert.band}
                    </h3>
                    <div className="flex items-start gap-2 mt-3 text-sm text-slate-400">
                      <MapPin size={16} className="text-slate-500 mt-0.5 shrink-0" />
                      <span className="line-clamp-1">{concert.city}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-4 border-t border-slate-700/30">
                     <span className="text-xs text-slate-500 flex items-center gap-1">
                       <Users size={12} />
                       {concert.artists > 1 ? `${concert.artists} artisti` : '1 artista'}
                     </span>
                     
                     {user && (
                       <div className="flex gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-200">
                          <button 
                            onClick={(e) => { e.stopPropagation(); onEdit(concert); }}
                            className="p-2 hover:bg-indigo-600/20 text-slate-400 hover:text-indigo-400 rounded-lg transition-colors"
                          >
                            <Edit2 size={16} />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              if (window.confirm('Sei sicuro di voler eliminare questo concerto?')) {
                                onDelete(concert.id);
                              }
                            }}
                            className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                          >
                            <Trash2 size={16} />
                          </button>
                       </div>
                     )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};