// database/db.js - conexão e estrutura do banco SQLite

const { DatabaseSync } = require("node:sqlite");
const path = require("node:path");
const fs = require("node:fs");

const pastaBanco = __dirname;
const caminhoBanco = path.join(pastaBanco, "vendas.db");

// Cria a pasta caso ainda não exista.
if (!fs.existsSync(pastaBanco)) {
  fs.mkdirSync(pastaBanco, { recursive: true });
}

// Abre ou cria o arquivo do banco de dados.
const db = new DatabaseSync(caminhoBanco);

// Cria a tabela de vendas na primeira execução.
db.exec(`
  CREATE TABLE IF NOT EXISTS vendas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    cliente TEXT NOT NULL,
    produto TEXT NOT NULL,
    quantidade INTEGER NOT NULL,
    valor_unitario REAL NOT NULL,
    total REAL NOT NULL,
    data_venda TEXT NOT NULL,
    criado_em TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

module.exports = db;
