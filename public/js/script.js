// public/js/script.js - comunicação do front-end com a API

const API = "/api/vendas";

const form = document.getElementById("formVenda");
const lista = document.getElementById("listaVendas");
const mensagem = document.getElementById("mensagem");
const vendaId = document.getElementById("vendaId");
const totalVendas = document.getElementById("totalVendas");
const valorTotal = document.getElementById("valorTotal");
const tituloFormulario = document.getElementById("tituloFormulario");
const botaoSalvar = document.getElementById("botaoSalvar");
const botaoCancelar = document.getElementById("botaoCancelar");

// Carrega o histórico quando a página termina de abrir.
document.addEventListener("DOMContentLoaded", carregarVendas);

// READ / LISTAR: busca as vendas na API e mostra os registros na tabela.
async function carregarVendas() {
  try {
    const resposta = await fetch(API);
    const vendas = await resposta.json();
    if (!resposta.ok) throw new Error(vendas.erro || "Erro ao carregar vendas.");

    totalVendas.textContent = vendas.length;
    const soma = vendas.reduce((acumulado, venda) => acumulado + Number(venda.total), 0);
    valorTotal.textContent = soma.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

    if (vendas.length === 0) {
      lista.innerHTML = '<tr><td colspan="8" class="vazio">Nenhuma venda registrada.</td></tr>';
      return;
    }

    lista.innerHTML = "";
    vendas.forEach((venda) => {
      const linha = document.createElement("tr");
      const dados = [
        venda.id,
        formatarData(venda.data_venda),
        venda.cliente,
        venda.produto,
        venda.quantidade,
        moeda(venda.valor_unitario),
        moeda(venda.total)
      ];

      // Cria as células usando textContent para não interpretar texto como HTML.
      dados.forEach((dado) => {
        const celula = document.createElement("td");
        celula.textContent = dado;
        linha.appendChild(celula);
      });

      const celulaAcoes = document.createElement("td");
      const grupo = document.createElement("div");
      grupo.className = "acoes";

      const editar = document.createElement("button");
      editar.textContent = "Editar";
      editar.className = "pequeno secundario";
      editar.addEventListener("click", () => prepararEdicao(venda));

      const excluir = document.createElement("button");
      excluir.textContent = "Excluir";
      excluir.className = "pequeno perigo";
      excluir.addEventListener("click", () => excluirVenda(venda.id));

      grupo.append(editar, excluir);
      celulaAcoes.appendChild(grupo);
      linha.appendChild(celulaAcoes);
      lista.appendChild(linha);
    });
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

// CREATE / UPDATE: envia os campos ao servidor por POST ou PUT.
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const id = vendaId.value;
  const dados = {
    cliente: document.getElementById("cliente").value.trim(),
    produto: document.getElementById("produto").value.trim(),
    quantidade: Number(document.getElementById("quantidade").value),
    valor_unitario: Number(document.getElementById("valor_unitario").value),
    data_venda: document.getElementById("data_venda").value
  };

  const metodo = id ? "PUT" : "POST";
  const url = id ? `${API}/${id}` : API;

  try {
    const resposta = await fetch(url, {
      method: metodo,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(dados)
    });

    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível salvar.");

    mostrarMensagem(id ? "Venda atualizada com sucesso!" : "Venda registrada com sucesso!");
    limparFormulario();
    carregarVendas();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
});

// Preenche o formulário com os dados escolhidos para permitir a edição.
function prepararEdicao(venda) {
  vendaId.value = venda.id;
  document.getElementById("cliente").value = venda.cliente;
  document.getElementById("produto").value = venda.produto;
  document.getElementById("quantidade").value = venda.quantidade;
  document.getElementById("valor_unitario").value = venda.valor_unitario;
  document.getElementById("data_venda").value = venda.data_venda;

  tituloFormulario.textContent = "Editar venda";
  botaoSalvar.textContent = "Salvar alterações";
  botaoCancelar.classList.remove("oculto");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

// DELETE / EXCLUIR: confirma e solicita ao servidor a remoção da venda.
async function excluirVenda(id) {
  if (!confirm("Deseja realmente excluir esta venda?")) return;

  try {
    const resposta = await fetch(`${API}/${id}`, { method: "DELETE" });
    const resultado = await resposta.json();
    if (!resposta.ok) throw new Error(resultado.erro || "Não foi possível excluir.");

    mostrarMensagem("Venda excluída com sucesso!");
    carregarVendas();
  } catch (erro) {
    mostrarMensagem(erro.message, true);
  }
}

// Formata valores monetários e datas para exibição.
function moeda(valor) {
  return Number(valor).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function formatarData(data) {
  const partes = data.split("-");
  return partes.length === 3 ? `${partes[2]}/${partes[1]}/${partes[0]}` : data;
}

// Limpa os campos e retorna o formulário ao modo de cadastro.
function limparFormulario() {
  form.reset();
  vendaId.value = "";
  tituloFormulario.textContent = "Registrar venda";
  botaoSalvar.textContent = "Registrar venda";
  botaoCancelar.classList.add("oculto");
}

// Exibe mensagens de sucesso ou erro para o usuário.
function mostrarMensagem(texto, erro = false) {
  mensagem.textContent = texto;
  mensagem.classList.toggle("erro", erro);
}

botaoCancelar.addEventListener("click", limparFormulario);
document.getElementById("botaoAtualizar").addEventListener("click", carregarVendas);
