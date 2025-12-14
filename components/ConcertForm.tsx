import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, MapPin, Ticket, Music2, PartyPopper, Camera, Loader2, Sparkles, FileText, ImageIcon, Mail, FileType, Type, MapPinned } from 'lucide-react';
import { GoogleGenAI, Type as GenAiType } from "@google/genai";
import { Concert } from '../types';

interface ConcertFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Concert, 'id'>) => void;
  initialData?: Concert;
}

const SPECIAL_UPPERCASE = ['WEL', 'WET', 'POE', 'PPMP', 'DJ', 'PR'];

export const ConcertForm: React.FC<ConcertFormProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    band: '',
    date: '',
    city: '',
    event: '',
    cost: 0,
  });
  
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [analysisMode, setAnalysisMode] = useState<'image' | 'text'>('image');
  const [emailText, setEmailText] = useState('');
  const [autoFormat, setAutoFormat] = useState(true); // Default to auto-format
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialData) {
      setFormData({
        band: initialData.band,
        date: initialData.date,
        city: initialData.city,
        event: initialData.event,
        cost: initialData.cost,
      });
    } else {
      setFormData({
        band: '',
        date: new Date().toISOString().split('T')[0],
        city: '',
        event: 'Concerto',
        cost: 0,
      });
      setEmailText('');
      setAutoFormat(true);
    }
  }, [initialData, isOpen]);

  // Helper to format a single string (Title Case with exceptions)
  const formatString = (str: string): string => {
    if (!str) return '';
    return str.split(' ').map(word => {
      // Remove punctuation for the check (e.g., "WEL," -> "WEL")
      const cleanWord = word.replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
      
      // If it's a special word, return it fully uppercase (preserving original punctuation if needed is tricky, 
      // but simple replacement works for most cases. Let's rebuild the word carefully).
      if (SPECIAL_UPPERCASE.includes(cleanWord)) {
        return word.toUpperCase();
      }
      
      // Standard Title Case: First letter upper, rest lower
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    }).join(' ');
  };

  // Helper specifically for comma-separated lists (like bands)
  const formatList = (str: string): string => {
    return str.split(',').map(part => formatString(part.trim())).join(', ');
  };

  const updateFormFromData = (data: any) => {
    setFormData(prev => ({
      ...prev,
      band: data.band || prev.band,
      date: data.date || prev.date,
      city: data.city || prev.city,
      event: data.event || prev.event,
      cost: typeof data.cost === 'number' ? data.cost : prev.cost
    }));
  };

  const openGmailSearch = () => {
    const query = encodeURIComponent("subject:(biglietti OR ticket OR ordine OR conferma OR order OR confirmation)");
    window.open(`https://mail.google.com/mail/u/0/#search/${query}`, '_blank');
  };

  const handleEnrichLocation = async () => {
    if (!formData.band || !formData.city) return;
    setIsLocating(true);
    
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [{
            text: `Identify the specific concert venue.
            Artist: ${formData.band}
            Date: ${formData.date}
            City: ${formData.city}
            Current Event Name: ${formData.event}

            Task: Return the specific venue name combined with the city.
            Format: "City, Venue Name" (e.g. "Milano, Fabrique" or "Parma, Parco Ducale").
            
            Rules:
            1. If the input City already contains the venue (e.g. "Milano, Fabrique"), return it as is.
            2. If you cannot find a specific venue for this date/artist in this city, return just the City.
            3. Prioritize famous venues (stadiums, clubs, parks).`
          }]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
            type: GenAiType.OBJECT,
            properties: {
              venue: { type: GenAiType.STRING }
            }
          }
        }
      });
      
      const result = JSON.parse(response.text || '{}');
      if (result.venue) {
        setFormData(prev => ({ ...prev, city: result.venue }));
      }
    } catch (e) {
      console.error("Error enriching location", e);
    } finally {
      setIsLocating(false);
    }
  };

  const handleTextAnalysis = async () => {
    if (!emailText.trim()) return;
    setIsAnalyzing(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              text: `Analyze the following text which is likely an email confirmation for a concert ticket or an event description. 
              Extract the details in JSON format using the schema provided.
              
              TEXT TO ANALYZE:
              "${emailText}"
              
              Instructions:
              - 'band': Main artist(s).
              - 'date': YYYY-MM-DD.
              - 'city': City name (Try to include venue if available, e.g. "Milano, Fabrique").
              - 'event': Event name.
              - 'cost': Total cost found in the text (number only).`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: GenAiType.OBJECT,
             properties: {
               band: { type: GenAiType.STRING },
               date: { type: GenAiType.STRING },
               city: { type: GenAiType.STRING },
               event: { type: GenAiType.STRING },
               cost: { type: GenAiType.NUMBER }
             }
          }
        }
      });

      const text = response.text;
      if (text) {
        updateFormFromData(JSON.parse(text));
      }
    } catch (error) {
      console.error("Error analyzing text:", error);
      alert("Errore durante l'analisi del testo. Riprova.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      alert("Per favore carica un'immagine o un file PDF.");
      return;
    }

    setIsAnalyzing(true);

    try {
      const base64Data = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
          const result = reader.result as string;
          const base64Content = result.split(',')[1];
          resolve(base64Content);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
          parts: [
            {
              inlineData: {
                mimeType: file.type,
                data: base64Data
              }
            },
            {
              text: `Analyze this file (image or PDF document) of a concert ticket, receipt, or poster.
              CONTEXT FROM FILENAME: "${file.name}"
              Extract: band, date, city (include venue if visible), event, cost (number). JSON format.`
            }
          ]
        },
        config: {
          responseMimeType: 'application/json',
          responseSchema: {
             type: GenAiType.OBJECT,
             properties: {
               band: { type: GenAiType.STRING },
               date: { type: GenAiType.STRING },
               city: { type: GenAiType.STRING },
               event: { type: GenAiType.STRING },
               cost: { type: GenAiType.NUMBER }
             }
          }
        }
      });

      const text = response.text;
      if (text) {
        updateFormFromData(JSON.parse(text));
      }

    } catch (error) {
      console.error("Error analyzing file:", error);
      alert("Impossibile analizzare il file.");
    } finally {
      setIsAnalyzing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const dateObj = new Date(formData.date);
    const year = dateObj.getFullYear();
    
    // Auto-formatting logic
    let finalBand = formData.band;
    let finalCity = formData.city;
    let finalEvent = formData.event;

    if (autoFormat) {
      finalBand = formatList(formData.band);
      finalCity = formatString(formData.city);
      finalEvent = formatString(formData.event);
    }

    // Auto-calculate artists count based on commas
    const artistCount = finalBand
      .split(',')
      .map(s => s.trim())
      .filter(s => s.length > 0)
      .length;

    const finalArtists = artistCount > 0 ? artistCount : 1;
    
    // Normalize Event Name for PPMP (Specific logic override)
    const lowerEvent = finalEvent.toLowerCase().trim();
    if (lowerEvent === 'ppmp' || lowerEvent === 'pop punk mosh party') {
       finalEvent = 'PPMP - Pop Punk Mosh Party';
    }

    onSubmit({
      ...formData,
      band: finalBand,
      city: finalCity,
      event: finalEvent,
      artists: finalArtists,
      year,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    // Mobile: Aligns to bottom (items-end), Desktop: Centered (md:items-center)
    <div className="fixed inset-0 z-[60] flex items-end md:items-center justify-center sm:p-4 bg-black/80 backdrop-blur-md transition-all duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full h-[90vh] md:h-auto md:max-w-lg rounded-t-3xl md:rounded-2xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300 md:zoom-in-95 md:slide-in-from-bottom-0 flex flex-col">
        
        {/* Header */}
        <div className="p-5 md:p-6 border-b border-slate-800 flex justify-between items-center bg-slate-800/50 sticky top-0 backdrop-blur-sm z-10 shrink-0">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-white">
              {initialData ? 'Modifica Evento' : 'Nuovo Evento'}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Inserisci i dettagli del concerto.
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 md:p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
          
          {/* AI Import Section */}
          {!initialData && (
             <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 space-y-4">
               <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-indigo-300 flex items-center gap-2">
                    <Sparkles size={14} /> Importazione Automatica
                  </h3>
                  
                  <div className="flex bg-slate-900 rounded-lg p-1 border border-slate-700">
                    <button 
                      type="button"
                      onClick={() => setAnalysisMode('image')}
                      className={`p-1.5 rounded-md transition-all ${analysisMode === 'image' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <FileType size={16} />
                    </button>
                    <button 
                      type="button"
                      onClick={() => setAnalysisMode('text')}
                      className={`p-1.5 rounded-md transition-all ${analysisMode === 'text' ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                    >
                      <FileText size={16} />
                    </button>
                  </div>
               </div>

               {analysisMode === 'image' ? (
                 <div className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in duration-300">
                   <p className="text-[10px] text-slate-400 w-full sm:w-auto">
                     Carica biglietto o locandina.
                   </p>
                   <input 
                     type="file" 
                     ref={fileInputRef} 
                     onChange={handleFileChange} 
                     accept="image/*,application/pdf" 
                     className="hidden" 
                   />
                   <button
                     type="button"
                     onClick={() => fileInputRef.current?.click()}
                     disabled={isAnalyzing}
                     className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm whitespace-nowrap"
                   >
                     {isAnalyzing ? (
                       <><Loader2 size={16} className="animate-spin" /> Analisi...</>
                     ) : (
                       <><FileType size={16} /> Carica File</>
                     )}
                   </button>
                 </div>
               ) : (
                 <div className="space-y-3 animate-in fade-in duration-300">
                   <div className="flex justify-between items-center">
                     <p className="text-[10px] text-slate-400">
                       Incolla qui il testo.
                     </p>
                     <button 
                        type="button"
                        onClick={openGmailSearch}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 flex items-center gap-1 font-semibold transition-colors"
                     >
                        <Mail size={12} /> Cerca Gmail
                     </button>
                   </div>
                   <textarea
                     value={emailText}
                     onChange={(e) => setEmailText(e.target.value)}
                     placeholder="Incolla il testo qui..."
                     className="w-full h-20 bg-slate-900/80 border border-slate-700 rounded-lg p-3 text-xs text-white placeholder:text-slate-600 focus:ring-1 focus:ring-indigo-500 outline-none resize-none"
                   />
                   <button
                     type="button"
                     onClick={handleTextAnalysis}
                     disabled={isAnalyzing || !emailText.trim()}
                     className="w-full flex items-center justify-center gap-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 text-white text-xs font-bold py-2.5 px-4 rounded-lg transition-colors shadow-sm"
                   >
                     {isAnalyzing ? (
                       <><Loader2 size={16} className="animate-spin" /> Elaborazione...</>
                     ) : (
                       <><Sparkles size={16} /> Estrai Dati</>
                     )}
                   </button>
                 </div>
               )}
             </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
            
            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-indigo-400 flex items-center gap-2">
                <Music2 size={16} /> Artisti (Separati da virgola)
              </label>
              <input
                required
                type="text"
                value={formData.band}
                onChange={(e) => setFormData({ ...formData, band: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3.5 md:p-4 text-base md:text-lg text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all placeholder:text-slate-600"
                placeholder="Es. Simple Plan, Sum 41"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-400 flex items-center gap-2">
                  <Calendar size={16} /> Data
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
               <div className="space-y-2">
                <label className="text-xs uppercase font-bold text-slate-400 flex items-center gap-2">
                  <Ticket size={16} /> Costo (€)
                </label>
                <input
                  required
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.cost}
                  onChange={(e) => setFormData({ ...formData, cost: parseFloat(e.target.value) })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-slate-400 flex items-center gap-2">
                <MapPin size={16} /> Città / Luogo
              </label>
              <div className="relative">
                <input
                  required
                  type="text"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none pr-12"
                  placeholder="Es. Milano, Fabrique"
                />
                <button
                  type="button"
                  onClick={handleEnrichLocation}
                  disabled={isLocating || !formData.band}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-indigo-400 hover:text-indigo-300 bg-slate-800/80 hover:bg-slate-700 rounded-lg transition-colors border border-slate-700 disabled:opacity-50"
                  title="Trova Venue Automaticamente (AI)"
                >
                  {isLocating ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <MapPinned size={16} />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs uppercase font-bold text-slate-400 flex items-center gap-2">
                <PartyPopper size={16} /> Nome Evento / Tour
              </label>
              <input
                type="text"
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value })}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="Es. SlamDunk Festival"
              />
            </div>

            {/* Formatting Toggle */}
            <div className="flex items-center justify-between bg-slate-800/50 p-3 rounded-xl border border-slate-700/30">
               <div className="flex items-center gap-2">
                 <Type size={16} className="text-indigo-400" />
                 <span className="text-sm text-slate-300">Formattazione Automatica</span>
               </div>
               <button
                 type="button"
                 onClick={() => setAutoFormat(!autoFormat)}
                 className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none ${autoFormat ? 'bg-indigo-600' : 'bg-slate-700'}`}
               >
                 <span
                   className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoFormat ? 'translate-x-6' : 'translate-x-1'}`}
                 />
               </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold py-3.5 md:py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all transform active:scale-[0.98] mt-2 text-lg pb-safe"
            >
              {initialData ? 'Salva Modifiche' : 'Aggiungi al Tracker'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};