import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { adminLogin } from '../lib/databaseService';
import { ShieldCheck, Lock, Mail, ArrowRight, ArrowLeft } from 'lucide-react';

export const AdminLoginPage: React.FC = () => {
  const { setAdminUser, setView, notify } = useStore();
  const [email, setEmail] = useState('admin@tariqsweets.pk');
  const [password, setPassword] = useState('tariq123');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrorMsg('');
      const profile = await adminLogin(email, password);
      setAdminUser(profile);
      notify(`Welcome back, ${profile.full_name}!`);
      setView('admin-dashboard');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid credentials';
      setErrorMsg(msg);
      notify(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoFill = () => {
    setEmail('admin@tariqsweets.pk');
    setPassword('tariq123');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <button
        onClick={() => setView('home')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#8C6D58] hover:text-[#2B1810] mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Store
      </button>

      <div className="bg-[#FFFDF9] rounded-3xl border border-[#E7DECD] p-8 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#FEF3C7] text-[#B45309] flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 stroke-[1.8]" />
          </div>
          <h1 className="font-serif text-2xl font-bold text-[#2B1810]">
            Staff & Admin Portal
          </h1>
          <p className="text-xs text-[#6B5749]">
            Sign in to manage bakery catalog, update prices in PKR, and fulfill live customer orders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-[#FEF2F2] border border-[#FCA5A5] text-[#991B1B] text-xs">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
              Admin Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tariqsweets.pk"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#2B1810] uppercase tracking-wide mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8C6D58]" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#D5C7B5] bg-white text-sm text-[#2B1810] focus:outline-none focus:ring-2 focus:ring-[#F59E0B]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#2B1810] text-[#FEF3C7] font-semibold text-sm hover:bg-[#451A03] transition-colors flex items-center justify-center gap-2 shadow-md active:scale-98"
          >
            {loading ? 'Authenticating...' : 'Sign In to Dashboard'} <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Credentials Box */}
        <div className="pt-4 border-t border-[#F2ECE1] bg-[#FAF5EE] p-4 rounded-2xl text-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#2B1810]">Demo Admin Credentials:</span>
            <button
              type="button"
              onClick={handleDemoFill}
              className="text-[#B45309] font-bold hover:underline"
            >
              Auto-Fill
            </button>
          </div>
          <p className="text-[#6B5749] font-mono text-[11px]">
            Email: <strong>admin@tariqsweets.pk</strong>
            <br />
            Pass: <strong>tariq123</strong>
          </p>
        </div>
      </div>
    </div>
  );
};
