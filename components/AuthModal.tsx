import React, { useState } from 'react';
import { X, Mail, Lock, Loader2, LogIn, KeyRound, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signIn, resetPassword } = useAuth();
  const [mode, setMode] = useState<'login' | 'reset'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      if (mode === 'login') {
        await signIn(email, password, rememberMe);
        onClose(); // Close modal on success
      } else {
        await resetPassword(email);
        setMessage({ type: 'success', text: 'Ti abbiamo inviato una mail per resettare la password.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Si è verificato un errore.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        
        <div className="p-5 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {mode === 'login' ? <LogIn size={20} className="text-indigo-400" /> : <KeyRound size={20} className="text-indigo-400" />}
            {mode === 'login' ? 'Accedi' : 'Recupera Password'}
          </h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {message && (
            <div className={`p-3 rounded-lg text-xs border ${message.type === 'error' ? 'bg-red-500/10 border-red-500/50 text-red-200' : 'bg-green-500/10 border-green-500/50 text-green-200'}`}>
              {message.text}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs uppercase font-bold text-slate-400">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                placeholder="nome@esempio.com"
              />
            </div>
          </div>

          {mode === 'login' && (
            <div className="space-y-2 animate-in fade-in slide-in-from-top-2">
              <label className="text-xs uppercase font-bold text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16} />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl py-3 pl-10 pr-3 text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                  placeholder="••••••••"
                />
              </div>

              {/* Remember Me Checkbox */}
              <div 
                className="flex items-center gap-2 pt-2 cursor-pointer group w-max"
                onClick={() => setRememberMe(!rememberMe)}
              >
                 <div className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${rememberMe ? 'bg-indigo-600 border-indigo-600' : 'bg-transparent border-slate-600 group-hover:border-indigo-500'}`}>
                    {rememberMe && <Check size={14} className="text-white stroke-[3]" />}
                 </div>
                 <span className="text-sm text-slate-300 group-hover:text-indigo-300 transition-colors select-none">
                   Ricordami
                 </span>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-3 rounded-xl shadow-lg transition-transform active:scale-[0.98] mt-2 flex justify-center items-center gap-2"
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {mode === 'login' ? 'Entra' : 'Invia Email di Reset'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => {
                setMode(mode === 'login' ? 'reset' : 'login');
                setMessage(null);
              }}
              className="text-xs text-slate-400 hover:text-white underline decoration-slate-600 underline-offset-2 transition-colors"
            >
              {mode === 'login' ? 'Password dimenticata?' : 'Torna al login'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};