/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRentManager, DEMO_USERS } from '../context/RentManagerContext';
import { 
  Building2, 
  Lock, 
  Mail, 
  ShieldCheck, 
  ArrowRight, 
  UserCheck, 
  KeyRound,
  Database,
  Code2,
  Eye,
  EyeOff,
  Sparkles
} from 'lucide-react';

export default function LoginScreen() {
  const { login, quickLogin, theme } = useRentManager();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const result = login(email, password);
      if (!result.success) {
        setErrorMessage(result.message || 'Erro ao realizar login.');
      }
      setIsLoading(false);
    }, 300);
  };

  const isDark = theme === 'dark';

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
      isDark ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`}>
      <div className="w-full max-w-md space-y-6">
        
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex p-3 rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-900/30 mb-2">
            <Building2 className="w-8 h-8" />
          </div>
          <h1 className={`text-2xl font-black tracking-tight ${isDark ? 'text-white' : 'text-slate-900'}`}>
            Gestor Imobiliário & Finanças
          </h1>
          <p className={`text-xs ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Demonstração com PHP 8, MySQL e React para GitHub
          </p>
        </div>

        {/* Demo Credentials Quick-Select Pill Box */}
        <div className={`p-4 rounded-2xl border transition-colors ${
          isDark 
            ? 'bg-slate-900/90 border-slate-800 shadow-xl' 
            : 'bg-white border-slate-200 shadow-sm'
        }`}>
          <div className="flex items-center gap-1.5 mb-3">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            <span className={`text-xs font-bold uppercase tracking-wider ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
              Acesso Rápido de Demonstração (1 Clique)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => quickLogin('admin')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/20' 
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-500">Administrador</span>
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              </div>
              <p className={`text-3xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                admin@imobiliaria.com
              </p>
              <span className={`text-3xs font-mono block mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Senha: senha123
              </span>
            </button>

            <button
              type="button"
              onClick={() => quickLogin('proprietario')}
              className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 hover:border-emerald-500 hover:bg-emerald-950/20' 
                  : 'bg-slate-50 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/50'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-blue-400">Proprietária</span>
                <UserCheck className="w-3.5 h-3.5 text-blue-400" />
              </div>
              <p className={`text-3xs truncate mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                proprietaria@exemplo.com
              </p>
              <span className={`text-3xs font-mono block mt-1 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                Senha: senha123
              </span>
            </button>
          </div>
        </div>

        {/* Traditional Form Card */}
        <div className={`p-6 rounded-2xl border shadow-xl transition-colors ${
          isDark 
            ? 'bg-slate-900 border-slate-800 text-slate-100' 
            : 'bg-white border-slate-200 text-slate-800'
        }`}>
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-800/40">
            <span className="text-xs font-bold text-slate-400">Ou entre com login e senha:</span>
            <div className="flex items-center gap-1 text-3xs text-emerald-400 font-mono">
              <KeyRound className="w-3 h-3" />
              <span>Auth Ativa</span>
            </div>
          </div>

          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 shrink-0"></span>
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-400">
                E-mail de Acesso
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type="email"
                  required
                  placeholder="admin@imobiliaria.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className={`w-full pl-9 pr-3 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold mb-1.5 text-slate-400">
                Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="senha123"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className={`w-full pl-9 pr-10 py-2 text-xs rounded-xl border focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-slate-950 border-slate-800 text-slate-100 placeholder-slate-600' 
                      : 'bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400'
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-md cursor-pointer disabled:opacity-50"
            >
              {isLoading ? (
                <span>Autenticando...</span>
              ) : (
                <>
                  <span>Entrar no Sistema</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* GitHub Demonstration Badge */}
          <div className={`mt-5 pt-4 border-t flex items-center justify-between text-3xs text-slate-500 ${
            isDark ? 'border-slate-800' : 'border-slate-200'
          }`}>
            <span className="flex items-center gap-1 font-mono">
              <Database className="w-3 h-3 text-emerald-500" /> MySQL 8.0
            </span>
            <span className="flex items-center gap-1 font-mono">
              <Code2 className="w-3 h-3 text-blue-500" /> PHP 8 API
            </span>
            <span className="font-semibold">GitHub Showcase</span>
          </div>
        </div>

      </div>
    </div>
  );
}
