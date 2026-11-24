// server.js - configura e inicia o servidor Node.js

const express = require("express");
const path = require("node:path");
const rotasVendas = require("./routes/vendas");

const app = express();
const PORTA = 3000;

// Permite receber JSON enviado pelo JavaScript do navegador.
app.use(express.json());

// Entrega os arquivos HTML, CSS e JS da pasta public.
app.use(express.static(path.join(__dirname, "public")));

// Define o endereço base de todas as rotas de vendas.
app.use("/api/vendas", rotasVendas);

// Inicia o servidor local.
app.listen(PORTA, () => {
  console.log(`Servidor rodando em http://localhost:${PORTA}`);
});
