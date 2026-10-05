/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRentManager } from '../context/RentManagerContext';
import { Property, RentContract } from '../types';
import { 
  Home, 
  User, 
  DollarSign, 
  Calendar, 
  Trash2, 
  Edit3, 
  Plus, 
  X, 
  Check, 
  Percent, 
  CreditCard 
} from 'lucide-react';

export default function PropertyTab() {
  const { 
    properties, 
    contracts, 
    theme,
    addProperty, 
    updateProperty, 
    deleteProperty,
    addContract,
    updateContract,
    deleteContract
  } = useRentManager();

  // Selected property for detailed view or action
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(properties[0]?.id || null);

  // Modals / forms states
  const [showPropForm, setShowPropForm] = useState(false);
  const [editingProperty, setEditingProperty] = useState<Property | null>(null);

  const [showContForm, setShowContForm] = useState(false);
  const [editingContract, setEditingContract] = useState<RentContract | null>(null);

  // Property form state
  const [propAddress, setPropAddress] = useState('');
  const [propNumber, setPropNumber] = useState('');
  const [propNeighborhood, setPropNeighborhood] = useState('');
  const [propCity, setPropCity] = useState('Campinas');
  const [propState, setPropState] = useState('SP');
  const [propCep, setPropCep] = useState('');

  // Contract form state
  const [contCode, setContCode] = useState('');
  const [contTenant, setContTenant] = useState('');
  const [contStartDate, setContStartDate] = useState('');
  const [contDuration, setContDuration] = useState(12);
  const [contRent, setContRent] = useState(0);
  const [contFeeRate, setContFeeRate] = useState(10); // Default 10%
  const [contLastAdjust, setContLastAdjust] = useState('');
  const [contNextAdjust, setContNextAdjust] = useState('');
  const [contLandlord, setContLandlord] = useState('Maria de Lourdes Silva');
  const [contBankName, setContBankName] = useState('Banco do Brasil S.A. (001)');
  const [contBankAgency, setContBankAgency] = useState('1234-5');
  const [contBankAccount, setContBankAccount] = useState('98765-4');

  // Handle open property form for creating
  const openAddProperty = () => {
    setEditingProperty(null);
    setPropAddress('');
    setPropNumber('');
    setPropNeighborhood('');
    setPropCity('Campinas');
    setPropState('SP');
    setPropCep('');
    setShowPropForm(true);
  };

  // Handle open property form for editing
  const openEditProperty = (prop: Property) => {
    setEditingProperty(prop);
    setPropAddress(prop.address);
    setPropNumber(prop.number);
    setPropNeighborhood(prop.neighborhood);
    setPropCity(prop.city);
    setPropState(prop.state);
    setPropCep(prop.cep);
    setShowPropForm(true);
  };

  // Save property
  const savePropertyForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!propAddress || !propNumber || !propNeighborhood) {
      alert("Por favor, preencha o endereço, número e bairro.");
      return;
    }

    const payload = {
      address: propAddress,
      number: propNumber,
      neighborhood: propNeighborhood,
      city: propCity,
      state: propState,
      cep: propCep
    };

    if (editingProperty) {
      updateProperty({ ...payload, id: editingProperty.id });
    } else {
      const newId = addProperty(payload);
      setSelectedPropertyId(newId);
    }
    setShowPropForm(false);
  };

  // Handle open contract form for creating
  const openAddContract = (propertyId: string) => {
    setEditingContract(null);
    setContCode('');
    setContTenant('');
    
    // Auto fill dates with reasonable defaults
    const todayStr = new Date().toISOString().substring(0, 10);
    setContStartDate(todayStr);
    setContDuration(30);
    setContRent(1800);
    setContFeeRate(10);
    setContLastAdjust(todayStr);
    
    // Default next adjust in 12 months
    const nextY = new Date();
    nextY.setFullYear(nextY.getFullYear() + 1);
    setContNextAdjust(nextY.toISOString().substring(0, 10));
    
    // Prefill fictitious bank info
    setContLandlord('Maria de Lourdes Silva');
    setContBankName('Banco do Brasil S.A. (001)');
    setContBankAgency('1234-5');
    setContBankAccount('98765-4');
    setShowContForm(true);
  };

  // Handle open contract form for editing
  const openEditContract = (cont: RentContract) => {
    setEditingContract(cont);
    setContCode(cont.contractCode);
    setContTenant(cont.tenantName);
    setContStartDate(cont.startDate);
    setContDuration(cont.durationMonths);
    setContRent(cont.rentAmount);
    setContFeeRate(cont.adminFeeRate);
    setContLastAdjust(cont.lastAdjustmentDate);
    setContNextAdjust(cont.nextAdjustmentDate);
    setContLandlord(cont.landlordName);
    setContBankName(cont.bankName);
    setContBankAgency(cont.bankAgency);
    setContBankAccount(cont.bankAccount);
    setShowContForm(true);
  };

  // Save contract
  const saveContractForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPropertyId) return;
    if (!contCode || !contTenant || contRent <= 0) {
      alert("Por favor, preencha o código do contrato, nome do inquilino e o valor do aluguel.");
      return;
    }

    const adminFeeAmount = (contRent * contFeeRate) / 100;
    const netPayout = contRent - adminFeeAmount;

    const payload = {
      propertyId: selectedPropertyId,
      contractCode: contCode,
      tenantName: contTenant,
      startDate: contStartDate,
      durationMonths: Number(contDuration),
      rentAmount: Number(contRent),
      adminFeeRate: Number(contFeeRate),
      adminFeeAmount,
      netPayout,
      lastAdjustmentDate: contLastAdjust,
      nextAdjustmentDate: contNextAdjust,
      landlordName: contLandlord,
      landlordPercent: 100,
      bankName: contBankName,
      bankAgency: contBankAgency,
      bankAccount: contBankAccount
    };

    if (editingContract) {
      updateContract({ ...payload, id: editingContract.id });
    } else {
      addContract(payload);
    }
    setShowContForm(false);
  };

  // Format currency
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const selectedProperty = properties.find(p => p.id === selectedPropertyId);
  const propertyContracts = contracts.filter(c => c.propertyId === selectedPropertyId);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" id="properties-container">
      {/* Sidebar: Properties list */}
      <div className={`rounded-2xl border p-4 h-fit space-y-4 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="properties-sidebar">
        <div className={`flex justify-between items-center pb-2 border-b transition-colors duration-200 ${
          theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
        }`}>
          <h3 className={`font-sans font-bold text-base flex items-center gap-2 ${
            theme === 'dark' ? 'text-white' : 'text-slate-800'
          }`}>
            <Home className="w-5 h-5 text-emerald-500" />
            Imóveis Cadastrados ({properties.length})
          </h3>
          <button 
            onClick={openAddProperty}
            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
              theme === 'dark' 
                ? 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/40' 
                : 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
            }`}
            title="Adicionar Imóvel"
            id="add-property-btn"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {properties.length === 0 ? (
          <div className="text-center py-8 text-slate-400 text-sm italic">
            Nenhum imóvel cadastrado ainda. Clique no "+" acima para adicionar!
          </div>
        ) : (
          <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1" id="properties-list">
            {properties.map(p => {
              const activeCont = contracts.find(c => c.propertyId === p.id);
              const isSelected = selectedPropertyId === p.id;
              
              let cardStyle = "";
              if (isSelected) {
                cardStyle = theme === 'dark'
                  ? 'border-emerald-500 bg-emerald-950/35 shadow-xs'
                  : 'border-emerald-500 bg-emerald-50/40 shadow-xs';
              } else {
                cardStyle = theme === 'dark'
                  ? 'border-slate-800 hover:bg-slate-800/40'
                  : 'border-slate-100 hover:bg-slate-50/70';
              }

              return (
                <div 
                  key={p.id}
                  onClick={() => setSelectedPropertyId(p.id)}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all ${cardStyle}`}
                  id={`prop-card-${p.id}`}
                >
                  <span className={`font-bold text-sm block truncate ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                    {p.address}, nº {p.number}
                  </span>
                  <span className={`text-xs block truncate ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                    {p.neighborhood} - {p.city}
                  </span>
                  {activeCont ? (
                    <span className={`inline-flex items-center gap-1 mt-2 text-2xs font-semibold px-2 py-0.5 rounded-full truncate max-w-full ${
                      theme === 'dark' ? 'bg-emerald-950/70 text-emerald-400' : 'bg-emerald-100 text-emerald-800'
                    }`}>
                      <User className="w-2.5 h-2.5" /> Inquilino: {activeCont.tenantName.split(' ')[0]}
                    </span>
                  ) : (
                    <span className={`inline-flex items-center gap-1 mt-2 text-2xs font-semibold px-2 py-0.5 rounded-full ${
                      theme === 'dark' ? 'bg-slate-800 text-slate-400' : 'bg-slate-100 text-slate-600'
                    }`}>
                      Sem contrato ativo
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Main Content Area: Detailed view of the selected property */}
      <div className={`rounded-2xl border shadow-sm p-6 md:col-span-2 space-y-6 transition-colors duration-200 ${
        theme === 'dark' ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`} id="property-detail-main">
        {selectedProperty ? (
          <>
            {/* Header section with property address and controls */}
            <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b transition-colors duration-200 ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            }`} id="property-detail-header">
              <div>
                <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">Endereço do Imóvel</span>
                <h2 className={`text-xl font-extrabold font-sans mt-0.5 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                  {selectedProperty.address}, nº {selectedProperty.number}
                </h2>
                <p className={`text-sm ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                  {selectedProperty.neighborhood}, {selectedProperty.city} - {selectedProperty.state} {selectedProperty.cep && `| CEP: ${selectedProperty.cep}`}
                </p>
              </div>
              <div className="flex gap-2">
                <button 
                  onClick={() => openEditProperty(selectedProperty)}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'dark' 
                      ? 'border-slate-700 text-slate-300 hover:bg-slate-800' 
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                  id="edit-property-btn-top"
                >
                  <Edit3 className="w-3.5 h-3.5" /> Editar
                </button>
                <button 
                  onClick={() => {
                    if (confirm("Deseja mesmo remover este imóvel? Isso removerá todos os contratos e extratos dele!")) {
                      deleteProperty(selectedProperty.id);
                      setSelectedPropertyId(properties[0]?.id || null);
                    }
                  }}
                  className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-colors cursor-pointer ${
                    theme === 'dark'
                      ? 'border-red-900/40 text-red-400 hover:bg-red-950/20'
                      : 'border-red-200 text-red-600 hover:bg-red-50'
                  }`}
                  id="delete-property-btn-top"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Excluir
                </button>
              </div>
            </div>

            {/* Contracts Section */}
            <div className="space-y-4" id="contracts-block">
              <div className="flex justify-between items-center">
                <h3 className={`font-sans font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>Contrato de Locação Vinculado</h3>
                {propertyContracts.length === 0 && (
                  <button 
                    onClick={() => openAddContract(selectedProperty.id)}
                    className="flex items-center gap-1 text-xs font-bold bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                    id="add-contract-btn"
                  >
                    <Plus className="w-3.5 h-3.5" /> Vincular Contrato
                  </button>
                )}
              </div>

              {propertyContracts.length === 0 ? (
                <div className={`border border-dashed rounded-xl p-8 text-center text-sm transition-colors duration-200 ${
                  theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
                }`} id="empty-contract-state">
                  <User className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="font-semibold">Nenhum contrato ativo para este imóvel</p>
                  <p className="text-xs text-slate-400 mt-1 mb-4">Vincule os dados de inquilino, aluguel e comissão da imobiliária para começar a gerenciar.</p>
                  <button 
                    onClick={() => openAddContract(selectedProperty.id)}
                    className={`text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/40'
                        : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
                    }`}
                    id="add-contract-btn-empty"
                  >
                    Cadastrar Contrato
                  </button>
                </div>
              ) : (
                propertyContracts.map(c => (
                  <div key={c.id} className={`border rounded-2xl p-5 space-y-4 transition-colors duration-200 ${
                    theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
                  }`} id={`contract-card-${c.id}`}>
                    <div className={`flex justify-between items-start pb-3 border-b transition-colors duration-200 ${
                      theme === 'dark' ? 'border-slate-800' : 'border-slate-50'
                    }`} id="contract-card-header">
                      <div>
                        <span className="text-xs text-slate-400 font-bold">Locatário (Inquilino)</span>
                        <h4 className={`text-base font-extrabold flex items-center gap-1.5 mt-0.5 ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}`}>
                          <User className="w-4 h-4 text-emerald-500" />
                          {c.tenantName}
                        </h4>
                        <p className={`text-xs ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                          Código do Contrato: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-700'}>{c.contractCode}</strong> | Proprietária: {c.landlordName}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => openEditContract(c)}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            theme === 'dark' ? 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800' : 'text-slate-500 hover:text-emerald-600 hover:bg-slate-100'
                          }`}
                          title="Editar Contrato"
                          id={`edit-contract-btn-${c.id}`}
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm("Remover este contrato? Os extratos associados também serão apagados!")) {
                              deleteContract(c.id);
                            }
                          }}
                          className={`p-1.5 rounded transition-colors cursor-pointer ${
                            theme === 'dark' ? 'text-slate-400 hover:text-red-400 hover:bg-slate-800' : 'text-slate-500 hover:text-red-600 hover:bg-slate-100'
                          }`}
                          title="Excluir Contrato"
                          id={`delete-contract-btn-${c.id}`}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Financial details of the contract */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4" id="contract-financial-grid">
                      <div className={`p-3.5 rounded-xl border text-center transition-colors duration-200 ${
                        theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80 text-slate-200' : 'bg-slate-50/60 border-slate-100 text-slate-800'
                      }`}>
                        <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider">Aluguel do Contrato</span>
                        <span className="text-lg font-extrabold block mt-1">{formatCurrency(c.rentAmount)}</span>
                      </div>
                      <div className={`p-3.5 rounded-xl border text-center transition-colors duration-200 ${
                        theme === 'dark' ? 'bg-rose-950/20 border-rose-900/35 text-rose-400' : 'bg-rose-50/40 border-rose-100/30 text-rose-600'
                      }`}>
                        <span className="text-2xs font-bold uppercase tracking-wider flex items-center justify-center gap-1">
                          Taxa Adm. ({c.adminFeeRate}%) <Percent className="w-3 h-3" />
                        </span>
                        <span className="text-lg font-extrabold block mt-1">-{formatCurrency(c.adminFeeAmount)}</span>
                      </div>
                      <div className={`p-3.5 rounded-xl border text-center transition-colors duration-200 ${
                        theme === 'dark' ? 'bg-emerald-950/20 border-emerald-900/35 text-emerald-400' : 'bg-emerald-50/50 border-emerald-100/40 text-emerald-700'
                      }`}>
                        <span className="text-2xs font-bold uppercase tracking-wider">Repasse Líquido</span>
                        <span className="text-lg font-extrabold block mt-1">{formatCurrency(c.netPayout)}</span>
                      </div>
                    </div>

                    {/* Contract timing details */}
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs pt-1 ${
                      theme === 'dark' ? 'text-slate-300' : 'text-slate-600'
                    }`} id="contract-timings-grid">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Início do Contrato: <strong>{new Date(c.startDate + 'T12:00:00').toLocaleDateString('pt-BR')}</strong> ({c.durationMonths} meses)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                        <span>Próximo Reajuste: <strong>{new Date(c.nextAdjustmentDate + 'T12:00:00').toLocaleDateString('pt-BR')}</strong></span>
                      </div>
                    </div>

                    {/* Bank Transfer Destination Account */}
                    <div className={`p-3 rounded-xl border flex items-center gap-3 text-xs transition-colors duration-200 ${
                      theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
                    }`} id="contract-bank-details">
                      <div className={`p-2 rounded-lg border transition-colors ${
                        theme === 'dark' ? 'bg-slate-900 border-slate-800 text-slate-300' : 'bg-white border-slate-100 text-slate-600'
                      }`}>
                        <CreditCard className="w-4 h-4 text-emerald-500" />
                      </div>
                      <div>
                        <span className="text-slate-400 font-semibold uppercase tracking-wider text-2xs block">Conta Bancária de Recebimento</span>
                        <p className={`font-medium ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                          {c.bankName} | Agência: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{c.bankAgency}</strong> | C/C: <strong className={theme === 'dark' ? 'text-slate-200' : 'text-slate-800'}>{c.bankAccount}</strong>
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        ) : (
          <div className="text-center py-20 text-slate-400 text-sm italic" id="empty-property-state">
            <Home className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-base font-semibold">Nenhum imóvel selecionado</p>
            <p className="text-xs text-slate-400 mt-1">Selecione um imóvel na lista ao lado ou cadastre um novo.</p>
          </div>
        )}
      </div>

      {/* Modal: Property Form */}
      {showPropForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="property-modal">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-xl border animate-scale-up space-y-4 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`font-sans font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {editingProperty ? 'Editar Imóvel' : 'Cadastrar Novo Imóvel'}
              </h3>
              <button 
                onClick={() => setShowPropForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                id="close-property-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={savePropertyForm} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Rua / Logradouro*</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Rua dos Girassóis"
                    value={propAddress} 
                    onChange={e => setPropAddress(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Número*</label>
                  <input 
                    type="text" 
                    placeholder="Ex: 142"
                    value={propNumber} 
                    onChange={e => setPropNumber(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Bairro*</label>
                <input 
                  type="text" 
                  placeholder="Ex: Jardim Europa"
                  value={propNeighborhood} 
                  onChange={e => setPropNeighborhood(e.target.value)}
                  className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                    theme === 'dark' 
                      ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                      : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Cidade</label>
                  <input 
                    type="text" 
                    value={propCity} 
                    onChange={e => setPropCity(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">CEP</label>
                  <input 
                    type="text" 
                    placeholder="13025-000"
                    value={propCep} 
                    onChange={e => setPropCep(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div className={`flex gap-2 justify-end pt-3 border-t ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button 
                  type="button"
                  onClick={() => setShowPropForm(false)}
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
                  Salvar Imóvel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Contract Form */}
      {showContForm && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 animate-fade-in" id="contract-modal">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-xl border max-h-[90vh] overflow-y-auto animate-scale-up space-y-4 transition-colors duration-200 ${
            theme === 'dark' ? 'bg-slate-900 border-slate-800 text-white' : 'bg-white border-slate-100'
          }`}>
            <div className={`flex justify-between items-center pb-2 border-b ${
              theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
            }`}>
              <h3 className={`font-sans font-bold text-base ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>
                {editingContract ? 'Editar Contrato' : 'Vincular Contrato de Locação'}
              </h3>
              <button 
                onClick={() => setShowContForm(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded cursor-pointer"
                id="close-contract-modal"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={saveContractForm} className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nome do Inquilino*</label>
                  <input 
                    type="text" 
                    placeholder="Ex: Lucas Gabriel Ferreira"
                    value={contTenant} 
                    onChange={e => setContTenant(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Cód. Contrato*</label>
                  <input 
                    type="text" 
                    placeholder="Ex: LOC-2025-01"
                    value={contCode} 
                    onChange={e => setContCode(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Valor do Aluguel (Bruto)*</label>
                  <div className="relative">
                    <span className="absolute left-2.5 top-2 text-xs text-slate-400 font-bold">R$</span>
                    <input 
                      type="number" 
                      placeholder="1800"
                      value={contRent || ''} 
                      onChange={e => setContRent(Number(e.target.value))}
                      className={`w-full border rounded-lg pl-8 pr-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-500' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                      required
                      min="1"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Taxa Imobiliária (%)*</label>
                  <div className="relative">
                    <input 
                      type="number" 
                      placeholder="10"
                      value={contFeeRate} 
                      onChange={e => setContFeeRate(Number(e.target.value))}
                      className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                      required
                      min="0"
                      max="100"
                    />
                  </div>
                </div>
                <div className="col-span-2 sm:col-span-1">
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Repasse Líquido</label>
                  <div className={`border rounded-lg px-3 py-1.5 text-sm font-bold transition-colors ${
                    theme === 'dark' ? 'bg-slate-950/40 border-slate-800 text-slate-300' : 'bg-slate-100 border-slate-200 text-slate-500'
                  }`}>
                    {formatCurrency(contRent - (contRent * contFeeRate) / 100)}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Início do Contrato*</label>
                  <input 
                    type="date" 
                    value={contStartDate} 
                    onChange={e => setContStartDate(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Prazo (Meses)*</label>
                  <input 
                    type="number" 
                    placeholder="36"
                    value={contDuration || ''} 
                    onChange={e => setContDuration(Number(e.target.value))}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                    min="1"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Último Reajuste</label>
                  <input 
                    type="date" 
                    value={contLastAdjust} 
                    onChange={e => setContLastAdjust(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Próximo Reajuste*</label>
                  <input 
                    type="date" 
                    value={contNextAdjust} 
                    onChange={e => setContNextAdjust(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nome do Proprietário</label>
                  <input 
                    type="text" 
                    value={contLandlord} 
                    onChange={e => setContLandlord(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  />
                </div>
              </div>

              {/* Bank Account Sub-form */}
              <div className={`p-4 rounded-xl border space-y-3 transition-colors duration-200 ${
                theme === 'dark' ? 'bg-slate-950/40 border-slate-800/80' : 'bg-slate-50 border-slate-100'
              }`}>
                <span className="text-2xs text-slate-400 font-bold uppercase tracking-wider block">Conta para Depósito do Repasse</span>
                
                <div>
                  <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Nome do Banco</label>
                  <input 
                    type="text" 
                    value={contBankName} 
                    onChange={e => setContBankName(e.target.value)}
                    className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                      theme === 'dark' 
                        ? 'bg-slate-800 border-slate-700 text-white' 
                        : 'bg-white border-slate-200 text-slate-700'
                    }`}
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Agência</label>
                    <input 
                      type="text" 
                      placeholder="1234-5"
                      value={contBankAgency} 
                      onChange={e => setContBankAgency(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    />
                  </div>
                  <div>
                    <label className="text-2xs font-semibold text-slate-500 dark:text-slate-400 block mb-1">Conta Corrente</label>
                    <input 
                      type="text" 
                      placeholder="98765-4"
                      value={contBankAccount} 
                      onChange={e => setContBankAccount(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                        theme === 'dark' 
                          ? 'bg-slate-800 border-slate-700 text-white' 
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    />
                  </div>
                </div>
              </div>

              <div className={`flex gap-2 justify-end pt-3 border-t ${
                theme === 'dark' ? 'border-slate-800' : 'border-slate-100'
              }`}>
                <button 
                  type="button"
                  onClick={() => setShowContForm(false)}
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
                  Salvar Contrato
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
