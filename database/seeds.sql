-- ==============================================================================
-- DADOS DE TESTE E DEMONSTRAÇÃO (SEEDS 100% FICTÍCIOS)
-- ==============================================================================

USE `gestor_imobiliario`;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE `despesas_pessoais`;
TRUNCATE TABLE `extratos_repasse`;
TRUNCATE TABLE `contratos`;
TRUNCATE TABLE `inquilinos`;
TRUNCATE TABLE `propriedades`;
TRUNCATE TABLE `proprietarios`;
TRUNCATE TABLE `usuarios`;

-- 1. Usuários do Sistema (Senha demo padrão: senha123 -> bcrypt)
INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `cargo`, `status`, `criado_em`) VALUES
(1, 'Gestor Imobiliário', 'admin@imobiliaria.com', '$2y$10$eO1eKqJ8H6aR4vI2sV6zReZ999demoAdminHash', 'admin', 'ativo', NOW()),
(2, 'Maria de Lourdes Silva', 'proprietaria@exemplo.com', '$2y$10$eO1eKqJ8H6aR4vI2sV6zReZ999demoPropHash', 'proprietario', 'ativo', NOW());

-- 2. Proprietária
INSERT INTO `proprietarios` (`id`, `usuario_id`, `nome`, `cpf`, `telefone`, `email`, `banco_nome`, `banco_agencia`, `banco_conta`, `tipo_chave_pix`, `chave_pix`) VALUES
(1, 2, 'Maria de Lourdes Silva', '123.456.789-00', '(19) 98765-4321', 'proprietaria@exemplo.com', 'Banco do Brasil S.A. (001)', '1234-5', '98765-4', 'CPF', '12345678900');

-- 3. Imóveis / Propriedades
INSERT INTO `propriedades` (`id`, `proprietario_id`, `endereco`, `numero`, `complemento`, `bairro`, `cidade`, `uf`, `cep`, `tipo_imovel`, `status`) VALUES
(1, 1, 'Rua dos Girassóis', '142', NULL, 'Jardim Europa', 'Campinas', 'SP', '13025-000', 'casa', 'alugado'),
(2, 1, 'Avenida Central', '850', 'Apto 32 Bloco B', 'Centro', 'Campinas', 'SP', '13010-100', 'apartamento', 'alugado'),
(3, 1, 'Rua das Acácias', '77', NULL, 'Vila Primavera', 'Campinas', 'SP', '13040-200', 'casa', 'alugado');

-- 4. Inquilinos
INSERT INTO `inquilinos` (`id`, `nome`, `cpf`, `telefone`, `email`) VALUES
(1, 'Lucas Gabriel Ferreira', '234.567.890-11', '(19) 99123-4567', 'lucas.ferreira@emaildemo.com'),
(2, 'Mariana Costa Santos', '345.678.901-22', '(19) 99234-5678', 'mariana.costa@emaildemo.com'),
(3, 'Rafael Silveira Ramos', '456.789.012-33', '(19) 99345-6789', 'rafael.ramos@emaildemo.com');

-- 5. Contratos de Locação
INSERT INTO `contratos` (`id`, `propriedade_id`, `inquilino_id`, `codigo_contrato`, `inquilino_nome`, `data_inicio`, `duracao_meses`, `valor_aluguel`, `taxa_administracao_perc`, `taxa_administracao_valor`, `repasse_liquido`, `data_ultimo_reajuste`, `data_proximo_reajuste`, `proprietario_nome`, `banco_nome`, `banco_agencia`, `banco_conta`, `status`) VALUES
(1, 1, 1, 'LOC-2025-01', 'Lucas Gabriel Ferreira', '2025-03-12', 36, 1800.00, 10.00, 180.00, 1620.00, '2025-03-12', '2026-03-12', 'Maria de Lourdes Silva', 'Banco do Brasil S.A. (001)', '1234-5', '98765-4', 'ativo'),
(2, 2, 2, 'LOC-2024-88', 'Mariana Costa Santos', '2024-06-01', 30, 2400.00, 8.00, 192.00, 2208.00, '2025-06-01', '2026-06-01', 'Maria de Lourdes Silva', 'Banco do Brasil S.A. (001)', '1234-5', '98765-4', 'ativo'),
(3, 3, 3, 'LOC-2025-14', 'Rafael Silveira Ramos', '2025-01-15', 24, 1450.00, 10.00, 145.00, 1305.00, '2025-01-15', '2026-01-15', 'Maria de Lourdes Silva', 'Banco do Brasil S.A. (001)', '1234-5', '98765-4', 'ativo');

-- 6. Extratos de Repasse da Imobiliária
INSERT INTO `extratos_repasse` (`id`, `contrato_id`, `numero_extrato`, `periodo_inicio`, `periodo_fim`, `data_vencimento`, `data_extrato`, `valor_aluguel`, `taxa_administracao`, `valor_liquido`, `status_pagamento`, `data_pagamento`, `codigo_autenticacao`) VALUES
(1, 1, '10420', '2026-05-12', '2026-06-11', '2026-06-15', '2026-06-05', 1800.00, 180.00, 1620.00, 'Recebido', '2026-06-14', 'IMOB-AUT-10420-20260615'),
(2, 2, '10421', '2026-05-01', '2026-05-31', '2026-06-10', '2026-06-02', 2400.00, 192.00, 2208.00, 'Recebido', '2026-06-09', 'IMOB-AUT-10421-20260610'),
(3, 3, '10422', '2026-05-15', '2026-06-14', '2026-06-20', '2026-06-08', 1450.00, 145.00, 1305.00, 'Pendente', NULL, 'IMOB-AUT-10422-20260620'),
(4, 1, '10385', '2026-04-12', '2026-05-11', '2026-05-15', '2026-05-05', 1800.00, 180.00, 1620.00, 'Recebido', '2026-05-14', 'IMOB-AUT-10385-20260515');

-- 7. Contas / Despesas Pessoais Mensais da Proprietária
INSERT INTO `despesas_pessoais` (`id`, `usuario_id`, `descricao`, `valor`, `data_vencimento`, `categoria`, `status_pagamento`, `data_pagamento`, `observacoes`) VALUES
(1, 2, 'Plano de Saúde Familiar', 720.00, '2026-06-15', 'Saúde', 'Pago', '2026-06-14', 'Débito em conta'),
(2, 2, 'Energia Elétrica (CPFL)', 245.80, '2026-06-18', 'Moradia', 'Pago', '2026-06-17', 'Consumo do mês de maio'),
(3, 2, 'Supermercado e Feira', 980.50, '2026-06-10', 'Alimentação', 'Pago', '2026-06-09', 'Compras do mês'),
(4, 2, 'Água e Saneamento', 98.40, '2026-06-22', 'Moradia', 'Pendente', NULL, 'Boleto bancário'),
(5, 2, 'Internet Fibra 500MB', 129.90, '2026-06-10', 'Lazer/Tecnologia', 'Pago', '2026-06-10', 'Plano residencial'),
(6, 2, 'Medicamentos e Farmácia', 145.00, '2026-06-25', 'Saúde', 'Pendente', NULL, 'Receita contínua');

SET FOREIGN_KEY_CHECKS = 1;
