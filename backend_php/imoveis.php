<?php
/**
 * CRUD de Imóveis (Propriedades) e Contratos em PHP
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

switch ($method) {
    case 'GET':
        // Lista todas as propriedades com contratos associados
        $stmt = $pdo->query('
            SELECT 
                p.*,
                c.id AS contrato_id,
                c.codigo_contrato,
                c.inquilino_nome,
                c.valor_aluguel,
                c.taxa_administracao_perc,
                c.taxa_administracao_valor,
                c.repasse_liquido,
                c.data_inicio,
                c.duracao_meses,
                c.data_proximo_reajuste,
                c.banco_nome,
                c.banco_agencia,
                c.banco_conta
            FROM propriedades p
            LEFT JOIN contratos c ON p.id = c.propriedade_id
            ORDER BY p.id DESC
        ');
        $rows = $stmt->fetchAll();
        responseJson(['status' => 'success', 'data' => $rows]);
        break;

    case 'POST':
        // Cadastra um novo imóvel
        $input = json_decode(file_get_contents('php://input'), true);
        if (empty($input['endereco']) || empty($input['numero']) || empty($input['bairro'])) {
            responseJson(['status' => 'error', 'message' => 'Endereço, número e bairro são obrigatórios.'], 400);
        }

        $stmt = $pdo->prepare('
            INSERT INTO propriedades (endereco, numero, complemento, bairro, cidade, uf, cep)
            VALUES (:endereco, :numero, :complemento, :bairro, :cidade, :uf, :cep)
        ');
        $stmt->execute([
            ':endereco'    => $input['endereco'],
            ':numero'      => $input['numero'],
            ':complemento' => $input['complemento'] ?? null,
            ':bairro'      => $input['bairro'],
            ':cidade'      => $input['cidade'] ?? 'Campinas',
            ':uf'          => $input['uf'] ?? 'SP',
            ':cep'         => $input['cep'] ?? '00000-000',
        ]);
        $newId = $pdo->lastInsertId();
        responseJson(['status' => 'success', 'message' => 'Imóvel cadastrado com sucesso.', 'id' => $newId], 201);
        break;

    case 'DELETE':
        $id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
        if (!$id) {
            responseJson(['status' => 'error', 'message' => 'ID do imóvel não fornecido.'], 400);
        }
        $stmt = $pdo->prepare('DELETE FROM propriedades WHERE id = :id');
        $stmt->execute([':id' => $id]);
        responseJson(['status' => 'success', 'message' => 'Imóvel removido com sucesso.']);
        break;

    default:
        responseJson(['status' => 'error', 'message' => 'Método inválido.'], 405);
}
