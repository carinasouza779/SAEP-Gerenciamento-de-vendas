// routes/vendas.js - rotas da API para gerenciar vendas

const express = require("express");
const router = express.Router();
const db = require("../database/db");

// GET /api/vendas
// READ / LISTAR: busca todas as vendas registradas.
router.get("/", (req, res) => {
  try {
    const vendas = db.prepare(
      "SELECT * FROM vendas ORDER BY id DESC"
    ).all();

    res.json(vendas);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível listar as vendas." });
  }
});

// GET /api/vendas/:id
// READ / CONSULTAR: busca uma venda específica pelo ID.
router.get("/:id", (req, res) => {
  try {
    const venda = db.prepare(
      "SELECT * FROM vendas WHERE id = ?"
    ).get(req.params.id);

    if (!venda) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }

    res.json(venda);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível consultar a venda." });
  }
});

// POST /api/vendas
// CREATE / CADASTRAR: recebe os dados do front-end e grava uma venda.
router.post("/", (req, res) => {
  const { cliente, produto, quantidade, valor_unitario, data_venda } = req.body;

  if (!cliente || !produto || quantidade === undefined ||
      valor_unitario === undefined || !data_venda) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const qtd = Number(quantidade);
  const valor = Number(valor_unitario);

  if (!Number.isInteger(qtd) || qtd <= 0 ||
      !Number.isFinite(valor) || valor < 0) {
    return res.status(400).json({ erro: "Quantidade ou valor inválido." });
  }

  // O total é calculado no servidor para evitar valores incorretos enviados pelo navegador.
  const total = qtd * valor;

  try {
    const resultado = db.prepare(`
      INSERT INTO vendas (cliente, produto, quantidade, valor_unitario, total, data_venda)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(cliente.trim(), produto.trim(), qtd, valor, total, data_venda);

    const novaVenda = db.prepare(
      "SELECT * FROM vendas WHERE id = ?"
    ).get(Number(resultado.lastInsertRowid));

    res.status(201).json(novaVenda);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível cadastrar a venda." });
  }
});

// PUT /api/vendas/:id
// UPDATE / EDITAR: altera os dados da venda que possui o ID informado.
router.put("/:id", (req, res) => {
  const { cliente, produto, quantidade, valor_unitario, data_venda } = req.body;

  if (!cliente || !produto || quantidade === undefined ||
      valor_unitario === undefined || !data_venda) {
    return res.status(400).json({ erro: "Preencha todos os campos." });
  }

  const qtd = Number(quantidade);
  const valor = Number(valor_unitario);

  if (!Number.isInteger(qtd) || qtd <= 0 ||
      !Number.isFinite(valor) || valor < 0) {
    return res.status(400).json({ erro: "Quantidade ou valor inválido." });
  }

  const total = qtd * valor;

  try {
    const resultado = db.prepare(`
      UPDATE vendas
      SET cliente = ?, produto = ?, quantidade = ?,
          valor_unitario = ?, total = ?, data_venda = ?
      WHERE id = ?
    `).run(cliente.trim(), produto.trim(), qtd, valor, total, data_venda, req.params.id);

    if (Number(resultado.changes) === 0) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }

    const vendaAtualizada = db.prepare(
      "SELECT * FROM vendas WHERE id = ?"
    ).get(req.params.id);

    res.json(vendaAtualizada);
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível editar a venda." });
  }
});

// DELETE /api/vendas/:id
// DELETE / EXCLUIR: remove a venda indicada pelo ID.
router.delete("/:id", (req, res) => {
  try {
    const resultado = db.prepare(
      "DELETE FROM vendas WHERE id = ?"
    ).run(req.params.id);

    if (Number(resultado.changes) === 0) {
      return res.status(404).json({ erro: "Venda não encontrada." });
    }

    res.json({ mensagem: "Venda excluída com sucesso." });
  } catch (erro) {
    res.status(500).json({ erro: "Não foi possível excluir a venda." });
  }
});

module.exports = router;
