import React, { useState } from 'react';
import { Shield, ArrowRight, Lock, User, AlertCircle, ArrowLeft } from 'lucide-react';
import { api } from '../services/api.ts';

interface AdminLoginPageProps {
  onLoginSuccess: () => void;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ onLoginSuccess }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await api.login({ username, password });
      if (res.success) {
        onLoginSuccess();
      } else {
        setError(res.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check your network connection.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <a
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#74767e] hover:text-[#222325] mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to public site</span>
        </a>

        {/* Fiverr Logo style */}
        <div className="mb-4 text-3xl font-black tracking-tighter text-[#222325] flex items-center justify-center">
          <span>calcplatform</span>
          <span className="text-[#1dbf73] font-extrabold text-4xl">.</span>
        </div>
        <h2 className="text-xl font-extrabold text-[#222325] tracking-tight">
          Admin Console Sign In
        </h2>
        <p className="mt-1 text-xs text-[#74767e]">
          Manage categories, subcategories, formulas, and calculators
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 border border-[#e4e5e7] rounded-xl shadow-sm">
          {error && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-semibold">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5">
                Admin Username
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#74767e] absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold border border-[#dadbdd] rounded-md focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden"
                  placeholder="admin"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#222325] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#74767e] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs font-semibold border border-[#dadbdd] rounded-md focus:border-[#1dbf73] focus:ring-2 focus:ring-[#1dbf73]/20 outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 px-4 bg-[#1dbf73] hover:bg-[#19a463] text-white text-xs font-bold rounded-md transition-colors flex items-center justify-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <span>{isLoading ? 'Authenticating...' : 'Sign In to Dashboard'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-[#f5f5f5] text-center text-[11px] text-[#74767e]">
            Default credentials: <span className="font-mono font-bold text-[#222325]">admin / admin123</span>
          </div>
        </div>
      </div>
    </div>
  );
};
