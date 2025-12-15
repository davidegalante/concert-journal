import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { Concert } from '../types';
import { TrendingUp, DollarSign, Calendar, Music, Crown, X, MapPin, ArrowRight } from 'lucide-react';

interface StatisticsProps {
  concerts: Concert[];
}

export const Statistics: React.FC<StatisticsProps> = ({ concerts }) => {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  // Lock scroll when modal is open
  useEffect(() => {
    if (selectedArtist) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [selectedArtist]);

  // 1. Calculate Summary Stats
  const totalSpent = concerts.reduce((acc, c) => acc + c.cost, 0);
  const totalConcerts = concerts.length;
  
  // Normalization Helper
  const normalizeArtist = (name: string) => {
    const n = name.trim();
    const lower = n.toLowerCase();
    
    // Explicit overrides for acronyms
    if (lower.replace(/\s/g, '') === 'bnkr44') return 'Bnkr44';
    if (lower === 'wel') return 'WEL';
    if (lower === 'wet') return 'WET';
    if (lower === 'poe') return 'POE';
    
    // Standard Title Case for grouping consistency
    return n.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  // 3. Top Artists Logic (with normalization)
  const artistCounts: Record<string, number> = {};
  const uniqueArtists = new Set<string>();

  concerts.forEach(c => {
    const artists = c.band.split(',').map(s => s.trim());
    artists.forEach(artist => {
      const normalized = normalizeArtist(artist);
      if (normalized) {
        artistCounts[normalized] = (artistCounts[normalized] || 0) + 1;
        uniqueArtists.add(normalized);
      }
    });
  });

  const totalArtists = uniqueArtists.size;

  // 2. Prepare Chart Data (Spend per Year)
  const years = Array.from(new Set(concerts.map(c => Number(c.year)))).sort((a: number, b: number) => a - b);
  const dataByYear = years.map(year => {
    const yearlyConcerts = concerts.filter(c => c.year === year);
    return {
      year,
      spent: yearlyConcerts.reduce((acc, c) => acc + c.cost, 0),
      count: yearlyConcerts.length
    };
  });

  const topArtists = Object.entries(artistCounts)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5); // Top 5

  // Logic to get concerts for the selected artist
  const selectedArtistConcerts = selectedArtist 
    ? concerts.filter(c => {
        const artists = c.band.split(',').map(s => normalizeArtist(s));
        return artists.includes(selectedArtist);
      }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    : [];

  const formatDate = (dateStr: string) => {
    try {
      return new Date(dateStr).toLocaleDateString('it-IT', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-8 pb-28 relative">
      {/* Styles to remove outline from charts */}
      <style>{`
        .recharts-wrapper, .recharts-surface, .recharts-layer { outline: none !important; border: none !important; }
        *:focus { outline: none !important; }
      `}</style>
      
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 animate-card" style={{ animationDelay: '0s' }}>
        <div className="glass-panel p-4 md:p-5 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <DollarSign size={40} />
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-indigo-400 mb-1">Totale Speso</div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight">€{totalSpent.toFixed(0)}</div>
          <div className="text-[9px] md:text-[10px] text-slate-500 mt-1">Costo totale biglietti</div>
        </div>

        <div className="glass-panel p-4 md:p-5 rounded-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Calendar size={40} />
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-purple-400 mb-1">Eventi</div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{totalConcerts}</div>
          <div className="text-[9px] md:text-[10px] text-slate-500 mt-1">Totale concerti visti</div>
        </div>

        <div className="glass-panel p-4 md:p-5 rounded-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <Music size={40} />
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-pink-400 mb-1">Artisti</div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight">{totalArtists}</div>
          <div className="text-[9px] md:text-[10px] text-slate-500 mt-1">Band e cantanti unici</div>
        </div>

        <div className="glass-panel p-4 md:p-5 rounded-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <TrendingUp size={40} />
          </div>
          <div className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-emerald-400 mb-1">Media</div>
          <div className="text-2xl md:text-3xl font-black text-white tracking-tight">€{(totalSpent / totalConcerts || 0).toFixed(0)}</div>
          <div className="text-[9px] md:text-[10px] text-slate-500 mt-1">Per evento</div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Money per Year */}
        <div className="glass-panel rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-white">Spesa annuale</h3>
            <div className="text-xs text-slate-400 bg-slate-800 px-2 py-1 rounded">EUR (€)</div>
          </div>
          <div className="h-64 w-full min-w-0" style={{ outline: 'none' }}>
            <ResponsiveContainer width="100%" height="100%" minWidth={0} className="outline-none">
              <BarChart data={dataByYear}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} opacity={0.5} />
                <XAxis 
                  dataKey="year" 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}} 
                  axisLine={false} 
                  tickLine={false} 
                  dy={10} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  tick={{fontSize: 12}} 
                  tickFormatter={(val) => `€${val}`} 
                  axisLine={false} 
                  tickLine={false} 
                  dx={-10}
                />
                <Tooltip 
                  cursor={{ fill: '#334155', opacity: 0.2 }}
                  contentStyle={{ 
                    backgroundColor: '#0f172a', 
                    borderColor: '#334155', 
                    color: '#f8fafc',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                    outline: 'none'
                  }}
                  itemStyle={{ color: '#818cf8' }}
                  formatter={(value: number) => [`€${value.toFixed(2)}`, 'Spesa']}
                />
                <Bar dataKey="spent" radius={[6, 6, 0, 0]} animationDuration={1500} isAnimationActive={true}>
                  {dataByYear.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill="url(#colorGradient)" stroke="none" />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={1}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.6}/>
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Artists List */}
        <div className="glass-panel rounded-3xl p-6 animate-card" style={{ animationDelay: '0.2s' }}>
          <div className="flex items-center justify-between mb-6">
             <h3 className="text-lg font-bold text-white">Top 5 Artisti</h3>
             <Crown size={18} className="text-yellow-500" />
          </div>
          
          <div className="space-y-4">
            {topArtists.map(([artist, count], idx) => (
              <div 
                key={idx} 
                onClick={() => setSelectedArtist(artist)}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-800/40 border border-slate-700/30 hover:bg-slate-700/60 hover:border-indigo-500/30 cursor-pointer transition-all group"
              >
                <div className="flex items-center gap-4">
                  <div className={`
                    flex items-center justify-center w-10 h-10 rounded-xl font-bold text-sm shadow-inner
                    ${idx === 0 ? 'bg-gradient-to-br from-yellow-400 to-orange-500 text-slate-900' : 
                      idx === 1 ? 'bg-gradient-to-br from-slate-300 to-slate-400 text-slate-900' :
                      idx === 2 ? 'bg-gradient-to-br from-orange-300 to-orange-400 text-slate-900' :
                      'bg-slate-700 text-slate-300'}
                  `}>
                    {idx + 1}
                  </div>
                  <div>
                    <div className="font-semibold text-white group-hover:text-indigo-300 transition-colors flex items-center gap-2">
                      {artist}
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                    </div>
                    <div className="w-full bg-slate-700 h-1.5 rounded-full mt-1.5 w-24 overflow-hidden">
                       <div 
                        className="h-full bg-indigo-500 rounded-full" 
                        style={{ width: `${(count / topArtists[0][1]) * 100}%` }}
                       ></div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-white">{count}</div>
                  <div className="text-[10px] text-slate-500 uppercase">Presenze</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Artist Detail Modal - Uses Portal to ensure full screen coverage */}
      {selectedArtist && createPortal(
        <div className="fixed inset-0 z-[9999] h-[100dvh] w-screen flex items-center justify-center p-4 bg-black/90 backdrop-blur-xl animate-in fade-in duration-300" onClick={() => setSelectedArtist(null)}>
          <div 
            className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 relative"
            onClick={(e) => e.stopPropagation()} 
          >
            <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
              <div>
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <Music size={20} className="text-indigo-400" />
                  {selectedArtist}
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Hai visto questo artista <span className="text-white font-bold">{selectedArtistConcerts.length}</span> volte.
                </p>
              </div>
              <button onClick={() => setSelectedArtist(null)} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
                <X size={20} />
              </button>
            </div>

            <div className="p-0 max-h-[60vh] overflow-y-auto custom-scrollbar">
              {selectedArtistConcerts.map((concert, i) => (
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
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

    </div>
  );
};