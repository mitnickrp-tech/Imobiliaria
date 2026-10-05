/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Property, RentContract, RentStatement, PersonalExpense, User } from '../types';

export const DEMO_USERS: (User & { password: string })[] = [
  {
    id: 'user-admin-1',
    name: 'Gestor Imobiliário',
    email: 'admin@imobiliaria.com',
    role: 'admin',
    password: 'senha123'
  },
  {
    id: 'user-prop-1',
    name: 'Maria de Lourdes Silva',
    email: 'proprietaria@exemplo.com',
    role: 'proprietario',
    password: 'senha123'
  }
];

interface RentManagerContextType {
  currentUser: User | null;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  quickLogin: (role: 'admin' | 'proprietario') => void;
  logout: () => void;

  properties: Property[];
  contracts: RentContract[];
  statements: RentStatement[];
  expenses: PersonalExpense[];
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  
  addProperty: (property: Omit<Property, 'id'>) => string;
  updateProperty: (property: Property) => void;
  deleteProperty: (id: string) => void;
  
  addContract: (contract: Omit<RentContract, 'id'>) => string;
  updateContract: (contract: RentContract) => void;
  deleteContract: (id: string) => void;
  
  addStatement: (statement: Omit<RentStatement, 'id'>) => string;
  updateStatement: (statement: RentStatement) => void;
  deleteStatement: (id: string) => void;
  
  addExpense: (expense: Omit<PersonalExpense, 'id'>) => string;
  updateExpense: (expense: PersonalExpense) => void;
  deleteExpense: (id: string) => void;
  
  resetToMockData: () => void;
  clearAllData: () => void;
  exportData: () => string;
  importData: (dataStr: string) => boolean;
  generateSqlDump: () => string;
}

const RentManagerContext = createContext<RentManagerContextType | undefined>(undefined);

// 100% Fictitious Initial Data for GitHub Demonstration
const initialProperties: Property[] = [
  {
    id: 'prop-1',
    address: 'Rua dos Girassóis',
    number: '142',
    neighborhood: 'Jardim Europa',
    city: 'Campinas',
    state: 'SP',
    cep: '13025-000'
  },
  {
    id: 'prop-2',
    address: 'Avenida Central',
    number: '850',
    neighborhood: 'Centro',
    city: 'Campinas',
    state: 'SP',
    cep: '13010-100'
  },
  {
    id: 'prop-3',
    address: 'Rua das Acácias',
    number: '77',
    neighborhood: 'Vila Primavera',
    city: 'Campinas',
    state: 'SP',
    cep: '13040-200'
  }
];

const initialContracts: RentContract[] = [
  {
    id: 'cont-1',
    propertyId: 'prop-1',
    contractCode: 'LOC-2025-01',
    tenantName: 'Lucas Gabriel Ferreira',
    startDate: '2025-03-12',
    durationMonths: 36,
    rentAmount: 1800.00,
    adminFeeRate: 10,
    adminFeeAmount: 180.00,
    netPayout: 1620.00,
    lastAdjustmentDate: '2025-03-12',
    nextAdjustmentDate: '2026-03-12',
    landlordName: 'Maria de Lourdes Silva',
    landlordPercent: 100,
    bankName: 'Banco do Brasil S.A. (001)',
    bankAgency: '1234-5',
    bankAccount: '98765-4'
  },
  {
    id: 'cont-2',
    propertyId: 'prop-2',
    contractCode: 'LOC-2024-88',
    tenantName: 'Mariana Costa Santos',
    startDate: '2024-06-01',
    durationMonths: 30,
    rentAmount: 2400.00,
    adminFeeRate: 8,
    adminFeeAmount: 192.00,
    netPayout: 2208.00,
    lastAdjustmentDate: '2025-06-01',
    nextAdjustmentDate: '2026-06-01',
    landlordName: 'Maria de Lourdes Silva',
    landlordPercent: 100,
    bankName: 'Banco do Brasil S.A. (001)',
    bankAgency: '1234-5',
    bankAccount: '98765-4'
  },
  {
    id: 'cont-3',
    propertyId: 'prop-3',
    contractCode: 'LOC-2025-14',
    tenantName: 'Rafael Silveira Ramos',
    startDate: '2025-01-15',
    durationMonths: 24,
    rentAmount: 1450.00,
    adminFeeRate: 10,
    adminFeeAmount: 145.00,
    netPayout: 1305.00,
    lastAdjustmentDate: '2025-01-15',
    nextAdjustmentDate: '2026-01-15',
    landlordName: 'Maria de Lourdes Silva',
    landlordPercent: 100,
    bankName: 'Banco do Brasil S.A. (001)',
    bankAgency: '1234-5',
    bankAccount: '98765-4'
  }
];

const initialStatements: RentStatement[] = [
  {
    id: 'stat-1',
    contractId: 'cont-1',
    statementNumber: '10420',
    periodStart: '2026-05-12',
    periodEnd: '2026-06-11',
    dueDate: '2026-06-15',
    rentAmount: 1800.00,
    adminFee: 180.00,
    netAmount: 1620.00,
    status: 'Recebido',
    paymentDate: '2026-06-14',
    statementDate: '2026-06-05'
  },
  {
    id: 'stat-2',
    contractId: 'cont-2',
    statementNumber: '10421',
    periodStart: '2026-05-01',
    periodEnd: '2026-05-31',
    dueDate: '2026-06-10',
    rentAmount: 2400.00,
    adminFee: 192.00,
    netAmount: 2208.00,
    status: 'Recebido',
    paymentDate: '2026-06-09',
    statementDate: '2026-06-02'
  },
  {
    id: 'stat-3',
    contractId: 'cont-3',
    statementNumber: '10422',
    periodStart: '2026-05-15',
    periodEnd: '2026-06-14',
    dueDate: '2026-06-20',
    rentAmount: 1450.00,
    adminFee: 145.00,
    netAmount: 1305.00,
    status: 'Pendente',
    paymentDate: null,
    statementDate: '2026-06-08'
  },
  {
    id: 'stat-4',
    contractId: 'cont-1',
    statementNumber: '10385',
    periodStart: '2026-04-12',
    periodEnd: '2026-05-11',
    dueDate: '2026-05-15',
    rentAmount: 1800.00,
    adminFee: 180.00,
    netAmount: 1620.00,
    status: 'Recebido',
    paymentDate: '2026-05-14',
    statementDate: '2026-05-05'
  }
];

const initialExpenses: PersonalExpense[] = [
  {
    id: 'exp-1',
    description: 'Plano de Saúde Familiar',
    amount: 720.00,
    dueDate: '2026-06-15',
    category: 'Saúde',
    status: 'Pago',
    paymentDate: '2026-06-14'
  },
  {
    id: 'exp-2',
    description: 'Energia Elétrica (CPFL)',
    amount: 245.80,
    dueDate: '2026-06-18',
    category: 'Moradia',
    status: 'Pago',
    paymentDate: '2026-06-17'
  },
  {
    id: 'exp-3',
    description: 'Supermercado e Feira',
    amount: 980.50,
    dueDate: '2026-06-10',
    category: 'Alimentação',
    status: 'Pago',
    paymentDate: '2026-06-09'
  },
  {
    id: 'exp-4',
    description: 'Água e Saneamento',
    amount: 98.40,
    dueDate: '2026-06-22',
    category: 'Moradia',
    status: 'Pendente',
    paymentDate: null
  },
  {
    id: 'exp-5',
    description: 'Internet Fibra 500MB',
    amount: 129.90,
    dueDate: '2026-06-10',
    category: 'Lazer/Tecnologia',
    status: 'Pago',
    paymentDate: '2026-06-10'
  },
  {
    id: 'exp-6',
    description: 'Medicamentos e Farmácia',
    amount: 145.00,
    dueDate: '2026-06-25',
    category: 'Saúde',
    status: 'Pendente',
    paymentDate: null
  }
];

export const RentManagerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [contracts, setContracts] = useState<RentContract[]>([]);
  const [statements, setStatements] = useState<RentStatement[]>([]);
  const [expenses, setExpenses] = useState<PersonalExpense[]>([]);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from local storage on mount
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('imob_session_user');
      const storedProps = localStorage.getItem('imob_properties_v2');
      const storedContracts = localStorage.getItem('imob_contracts_v2');
      const storedStatements = localStorage.getItem('imob_statements_v2');
      const storedExpenses = localStorage.getItem('imob_expenses_v2');
      const storedTheme = localStorage.getItem('imob_theme_v2') as 'dark' | 'light';

      if (storedUser) {
        try {
          setCurrentUser(JSON.parse(storedUser));
        } catch {
          setCurrentUser(DEMO_USERS[0]);
        }
      } else {
        // Automatically start with demo admin user so it's ready, but user can log out to test login
        setCurrentUser(DEMO_USERS[0]);
      }

      if (storedProps) setProperties(JSON.parse(storedProps));
      else setProperties(initialProperties);

      if (storedContracts) setContracts(JSON.parse(storedContracts));
      else setContracts(initialContracts);

      if (storedStatements) setStatements(JSON.parse(storedStatements));
      else setStatements(initialStatements);

      if (storedExpenses) setExpenses(JSON.parse(storedExpenses));
      else setExpenses(initialExpenses);

      // Dark mode as default!
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme('dark');
      }
    } catch (e) {
      console.error("Error loading data from localStorage", e);
      setProperties(initialProperties);
      setContracts(initialContracts);
      setStatements(initialStatements);
      setExpenses(initialExpenses);
      setTheme('dark');
      setCurrentUser(DEMO_USERS[0]);
    }
    setIsLoaded(true);
  }, []);

  // Save to local storage when state changes
  useEffect(() => {
    if (!isLoaded) return;
    try {
      if (currentUser) {
        localStorage.setItem('imob_session_user', JSON.stringify(currentUser));
      } else {
        localStorage.removeItem('imob_session_user');
      }
      localStorage.setItem('imob_properties_v2', JSON.stringify(properties));
      localStorage.setItem('imob_contracts_v2', JSON.stringify(contracts));
      localStorage.setItem('imob_statements_v2', JSON.stringify(statements));
      localStorage.setItem('imob_expenses_v2', JSON.stringify(expenses));
      localStorage.setItem('imob_theme_v2', theme);
    } catch (e) {
      console.error("Error saving data to localStorage", e);
    }
  }, [currentUser, properties, contracts, statements, expenses, theme, isLoaded]);

  // Auth methods
  const login = (email: string, pass: string) => {
    const found = DEMO_USERS.find(
      u => u.email.toLowerCase() === email.trim().toLowerCase() && u.password === pass
    );

    if (found) {
      const userObj: User = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role
      };
      setCurrentUser(userObj);
      return { success: true };
    }

    // Allow flexible test login for any email with password "senha123"
    if (pass === 'senha123' && email.includes('@')) {
      const newUser: User = {
        id: 'user-' + Date.now(),
        name: email.split('@')[0].toUpperCase(),
        email: email.trim(),
        role: 'proprietario'
      };
      setCurrentUser(newUser);
      return { success: true };
    }

    return { 
      success: false, 
      message: 'E-mail ou senha inválidos. Utilize admin@imobiliaria.com com senha123.' 
    };
  };

  const quickLogin = (role: 'admin' | 'proprietario') => {
    const user = DEMO_USERS.find(u => u.role === role) || DEMO_USERS[0];
    setCurrentUser({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // CRUD Properties
  const addProperty = (newProp: Omit<Property, 'id'>) => {
    const id = 'prop-' + Date.now();
    setProperties(prev => [...prev, { ...newProp, id }]);
    return id;
  };

  const updateProperty = (updated: Property) => {
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  const deleteProperty = (id: string) => {
    setProperties(prev => prev.filter(p => p.id !== id));
    const affectedContracts = contracts.filter(c => c.propertyId === id);
    const affectedContractIds = affectedContracts.map(c => c.id);
    
    setContracts(prev => prev.filter(c => c.propertyId !== id));
    setStatements(prev => prev.filter(s => !affectedContractIds.includes(s.contractId)));
  };

  // CRUD Contracts
  const addContract = (newCont: Omit<RentContract, 'id'>) => {
    const id = 'cont-' + Date.now();
    setContracts(prev => [...prev, { ...newCont, id }]);
    return id;
  };

  const updateContract = (updated: RentContract) => {
    setContracts(prev => prev.map(c => c.id === updated.id ? updated : c));
  };

  const deleteContract = (id: string) => {
    setContracts(prev => prev.filter(c => c.id !== id));
    setStatements(prev => prev.filter(s => s.contractId !== id));
  };

  // CRUD Statements
  const addStatement = (newStat: Omit<RentStatement, 'id'>) => {
    const id = 'stat-' + Date.now();
    setStatements(prev => [...prev, { ...newStat, id }]);
    return id;
  };

  const updateStatement = (updated: RentStatement) => {
    setStatements(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  const deleteStatement = (id: string) => {
    setStatements(prev => prev.filter(s => s.id !== id));
  };

  // CRUD Expenses
  const addExpense = (newExp: Omit<PersonalExpense, 'id'>) => {
    const id = 'exp-' + Date.now();
    setExpenses(prev => [...prev, { ...newExp, id }]);
    return id;
  };

  const updateExpense = (updated: PersonalExpense) => {
    setExpenses(prev => prev.map(e => e.id === updated.id ? updated : e));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(e => e.id !== id));
  };

  // Utilities
  const resetToMockData = () => {
    setProperties(initialProperties);
    setContracts(initialContracts);
    setStatements(initialStatements);
    setExpenses(initialExpenses);
  };

  const clearAllData = () => {
    setProperties([]);
    setContracts([]);
    setStatements([]);
    setExpenses([]);
  };

  const exportData = () => {
    const exportObj = {
      properties,
      contracts,
      statements,
      expenses,
      exportDate: new Date().toISOString()
    };
    return JSON.stringify(exportObj, null, 2);
  };

  const importData = (dataStr: string) => {
    try {
      const parsed = JSON.parse(dataStr);
      if (parsed.properties && Array.isArray(parsed.properties)) {
        setProperties(parsed.properties);
      }
      if (parsed.contracts && Array.isArray(parsed.contracts)) {
        setContracts(parsed.contracts);
      }
      if (parsed.statements && Array.isArray(parsed.statements)) {
        setStatements(parsed.statements);
      }
      if (parsed.expenses && Array.isArray(parsed.expenses)) {
        setExpenses(parsed.expenses);
      }
      return true;
    } catch (e) {
      console.error("Failed to import JSON data", e);
      return false;
    }
  };

  // Generate dynamic MySQL dump containing the live data
  const generateSqlDump = () => {
    const lines: string[] = [
      '--',
      '-- DUMP DO BANCO DE DADOS MYSQL: SISTEMA DE GESTÃO DE IMÓVEIS & DESPESAS',
      `-- Gerado em: ${new Date().toISOString()}`,
      '--',
      'SET FOREIGN_KEY_CHECKS = 0;',
      'TRUNCATE TABLE extratos_repasse;',
      'TRUNCATE TABLE contratos;',
      'TRUNCATE TABLE propriedades;',
      'TRUNCATE TABLE despesas_pessoais;',
      'TRUNCATE TABLE usuarios;',
      '',
      '-- Inserindo Usuários',
      `INSERT INTO usuarios (id, nome, email, senha_hash, cargo, criado_em) VALUES`,
      `  (1, 'Gestor Imobiliário', 'admin@imobiliaria.com', '$2y$10$eO1eKqJ8H6aR4vI2sV6zReZ999demoAdminHash', 'admin', NOW()),`,
      `  (2, 'Maria de Lourdes Silva', 'proprietaria@exemplo.com', '$2y$10$eO1eKqJ8H6aR4vI2sV6zReZ999demoPropHash', 'proprietario', NOW());`,
      '',
      '-- Inserindo Imóveis (Propriedades)'
    ];

    if (properties.length > 0) {
      const propValues = properties.map((p, idx) => {
        const idNum = idx + 1;
        return `  (${idNum}, '${p.address.replace(/'/g, "''")}', '${p.number}', '${p.neighborhood.replace(/'/g, "''")}', '${p.city.replace(/'/g, "''")}', '${p.state}', '${p.cep}')`;
      }).join(',\n');
      lines.push(`INSERT INTO propriedades (id, endereco, numero, bairro, cidade, uf, cep) VALUES\n${propValues};`);
    }

    lines.push('', '-- Inserindo Contratos de Locação');
    if (contracts.length > 0) {
      const contValues = contracts.map((c, idx) => {
        const idNum = idx + 1;
        const propIdx = properties.findIndex(p => p.id === c.propertyId);
        const propIdNum = propIdx >= 0 ? propIdx + 1 : 1;
        return `  (${idNum}, ${propIdNum}, '${c.contractCode}', '${c.tenantName.replace(/'/g, "''")}', '${c.startDate}', ${c.durationMonths}, ${c.rentAmount.toFixed(2)}, ${c.adminFeeRate.toFixed(2)}, ${c.adminFeeAmount.toFixed(2)}, ${c.netPayout.toFixed(2)}, '${c.lastAdjustmentDate}', '${c.nextAdjustmentDate}', '${c.landlordName.replace(/'/g, "''")}', '${c.bankName.replace(/'/g, "''")}', '${c.bankAgency}', '${c.bankAccount}')`;
      }).join(',\n');
      lines.push(`INSERT INTO contratos (id, propriedade_id, codigo_contrato, inquilino_nome, data_inicio, duracao_meses, valor_aluguel, taxa_administracao_perc, taxa_administracao_valor, repasse_liquido, data_ultimo_reajuste, data_proximo_reajuste, proprietario_nome, banco_nome, banco_agencia, banco_conta) VALUES\n${contValues};`);
    }

    lines.push('', '-- Inserindo Extratos de Repasse da Imobiliária');
    if (statements.length > 0) {
      const statValues = statements.map((s, idx) => {
        const idNum = idx + 1;
        const contIdx = contracts.findIndex(c => c.id === s.contractId);
        const contIdNum = contIdx >= 0 ? contIdx + 1 : 1;
        const payDate = s.paymentDate ? `'${s.paymentDate}'` : 'NULL';
        return `  (${idNum}, ${contIdNum}, '${s.statementNumber}', '${s.periodStart}', '${s.periodEnd}', '${s.dueDate}', ${s.rentAmount.toFixed(2)}, ${s.adminFee.toFixed(2)}, ${s.netAmount.toFixed(2)}, '${s.status}', ${payDate}, '${s.statementDate}')`;
      }).join(',\n');
      lines.push(`INSERT INTO extratos_repasse (id, contrato_id, numero_extrato, periodo_inicio, periodo_fim, data_vencimento, valor_aluguel, taxa_administracao, valor_liquido, status_pagamento, data_pagamento, data_extrato) VALUES\n${statValues};`);
    }

    lines.push('', '-- Inserindo Despesas Pessoais');
    if (expenses.length > 0) {
      const expValues = expenses.map((e, idx) => {
        const idNum = idx + 1;
        const payDate = e.paymentDate ? `'${e.paymentDate}'` : 'NULL';
        return `  (${idNum}, '${e.description.replace(/'/g, "''")}', ${e.amount.toFixed(2)}, '${e.dueDate}', '${e.category}', '${e.status}', ${payDate})`;
      }).join(',\n');
      lines.push(`INSERT INTO despesas_pessoais (id, descricao, valor, data_vencimento, categoria, status_pagamento, data_pagamento) VALUES\n${expValues};`);
    }

    lines.push('', 'SET FOREIGN_KEY_CHECKS = 1;', '-- Fim do Dump.');
    return lines.join('\n');
  };

  return (
    <RentManagerContext.Provider value={{
      currentUser,
      login,
      quickLogin,
      logout,
      properties,
      contracts,
      statements,
      expenses,
      theme,
      setTheme,
      addProperty,
      updateProperty,
      deleteProperty,
      addContract,
      updateContract,
      deleteContract,
      addStatement,
      updateStatement,
      deleteStatement,
      addExpense,
      updateExpense,
      deleteExpense,
      resetToMockData,
      clearAllData,
      exportData,
      importData,
      generateSqlDump
    }}>
      {children}
    </RentManagerContext.Provider>
  );
};

export const useRentManager = () => {
  const context = useContext(RentManagerContext);
  if (context === undefined) {
    throw new Error('useRentManager must be used within a RentManagerProvider');
  }
  return context;
};
