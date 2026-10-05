/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { useRentManager } from '../context/RentManagerContext';
import { PersonalExpense } from '../types';
import { 
  Plus, 
  Trash2, 
  Check, 
  X, 
  Clock, 
  DollarSign, 
  Calendar, 
  FileText, 
  Filter, 
  TrendingDown, 
  CheckCircle,
  HelpCircle,
  Zap,
  Droplet,
  Heart,
  ShoppingBag,
  Cpu,
  Bookmark
} from 'lucide-react';

export default function ExpenseTab() {
  const { expenses, addExpense, updateExpense, deleteExpense, theme } = useRentManager();

  const [showForm, setShowForm] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'Todos' | 'Pendente' | 'Pago'>('Todos');
  const [filterCategory, setFilterCategory] = useState<string>('Todas');

  // Form states
  const [formDesc, setFormDesc] = useState('');
  const [formAmount, setFormAmount] = useState(0);
  const [formDueDate, setFormDueDate] = useState('');
  const [formCategory, setFormCategory] = useState('Moradia');
  const [formStatus, setFormStatus] = useState<'Pendente' | 'Pago'>('Pendente');
  const [formPaymentDate, setFormPaymentDate] = useState('');

  const isDark = theme === 'dark';

  // Categories list
  const categories = [
    { 
      name: 'Moradia', 
      icon: Zap, 
      color: isDark 
        ? 'text-amber-400 bg-amber-950/50 border-amber-900/30' 
        : 'text-amber-600 bg-amber-50 border-amber-100' 
    },
    { 
      name: 'Alimentação', 
      icon: ShoppingBag, 
      color: isDark 
        ? 'text-emerald-400 bg-emerald-950/50 border-emerald-900/30' 
        : 'text-emerald-600 bg-emerald-50 border-emerald-100' 
    },
    { 
      name: 'Saúde', 
      icon: Heart, 
      color: isDark 
        ? 'text-rose-400 bg-rose-950/50 border-rose-900/30' 
        : 'text-rose-600 bg-rose-50 border-rose-100' 
    },
    { 
      name: 'Lazer/Tecnologia', 
      icon: Cpu, 
      color: isDark 
        ? 'text-blue-400 bg-blue-950/50 border-blue-900/30' 
        : 'text-blue-600 bg-blue-50 border-blue-100' 
    },
    { 
      name: 'Outros', 
      icon: Bookmark, 
      color: isDark 
        ? 'text-purple-400 bg-purple-950/50 border-purple-900/30' 
        : 'text-purple-600 bg-purple-50 border-purple-100' 
    }
  ];

  // Helper to format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  // Helper to format dates for Brazil
  const formatDateBR = (dateStr: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('pt-BR');
  };

  // Extract all categories currently in use for the filters
  const uniqueCategoriesInUse = useMemo(() => {
    const cats = new Set<string>();
    expenses.forEach(e => cats.add(e.category));
    return ['Todas', ...Array.from(cats)];
  }, [expenses]);

  // Filtered expenses list
  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => {
      const matchStatus = filterStatus === 'Todos' || e.status === filterStatus;
      const matchCategory = filterCategory === 'Todas' || e.category === filterCategory;
      return matchStatus && matchCategory;
    }).sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()); // Sort by due date ascending
  }, [expenses, filterStatus, filterCategory]);

  // Expenses totals
  const totalPendingAmount = useMemo(() => {
    return expenses
      .filter(e => e.status === 'Pendente')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const totalPaidAmount = useMemo(() => {
    return expenses
      .filter(e => e.status === 'Pago')
      .reduce((sum, e) => sum + e.amount, 0);
  }, [expenses]);

  const openAddExpense = () => {
    setFormDesc('');
    setFormAmount(0);
    const todayStr = new Date().toISOString().substring(0, 10);
    setFormDueDate(todayStr);
    setFormCategory('Moradia');
    setFormStatus('Pendente');
    setFormPaymentDate('');
    setShowForm(true);
  };

  const saveExpense = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDesc || formAmount <= 0 || !formDueDate) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    const payload = {
      description: formDesc,
      amount: Number(formAmount),
      dueDate: formDueDate,
      category: formCategory,
      status: formStatus,
      paymentDate: formStatus === 'Pago' ? (formPaymentDate || new Date().toISOString().substring(0, 10)) : null
    };

    addExpense(payload);
    setShowForm(false);
  };

  // Get specific category styles/icon
  const getCategoryMeta = (catName: string) => {
    const found = categories.find(c => c.name === catName);
    return found || { 
      name: catName, 
      icon: HelpCircle, 
      color: isDark 
        ? 'text-slate-400 bg-slate-950 border-slate-800' 
        : 'text-slate-600 bg-slate-50 border-slate-100' 
    };
  };

  return (
    <div className="space-y-6" id="expenses-tab">
      {/* Top summary banners */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="expense-payouts-banner">
        <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors duration-200 ${
          isDark 
            ? 'bg-rose-950/20 border-rose-900/30' 
            : 'bg-red-50 border-red-100'
        }`} id="unpaid-summary">
          <div>
            <span className={`text-2xs font-bold uppercase tracking-wider block ${isDark ? 'text-rose-400' : 'text-rose-600'}`}>Total de Contas em Aberto</span>
            <span className={`text-xl font-black block mt-1 ${isDark ? 'text-rose-400' : 'text-rose-700'}`}>{formatCurrency(totalPendingAmount)}</span>
          </div>
          <div className={`p-2.5 rounded-lg ${isDark ? 'bg-rose-900/40' : 'bg-rose-100/60'}`}>
            <Clock className={`w-5 h-5 ${isDark ? 'text-rose-400' : 'text-rose-600'}`} />
          </div>
        </div>

        <div className={`border rounded-xl p-4 flex items-center justify-between transition-colors duration-200 ${
          isDark 
            ? 'bg-emerald-950/20 border-emerald-900/30' 
            : 'bg-emerald-50 border-emerald-100'
        }`} id="paid-summary">
          <div>
            <span className={`text-2xs font-bold uppercase tracking-wider block ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>Total de Contas Pagas</span>
            <span className={`text-xl font-black block mt-1 ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>{formatCurrency(totalPaidAmount)}</span>
          </div>
          <div className={`p-2.5 rounded-lg ${isDark ? 'bg-emerald-900/40' : 'bg-emerald-100/60'}`}>
            <CheckCircle className={`w-5 h-5 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          </div>
        </div>
      </div>

      {/* Filter and search block */}
      <div className={`rounded-xl border shadow-sm p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="expense-filters-bar">
        <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
          {/* Status filter */}
          <div className={`p-1 rounded-lg text-xs flex transition-colors ${
            isDark ? 'bg-slate-950' : 'bg-slate-100'
          }`} id="status-filters">
            {(['Todos', 'Pendente', 'Pago'] as const).map(st => {
              const isSelected = filterStatus === st;
              let btnClass = "";
              if (isSelected) {
                btnClass = isDark
                  ? 'bg-slate-800 text-white shadow-xs'
                  : 'bg-white text-slate-800 shadow-xs';
              } else {
                btnClass = isDark
                  ? 'text-slate-400 hover:text-white'
                  : 'text-slate-500 hover:text-slate-800';
              }
              return (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1.5 rounded-md font-bold transition-all cursor-pointer ${btnClass}`}
                >
                  {st}
                </button>
              );
            })}
          </div>

          {/* Category filter */}
          <div className="flex items-center gap-1.5" id="category-filter-select-wrapper">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className={`border py-1 px-2.5 rounded-lg text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200' 
                  : 'bg-slate-50 border border-slate-200 text-slate-600'
              }`}
              id="category-select"
            >
              {uniqueCategoriesInUse.map(cat => (
                <option key={cat} value={cat}>{cat === 'Todas' ? 'Todas Categorias' : cat}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          onClick={openAddExpense}
          className="bg-emerald-600 text-white font-bold text-xs px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center gap-1.5 shadow-sm w-full sm:w-auto justify-center cursor-pointer"
          id="add-expense-btn"
        >
          <Plus className="w-4 h-4" /> Adicionar Conta
        </button>
      </div>

      {/* Expenses Table / Cards Grid */}
      <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="expenses-table-container">
        {filteredExpenses.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-sm italic" id="empty-expenses-state">
            <FileText className="w-10 h-10 text-slate-400 mx-auto mb-2" />
            <p className="font-semibold">Nenhuma conta pessoal encontrada</p>
            <p className="text-xs text-slate-400 mt-1">Experimente ajustar os filtros ou clique no botão acima para adicionar uma nova conta.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className={`border-b text-xs font-black uppercase transition-colors ${
                isDark ? 'bg-slate-950 border-slate-850 text-slate-400' : 'bg-slate-50 border-slate-100 text-slate-500'
              }`}>
                <tr>
                  <th className="p-4">Descrição</th>
                  <th className="p-4">Categoria</th>
                  <th className="p-4">Vencimento</th>
                  <th className="p-4 text-right">Valor</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-center">Ações</th>
                </tr>
              </thead>
              <tbody className={`divide-y transition-colors ${isDark ? 'divide-slate-800' : 'divide-slate-50'}`}>
                {filteredExpenses.map(e => {
                  const catMeta = getCategoryMeta(e.category);
                  const IconComp = catMeta.icon;
                  
                  return (
                    <tr key={e.id} className={`transition-colors ${isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50/40'}`} id={`expense-row-${e.id}`}>
                      <td className="p-4">
                        <span className={`font-bold block ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{e.description}</span>
                        {e.status === 'Pago' && e.paymentDate && (
                          <span className="text-3xs text-emerald-500 font-bold block mt-0.5 uppercase tracking-wide">
                            Pago em: {formatDateBR(e.paymentDate)}
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 text-2xs font-semibold px-2 py-0.5 rounded-full border ${catMeta.color}`}>
                          <IconComp className="w-3 h-3" />
                          {e.category}
                        </span>
                      </td>
                      <td className={`p-4 font-semibold font-mono ${isDark ? 'text-slate-300' : 'text-slate-600'}`}>
                        {formatDateBR(e.dueDate)}
                      </td>
                      <td className={`p-4 font-bold text-right font-mono ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                        {formatCurrency(e.amount)}
                      </td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-2xs font-bold ${
                          e.status === 'Pago' 
                            ? (isDark ? 'bg-emerald-950 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-100 text-emerald-800') 
                            : (isDark ? 'bg-amber-950 text-amber-400 border border-amber-900/30' : 'bg-amber-100 text-amber-800')
                        }`}>
                          {e.status}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex justify-center items-center gap-2">
                          {e.status === 'Pendente' && (
                            <button
                              onClick={() => {
                                const payDate = new Date().toISOString().substring(0, 10);
                                updateExpense({
                                  ...e,
                                  status: 'Pago',
                                  paymentDate: payDate
                                });
                              }}
                              className={`text-2xs font-extrabold px-2 py-1 rounded border flex items-center gap-0.5 cursor-pointer transition-colors ${
                                isDark 
                                  ? 'text-emerald-400 bg-emerald-950 border-emerald-900/40 hover:bg-emerald-900/30' 
                                  : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border-emerald-100'
                              }`}
                              title="Marcar como Pago"
                              id={`pay-expense-btn-${e.id}`}
                            >
                              <Check className="w-3 h-3" /> Pagar
                            </button>
                          )}
                          <button
                            onClick={() => {
                              if (confirm(`Deseja mesmo remover a conta "${e.description}"?`)) {
                                deleteExpense(e.id);
                              }
                            }}
                            className={`p-1 rounded transition-colors cursor-pointer ${
                              isDark ? 'text-slate-500 hover:text-red-400 hover:bg-slate-800' : 'text-slate-400 hover:text-red-600 hover:bg-slate-50'
                            }`}
                            title="Excluir Conta"
                            id={`delete-expense-btn-${e.id}`}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Add Expense */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="expense-modal">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-xl border animate-scale-up space-y-4 transition-colors duration-200 ${
            isDark ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${
              isDark ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`font-sans font-bold text-base ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Cadastrar Conta Mensal
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded"
                id="close-expense-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveExpense} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Descrição da Conta / Gasto*</label>
                <input 
                  type="text" 
                  placeholder="Ex: Conta de Luz CPFL, Plano de Saúde"
                  value={formDesc} 
                  onChange={e => setFormDesc(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    isDark 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Valor*</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">R$</span>
                    <input 
                      type="number" 
                      placeholder="150"
                      value={formAmount || ''} 
                      onChange={e => setFormAmount(Number(e.target.value))}
                      className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        isDark 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                      required
                      min="0.01"
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data de Vencimento*</label>
                  <input 
                    type="date" 
                    value={formDueDate} 
                    onChange={e => setFormDueDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Categoria</label>
                  <select 
                    value={formCategory} 
                    onChange={e => setFormCategory(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    {categories.map(c => (
                      <option key={c.name} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Status da Conta</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value as any)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Pago">Pago</option>
                  </select>
                </div>
              </div>

              {formStatus === 'Pago' && (
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data do Pagamento*</label>
                  <input 
                    type="date" 
                    value={formPaymentDate} 
                    onChange={e => setFormPaymentDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      isDark 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              )}

              <div className={`flex gap-2 justify-end pt-3 border-t ${
                isDark ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors ${
                    isDark 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm"
                >
                  Salvar Conta
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
