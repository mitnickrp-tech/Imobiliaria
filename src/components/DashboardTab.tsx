/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useRentManager } from '../context/RentManagerContext';
import { 
  DollarSign, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  Home, 
  FileText 
} from 'lucide-react';

export default function DashboardTab() {
  const { statements, expenses, contracts, theme } = useRentManager();

  // We find all unique months/years in both statements and expenses to let Dona Ivanir filter by month.
  // Default to June 2026 since it aligns with the sample statement.
  const [selectedMonth, setSelectedMonth] = useState('2026-06');

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Extract all available months (YYYY-MM format) from statements and expenses
  const availableMonths = useMemo(() => {
    const monthsSet = new Set<string>();
    // Default months to always have some options
    monthsSet.add('2026-05');
    monthsSet.add('2026-06');
    monthsSet.add('2026-07');
    
    statements.forEach(s => {
      const month = s.dueDate.substring(0, 7);
      if (month) monthsSet.add(month);
    });
    
    expenses.forEach(e => {
      const month = e.dueDate.substring(0, 7);
      if (month) monthsSet.add(month);
    });

    return Array.from(monthsSet).sort().reverse();
  }, [statements, expenses]);

  // Format month name (e.g., "2026-06" -> "Junho de 2026")
  const formatMonthName = (monthStr: string) => {
    const [year, month] = monthStr.split('-');
    const monthNames = [
      'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
      'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
    ];
    const monthIndex = parseInt(month, 10) - 1;
    return `${monthNames[monthIndex]} de ${year}`;
  };

  // Filtered data for the selected month
  const monthlyStatements = useMemo(() => {
    return statements.filter(s => s.dueDate.startsWith(selectedMonth));
  }, [statements, selectedMonth]);

  const monthlyExpenses = useMemo(() => {
    return expenses.filter(e => e.dueDate.startsWith(selectedMonth));
  }, [expenses, selectedMonth]);

  // Calculations for the selected month
  const stats = useMemo(() => {
    // Rental incomes
    const grossRent = monthlyStatements.reduce((sum, s) => sum + s.rentAmount, 0);
    const adminFees = monthlyStatements.reduce((sum, s) => sum + s.adminFee, 0);
    const netPayout = monthlyStatements.reduce((sum, s) => sum + s.netAmount, 0);
    
    const rentReceived = monthlyStatements
      .filter(s => s.status === 'Recebido')
      .reduce((sum, s) => sum + s.netAmount, 0);
      
    const rentPending = monthlyStatements
      .filter(s => s.status === 'Pendente')
      .reduce((sum, s) => sum + s.netAmount, 0);

    // Personal expenses
    const totalExpenses = monthlyExpenses.reduce((sum, e) => sum + e.amount, 0);
    const expensesPaid = monthlyExpenses
      .filter(e => e.status === 'Pago')
      .reduce((sum, e) => sum + e.amount, 0);
    const expensesPending = monthlyExpenses
      .filter(e => e.status === 'Pendente')
      .reduce((sum, e) => sum + e.amount, 0);

    // Balances
    const currentBalance = rentReceived - expensesPaid; // actual real balance
    const projectedBalance = netPayout - totalExpenses; // projected balance

    return {
      grossRent,
      adminFees,
      netPayout,
      rentReceived,
      rentPending,
      totalExpenses,
      expensesPaid,
      expensesPending,
      currentBalance,
      projectedBalance,
      statementCount: monthlyStatements.length,
      expenseCount: monthlyExpenses.length
    };
  }, [monthlyStatements, monthlyExpenses]);

  // Categories distribution for expenses
  const expenseCategories = useMemo(() => {
    const categories: { [key: string]: number } = {};
    monthlyExpenses.forEach(e => {
      categories[e.category] = (categories[e.category] || 0) + e.amount;
    });
    return Object.entries(categories).map(([name, value]) => ({ name, value }));
  }, [monthlyExpenses]);

  return (
    <div className="space-y-6" id="dashboard-tab">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-700 rounded-2xl p-6 text-white shadow-md relative overflow-hidden animate-fade-in" id="welcome-banner">
        <div className="relative z-10">
          <span className="bg-emerald-500/35 text-emerald-100 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            Painel da Dona Ivanir
          </span>
          <h2 className="text-2xl font-bold mt-2 font-sans tracking-tight">
            Olá, Dona Ivanir! 🌸
          </h2>
          <p className="text-emerald-100/90 text-sm mt-1 max-w-md font-medium">
            Acompanhe o rendimento das suas casas de aluguel e o controle de suas despesas pessoais de forma simples e organizada.
          </p>
        </div>
        <div className="absolute right-6 bottom-0 translate-y-3 opacity-15 hidden md:block" id="banner-icon-bg">
          <Home className="w-48 h-48" />
        </div>
      </div>

      {/* Filter and Overview Grid */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 rounded-xl border shadow-sm gap-4 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="month-filter-bar">
        <div>
          <span className={`text-xs font-medium block uppercase tracking-wider ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Período Selecionado</span>
          <span className={`text-lg font-bold font-sans ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{formatMonthName(selectedMonth)}</span>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Calendar className="w-4 h-4 text-slate-400" />
          <select 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)}
            className={`w-full sm:w-auto border py-1.5 px-3 rounded-lg font-medium text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
              theme === 'dark' 
                ? 'bg-slate-800 border-slate-700 text-slate-100' 
                : 'bg-slate-50 border-slate-200 text-slate-700'
            }`}
            id="month-select"
          >
            {availableMonths.map(m => (
              <option key={m} value={m}>{formatMonthName(m)}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Main KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="kpi-cards-grid">
        {/* Card 1: Rental Income */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="kpi-rental-income">
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-emerald-950/50' : 'bg-emerald-50'}`}>
              <DollarSign className="w-6 h-6 text-emerald-500" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              theme === 'dark' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700'
            }`}>
              {stats.statementCount} {stats.statementCount === 1 ? 'repasse' : 'repasses'}
            </span>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Repasse Líquido das Casas</span>
            <h3 className={`text-2xl font-extrabold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{formatCurrency(stats.netPayout)}</h3>
          </div>
          <div className={`border-t mt-4 pt-3 flex justify-between text-xs transition-colors ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span>
              Recebido: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{formatCurrency(stats.rentReceived)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              Pendente: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{formatCurrency(stats.rentPending)}</strong>
            </span>
          </div>
        </div>

        {/* Card 2: Personal Expenses */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="kpi-personal-expenses">
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-rose-950/50' : 'bg-rose-50'}`}>
              <ArrowDownRight className="w-6 h-6 text-rose-500" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              theme === 'dark' ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-50 text-rose-700'
            }`}>
              {stats.expenseCount} {stats.expenseCount === 1 ? 'conta' : 'contas'}
            </span>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Suas Contas Pessoais</span>
            <h3 className={`text-2xl font-extrabold mt-1 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{formatCurrency(stats.totalExpenses)}</h3>
          </div>
          <div className={`border-t mt-4 pt-3 flex justify-between text-xs transition-colors ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block"></span>
              Pagas: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{formatCurrency(stats.expensesPaid)}</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block"></span>
              A Pagar: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{formatCurrency(stats.expensesPending)}</strong>
            </span>
          </div>
        </div>

        {/* Card 3: Final Balance */}
        <div className={`p-5 rounded-2xl border shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="kpi-final-balance">
          <div className="flex justify-between items-start">
            <div className={`p-2.5 rounded-xl ${theme === 'dark' ? 'bg-blue-950/50' : 'bg-blue-50'}`}>
              <TrendingUp className="w-6 h-6 text-blue-500" />
            </div>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              stats.projectedBalance >= 0 
                ? (theme === 'dark' ? 'bg-emerald-950/40 text-emerald-400' : 'bg-emerald-50 text-emerald-700') 
                : (theme === 'dark' ? 'bg-rose-950/40 text-rose-400' : 'bg-rose-50 text-rose-700')
            }`}>
              Previsto: {formatCurrency(stats.projectedBalance)}
            </span>
          </div>
          <div className="mt-4">
            <span className={`text-sm font-medium ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Saldo Atual (Recebido - Pago)</span>
            <h3 className={`text-2xl font-extrabold mt-1 ${
              stats.currentBalance >= 0 
                ? (theme === 'dark' ? 'text-emerald-400' : 'text-emerald-700') 
                : (theme === 'dark' ? 'text-rose-400' : 'text-rose-600')
            }`}>
              {formatCurrency(stats.currentBalance)}
            </h3>
          </div>
          <div className={`border-t mt-4 pt-3 text-xs transition-colors ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`}>
            <span>Seus repasses cobriram <strong>{stats.totalExpenses > 0 ? Math.round((stats.rentReceived / stats.totalExpenses) * 100) : 100}%</strong> de suas despesas pagas ou futuras.</span>
          </div>
        </div>
      </div>

      {/* Visual Progress Section (Aesthetic custom charts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="charts-and-alerts-grid">
        {/* Left: Financial Progress Charts */}
        <div className={`p-6 rounded-2xl border shadow-sm space-y-6 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="financial-analysis">
          <h3 className={`font-sans font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Visualização Financeira do Mês</h3>
          
          {/* Custom comparison bars */}
          <div className="space-y-4">
            {/* Income Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="w-3 h-3 rounded bg-emerald-500"></span>
                  Aluguéis Recebidos da Imobiliária
                </span>
                <span className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{formatCurrency(stats.rentReceived)} / {formatCurrency(stats.netPayout)}</span>
              </div>
              <div className={`w-full h-3.5 rounded-full overflow-hidden flex ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className="bg-emerald-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${stats.netPayout > 0 ? (stats.rentReceived / stats.netPayout) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {stats.netPayout > 0 ? `${Math.round((stats.rentReceived / stats.netPayout) * 100)}%` : '0%'} do repasse total das casas já entrou na sua conta bancária.
              </p>
            </div>

            {/* Expense Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className={`font-medium flex items-center gap-1.5 ${theme === 'dark' ? 'text-slate-300' : 'text-slate-600'}`}>
                  <span className="w-3 h-3 rounded bg-rose-500"></span>
                  Suas Contas Pessoais Pagas
                </span>
                <span className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>{formatCurrency(stats.expensesPaid)} / {formatCurrency(stats.totalExpenses)}</span>
              </div>
              <div className={`w-full h-3.5 rounded-full overflow-hidden flex ${theme === 'dark' ? 'bg-slate-800' : 'bg-slate-100'}`}>
                <div 
                  className="bg-rose-500 transition-all duration-500 rounded-full" 
                  style={{ width: `${stats.totalExpenses > 0 ? (stats.expensesPaid / stats.totalExpenses) * 100 : 0}%` }}
                ></div>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {stats.totalExpenses > 0 ? `${Math.round((stats.expensesPaid / stats.totalExpenses) * 100)}%` : '100%'} das suas despesas pessoais deste mês já foram quitadas.
              </p>
            </div>
          </div>

          {/* Breakdown for admin fee and gross rent */}
          <div className={`rounded-xl p-4 grid grid-cols-2 gap-4 text-xs border transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-600'
          }`} id="rent-breakdown">
            <div>
              <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>Aluguel Bruto Cobrado</p>
              <p className={`text-base font-bold mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(stats.grossRent)}</p>
            </div>
            <div>
              <p className={theme === 'dark' ? 'text-slate-500' : 'text-slate-400'}>Taxa de Adm (Imobiliária)</p>
              <p className={`text-base font-bold mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(stats.adminFees)}</p>
            </div>
          </div>
        </div>

        {/* Right: Urgent alerts or pending tasks */}
        <div className={`p-6 rounded-2xl border shadow-sm flex flex-col justify-between gap-4 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="alerts-and-shortcuts">
          <div>
            <h3 className={`font-sans font-bold text-base mb-3 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Lembretes e Avisos</h3>
            <div className="space-y-3" id="alerts-list">
              {/* Alert: Pending Rent Statement */}
              {stats.rentPending > 0 ? (
                <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'bg-amber-950/30 border-amber-900/40 text-amber-200' 
                    : 'bg-amber-50 border-amber-100 text-amber-900'
                }`}>
                  <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Repasse Pendente</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-amber-300/80' : 'text-amber-700'}`}>Você possui {formatCurrency(stats.rentPending)} de repasse da imobiliária aguardando confirmação de recebimento.</p>
                  </div>
                </div>
              ) : stats.statementCount > 0 ? (
                <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Tudo Recebido!</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-emerald-300/80' : 'text-emerald-700'}`}>Todos os repasses agendados para este mês já foram devidamente recebidos no banco.</p>
                  </div>
                </div>
              ) : null}

              {/* Alert: Pending personal bills */}
              {stats.expensesPending > 0 ? (
                <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'bg-red-950/30 border-red-900/40 text-red-200' 
                    : 'bg-red-50 border-red-100 text-red-900'
                }`}>
                  <AlertCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Contas a Pagar ({monthlyExpenses.filter(e => e.status === 'Pendente').length})</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-red-300/80' : 'text-red-700'}`}>Existem contas pessoais em aberto somando {formatCurrency(stats.expensesPending)} para este mês.</p>
                  </div>
                </div>
              ) : stats.expenseCount > 0 ? (
                <div className={`flex items-start gap-2.5 p-3 rounded-lg border text-sm transition-colors ${
                  theme === 'dark' 
                    ? 'bg-emerald-950/30 border-emerald-900/40 text-emerald-200' 
                    : 'bg-emerald-50 border-emerald-100 text-emerald-900'
                }`}>
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-semibold">Contas em Dia!</p>
                    <p className={`text-xs mt-0.5 ${theme === 'dark' ? 'text-emerald-300/80' : 'text-emerald-700'}`}>Excelente! Todas as suas contas cadastradas para este mês já foram pagas.</p>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-slate-400 italic">Nenhuma conta cadastrada para este mês.</p>
              )}
            </div>
          </div>

          <div className={`border-t pt-3 text-xs transition-colors ${
            theme === 'dark' ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'
          }`} id="santander-tip">
            <span className={`font-semibold block mb-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>Dica Financeira:</span>
            Confira o extrato de sua conta corrente bancária antes de marcar os repasses como "Recebido".
          </div>
        </div>
      </div>

      {/* Expense categories breakdown */}
      {expenseCategories.length > 0 && (
        <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="expenses-breakdown-by-category">
          <h3 className={`font-sans font-bold text-base mb-4 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Detalhamento das Contas Pessoais por Categoria</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4" id="categories-grid">
            {expenseCategories.map(cat => (
              <div key={cat.name} className={`p-3 rounded-xl border text-center transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-950/40 border-slate-800/60' : 'bg-slate-50 border-slate-100'
              }`} id={`category-${cat.name}`}>
                <span className="text-xs text-slate-400 font-medium block truncate uppercase tracking-wider">{cat.name}</span>
                <span className={`text-base font-extrabold block mt-1 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(cat.value)}</span>
                <span className="text-2xs text-slate-400 font-medium mt-0.5 block">
                  {Math.round((cat.value / stats.totalExpenses) * 100)}% do total
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
