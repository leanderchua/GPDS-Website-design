import React, { useState } from 'react';
import { 
  User, 
  Lock, 
  Mail, 
  ArrowRight, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2,
  Eye,
  EyeOff
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useRouter, Link } from '../context/RouterContext';
import { assetUrl } from '../utils/assets';

export const AuthPages: React.FC<{ initialMode?: 'login' | 'register' }> = ({ initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('gamer@gpds.ph');
  const [password, setPassword] = useState('password123');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);

  const { login } = useAuth();
  const { navigate } = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, mode === 'register' ? name : undefined);
    navigate('/dashboard');
  };

  const handleDemoLogin = () => {
    login('gamer@gpds.ph', 'Leander "ProGamer"');
    navigate('/dashboard');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12 space-y-8">
      
      {/* Brand Header */}
      <div className="text-center space-y-3">
        <Link to="/" className="inline-block group" aria-label="GPDS GAME SHOP Home">
          <img 
            src={assetUrl("/gpds_logo.png")} 
            alt="GPDS GAME SHOP" 
            className="h-11 w-auto mx-auto object-contain transition-transform group-hover:scale-105 drop-shadow-[0_4px_16px_rgba(240,192,48,0.3)]" 
          />
        </Link>
        <h1 className="text-2xl sm:text-3xl font-display font-black text-white">
          {mode === 'login' ? 'Welcome Back, Gamer' : 'Create GPDS Account'}
        </h1>
        <p className="text-xs text-gray-400">
          Save your Game IDs, earn loyalty points, and track instant top-up dispatches.
        </p>
      </div>

      {/* Auth Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-brand-card border border-brand-cardBorder shadow-2xl space-y-6">
        
        {/* Mode Toggle Tabs */}
        <div className="grid grid-cols-2 p-1 rounded-xl bg-[#0E0A1C] border border-brand-cardBorder text-xs font-bold uppercase tracking-wider">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'login'
                ? 'bg-brand-gold text-brand-dark shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg transition-all ${
              mode === 'register'
                ? 'bg-brand-gold text-brand-dark shadow-sm'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Sign Up
          </button>
        </div>

        {/* 1-Click Demo Login Shortcut */}
        <button
          onClick={handleDemoLogin}
          className="w-full py-2.5 px-4 rounded-xl bg-brand-gold/15 hover:bg-brand-gold/25 border border-brand-gold/40 text-brand-gold font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
        >
          <Sparkles className="w-4 h-4" /> 1-Click Demo Account Login
        </button>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-brand-cardBorder w-full" />
          <span className="bg-brand-card px-3 text-[10px] text-gray-500 uppercase font-bold absolute">
            Or with email
          </span>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {mode === 'register' && (
            <div className="space-y-1">
              <label className="font-bold text-gray-300 block">Gamer Name / Nickname</label>
              <div className="relative">
                <User className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="e.g. ShadowHunter"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-3 text-white outline-none"
                />
              </div>
            </div>
          )}

          <div className="space-y-1">
            <label className="font-bold text-gray-300 block">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="e.g. gamer@gmail.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-3.5 py-3 text-white outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-300 block">Password</label>
              {mode === 'login' && (
                <button
                  type="button"
                  onClick={() => setIsForgotModalOpen(true)}
                  className="text-brand-gold hover:underline text-[11px]"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-gray-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full bg-[#0E0A1C] border border-brand-cardBorder focus:border-brand-gold rounded-xl pl-10 pr-10 py-3 text-white outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3.5 bg-gradient-to-r from-brand-gold via-brand-goldLight to-brand-gold text-brand-dark font-display font-black text-xs uppercase tracking-wider rounded-xl shadow-gold-glow hover:opacity-95 transition-all mt-2"
          >
            {mode === 'login' ? 'Sign In to Dashboard' : 'Create Free Account'}
          </button>
        </form>

        <div className="text-[11px] text-gray-400 text-center flex items-center justify-center gap-1.5 pt-2">
          <ShieldCheck className="w-4 h-4 text-green-400" />
          <span>Encrypted security. Your privacy is 100% guarded.</span>
        </div>

      </div>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="relative w-full max-w-sm bg-[#151125] border border-brand-gold/40 rounded-3xl p-6 space-y-4">
            <h3 className="font-display font-bold text-lg text-white">Reset Your Password</h3>
            <p className="text-xs text-gray-400">Enter your email and we will send you a 6-digit recovery code.</p>

            {forgotSent ? (
              <div className="p-4 bg-green-500/10 border border-green-500/30 rounded-xl text-green-400 text-xs">
                Password recovery email has been sent! Check your inbox.
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  defaultValue={email}
                  className="w-full bg-[#0E0A1C] border border-brand-cardBorder rounded-xl p-3 text-xs text-white outline-none"
                  placeholder="Enter email"
                />
                <button
                  onClick={() => setForgotSent(true)}
                  className="w-full py-2.5 bg-brand-gold text-brand-dark font-bold text-xs uppercase rounded-xl"
                >
                  Send Reset Link
                </button>
              </div>
            )}

            <button
              onClick={() => {
                setIsForgotModalOpen(false);
                setForgotSent(false);
              }}
              className="w-full text-center text-xs text-gray-400 hover:text-white"
            >
              Close
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
