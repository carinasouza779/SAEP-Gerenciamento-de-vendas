# SAEP — Gerenciamento de Vendas

Sistema de estudo para gerenciamento de vendas com **Node.js, Express, SQLite, HTML, CSS e JavaScript**. Possui cadastro, listagem, consulta, edição e exclusão (CRUD).

## 1. Funcionalidades

- Registrar uma venda com cliente, produto, quantidade, valor unitário e data.
- Calcular o valor total automaticamente no servidor.
- Listar todas as vendas.
- Consultar uma venda pelo ID pela API.
- Editar uma venda.
- Excluir uma venda.
- Exibir quantidade de vendas e valor total vendido.

## 2. Instalação e execução

No terminal, entre na pasta onde deseja salvar o projeto e execute:

```bash
git clone https://github.com/carinasouza779/SAEP-Gerenciamento-de-vendas.git
cd SAEP-Gerenciamento-de-vendas
npm install
npm start
```

Abra no navegador: http://localhost:3000

Para reiniciar o servidor automaticamente durante o desenvolvimento:

```bash
npm run dev
```

O banco `database/vendas.db` e a tabela `vendas` são criados automaticamente ao iniciar o servidor.

## 3. Tecnologias

- Node.js
- Express
- SQLite usando o módulo nativo `node:sqlite`.
- HTML, CSS e JavaScript em arquivos separados.

Não é necessário instalar `better-sqlite3`. O módulo `node:sqlite` está disponível nas versões atuais do Node.js; algumas versões podem exibir um aviso de experimental.

## 4. Estrutura de pastas

```text
SAEP-Gerenciamento-de-vendas/
├── database/
│   └── db.js
├── public/
│   ├── css/
│   │   └── style.css
│   ├── js/
│   │   └── script.js
│   └── index.html
├── routes/
│   └── vendas.js
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 5. Rotas da API

Todas as rotas começam com `/api/vendas`.

| Método | Rota | Função |
|---|---|---|
| GET | `/api/vendas` | Lista todas as vendas |
| GET | `/api/vendas/:id` | Consulta uma venda pelo ID |
| POST | `/api/vendas` | Registra uma venda |
| PUT | `/api/vendas/:id` | Edita uma venda pelo ID |
| DELETE | `/api/vendas/:id` | Exclui uma venda pelo ID |

Exemplo de JSON enviado no cadastro ou edição:

```json
{
  "cliente": "Maria Silva",
  "produto": "Teclado",
  "quantidade": 2,
  "valor_unitario": 89.90,
  "data_venda": "2026-11-24"
}
```

O servidor calcula `total` multiplicando quantidade por valor unitário.

## 6. Para que serve cada arquivo?

- `server.js`: configura o Express, disponibiliza os arquivos da pasta public e inicia o servidor.
- `database/db.js`: conecta ao SQLite e cria a tabela vendas.
- `routes/vendas.js`: contém as rotas GET, POST, PUT e DELETE, com comentários.
- `public/index.html`: estrutura da tela, formulário e tabela.
- `public/css/style.css`: aparência e adaptação para celular.
- `public/js/script.js`: captura os dados, chama a API com fetch e atualiza a tela.
- `package.json`: dependências e comandos do projeto.

## 7. Guia para adaptar na prova

A estrutura pode ser reutilizada para clientes, produtos, funcionários, pedidos ou agendamentos. Você precisa ajustar o nome da entidade, os campos e as consultas.

### Passo 1 — Trocar os nomes

Exemplo para transformar vendas em clientes:

- Tabela: `vendas` → `clientes`
- Rota: `/api/vendas` → `/api/clientes`
- Arquivo: `vendas.js` → `clientes.js`

### Passo 2 — Alterar o banco de dados

No arquivo `database/db.js`, altere a tabela e seus campos. Exemplo:

```sql
CREATE TABLE IF NOT EXISTS clientes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT
);
```

### Passo 3 — Adaptar as rotas

No arquivo `routes/vendas.js`:

- Altere o nome da tabela nos comandos SQL.
- Altere os campos retirados de `req.body`.
- Atualize as colunas do INSERT e do UPDATE.
- Mantenha o ID em `req.params.id` para consultar, editar e excluir um registro.

### Passo 4 — Adaptar o front-end

- No `index.html`, altere os campos do formulário e os títulos da tabela.
- No `script.js`, ajuste o objeto enviado no `fetch`, o endereço da API e os dados exibidos.
- No `server.js`, importe o novo arquivo de rotas e configure o caminho correto.

### Passo 5 — Testar o CRUD

1. Execute `npm start`.
2. Abra `http://localhost:3000`.
3. Cadastre um registro.
4. Confira se ele aparece na lista.
5. Edite o registro.
6. Exclua o registro.

## 8. Entendendo o CRUD

- **Create (POST):** cadastrar.
- **Read (GET):** listar ou consultar.
- **Update (PUT):** editar.
- **Delete (DELETE):** excluir.

## 9. Trabalhar sem Wi-Fi

Antes da prova, clone ou baixe o projeto e execute `npm install` com internet. Mantenha a pasta local e não apague `node_modules`. O SQLite é local, então o sistema funciona sem Wi-Fi depois de instalado.

Atenção: `git clone` precisa de internet. Para trabalhar offline, deixe uma cópia do projeto no computador antes da prova.
