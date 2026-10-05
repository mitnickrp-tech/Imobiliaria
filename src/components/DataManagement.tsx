/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useRentManager } from '../context/RentManagerContext';
import { Download, Upload, RefreshCw, Trash2, Check, AlertTriangle, Database, Info } from 'lucide-react';

export default function DataManagement() {
  const { exportData, importData, resetToMockData, clearAllData, generateSqlDump, theme } = useRentManager();
  const [importStr, setImportStr] = useState('');
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const [copied, setCopied] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);
  const [importSuccess, setImportSuccess] = useState<boolean | null>(null);

  const isDark = theme === 'dark';

  const handleExport = () => {
    const data = exportData();
    navigator.clipboard.writeText(data);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);

    const element = document.createElement("a");
    const file = new Blob([data], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `backup_gestor_imoveis_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleExportSql = () => {
    const sql = generateSqlDump();
    navigator.clipboard.writeText(sql);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 3000);

    const element = document.createElement("a");
    const file = new Blob([sql], { type: 'text/sql' });
    element.href = URL.createObjectURL(file);
    element.download = `dump_mysql_gestor_${new Date().toISOString().slice(0, 10)}.sql`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!importStr) return;
    const success = importData(importStr);
    setImportSuccess(success);
    if (success) {
      setImportStr('');
      alert("Seus dados foram importados e restaurados com sucesso!");
    } else {
      alert("Erro ao ler o texto de backup. Verifique se copiou o JSON completo corretamente.");
    }
    setTimeout(() => setImportSuccess(null), 3000);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6" id="data-management-tab">
      {/* Backup and Restore */}
      <div className={`rounded-2xl border p-6 space-y-4 shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <h3 className={`font-sans font-bold text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
          <Download className="w-5 h-5 text-emerald-500" />
          Backup e Exportação dos Dados
        </h3>
        <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
          Salve uma cópia de segurança em formato JSON para restaurar no navegador, ou exporte em formato SQL para carregar no banco de dados MySQL ou MariaDB.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2">
          <button
            onClick={handleExport}
            className="flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-xs py-2.5 px-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
            id="export-data-btn"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 animate-bounce" /> JSON Baixado!
              </>
            ) : (
              <>
                <Download className="w-4 h-4" /> Backup JSON
              </>
            )}
          </button>

          <button
            onClick={handleExportSql}
            className={`flex items-center justify-center gap-2 font-bold text-xs py-2.5 px-3 rounded-xl border transition-colors cursor-pointer ${
              isDark 
                ? 'bg-slate-800 border-slate-700 text-emerald-400 hover:bg-slate-700' 
                : 'bg-slate-100 border-slate-200 text-emerald-700 hover:bg-slate-200'
            }`}
            id="export-sql-btn"
          >
            {copiedSql ? (
              <>
                <Check className="w-4 h-4 animate-bounce text-emerald-400" /> Dump SQL Salvo!
              </>
            ) : (
              <>
                <Database className="w-4 h-4 text-emerald-500" /> Baixar Dump MySQL (.sql)
              </>
            )}
          </button>
        </div>

        <div className={`border-t pt-4 space-y-3 transition-colors ${isDark ? 'border-slate-800' : 'border-slate-100'}`}>
          <h4 className={`font-sans font-bold text-sm flex items-center gap-1.5 ${isDark ? 'text-slate-300' : 'text-slate-700'}`}>
            <Upload className="w-4 h-4 text-slate-400" />
            Restaurar de um Backup JSON (Importar)
          </h4>
          <form onSubmit={handleImport} className="space-y-2">
            <textarea
              placeholder="Cole aqui o texto do seu arquivo de backup (.json)..."
              value={importStr}
              onChange={e => setImportStr(e.target.value)}
              rows={4}
              className={`w-full rounded-xl p-3 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors ${
                isDark 
                  ? 'bg-slate-950 border-slate-800 text-slate-300 placeholder-slate-600' 
                  : 'bg-slate-50 border border-slate-200 text-slate-600'
              }`}
              id="import-textarea"
            />
            <button
              type="submit"
              disabled={!importStr}
              className={`w-full text-xs font-bold py-2 px-4 rounded-lg border transition-all cursor-pointer ${
                importStr 
                  ? (isDark ? 'bg-slate-800 text-white border-slate-700 hover:bg-slate-700' : 'bg-slate-800 text-white border-slate-800 hover:bg-slate-700') 
                  : (isDark ? 'bg-slate-950 text-slate-600 border-slate-850 cursor-not-allowed' : 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed')
              }`}
              id="import-submit-btn"
            >
              Restaurar Dados
            </button>
          </form>
        </div>
      </div>

      {/* Advanced Settings & Mock data */}
      <div className={`rounded-2xl border p-6 space-y-6 flex flex-col justify-between shadow-sm transition-colors duration-200 ${
        isDark ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-100'
      }`}>
        <div className="space-y-4">
          <h3 className={`font-sans font-bold text-base flex items-center gap-2 ${isDark ? 'text-white' : 'text-slate-800'}`}>
            <RefreshCw className="w-5 h-5 text-amber-500" />
            Configurações e Dados Fictícios de Demonstração
          </h3>
          <p className={`text-xs leading-relaxed ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
            Este projeto foi montado para demonstração no GitHub com dados 100% fictícios de imóveis, inquilinos, extratos da imobiliária e contas mensais.
          </p>

          <div className={`border p-4 rounded-xl text-xs transition-colors duration-200 ${
            isDark 
              ? 'bg-amber-950/20 border-amber-900/30 text-amber-300' 
              : 'bg-amber-50/50 border border-amber-100/50 text-amber-900'
          }`} id="mock-info-card">
            <div className="flex gap-2">
              <Info className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Dados Fictícios de Portfólio:</p>
                <p className={`mt-1 ${isDark ? 'text-amber-400' : 'text-amber-700'}`}>
                  Ao restaurar os dados de exemplo, o sistema preencherá 3 imóveis fictícios, contratos com taxa de administração calculada, extratos da imobiliária e contas mensais de teste.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-4" id="danger-actions-grid">
          {/* Mock data reset button */}
          {!showConfirmReset ? (
            <button
              onClick={() => setShowConfirmReset(true)}
              className={`flex items-center justify-center gap-1.5 border font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-amber-950/40 border-amber-900/30 text-amber-400 hover:bg-amber-950/80' 
                  : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
              }`}
              id="reset-mock-prompt"
            >
              <RefreshCw className="w-4 h-4" /> Restaurar Seeds Fictícias
            </button>
          ) : (
            <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors ${
              isDark ? 'bg-amber-950/40 border-amber-900/30' : 'bg-amber-50 border border-amber-200'
            }`} id="reset-mock-confirm">
              <p className={`text-2xs font-bold text-center flex items-center gap-1 ${isDark ? 'text-amber-300' : 'text-amber-800'}`}>
                <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" /> Substituirá os dados atuais. Confirmar?
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    resetToMockData();
                    setShowConfirmReset(false);
                    alert("Dados de demonstração recarregados com sucesso!");
                  }}
                  className="flex-1 bg-amber-600 text-white font-bold text-2xs py-1 px-2 rounded cursor-pointer"
                >
                  Sim
                </button>
                <button
                  onClick={() => setShowConfirmReset(false)}
                  className={`flex-1 border font-bold text-2xs py-1 px-2 rounded cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>
          )}

          {/* Clean wipe button */}
          {!showConfirmClear ? (
            <button
              onClick={() => setShowConfirmClear(true)}
              className={`flex items-center justify-center gap-1.5 border font-bold text-xs py-2.5 px-4 rounded-xl transition-colors cursor-pointer ${
                isDark 
                  ? 'bg-red-950/40 border-red-900/30 text-red-400 hover:bg-red-950/80' 
                  : 'bg-rose-50 text-rose-700 border border-rose-200 hover:bg-rose-100'
              }`}
              id="clear-data-prompt"
            >
              <Trash2 className="w-4 h-4" /> Limpar Todo o Sistema
            </button>
          ) : (
            <div className={`border rounded-xl p-3 flex flex-col gap-2 transition-colors ${
              isDark ? 'bg-red-950/40 border-red-900/30' : 'bg-rose-50 border border-rose-200'
            }`} id="clear-data-confirm">
              <p className={`text-2xs font-bold text-center flex items-center gap-1 ${isDark ? 'text-red-300' : 'text-rose-800'}`}>
                <AlertTriangle className="w-3.5 h-3.5 text-red-500 shrink-0" /> ATENÇÃO: Apagará tudo permanentemente!
              </p>
              <div className="flex gap-1.5">
                <button
                  onClick={() => {
                    clearAllData();
                    setShowConfirmClear(false);
                    alert("O sistema foi limpo.");
                  }}
                  className="flex-1 bg-rose-600 text-white font-bold text-2xs py-1 px-2 rounded cursor-pointer"
                >
                  Sim, Limpar
                </button>
                <button
                  onClick={() => setShowConfirmClear(false)}
                  className={`flex-1 border font-bold text-2xs py-1 px-2 rounded cursor-pointer ${
                    isDark ? 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Não
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
