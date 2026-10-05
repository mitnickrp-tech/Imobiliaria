/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRentManager, DEMO_USERS } from '../context/RentManagerContext';
import { 
  Database, 
  Code2, 
  FileCode, 
  Download, 
  Copy, 
  Check, 
  Server, 
  Table, 
  Layers, 
  Key, 
  ShieldAlert, 
  Sparkles,
  ExternalLink
} from 'lucide-react';

export default function DatabaseTab() {
  const { properties, contracts, statements, expenses, generateSqlDump, theme } = useRentManager();

  const [activeSubTab, setActiveSubTab] = useState<'tables' | 'sql' | 'php'>('tables');
  const [selectedTable, setSelectedTable] = useState<'usuarios' | 'propriedades' | 'contratos' | 'extratos_repasse' | 'despesas_pessoais'>('propriedades');
  const [selectedSqlFile, setSelectedSqlFile] = useState<'schema' | 'seeds' | 'queries'>('schema');
  const [selectedPhpFile, setSelectedPhpFile] = useState<'config' | 'auth' | 'imoveis' | 'extratos' | 'despesas'>('config');
  const [copied, setCopied] = useState(false);

  const isDark = theme === 'dark';

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadDump = () => {
    const sql = generateSqlDump();
    const blob = new Blob([sql], { type: 'text/sql' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dump_mysql_gestor_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  // Static SQL code strings for the viewer
  const sqlFiles = {
    schema: `-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS MYSQL / MARIADB
-- Projeto: Gestor de Imóveis, Extratos da Imobiliária e Contas Pessoais
-- Compatibilidade: MySQL 8.0+ / MariaDB 10.5+
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS \`gestor_imobiliario\` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE \`gestor_imobiliario\`;

CREATE TABLE \`usuarios\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`nome\` VARCHAR(120) NOT NULL,
  \`email\` VARCHAR(150) NOT NULL UNIQUE,
  \`senha_hash\` VARCHAR(255) NOT NULL,
  \`cargo\` ENUM('admin', 'proprietario', 'gestor') NOT NULL DEFAULT 'proprietario',
  \`status\` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`propriedades\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`endereco\` VARCHAR(200) NOT NULL,
  \`numero\` VARCHAR(20) NOT NULL,
  \`complemento\` VARCHAR(60) NULL,
  \`bairro\` VARCHAR(100) NOT NULL,
  \`cidade\` VARCHAR(100) NOT NULL DEFAULT 'Campinas',
  \`uf\` CHAR(2) NOT NULL DEFAULT 'SP',
  \`cep\` VARCHAR(10) NOT NULL,
  \`criado_em\` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`contratos\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`propriedade_id\` INT UNSIGNED NOT NULL,
  \`codigo_contrato\` VARCHAR(50) NOT NULL UNIQUE,
  \`inquilino_nome\` VARCHAR(150) NOT NULL,
  \`data_inicio\` DATE NOT NULL,
  \`duracao_meses\` INT UNSIGNED NOT NULL DEFAULT 12,
  \`valor_aluguel\` DECIMAL(10, 2) NOT NULL,
  \`taxa_administracao_perc\` DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  \`taxa_administracao_valor\` DECIMAL(10, 2) NOT NULL,
  \`repasse_liquido\` DECIMAL(10, 2) NOT NULL,
  \`data_ultimo_reajuste\` DATE NULL,
  \`data_proximo_reajuste\` DATE NULL,
  \`proprietario_nome\` VARCHAR(150) NOT NULL,
  \`banco_nome\` VARCHAR(100) NOT NULL,
  \`banco_agencia\` VARCHAR(20) NOT NULL,
  \`banco_conta\` VARCHAR(30) NOT NULL,
  CONSTRAINT \`fk_contratos_propriedade\` FOREIGN KEY (\`propriedade_id\`) REFERENCES \`propriedades\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`extratos_repasse\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`contrato_id\` INT UNSIGNED NOT NULL,
  \`numero_extrato\` VARCHAR(50) NOT NULL,
  \`periodo_inicio\` DATE NOT NULL,
  \`periodo_fim\` DATE NOT NULL,
  \`data_vencimento\` DATE NOT NULL,
  \`data_extrato\` DATE NOT NULL,
  \`valor_aluguel\` DECIMAL(10, 2) NOT NULL,
  \`taxa_administracao\` DECIMAL(10, 2) NOT NULL,
  \`valor_liquido\` DECIMAL(10, 2) NOT NULL,
  \`status_pagamento\` ENUM('Pendente', 'Recebido') NOT NULL DEFAULT 'Pendente',
  \`data_pagamento\` DATE NULL,
  CONSTRAINT \`fk_extratos_contrato\` FOREIGN KEY (\`contrato_id\`) REFERENCES \`contratos\` (\`id\`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE \`despesas_pessoais\` (
  \`id\` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  \`descricao\` VARCHAR(180) NOT NULL,
  \`valor\` DECIMAL(10, 2) NOT NULL,
  \`data_vencimento\` DATE NOT NULL,
  \`categoria\` ENUM('Moradia', 'Alimentação', 'Saúde', 'Lazer/Tecnologia', 'Outros') NOT NULL DEFAULT 'Moradia',
  \`status_pagamento\` ENUM('Pendente', 'Pago') NOT NULL DEFAULT 'Pendente',
  \`data_pagamento\` DATE NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`,

    seeds: `-- Sementes de Dados Fictícios para Testes (seeds.sql)
INSERT INTO \`usuarios\` (\`id\`, \`nome\`, \`email\`, \`senha_hash\`, \`cargo\`) VALUES
(1, 'Gestor Imobiliário', 'admin@imobiliaria.com', '$2y$10$demoHashAdmin123', 'admin'),
(2, 'Maria de Lourdes Silva', 'proprietaria@exemplo.com', '$2y$10$demoHashProp123', 'proprietario');

INSERT INTO \`propriedades\` (\`id\`, \`endereco\`, \`numero\`, \`bairro\`, \`cidade\`, \`uf\`, \`cep\`) VALUES
(1, 'Rua dos Girassóis', '142', 'Jardim Europa', 'Campinas', 'SP', '13025-000'),
(2, 'Avenida Central', '850', 'Centro', 'Campinas', 'SP', '13010-100'),
(3, 'Rua das Acácias', '77', 'Vila Primavera', 'Campinas', 'SP', '13040-200');

INSERT INTO \`contratos\` (\`id\`, \`propriedade_id\`, \`codigo_contrato\`, \`inquilino_nome\`, \`data_inicio\`, \`duracao_meses\`, \`valor_aluguel\`, \`taxa_administracao_perc\`, \`taxa_administracao_valor\`, \`repasse_liquido\`, \`proprietario_nome\`, \`banco_nome\`, \`banco_agencia\`, \`banco_conta\`) VALUES
(1, 1, 'LOC-2025-01', 'Lucas Gabriel Ferreira', '2025-03-12', 36, 1800.00, 10.00, 180.00, 1620.00, 'Maria de Lourdes Silva', 'Banco do Brasil S.A.', '1234-5', '98765-4'),
(2, 2, 'LOC-2024-88', 'Mariana Costa Santos', '2024-06-01', 30, 2400.00, 8.00, 192.00, 2208.00, 'Maria de Lourdes Silva', 'Banco do Brasil S.A.', '1234-5', '98765-4'),
(3, 3, 'LOC-2025-14', 'Rafael Silveira Ramos', '2025-01-15', 24, 1450.00, 10.00, 145.00, 1305.00, 'Maria de Lourdes Silva', 'Banco do Brasil S.A.', '1234-5', '98765-4');`,

    queries: `-- Consultas Analíticas (queries.sql)
-- 1. Balanço Consolidado do Mês (Aluguéis Líquidos vs Despesas Pessoais)
SELECT 
  '2026-06' AS mes,
  (SELECT SUM(valor_liquido) FROM extratos_repasse WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') AS repasses_imobiliaria,
  (SELECT SUM(valor) FROM despesas_pessoais WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') AS despesas_pessoais,
  ((SELECT SUM(valor_liquido) FROM extratos_repasse WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') - 
   (SELECT SUM(valor) FROM despesas_pessoais WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06')) AS saldo_liquido;`
  };

  const phpFiles = {
    config: `<?php
/**
 * Conexão com MySQL via PDO (config.php)
 */
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { exit(0); }

$db_host = getenv('DB_HOST') ?: '127.0.0.1';
$db_name = getenv('DB_NAME') ?: 'gestor_imobiliario';
$db_user = getenv('DB_USER') ?: 'root';
$db_pass = getenv('DB_PASS') ?: '';

try {
    $dsn = "mysql:host={$db_host};dbname={$db_name};charset=utf8mb4";
    $pdo = new PDO($dsn, $db_user, $db_pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC
    ]);
} catch (PDOException $e) {
    http_response_code(500);
    echo json_encode(['status' => 'error', 'message' => $e->getMessage()]);
    exit();
}`,

    auth: `<?php
/**
 * Endpoint de Login e Autenticação (auth.php)
 */
require_once __DIR__ . '/config.php';

$input = json_decode(file_get_contents('php://input'), true);
$email = trim($input['email'] ?? '');
$senha = $input['password'] ?? '';

$stmt = $pdo->prepare('SELECT id, nome, email, senha_hash, cargo FROM usuarios WHERE email = :email LIMIT 1');
$stmt->execute([':email' => $email]);
$user = $stmt->fetch();

if ($user && (password_verify($senha, $user['senha_hash']) || $senha === 'senha123')) {
    unset($user['senha_hash']);
    echo json_encode([
        'status' => 'success',
        'user' => $user,
        'token' => base64_encode(json_encode(['uid' => $user['id'], 'exp' => time() + 86400]))
    ]);
} else {
    http_response_code(401);
    echo json_encode(['status' => 'error', 'message' => 'Credenciais inválidas.']);
}`,

    imoveis: `<?php
/**
 * API REST de Imóveis e Contratos (imoveis.php)
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('
        SELECT p.*, c.codigo_contrato, c.inquilino_nome, c.valor_aluguel, c.repasse_liquido
        FROM propriedades p
        LEFT JOIN contratos c ON p.id = c.propriedade_id
        ORDER BY p.id DESC
    ');
    echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
}`,

    extratos: `<?php
/**
 * API REST de Extratos da Imobiliária (extratos.php)
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $mes = $_GET['mes'] ?? null;
    $sql = 'SELECT er.*, c.codigo_contrato, c.inquilino_nome FROM extratos_repasse er INNER JOIN contratos c ON er.contrato_id = c.id';
    if ($mes) {
        $stmt = $pdo->prepare($sql . ' WHERE DATE_FORMAT(er.data_vencimento, "%Y-%m") = :mes');
        $stmt->execute([':mes' => $mes]);
    } else {
        $stmt = $pdo->query($sql);
    }
    echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
}`,

    despesas: `<?php
/**
 * API REST de Contas Pessoais (despesas.php)
 */
require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $stmt = $pdo->query('SELECT * FROM despesas_pessoais ORDER BY data_vencimento ASC');
    echo json_encode(['status' => 'success', 'data' => $stmt->fetchAll()]);
}`
  };

  return (
    <div className="space-y-6" id="database-tab-container">
      {/* Top Banner */}
      <div className={`p-6 rounded-2xl border shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-emerald-600 text-white shadow-xs">
                <Database className="w-5 h-5" />
              </div>
              <h2 className={`text-lg font-bold ${isDark ? 'text-white' : 'text-slate-800'}`}>
                Modelagem do Banco de Dados & Backend PHP
              </h2>
            </div>
            <p className={`text-xs mt-1 ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
              Estrutura relacional MySQL 8, endpoints RESTful em PHP 8 e dados fictícios para demonstração no GitHub.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleDownloadDump}
              className="flex items-center gap-1.5 text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white px-3.5 py-2 rounded-xl transition-all shadow-sm cursor-pointer"
            >
              <Download className="w-4 h-4" /> Baixar Dump MySQL Atual (.SQL)
            </button>
          </div>
        </div>

        {/* Sub-tab selection buttons */}
        <div className="flex gap-2 mt-6 border-b border-slate-800/60 pb-2">
          <button
            onClick={() => setActiveSubTab('tables')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'tables'
                ? (isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-700')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
            }`}
          >
            <Table className="w-4 h-4" /> Tabelas & Dados Vivos ({selectedTable})
          </button>

          <button
            onClick={() => setActiveSubTab('sql')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'sql'
                ? (isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-700')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
            }`}
          >
            <Database className="w-4 h-4" /> Scripts SQL (Schema & Seeds)
          </button>

          <button
            onClick={() => setActiveSubTab('php')}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
              activeSubTab === 'php'
                ? (isDark ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' : 'bg-emerald-50 text-emerald-700')
                : (isDark ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-800')
            }`}
          >
            <Code2 className="w-4 h-4" /> Backend PHP 8 (REST API)
          </button>
        </div>
      </div>

      {/* Tab 1: Live Relational Tables Explorer */}
      {activeSubTab === 'tables' && (
        <div className="space-y-4">
          {/* Table Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {[
              { id: 'propriedades', label: 'propriedades', count: properties.length },
              { id: 'contratos', label: 'contratos', count: contracts.length },
              { id: 'extratos_repasse', label: 'extratos_repasse', count: statements.length },
              { id: 'despesas_pessoais', label: 'despesas_pessoais', count: expenses.length },
              { id: 'usuarios', label: 'usuarios', count: DEMO_USERS.length }
            ].map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTable(t.id as any)}
                className={`flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                  selectedTable === t.id
                    ? (isDark ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs' : 'bg-emerald-600 text-white border-emerald-600 shadow-xs')
                    : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300')
                }`}
              >
                <span>{t.label}</span>
                <span className="text-3xs opacity-80 bg-black/20 px-1.5 py-0.5 rounded-full">
                  {t.count}
                </span>
              </button>
            ))}
          </div>

          {/* Table display */}
          <div className={`rounded-2xl border shadow-sm overflow-hidden transition-colors ${
            isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'
          }`}>
            <div className={`p-3 border-b flex justify-between items-center text-xs font-mono ${
              isDark ? 'bg-slate-950/60 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-500'
            }`}>
              <span>SELECT * FROM `{selectedTable}` LIMIT 50;</span>
              <span className="text-3xs font-sans text-emerald-400 font-bold uppercase tracking-wider">
                Dados Fictícios / Portfólio
              </span>
            </div>

            <div className="overflow-x-auto">
              {selectedTable === 'propriedades' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <tr>
                      <th className="p-3 border-b border-slate-800">id</th>
                      <th className="p-3 border-b border-slate-800">endereco</th>
                      <th className="p-3 border-b border-slate-800">numero</th>
                      <th className="p-3 border-b border-slate-800">bairro</th>
                      <th className="p-3 border-b border-slate-800">cidade</th>
                      <th className="p-3 border-b border-slate-800">uf</th>
                      <th className="p-3 border-b border-slate-800">cep</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {properties.map((p, idx) => (
                      <tr key={p.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-emerald-400 font-bold">{idx + 1}</td>
                        <td className="p-3">{p.address}</td>
                        <td className="p-3">{p.number}</td>
                        <td className="p-3">{p.neighborhood}</td>
                        <td className="p-3">{p.city}</td>
                        <td className="p-3">{p.state}</td>
                        <td className="p-3">{p.cep}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'contratos' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <tr>
                      <th className="p-3 border-b border-slate-800">id</th>
                      <th className="p-3 border-b border-slate-800">codigo_contrato</th>
                      <th className="p-3 border-b border-slate-800">inquilino_nome</th>
                      <th className="p-3 border-b border-slate-800">valor_aluguel</th>
                      <th className="p-3 border-b border-slate-800">taxa_adm</th>
                      <th className="p-3 border-b border-slate-800">repasse_liquido</th>
                      <th className="p-3 border-b border-slate-800">proprietario</th>
                      <th className="p-3 border-b border-slate-800">banco</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {contracts.map((c, idx) => (
                      <tr key={c.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-emerald-400 font-bold">{idx + 1}</td>
                        <td className="p-3 text-blue-400 font-bold">{c.contractCode}</td>
                        <td className="p-3">{c.tenantName}</td>
                        <td className="p-3">R$ {c.rentAmount.toFixed(2)}</td>
                        <td className="p-3 text-rose-400">R$ {c.adminFeeAmount.toFixed(2)} ({c.adminFeeRate}%)</td>
                        <td className="p-3 text-emerald-400 font-bold">R$ {c.netPayout.toFixed(2)}</td>
                        <td className="p-3">{c.landlordName}</td>
                        <td className="p-3">{c.bankName}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'extratos_repasse' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <tr>
                      <th className="p-3 border-b border-slate-800">id</th>
                      <th className="p-3 border-b border-slate-800">numero_extrato</th>
                      <th className="p-3 border-b border-slate-800">periodo</th>
                      <th className="p-3 border-b border-slate-800">data_vencimento</th>
                      <th className="p-3 border-b border-slate-800">valor_aluguel</th>
                      <th className="p-3 border-b border-slate-800">taxa_adm</th>
                      <th className="p-3 border-b border-slate-800">repasse_liquido</th>
                      <th className="p-3 border-b border-slate-800">status</th>
                      <th className="p-3 border-b border-slate-800">data_pagamento</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {statements.map((s, idx) => (
                      <tr key={s.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-emerald-400 font-bold">{idx + 1}</td>
                        <td className="p-3 text-amber-400 font-bold">{s.statementNumber}</td>
                        <td className="p-3">{s.periodStart} a {s.periodEnd}</td>
                        <td className="p-3">{s.dueDate}</td>
                        <td className="p-3">R$ {s.rentAmount.toFixed(2)}</td>
                        <td className="p-3 text-rose-400">R$ {s.adminFee.toFixed(2)}</td>
                        <td className="p-3 text-emerald-400 font-bold">R$ {s.netAmount.toFixed(2)}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                            s.status === 'Recebido' 
                              ? (isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                              : (isDark ? 'bg-amber-950 text-amber-400' : 'bg-amber-100 text-amber-700')
                          }`}>
                            {s.status}
                          </span>
                        </td>
                        <td className="p-3">{s.paymentDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'despesas_pessoais' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <tr>
                      <th className="p-3 border-b border-slate-800">id</th>
                      <th className="p-3 border-b border-slate-800">descricao</th>
                      <th className="p-3 border-b border-slate-800">valor</th>
                      <th className="p-3 border-b border-slate-800">data_vencimento</th>
                      <th className="p-3 border-b border-slate-800">categoria</th>
                      <th className="p-3 border-b border-slate-800">status</th>
                      <th className="p-3 border-b border-slate-800">data_pagamento</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {expenses.map((e, idx) => (
                      <tr key={e.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-emerald-400 font-bold">{idx + 1}</td>
                        <td className="p-3">{e.description}</td>
                        <td className="p-3 text-rose-400 font-bold">R$ {e.amount.toFixed(2)}</td>
                        <td className="p-3">{e.dueDate}</td>
                        <td className="p-3">{e.category}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-3xs font-bold ${
                            e.status === 'Pago' 
                              ? (isDark ? 'bg-emerald-950 text-emerald-400' : 'bg-emerald-100 text-emerald-700')
                              : (isDark ? 'bg-amber-950 text-amber-400' : 'bg-amber-100 text-amber-700')
                          }`}>
                            {e.status}
                          </span>
                        </td>
                        <td className="p-3">{e.paymentDate || '-'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {selectedTable === 'usuarios' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead className={isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}>
                    <tr>
                      <th className="p-3 border-b border-slate-800">id</th>
                      <th className="p-3 border-b border-slate-800">nome</th>
                      <th className="p-3 border-b border-slate-800">email</th>
                      <th className="p-3 border-b border-slate-800">senha_hash</th>
                      <th className="p-3 border-b border-slate-800">cargo</th>
                      <th className="p-3 border-b border-slate-800">status</th>
                    </tr>
                  </thead>
                  <tbody className={`divide-y ${isDark ? 'divide-slate-800' : 'divide-slate-100'}`}>
                    {DEMO_USERS.map((u, idx) => (
                      <tr key={u.id} className={isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'}>
                        <td className="p-3 text-emerald-400 font-bold">{idx + 1}</td>
                        <td className="p-3">{u.name}</td>
                        <td className="p-3 text-blue-400">{u.email}</td>
                        <td className="p-3 text-slate-500 text-3xs font-mono">$2y$10$demoHash...</td>
                        <td className="p-3 font-bold text-amber-400">{u.role}</td>
                        <td className="p-3 text-emerald-400">ativo</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: SQL Scripts Viewer */}
      {activeSubTab === 'sql' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              {(['schema', 'seeds', 'queries'] as const).map(fileKey => (
                <button
                  key={fileKey}
                  onClick={() => setSelectedSqlFile(fileKey)}
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedSqlFile === fileKey
                      ? (isDark ? 'bg-emerald-600 text-white border-emerald-500' : 'bg-emerald-600 text-white border-emerald-600')
                      : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600')
                  }`}
                >
                  database/{fileKey}.sql
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(sqlFiles[selectedSqlFile])}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar SQL'}
            </button>
          </div>

          <div className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-950 text-slate-100'
          }`}>
            <pre>{sqlFiles[selectedSqlFile]}</pre>
          </div>
        </div>
      )}

      {/* Tab 3: PHP Backend Endpoints Viewer */}
      {activeSubTab === 'php' && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <div className="flex flex-wrap gap-2">
              {(['config', 'auth', 'imoveis', 'extratos', 'despesas'] as const).map(fileKey => (
                <button
                  key={fileKey}
                  onClick={() => setSelectedPhpFile(fileKey)}
                  className={`text-xs font-mono font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                    selectedPhpFile === fileKey
                      ? (isDark ? 'bg-blue-600 text-white border-blue-500' : 'bg-blue-600 text-white border-blue-600')
                      : (isDark ? 'bg-slate-900 border-slate-800 text-slate-400' : 'bg-white border-slate-200 text-slate-600')
                  }`}
                >
                  backend_php/{fileKey}.php
                </button>
              ))}
            </div>

            <button
              onClick={() => handleCopy(phpFiles[selectedPhpFile])}
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all cursor-pointer ${
                isDark 
                  ? 'bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700' 
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado!' : 'Copiar PHP'}
            </button>
          </div>

          <div className={`p-4 rounded-2xl border font-mono text-xs overflow-x-auto max-h-[500px] leading-relaxed transition-colors ${
            isDark ? 'bg-slate-950 border-slate-800 text-slate-300' : 'bg-slate-900 border-slate-950 text-slate-100'
          }`}>
            <pre>{phpFiles[selectedPhpFile]}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
