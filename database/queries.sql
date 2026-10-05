-- ==============================================================================
-- CONSULTAS SQL ÚTEIS PARA DEMONSTRAÇÃO E RELATÓRIOS
-- ==============================================================================

USE `gestor_imobiliario`;

-- 1. Balanço Financeiro Mensal Consolidado (Junho de 2026)
-- Cruza o total líquido de repasses da imobiliária contra o total de despesas pessoais pagas
SELECT 
  '2026-06' AS mes_referencia,
  (SELECT COALESCE(SUM(valor_liquido), 0) FROM extratos_repasse WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') AS total_repasses_imobiliaria,
  (SELECT COALESCE(SUM(valor_liquido), 0) FROM extratos_repasse WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06' AND status_pagamento = 'Recebido') AS repasses_ja_recebidos,
  (SELECT COALESCE(SUM(valor), 0) FROM despesas_pessoais WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') AS total_despesas_pessoais,
  (SELECT COALESCE(SUM(valor), 0) FROM despesas_pessoais WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06' AND status_pagamento = 'Pago') AS despesas_ja_pagas,
  ((SELECT COALESCE(SUM(valor_liquido), 0) FROM extratos_repasse WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06') - 
   (SELECT COALESCE(SUM(valor), 0) FROM despesas_pessoais WHERE DATE_FORMAT(data_vencimento, '%Y-%m') = '2026-06')) AS saldo_liquido_final;

-- 2. Demonstrativo Detalhado de Extratos por Imóvel com Taxa da Imobiliária
SELECT 
  er.numero_extrato,
  p.endereco,
  p.numero,
  p.bairro,
  c.codigo_contrato,
  c.inquilino_nome,
  er.data_vencimento,
  er.valor_aluguel AS aluguel_bruto,
  er.taxa_administracao,
  er.valor_liquido AS repasse_proprietario,
  er.status_pagamento,
  er.data_pagamento
FROM extratos_repasse er
INNER JOIN contratos c ON er.contrato_id = c.id
INNER JOIN propriedades p ON c.propriedade_id = p.id
ORDER BY er.data_vencimento DESC;

-- 3. Distribuição das Contas Pessoais por Categoria
SELECT 
  categoria,
  COUNT(*) AS quantidade_contas,
  SUM(valor) AS total_valor,
  ROUND((SUM(valor) / (SELECT SUM(valor) FROM despesas_pessoais)) * 100, 2) AS percentual_do_total
FROM despesas_pessoais
GROUP BY categoria
ORDER BY total_valor DESC;

-- 4. Contas e Repasses com Vencimento nos Próximos 15 Dias
SELECT 'Extrato a Receber' AS tipo, numero_extrato AS identificador, valor_liquido AS valor, data_vencimento, status_pagamento
FROM extratos_repasse
WHERE status_pagamento = 'Pendente'
UNION ALL
SELECT 'Despesa a Pagar' AS tipo, descricao AS identificador, valor, data_vencimento, status_pagamento
FROM despesas_pessoais
WHERE status_pagamento = 'Pendente'
ORDER BY data_vencimento ASC;
