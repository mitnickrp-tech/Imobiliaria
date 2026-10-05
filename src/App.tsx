/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { RentManagerProvider, useRentManager } from './context/RentManagerContext';
import DashboardTab from './components/DashboardTab';
import PropertyTab from './components/PropertyTab';
import StatementTab from './components/StatementTab';
import ExpenseTab from './components/ExpenseTab';
import DatabaseTab from './components/DatabaseTab';
import DataManagement from './components/DataManagement';
import LoginScreen from './components/LoginScreen';
import { 
  Home, 
  TrendingUp, 
  FileText, 
  DollarSign, 
  Settings, 
  Activity, 
  Sun,
  Moon,
  Database,
  LogOut,
  UserCheck,
  ShieldCheck,
  Building2
} from 'lucide-react';

type TabType = 'dashboard' | 'properties' | 'statements' | 'expenses' | 'database' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const { theme, setTheme, currentUser, logout } = useRentManager();

  // If user is not authenticated, show modern darkmode login screen
  if (!currentUser) {
    return <LoginScreen />;
  }

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardTab />;
      case 'properties':
        return <PropertyTab />;
      case 'statements':
        return <StatementTab />;
      case 'expenses':
        return <ExpenseTab />;
      case 'database':
        return <DatabaseTab />;
      case 'settings':
        return <DataManagement />;
      default:
        return <DashboardTab />;
    }
  };

  const tabs = [
    { id: 'dashboard' as TabType, label: 'Painel Geral', icon: TrendingUp },
    { id: 'properties' as TabType, label: 'Imóveis & Contratos', icon: Home },
    { id: 'statements' as TabType, label: 'Extratos da Imobiliária', icon: FileText },
    { id: 'expenses' as TabType, label: 'Contas Pessoais', icon: DollarSign },
    { id: 'database' as TabType, label: 'Banco de Dados & PHP', icon: Database },
    { id: 'settings' as TabType, label: 'Backup & JSON', icon: Settings }
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-200 ${
      theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-800'
    }`} id="app-root">
      
      {/* Main Header navigation */}
      <header className={`sticky top-0 z-40 shadow-xs border-b transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="app-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            {/* Logo / Brand */}
            <div className="flex items-center gap-2.5">
              <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-xs">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <h1 className={`text-base font-extrabold tracking-tight leading-tight transition-colors ${
                  theme === 'dark' ? 'text-white' : 'text-slate-800'
                }`}>
                  Gestor Imobiliário
                </h1>
                <p className={`text-3xs font-bold uppercase tracking-wider transition-colors ${
                  theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
                }`}>
                  Imóveis & Contas Pessoais
                </p>
              </div>
            </div>

            {/* Desktop Tab Navigation Buttons */}
            <nav className="hidden md:flex space-x-1" id="desktop-nav">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                
                let buttonStyle = "";
                if (isActive) {
                  buttonStyle = theme === 'dark'
                    ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/40 shadow-sm'
                    : 'bg-emerald-50 text-emerald-700 shadow-3xs';
                } else {
                  buttonStyle = theme === 'dark'
                    ? 'text-slate-400 hover:text-slate-100 hover:bg-slate-800/60'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50';
                }

                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all cursor-pointer ${buttonStyle}`}
                    id={`tab-button-${tab.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>

            {/* User Session, Theme Toggle & Logout */}
            <div className="flex items-center gap-2.5">
              {/* Theme Toggle Switch */}
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className={`p-2 rounded-lg border transition-all cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-amber-400 hover:bg-slate-700'
                    : 'bg-slate-100 border-slate-200 text-slate-500 hover:bg-slate-200'
                }`}
                title={theme === 'dark' ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
                id="theme-toggle-btn"
              >
                {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>

              {/* Logged in User Pill */}
              <div className={`hidden sm:flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-colors ${
                theme === 'dark' 
                  ? 'bg-slate-800/70 border-slate-700 text-slate-200' 
                  : 'bg-slate-100 border-slate-200 text-slate-700'
              }`}>
                {currentUser.role === 'admin' ? (
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                ) : (
                  <UserCheck className="w-3.5 h-3.5 text-blue-400" />
                )}
                <span className="truncate max-w-[130px]">{currentUser.name}</span>
                <span className={`text-3xs uppercase px-1.5 py-0.2 rounded font-extrabold ${
                  currentUser.role === 'admin'
                    ? (theme === 'dark' ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                    : (theme === 'dark' ? 'bg-blue-950 text-blue-400' : 'bg-blue-100 text-blue-800')
                }`}>
                  {currentUser.role === 'admin' ? 'Admin' : 'Proprietária'}
                </span>
              </div>

              {/* Logout Button */}
              <button
                onClick={logout}
                className={`flex items-center gap-1 text-xs font-semibold p-2 rounded-lg border transition-colors cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-slate-800 border-slate-700 text-slate-400 hover:text-rose-400 hover:bg-slate-750'
                    : 'bg-slate-100 border-slate-200 text-slate-600 hover:text-rose-600 hover:bg-slate-200'
                }`}
                title="Sair / Trocar Usuário"
                id="logout-btn"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden lg:inline text-xs">Sair</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Tab Navigation */}
      <div className={`md:hidden flex overflow-x-auto p-2 gap-1 sticky top-16 z-30 border-b transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="mobile-nav">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          let mStyle = "";
          if (isActive) {
            mStyle = theme === 'dark'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-emerald-500 text-white shadow-xs';
          } else {
            mStyle = theme === 'dark'
              ? 'text-slate-400 bg-slate-800/40 hover:text-slate-200'
              : 'text-slate-500 hover:text-slate-800 bg-slate-50';
          }

          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-2xs font-extrabold whitespace-nowrap shrink-0 transition-all cursor-pointer ${mStyle}`}
              id={`mobile-tab-button-${tab.id}`}
            >
              <Icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Main Workspace content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6" id="app-main-content">
        {renderActiveTab()}
      </main>

      {/* Subtle footer */}
      <footer className={`max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 border-t mt-12 text-center text-xs space-y-1 transition-colors duration-200 ${
        theme === 'dark' ? 'border-slate-900 text-slate-500' : 'border-slate-200 text-slate-400'
      }`} id="app-footer">
        <p className={`font-semibold transition-colors ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
          Gestor Imobiliário & Controle Financeiro de Contas
        </p>
        <p>Projeto de demonstração no GitHub com modelagem relacional MySQL 8, backend PHP 8 e frontend em React.</p>
        <div className={`flex justify-center gap-3 pt-2 text-3xs font-bold uppercase tracking-wider transition-colors ${
          theme === 'dark' ? 'text-slate-600' : 'text-slate-300'
        }`}>
          <span>Dados 100% Fictícios</span>
          <span>•</span>
          <span>Autenticação Integrada</span>
          <span>•</span>
          <span>Dump SQL Exportável</span>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <RentManagerProvider>
      <AppContent />
    </RentManagerProvider>
  );
}
