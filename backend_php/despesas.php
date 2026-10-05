<?php
/**
 * CRUD e Gestão de Despesas Pessoais em PHP
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        $mes = $_GET['mes'] ?? null;
        if ($mes) {
            $stmt = $pdo->prepare('
                SELECT * FROM despesas_pessoais 
                WHERE DATE_FORMAT(data_vencimento, "%Y-%m") = :mes 
                ORDER BY data_vencimento ASC
            ');
            $stmt->execute([':mes' => $mes]);
        } else {
            $stmt = $pdo->query('SELECT * FROM despesas_pessoais ORDER BY data_vencimento DESC');
        }
        responseJson(['status' => 'success', 'data' => $stmt->fetchAll()]);
        break;

    case 'POST':
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['descricao']) || empty($input['valor']) || empty($input['data_vencimento'])) {
            responseJson(['status' => 'error', 'message' => 'Campos obrigatórios ausentes.'], 400);
        }

        $stmt = $pdo->prepare('
            INSERT INTO despesas_pessoais 
            (usuario_id, descricao, valor, data_vencimento, categoria, status_pagamento, data_pagamento)
            VALUES 
            (:usuario_id, :descricao, :valor, :data_vencimento, :categoria, :status_pagamento, :data_pagamento)
        ');
        $stmt->execute([
            ':usuario_id'       => $input['usuario_id'] ?? 2,
            ':descricao'        => $input['descricao'],
            ':valor'            => $input['valor'],
            ':data_vencimento'  => $input['data_vencimento'],
            ':categoria'        => $input['categoria'] ?? 'Moradia',
            ':status_pagamento' => $input['status_pagamento'] ?? 'Pendente',
            ':data_pagamento'   => !empty($input['data_pagamento']) ? $input['data_pagamento'] : null
        ]);
        responseJson(['status' => 'success', 'message' => 'Despesa cadastrada.', 'id' => $pdo->lastInsertId()], 201);
        break;

    case 'PUT':
        $input = json_decode(file_get_contents('php://input'), true);
        $id = $input['id'] ?? null;
        if (!$id) responseJson(['status' => 'error', 'message' => 'ID obrigatório.'], 400);

        $stmt = $pdo->prepare('
            UPDATE despesas_pessoais 
            SET status_pagamento = :status, data_pagamento = :data_pagamento 
            WHERE id = :id
        ');
        $stmt->execute([
            ':id'             => $id,
            ':status'         => $input['status_pagamento'],
            ':data_pagamento' => $input['data_pagamento'] ?? null
        ]);
        responseJson(['status' => 'success', 'message' => 'Despesa atualizada.']);
        break;

    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) responseJson(['status' => 'error', 'message' => 'ID obrigatório.'], 400);
        $stmt = $pdo->prepare('DELETE FROM despesas_pessoais WHERE id = :id');
        $stmt->execute([':id' => $id]);
        responseJson(['status' => 'success', 'message' => 'Despesa removida.']);
        break;

    default:
        responseJson(['status' => 'error', 'message' => 'Método inválido.'], 405);
}
