# 🏠 Sistema de Gestão de Imóveis, Extratos da Imobiliária e Contas Pessoais

> **Projeto de Demonstração para Portfólio GitHub**  
> Desenvolvido com **PHP 8 + MySQL** no backend e interface moderna com **React, TypeScript & Tailwind CSS** (Dark Mode nativo).

---

## 📋 Visão Geral

Este projeto foi concebido para resolver um problema comum de gestão financeira familiar e patrimonial:  
1. **Controle de Imóveis Alugados**: Cadastro de casas/apartamentos, inquilinos e contratos de locação com cálculo automático de taxa de administração e repasse líquido.
2. **Espelhamento de Extratos da Imobiliária**: Registro dos comprovantes/faturas mensais enviados pela imobiliária, conferindo datas de vencimento, recebimento em conta e descontos de corretagem.
3. **Controle de Despesas Pessoais**: Lançamento das contas fixas e variáveis do proprietário (saúde, energia, alimentação, água, etc.).
4. **Balanço Mensal Inteligente**: Painel consolidado que cruza a renda líquida dos aluguéis com as contas pessoais, indicando o saldo restante no mês.
5. **Autenticação Segura**: Suporte a login com níveis de acesso (Administrador / Gestor e Proprietário).

---

## 🗄️ Modelagem do Banco de Dados (MySQL 8)

O modelo relacional foi projetado seguindo as boas práticas da terceira forma normal (3NF), garantindo integridade referencial com chaves estrangeiras (`FOREIGN KEY`), índices e views analíticas.

### Principais Tabelas:
- **`usuarios`**: Autenticação, cargo (`admin`, `proprietario`), hash de senha (`bcrypt`) e controle de status.
- **`proprietarios`**: Dados cadastrais da proprietária, dados bancários para repasse e chave PIX.
- **`propriedades`**: Cadastro dos imóveis (endereço, número, bairro, cidade, CEP, tipo e status).
- **`inquilinos`**: Dados dos locatários.
- **`contratos`**: Código do contrato, duração, valor do aluguel, taxa de administração (%) e repasse líquido.
- **`extratos_repasse`**: Histórico detalhado das faturas enviadas pela imobiliária (aluguel bruto, taxa de corretagem, repasse líquido e confirmação de pagamento).
- **`despesas_pessoais`**: Despesas mensais categorizadas (Moradia, Alimentação, Saúde, Lazer/Tecnologia, Outros) com status de quitação.
- **`vw_fluxo_caixa_mensal`**: View agregada de fluxo financeiro mês a mês.

Os scripts completos estão disponíveis na pasta `/database`:
- [`database/schema.sql`](database/schema.sql): DDL completo de criação das tabelas e índices.
- [`database/seeds.sql`](database/seeds.sql): Dados fictícios para teste imediato.
- [`database/queries.sql`](database/queries.sql): Consultas de relatórios, balanço e inadimplência.

---

## ⚙️ Backend em PHP 8 (API RESTful)

Os endpoints em PHP estão organizados na pasta `/backend_php` utilizando `PDO` com prepared statements contra SQL Injection:
- `config.php`: Conexão com PDO, tratamento de erros e headers CORS.
- `auth.php`: Login de usuários e emissão de token.
- `imoveis.php`: Listagem e cadastro de propriedades e contratos.
- `extratos.php`: Consulta e baixa de faturas da imobiliária.
- `despesas.php`: Gestão de contas pessoais mensais.

---

## 🚀 Como Executar o Projeto

### Pré-requisitos:
- PHP 8.1+ e MySQL 8.0+ (ou XAMPP / Laragon / Docker)
- Node.js 18+ (para o frontend interativo)

### 1. Configurando o Banco de Dados MySQL:
```bash
mysql -u root -p < database/schema.sql
mysql -u root -p < database/seeds.sql
```

### 2. Rodando o Frontend React Demo:
```bash
npm install
npm run dev
```
Acesse `http://localhost:3000` no seu navegador.

### 🔑 Credenciais de Demonstração:
- **Administrador**: `admin@imobiliaria.com` | Senha: `senha123`
- **Proprietária**: `proprietaria@exemplo.com` | Senha: `senha123`

---

## 🛡️ Dados Fictícios e Privacidade
Todos os nomes, endereços, contas bancárias e valores presentes nas sementes de dados (`seeds`) são estritamente fictícios para fins de demonstração no GitHub.
