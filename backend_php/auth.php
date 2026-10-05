<?php
/**
 * Endpoint de Autenticação (Login e Sessão) em PHP
 */
require_once __DIR__ . '/config.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    $email = trim($input['email'] ?? '');
    $senha = $input['password'] ?? '';

    if (empty($email) || empty($senha)) {
        responseJson(['status' => 'error', 'message' => 'E-mail e senha são obrigatórios.'], 400);
    }

    $stmt = $pdo->prepare('SELECT id, nome, email, senha_hash, cargo FROM usuarios WHERE email = :email AND status = "ativo" LIMIT 1');
    $stmt->execute([':email' => $email]);
    $user = $stmt->fetch();

    // Na demonstração aceita hash ou senha demo 'senha123'
    if ($user && (password_verify($senha, $user['senha_hash']) || $senha === 'senha123')) {
        unset($user['senha_hash']);
        
        // Atualiza timestamp de login
        $update = $pdo->prepare('UPDATE usuarios SET ultimo_login = NOW() WHERE id = :id');
        $update->execute([':id' => $user['id']]);

        responseJson([
            'status' => 'success',
            'message' => 'Login realizado com sucesso.',
            'user' => $user,
            'token' => base64_encode(json_encode(['uid' => $user['id'], 'exp' => time() + 86400]))
        ]);
    } else {
        responseJson(['status' => 'error', 'message' => 'Credenciais inválidas. Verifique e-mail e senha.'], 401);
    }
} else {
    responseJson(['status' => 'error', 'message' => 'Método não permitido.'], 405);
}
