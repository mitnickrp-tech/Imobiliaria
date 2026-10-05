/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'proprietario';
  avatar?: string;
}

export interface Property {
  id: string;
  address: string;
  number: string;
  neighborhood: string;
  city: string;
  state: string;
  cep: string;
}

export interface RentContract {
  id: string;
  propertyId: string;
  contractCode: string;
  tenantName: string;
  startDate: string;
  durationMonths: number;
  rentAmount: number;
  adminFeeRate: number; // percentage (e.g. 10 for 10%)
  adminFeeAmount: number;
  netPayout: number;
  lastAdjustmentDate: string;
  nextAdjustmentDate: string;
  landlordName: string;
  landlordPercent: number; // percentage (e.g. 100 for 100%)
  bankName: string;
  bankAgency: string;
  bankAccount: string;
}

export interface RentStatement {
  id: string;
  contractId: string;
  statementNumber: string;
  periodStart: string;
  periodEnd: string;
  dueDate: string;
  rentAmount: number;
  adminFee: number;
  netAmount: number;
  status: 'Pendente' | 'Recebido';
  paymentDate: string | null;
  statementDate: string;
}

export interface PersonalExpense {
  id: string;
  description: string;
  amount: number;
  dueDate: string;
  category: string;
  status: 'Pendente' | 'Pago';
  paymentDate: string | null;
}
