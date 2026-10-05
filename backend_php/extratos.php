<?php
/**
 * CRUD e Gestão de Extratos de Repasse da Imobiliária em PHP
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Filtro por mês se enviado (ex: ?mes=2026-06)
        $mes = $_GET['mes'] ?? null;
        if ($mes) {
            $stmt = $pdo->prepare('
                SELECT er.*, c.codigo_contrato, c.inquilino_nome, p.endereco, p.numero
                FROM extratos_repasse er
                INNER JOIN contratos c ON er.contrato_id = c.id
                INNER JOIN propriedades p ON c.propriedade_id = p.id
                WHERE DATE_FORMAT(er.data_vencimento, "%Y-%m") = :mes
                ORDER BY er.data_vencimento DESC
            ');
            $stmt->execute([':mes' => $mes]);
        } else {
            $stmt = $pdo->query('
                SELECT er.*, c.codigo_contrato, c.inquilino_nome, p.endereco, p.numero
                FROM extratos_repasse er
                INNER JOIN contratos c ON er.contrato_id = c.id
                INNER JOIN propriedades p ON c.propriedade_id = p.id
                ORDER BY er.data_vencimento DESC
            ');
        }
        responseJson(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $pdo->prepare('
            INSERT INTO extratos_repasse 
            (contrato_id, numero_extrato, periodo_inicio, periodo_fim, data_vencimento, data_extrato, valor_aluguel, taxa_administracao, valor_liquido, status_pagamento, data_pagamento, codigo_autenticacao)
            VALUES 
            (:contrato_id, :numero_extrato, :periodo_inicio, :periodo_fim, :data_vencimento, :data_extrato, :valor_aluguel, :taxa_administracao, :valor_liquido, :status_pagamento, :data_pagamento, :codigo_autenticacao)
        ');
        $valorLiquido = (float)$input['valor_aluguel'] - (float)$input['taxa_administracao'];
        $stmt->execute([
            ':contrato_id'         => $input['contrato_id'],
            ':numero_extrato'      => $input['numero_extrato'],
            ':periodo_inicio'      => $input['periodo_inicio'],
            ':periodo_fim'         => $input['periodo_fim'],
            ':data_vencimento'     => $input['data_vencimento'],
            ':data_extrato'        => $input['data_extrato'] ?? date('Y-m-d'),
            ':valor_aluguel'       => $input['valor_aluguel'],
            ':taxa_administracao'  => $input['taxa_administracao'],
            ':valor_liquido'       => $valorLiquido,
            ':status_pagamento'    => $input['status_pagamento'] ?? 'Pendente',
            ':data_pagamento'      => !empty($input['data_pagamento']) ? $input['data_pagamento'] : null,
            ':codigo_autenticacao' => 'IMOB-AUT-' . $input['numero_extrato'] . '-' . date('Ymd')
        ]);
        responseJson(['status' => 'success', 'message' => 'Extrato registrado.', 'id' => $pdo->lastInsertId()], 201);
        break;

    case 'PUT':
        // Atualizar status (Recebido/Pendente)
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if (!$id) responseJson(['status' => 'error', 'message' => 'ID obrigatório.'], 400);

        $stmt = $pdo->prepare('
            UPDATE extratos_repasse 
            SET status_pagamento = :status, data_pagamento = :data_pagamento 
            WHERE id = :id
        ');
        $stmt->execute([
            ':id'             => $id,
            ':status'         => $input['status_pagamento'],
            ':data_pagamento' => $input['data_pagamento'] ?? null
        ]);
        responseJson(['status' => 'success', 'message' => 'Extrato atualizado.']);
        break;

    default:
        responseJson(['status' => 'error', 'message' => 'Método inválido.'], 405);
}
