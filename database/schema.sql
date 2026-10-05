-- ==============================================================================
-- SCHEMA DO BANCO DE DADOS MYSQL / MARIADB
-- Projeto: Gestor de Imóveis, Extratos de Imobiliária e Contas Pessoais
-- Demonstração para Portfólio GitHub
-- Compatibilidade: MySQL 8.0+ / MariaDB 10.5+
-- Charset: utf8mb4 / Collation: utf8mb4_unicode_ci
-- ==============================================================================

CREATE DATABASE IF NOT EXISTS `gestor_imobiliario` 
  DEFAULT CHARACTER SET utf8mb4 
  DEFAULT COLLATE utf8mb4_unicode_ci;

USE `gestor_imobiliario`;

-- Desativa temporariamente a checagem de FK para recriação limpa
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS `despesas_pessoais`;
DROP TABLE IF EXISTS `extratos_repasse`;
DROP TABLE IF EXISTS `contratos`;
DROP TABLE IF EXISTS `propriedades`;
DROP TABLE IF EXISTS `inquilinos`;
DROP TABLE IF EXISTS `proprietarios`;
DROP TABLE IF EXISTS `usuarios`;

-- ------------------------------------------------------------------------------
-- 1. TABELA DE USUÁRIOS E AUTENTICAÇÃO
-- ------------------------------------------------------------------------------
CREATE TABLE `usuarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(120) NOT NULL,
  `email` VARCHAR(150) NOT NULL UNIQUE,
  `senha_hash` VARCHAR(255) NOT NULL,
  `cargo` ENUM('admin', 'proprietario', 'gestor') NOT NULL DEFAULT 'proprietario',
  `status` ENUM('ativo', 'inativo') NOT NULL DEFAULT 'ativo',
  `ultimo_login` DATETIME NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX `idx_usuarios_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 2. TABELA DE PROPRIETÁRIOS (DONOS DOS IMÓVEIS)
-- ------------------------------------------------------------------------------
CREATE TABLE `proprietarios` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NULL,
  `nome` VARCHAR(150) NOT NULL,
  `cpf` VARCHAR(14) NULL,
  `telefone` VARCHAR(20) NULL,
  `email` VARCHAR(150) NULL,
  `banco_nome` VARCHAR(100) NOT NULL DEFAULT 'Banco do Brasil S.A.',
  `banco_agencia` VARCHAR(20) NOT NULL DEFAULT '1234-5',
  `banco_conta` VARCHAR(30) NOT NULL DEFAULT '98765-4',
  `tipo_chave_pix` VARCHAR(30) NULL,
  `chave_pix` VARCHAR(100) NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT `fk_proprietarios_usuario` 
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 3. TABELA DE PROPRIEDADES (CASAS, APARTAMENTOS E IMÓVEIS ALUGADOS)
-- ------------------------------------------------------------------------------
CREATE TABLE `propriedades` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `proprietario_id` INT UNSIGNED NULL,
  `endereco` VARCHAR(200) NOT NULL,
  `numero` VARCHAR(20) NOT NULL,
  `complemento` VARCHAR(60) NULL,
  `bairro` VARCHAR(100) NOT NULL,
  `cidade` VARCHAR(100) NOT NULL DEFAULT 'Campinas',
  `uf` CHAR(2) NOT NULL DEFAULT 'SP',
  `cep` VARCHAR(10) NOT NULL,
  `tipo_imovel` ENUM('casa', 'apartamento', 'comercial', 'terreno') NOT NULL DEFAULT 'casa',
  `observacoes` TEXT NULL,
  `status` ENUM('alugado', 'disponivel', 'reforma') NOT NULL DEFAULT 'alugado',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_propriedades_proprietario` 
    FOREIGN KEY (`proprietario_id`) REFERENCES `proprietarios` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_propriedades_cidade_bairro` (`cidade`, `bairro`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 4. TABELA DE INQUILINOS (LOCATÁRIOS)
-- ------------------------------------------------------------------------------
CREATE TABLE `inquilinos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `nome` VARCHAR(150) NOT NULL,
  `cpf` VARCHAR(14) NULL,
  `telefone` VARCHAR(20) NULL,
  `email` VARCHAR(150) NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 5. TABELA DE CONTRATOS DE LOCAÇÃO
-- ------------------------------------------------------------------------------
CREATE TABLE `contratos` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `propriedade_id` INT UNSIGNED NOT NULL,
  `inquilino_id` INT UNSIGNED NULL,
  `codigo_contrato` VARCHAR(50) NOT NULL UNIQUE,
  `inquilino_nome` VARCHAR(150) NOT NULL,
  `data_inicio` DATE NOT NULL,
  `duracao_meses` INT UNSIGNED NOT NULL DEFAULT 12,
  `valor_aluguel` DECIMAL(10, 2) NOT NULL,
  `taxa_administracao_perc` DECIMAL(5, 2) NOT NULL DEFAULT 10.00,
  `taxa_administracao_valor` DECIMAL(10, 2) NOT NULL,
  `repasse_liquido` DECIMAL(10, 2) NOT NULL,
  `data_ultimo_reajuste` DATE NULL,
  `data_proximo_reajuste` DATE NULL,
  `proprietario_nome` VARCHAR(150) NOT NULL DEFAULT 'Maria de Lourdes Silva',
  `proprietario_percentual` DECIMAL(5, 2) NOT NULL DEFAULT 100.00,
  `banco_nome` VARCHAR(100) NOT NULL DEFAULT 'Banco do Brasil S.A.',
  `banco_agencia` VARCHAR(20) NOT NULL DEFAULT '1234-5',
  `banco_conta` VARCHAR(30) NOT NULL DEFAULT '98765-4',
  `status` ENUM('ativo', 'encerrado', 'em_renovacao') NOT NULL DEFAULT 'ativo',
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_contratos_propriedade` 
    FOREIGN KEY (`propriedade_id`) REFERENCES `propriedades` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  CONSTRAINT `fk_contratos_inquilino` 
    FOREIGN KEY (`inquilino_id`) REFERENCES `inquilinos` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_contratos_codigo` (`codigo_contrato`),
  INDEX `idx_contratos_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 6. TABELA DE EXTRATOS DE REPASSE (RECEITAS DA IMOBILIÁRIA)
-- ------------------------------------------------------------------------------
CREATE TABLE `extratos_repasse` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `contrato_id` INT UNSIGNED NOT NULL,
  `numero_extrato` VARCHAR(50) NOT NULL,
  `periodo_inicio` DATE NOT NULL,
  `periodo_fim` DATE NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `data_extrato` DATE NOT NULL,
  `valor_aluguel` DECIMAL(10, 2) NOT NULL,
  `taxa_administracao` DECIMAL(10, 2) NOT NULL,
  `valor_liquido` DECIMAL(10, 2) NOT NULL,
  `status_pagamento` ENUM('Pendente', 'Recebido') NOT NULL DEFAULT 'Pendente',
  `data_pagamento` DATE NULL,
  `codigo_autenticacao` VARCHAR(100) NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_extratos_contrato` 
    FOREIGN KEY (`contrato_id`) REFERENCES `contratos` (`id`) 
    ON DELETE CASCADE ON UPDATE CASCADE,
  INDEX `idx_extratos_vencimento` (`data_vencimento`),
  INDEX `idx_extratos_status` (`status_pagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- 7. TABELA DE DESPESAS PESSOAIS DA PROPRIETÁRIA
-- ------------------------------------------------------------------------------
CREATE TABLE `despesas_pessoais` (
  `id` INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `usuario_id` INT UNSIGNED NULL,
  `descricao` VARCHAR(180) NOT NULL,
  `valor` DECIMAL(10, 2) NOT NULL,
  `data_vencimento` DATE NOT NULL,
  `categoria` ENUM('Moradia', 'Alimentação', 'Saúde', 'Lazer/Tecnologia', 'Outros') NOT NULL DEFAULT 'Moradia',
  `status_pagamento` ENUM('Pendente', 'Pago') NOT NULL DEFAULT 'Pendente',
  `data_pagamento` DATE NULL,
  `comprovante_url` VARCHAR(255) NULL,
  `observacoes` TEXT NULL,
  `criado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  `atualizado_em` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT `fk_despesas_usuario` 
    FOREIGN KEY (`usuario_id`) REFERENCES `usuarios` (`id`) 
    ON DELETE SET NULL ON UPDATE CASCADE,
  INDEX `idx_despesas_vencimento` (`data_vencimento`),
  INDEX `idx_despesas_categoria` (`categoria`),
  INDEX `idx_despesas_status` (`status_pagamento`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ------------------------------------------------------------------------------
-- VIEW INTELIGENTE: RESUMO MENSAL CONSOLIDADO (CRUZAMENTO RECEITAS X DESPESAS)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE VIEW `vw_fluxo_caixa_mensal` AS
SELECT 
  DATE_FORMAT(er.data_vencimento, '%Y-%m') AS mes_referencia,
  SUM(er.valor_aluguel) AS receita_bruta_total,
  SUM(er.taxa_administracao) AS taxas_imobiliaria_total,
  SUM(er.valor_liquido) AS receita_liquida_total,
  SUM(CASE WHEN er.status_pagamento = 'Recebido' THEN er.valor_liquido ELSE 0 END) AS repasses_recebidos,
  SUM(CASE WHEN er.status_pagamento = 'Pendente' THEN er.valor_liquido ELSE 0 END) AS repasses_pendentes
FROM `extratos_repasse` er
GROUP BY DATE_FORMAT(er.data_vencimento, '%Y-%m');

SET FOREIGN_KEY_CHECKS = 1;
