/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRentManager } from '../context/RentManagerContext';
import { RentStatement, RentContract, Property } from '../types';
import { 
  FileText, 
  Plus, 
  Trash2, 
  Check, 
  Clock, 
  Printer, 
  ExternalLink,
  X,
  Sparkles,
  ArrowRight,
  Info,
  Building2
} from 'lucide-react';

export default function StatementTab() {
  const { 
    statements, 
    contracts, 
    properties, 
    theme,
    addStatement, 
    updateStatement, 
    deleteStatement 
  } = useRentManager();

  const [selectedStatementId, setSelectedStatementId] = useState<string | null>(statements[0]?.id || null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const [formContractId, setFormContractId] = useState('');
  const [formNumber, setFormNumber] = useState('');
  const [formPeriodStart, setFormPeriodStart] = useState('');
  const [formPeriodEnd, setFormPeriodEnd] = useState('');
  const [formDueDate, setFormDueDate] = useState('');
  const [formRentAmount, setFormRentAmount] = useState(0);
  const [formAdminFee, setFormAdminFee] = useState(0);
  const [formStatus, setFormStatus] = useState<'Pendente' | 'Recebido'>('Pendente');
  const [formPaymentDate, setFormPaymentDate] = useState('');
  const [formStatementDate, setFormStatementDate] = useState('');

  // Auto fill form when contract is selected
  const handleContractChange = (contractId: string) => {
    setFormContractId(contractId);
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      setFormRentAmount(contract.rentAmount);
      setFormAdminFee(contract.adminFeeAmount);
    }
  };

  const openAddStatement = () => {
    if (contracts.length === 0) {
      alert("Por favor, cadastre um contrato na aba 'Imóveis' antes de lançar um extrato.");
      return;
    }
    
    // Set default initial contract
    const defaultContractId = contracts[0].id;
    setFormContractId(defaultContractId);
    setFormRentAmount(contracts[0].rentAmount);
    setFormAdminFee(contracts[0].adminFeeAmount);
    
    // Default values
    setFormNumber((10420 + statements.length + 1).toString());
    
    // Dates
    setFormPeriodStart('2026-05-15');
    setFormPeriodEnd('2026-06-14');
    setFormDueDate('2026-06-20');
    setFormStatementDate('2026-06-08');
    setFormStatus('Pendente');
    setFormPaymentDate('');
    
    setShowForm(true);
  };

  const saveStatement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContractId) return;

    const payload = {
      contractId: formContractId,
      statementNumber: formNumber || 'S/N',
      periodStart: formPeriodStart,
      periodEnd: formPeriodEnd,
      dueDate: formDueDate,
      rentAmount: Number(formRentAmount),
      adminFee: Number(formAdminFee),
      netAmount: Number(formRentAmount) - Number(formAdminFee),
      status: formStatus,
      paymentDate: formStatus === 'Recebido' ? (formPaymentDate || new Date().toISOString().substring(0, 10)) : null,
      statementDate: formStatementDate || new Date().toISOString().substring(0, 10)
    };

    const newId = addStatement(payload);
    setSelectedStatementId(newId);
    setShowForm(false);
  };

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

  const selectedStatement = statements.find(s => s.id === selectedStatementId);
  const selectedContract = selectedStatement ? contracts.find(c => c.id === selectedStatement.contractId) : null;
  const selectedProperty = selectedContract ? properties.find(p => p.id === selectedContract.propertyId) : null;

  // Render a visual replica of the "Extrato da Imobiliária"
  const renderStatementReplica = () => {
    if (!selectedStatement || !selectedContract || !selectedProperty) return null;

    const netValue = selectedStatement.rentAmount - selectedStatement.adminFee;
    const isDark = theme === 'dark';

    return (
      <div className={`border-2 rounded-xl p-6 shadow-sm font-sans space-y-6 max-w-3xl mx-auto overflow-x-auto relative transition-colors duration-200 ${
        isDark 
          ? 'bg-slate-900 border-slate-750 text-slate-200' 
          : 'bg-white border-slate-300 text-slate-800'
      }`} id="statement-replica-sheet">
        {/* Paper receipt indicator */}
        <div className={`absolute right-6 top-3 text-3xs font-extrabold uppercase px-2 py-0.5 rounded border tracking-wider transition-colors ${
          isDark 
            ? 'bg-slate-950 text-slate-400 border-slate-800' 
            : 'bg-slate-100 text-slate-500 border-slate-200'
        }`}>
          Demonstrativo Oficial de Repasse
        </div>

        {/* Top Header Row */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4 gap-4 border-b-2 ${
          isDark ? 'border-slate-700' : 'border-slate-800'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`border px-3 py-1 font-black tracking-tighter text-lg flex flex-col items-center transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-white' 
                : 'bg-slate-900 border-slate-900 text-white'
            }`}>
              <span className={`text-2xs font-light tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-400'}`}>ADMINISTRAÇÃO</span>
              <span className="leading-tight">IMOBILIÁRIA</span>
              <span className={`text-3xs font-medium ${isDark ? 'text-slate-500' : 'text-slate-300'}`}>CRECI - 24580-J | GESTÃO PATRIMONIAL</span>
            </div>
            <div>
              <h2 className="text-sm font-black tracking-wide uppercase">Extrato de Repasse de Aluguel</h2>
              <p className={`text-xs font-medium ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Imobiliária de Locações & Administração</p>
            </div>
          </div>
          <div className="text-left sm:text-right">
            <span className={`text-xs font-bold block ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Nº do extrato:</span>
            <span className={`text-lg font-black font-mono px-2.5 py-0.5 rounded border transition-colors ${
              isDark 
                ? 'bg-slate-950 border-slate-800 text-slate-100' 
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}>
              {selectedStatement.statementNumber}
            </span>
          </div>
        </div>

        {/* Contract Core Info Block */}
        <div className={`grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-xs p-4 rounded-lg border transition-colors duration-200 ${
          isDark 
            ? 'bg-slate-950/40 border-slate-800 text-slate-300' 
            : 'bg-slate-50 border-slate-200 text-slate-500'
        }`}>
          <div>
            <p>Código do contrato: <strong className={`font-mono text-sm ${isDark ? 'text-white' : 'text-slate-800'}`}>{selectedContract.contractCode}</strong></p>
            <p className="mt-1">Data início do contrato: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{formatDateBR(selectedContract.startDate)}</strong></p>
            <p className="mt-1">Data do último reajuste: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{formatDateBR(selectedContract.lastAdjustmentDate)}</strong></p>
          </div>
          <div>
            <p>Endereço do imóvel: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedProperty.address}, nº {selectedProperty.number} - {selectedProperty.neighborhood}, {selectedProperty.city} - {selectedProperty.state}</strong></p>
            <p className="mt-1">Prazo do contrato: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{selectedContract.durationMonths} meses</strong></p>
            <p className="mt-1">Data do próximo reajuste: <strong className={isDark ? 'text-slate-200' : 'text-slate-800'}>{formatDateBR(selectedContract.nextAdjustmentDate)}</strong></p>
          </div>
          <div className={`sm:col-span-2 border-t mt-2 pt-2 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <p className={`uppercase text-3xs font-black tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-600'}`}>Locatário (Inquilino)</p>
            <p className={`text-sm font-black mt-0.5 ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>{selectedContract.tenantName}</p>
          </div>
        </div>

        {/* Receitas / Despesas Section */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider border-b pb-1 mb-2 transition-colors ${
            isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-300'
          }`}>Receitas & Taxas Administrativas</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Left: Receitas */}
            <div className={`border rounded-lg overflow-hidden transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <tr>
                    <th className="p-2 font-black uppercase">Receitas de Locação</th>
                    <th className="p-2 font-black text-right uppercase">Valor</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  <tr>
                    <td className="p-2.5 font-medium">Aluguel - Período ({formatDateBR(selectedStatement.periodStart)} a {formatDateBR(selectedStatement.periodEnd)})</td>
                    <td className={`p-2.5 font-bold text-right font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formatCurrency(selectedStatement.rentAmount)}</td>
                  </tr>
                  <tr className={`font-black border-t transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <td className="p-2 text-right">Valor Bruto:</td>
                    <td className={`p-2 text-right font-mono ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{formatCurrency(selectedStatement.rentAmount)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Right: Despesas / Taxas */}
            <div className={`border rounded-lg overflow-hidden transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <table className="w-full text-left text-xs">
                <thead className={`border-b transition-colors ${isDark ? 'bg-slate-950 border-slate-800' : 'bg-slate-100 border-slate-200'}`}>
                  <tr>
                    <th className="p-2 font-black uppercase">Taxa Imobiliária</th>
                    <th className="p-2 font-black text-right uppercase">Valor</th>
                  </tr>
                </thead>
                <tbody className={`divide-y transition-colors ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                  <tr>
                    <td className="p-2.5 font-medium">Taxa de administração da Imobiliária</td>
                    <td className="p-2.5 font-bold text-right text-rose-500 font-mono">{formatCurrency(selectedStatement.adminFee)}</td>
                  </tr>
                  <tr className={`font-black border-t transition-colors ${isDark ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <td className="p-2 text-right">Taxa Cobrada:</td>
                    <td className="p-2 text-right text-rose-500 font-mono">{formatCurrency(selectedStatement.adminFee)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Combined Net Summary */}
          <div className="flex justify-end mt-4">
            <div className={`border-2 px-4 py-2.5 rounded-lg flex items-center gap-6 text-sm transition-colors ${
              isDark ? 'border-slate-700 bg-slate-950 text-slate-100' : 'border-slate-800 bg-slate-50 text-slate-800'
            }`}>
              <span className="font-black uppercase tracking-wider text-xs">Total do Repasse Líquido:</span>
              <span className="text-xl font-black text-emerald-500 font-mono">{formatCurrency(netValue)}</span>
            </div>
          </div>
        </div>

        {/* Dados do pagamento block */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider border-b pb-1 mb-2 transition-colors ${
            isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-300'
          }`}>Dados Bancários para Crédito</h3>
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border rounded-lg p-3 text-xs transition-colors ${
            isDark ? 'border-slate-800 bg-slate-950/30' : 'border-slate-200 bg-slate-50/50'
          }`}>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Titular Beneficiária</p>
              <p className={`text-sm font-extrabold mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-800'}`}>{selectedContract.landlordName}</p>
            </div>
            <div>
              <p className="text-slate-400 font-bold uppercase tracking-wider text-3xs">Dados bancários do repasse</p>
              <p className={`text-xs font-medium mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                {selectedContract.bankName}
                <br />
                Agência: {selectedContract.bankAgency} | Conta: {selectedContract.bankAccount}
              </p>
            </div>
            <div className={`sm:col-span-2 border-t pt-2 mt-1 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
              <div className="flex justify-between items-center">
                <span>Proprietária: <strong className={isDark ? 'text-slate-200' : 'text-slate-700'}>{selectedContract.landlordName} ({selectedContract.landlordPercent}%)</strong></span>
                <span className={`text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-800'}`}>Valor a Receber: <span className="font-mono text-emerald-500">{formatCurrency(netValue)}</span></span>
              </div>
            </div>
          </div>
        </div>

        {/* Dados da Fatura (Vencimentos e Status) */}
        <div>
          <h3 className={`text-xs font-black uppercase tracking-wider border-b pb-1 mb-2 transition-colors ${
            isDark ? 'text-slate-300 border-slate-800' : 'text-slate-700 border-slate-300'
          }`}>Status do Repasse</h3>
          <div className={`border rounded-lg overflow-hidden transition-colors ${isDark ? 'border-slate-800' : 'border-slate-200'}`}>
            <table className="w-full text-left text-xs divide-y transition-colors duration-200 divide-slate-200 dark:divide-slate-800">
              <thead className={isDark ? 'bg-slate-950' : 'bg-slate-100'}>
                <tr>
                  <th className="p-2 font-black uppercase">Situação</th>
                  <th className="p-2 font-black uppercase">Data Prevista de Vencimento</th>
                  <th className="p-2 font-black uppercase">Data Efetiva de Recebimento</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                      selectedStatement.status === 'Recebido' 
                        ? (isDark ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-900/30' : 'bg-emerald-100 text-emerald-800') 
                        : (isDark ? 'bg-amber-950/60 text-amber-400 border border-amber-900/30' : 'bg-amber-100 text-amber-800')
                    }`}>
                      <span className={`w-2 h-2 rounded-full ${selectedStatement.status === 'Recebido' ? 'bg-emerald-500' : 'bg-amber-400'}`}></span>
                      {selectedStatement.status}
                    </span>
                  </td>
                  <td className={`p-3 font-semibold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {formatDateBR(selectedStatement.dueDate)}
                  </td>
                  <td className={`p-3 font-semibold font-mono ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
                    {selectedStatement.status === 'Recebido' && selectedStatement.paymentDate
                      ? formatDateBR(selectedStatement.paymentDate)
                      : '-'
                    }
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Bottom signature timestamp line */}
        <div className={`text-center text-xs pt-4 border-t flex flex-col sm:flex-row justify-between items-center gap-2 transition-colors ${
          isDark ? 'border-slate-800 text-slate-500' : 'border-slate-200 text-slate-400'
        }`}>
          <span className={`uppercase font-black text-2xs tracking-widest ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>Emissão do Extrato - {formatDateBR(selectedStatement.statementDate)}</span>
          <span className="text-3xs italic font-mono">Autenticação Digital: IMOB-REPASSE-{selectedStatement.statementNumber}-{selectedStatement.dueDate.replace(/-/g, '')}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6" id="statements-tab-container">
      {/* Top action bar */}
      <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 p-4 rounded-xl border shadow-sm transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="statement-header-bar">
        <div>
          <h2 className={`text-lg font-bold flex items-center gap-2 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
            <FileText className="w-5 h-5 text-emerald-500" />
            Extratos da Imobiliária ({statements.length})
          </h2>
          <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
            Lance e confira os demonstrativos mensais emitidos pela imobiliária para cruzar com o orçamento pessoal.
          </p>
        </div>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto">
          <button 
            onClick={openAddStatement}
            className="flex items-center justify-center gap-1.5 text-xs font-bold bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm w-full sm:w-auto cursor-pointer"
            id="register-statement-btn"
          >
            <Plus className="w-4 h-4" /> Lançar Novo Extrato
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6" id="statements-split-view">
        {/* Sidebar list of statements */}
        <div className={`rounded-xl border shadow-sm p-4 h-fit lg:col-span-1 space-y-3 transition-colors duration-200 ${
          theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
        }`} id="statements-list-box">
          <span className={`text-xs font-bold uppercase tracking-wider block border-b pb-1.5 mb-2 transition-colors ${
            theme === 'dark' ? 'text-slate-400 border-slate-800' : 'text-slate-400 border-slate-50'
          }`}>Histórico de Extratos</span>
          {statements.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm italic">
              Nenhum extrato lançado ainda.
            </div>
          ) : (
            <div className="space-y-2 max-h-[450px] overflow-y-auto pr-1" id="statements-scroller">
              {statements.map(s => {
                const contract = contracts.find(c => c.id === s.contractId);
                const property = contract ? properties.find(p => p.id === contract.propertyId) : null;
                const netAmount = s.rentAmount - s.adminFee;
                const isSelected = selectedStatementId === s.id;
                
                let listItemStyle = "";
                if (isSelected) {
                  listItemStyle = theme === 'dark'
                    ? 'border-emerald-500 bg-emerald-950/30 shadow-xs'
                    : 'border-emerald-500 bg-emerald-50/50 shadow-xs';
                } else {
                  listItemStyle = theme === 'dark'
                    ? 'border-slate-800 hover:bg-slate-800/50'
                    : 'border-slate-100 hover:bg-slate-50/50';
                }

                return (
                  <div
                    key={s.id}
                    onClick={() => setSelectedStatementId(s.id)}
                    className={`p-3 rounded-lg border text-left cursor-pointer transition-all ${listItemStyle}`}
                    id={`statement-list-item-${s.id}`}
                  >
                    <div className="flex justify-between items-center">
                      <span className={`font-bold text-xs font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>Extrato Nº {s.statementNumber}</span>
                      <span className={`text-2xs font-extrabold px-1.5 py-0.5 rounded ${
                        s.status === 'Recebido'
                          ? (theme === 'dark' ? 'bg-emerald-950/80 text-emerald-400' : 'bg-emerald-100 text-emerald-800')
                          : (theme === 'dark' ? 'bg-amber-950/80 text-amber-400' : 'bg-amber-100 text-amber-800')
                      }`}>
                        {s.status}
                      </span>
                    </div>
                    <p className={`text-2xs truncate mt-1 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                      {property ? `${property.address}, ${property.number}` : 'Imóvel'}
                    </p>
                    <div className={`flex justify-between items-end mt-2 pt-1 border-t text-2xs transition-colors ${
                      theme === 'dark' ? 'border-slate-800' : 'border-slate-50'
                    }`}>
                      <span className="text-slate-400">Venc: {formatDateBR(s.dueDate)}</span>
                      <span className={`font-extrabold font-mono ${theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}`}>{formatCurrency(netAmount)}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Detailed Interactive Sheet Replica */}
        <div className="lg:col-span-3 space-y-4" id="statement-detail-viewport">
          {selectedStatement ? (
            <div className="space-y-4" id="statement-active-wrapper">
              {/* Toolbar */}
              <div className={`flex justify-between items-center p-3 rounded-lg border transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-600'
              }`} id="statement-toolbar">
                <span className="text-xs font-medium">
                  Visualização: <strong>Extrato Oficial da Imobiliária</strong>
                </span>
                <div className="flex gap-2">
                  {selectedStatement.status === 'Pendente' ? (
                    <button 
                      onClick={() => {
                        const todayStr = new Date().toISOString().substring(0, 10);
                        const pDate = prompt("Digite a data do recebimento (AAAA-MM-DD) ou deixe vazio para hoje:", todayStr);
                        if (pDate !== null) {
                          updateStatement({
                            ...selectedStatement,
                            status: 'Recebido',
                            paymentDate: pDate || todayStr
                          });
                        }
                      }}
                      className="flex items-center gap-1 bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-emerald-700 transition-colors shadow-xs cursor-pointer"
                      id="mark-received-btn"
                    >
                      <Check className="w-3.5 h-3.5" /> Confirmar Recebimento
                    </button>
                  ) : (
                    <button 
                      onClick={() => {
                        if (confirm("Deseja marcar este extrato de volta para Pendente?")) {
                          updateStatement({
                            ...selectedStatement,
                            status: 'Pendente',
                            paymentDate: null
                          });
                        }
                      }}
                      className="flex items-center gap-1 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded hover:bg-amber-600 transition-colors shadow-xs cursor-pointer"
                      id="mark-pending-btn"
                    >
                      <Clock className="w-3.5 h-3.5" /> Voltar para Pendente
                    </button>
                  )}
                  <button 
                    onClick={() => {
                      if (confirm("Excluir este extrato do histórico?")) {
                        deleteStatement(selectedStatement.id);
                        setSelectedStatementId(statements.filter(s => s.id !== selectedStatement.id)[0]?.id || null);
                      }
                    }}
                    className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded transition-colors cursor-pointer ${
                      theme === 'dark' 
                        ? 'bg-red-950/40 border border-red-900/30 text-red-400 hover:bg-red-900/20' 
                        : 'bg-rose-50 text-rose-600 hover:bg-rose-100'
                    }`}
                    id="delete-statement-btn"
                  >
                    <Trash2 className="w-3.5 h-3.5" /> Excluir
                  </button>
                </div>
              </div>

              {/* Replica Component */}
              {renderStatementReplica()}
            </div>
          ) : (
            <div className={`border rounded-xl p-16 text-center italic shadow-sm transition-colors duration-200 ${
              theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-100 text-slate-500'
            }`} id="empty-statement-detail-state">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <p className="text-base font-semibold">Nenhum extrato selecionado</p>
              <p className="text-xs text-slate-400 mt-1">Selecione um extrato na barra lateral ou cadastre um novo demonstrativo.</p>
            </div>
          )}
        </div>
      </div>

      {/* Modal: Add Statement Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="statement-form-modal">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-xl border max-h-[90vh] overflow-y-auto animate-scale-up space-y-4 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`font-sans font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                Lançar Novo Extrato da Imobiliária
              </h3>
              <button 
                onClick={() => setShowForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                id="close-statement-form"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveStatement} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Selecione o Contrato (Imóvel / Inquilino)*</label>
                <select 
                  value={formContractId} 
                  onChange={e => handleContractChange(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 text-white' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                  }`}
                  required
                  id="form-contract-id"
                >
                  {contracts.map(c => {
                    const prop = properties.find(p => p.id === c.propertyId);
                    return (
                      <option key={c.id} value={c.id}>
                        {prop ? `${prop.address}, ${prop.number}` : 'Imóvel'} (Inquilino: {c.tenantName})
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Número do Extrato*</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 10420"
                    value={formNumber} 
                    onChange={e => setFormNumber(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data de Emissão*</label>
                  <input 
                    type="date" 
                    value={formStatementDate} 
                    onChange={e => setFormStatementDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className={`p-3.5 rounded-xl border space-y-2 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-950/40 border-slate-800' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-2xs font-bold text-slate-400 uppercase tracking-wide block">Período de Referência do Aluguel</span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Início do Período*</label>
                    <input 
                      type="date" 
                      value={formPeriodStart} 
                      onChange={e => setFormPeriodStart(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                      required
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Fim do Período*</label>
                    <input 
                      type="date" 
                      value={formPeriodEnd} 
                      onChange={e => setFormPeriodEnd(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-1 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                      required
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Aluguel Bruto (R$)</label>
                  <input 
                    type="number" 
                    value={formRentAmount || ''} 
                    onChange={e => setFormRentAmount(Number(e.target.value))}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Taxa Imobiliária (R$)</label>
                  <input 
                    type="number" 
                    value={formAdminFee || ''} 
                    onChange={e => setFormAdminFee(Number(e.target.value))}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data do Vencimento*</label>
                  <input 
                    type="date" 
                    value={formDueDate} 
                    onChange={e => setFormDueDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Status do Repasse*</label>
                  <select 
                    value={formStatus} 
                    onChange={e => setFormStatus(e.target.value as any)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    id="form-status"
                  >
                    <option value="Pendente">Pendente</option>
                    <option value="Recebido">Recebido</option>
                  </select>
                </div>
                {formStatus === 'Recebido' && (
                  <div>
                    <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Data do Recebimento*</label>
                    <input 
                      type="date" 
                      value={formPaymentDate} 
                      onChange={e => setFormPaymentDate(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                      required
                    />
                  </div>
                )}
              </div>

              <div className={`flex gap-2 justify-end pt-3 border-t ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button 
                  type="button"
                  onClick={() => setShowForm(false)}
                  className={`text-xs font-bold px-4 py-2 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'dark' 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Cancelar
                </button>
                <button 
                  type="submit"
                  className="bg-emerald-600 text-white text-xs font-bold px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm cursor-pointer"
                >
                  Salvar Extrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
