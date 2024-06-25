let pendingRequests = 0;
let produtosAdicionados = {};

/**
 * Incrementa o contador de requisições pendentes.
 */
function incrementPendingRequests() {
  pendingRequests++;
}

/**
 * Decrementa o contador de requisições pendentes e
 * esconde o spinner de carregamento se todas as requisições estiverem completas.
 */
function decrementPendingRequests() {
  pendingRequests--;
  if (pendingRequests === 0) {
    hideLoadingSpinner();
  }
}

/**
 * Calcula o valor total do produto com base no preço unitário, desconto e quantidade.
 */
function calcularTotal(precoUnitarioID, desconto, quantidadeID, totalInputId) {
  let preco = parseFloat(document.getElementById(precoUnitarioID).value);
  let desc = parseFloat(desconto);
  let quantidade = parseInt(document.getElementById(quantidadeID).value);

  if (!isNaN(preco) && !isNaN(quantidade)) {
    let total = preco * quantidade - (isNaN(desc) ? 0 : desc);
    document.getElementById(totalInputId).value = total.toFixed(2); // Arredonda para duas casas decimais
  } else {
    document.getElementById(totalInputId).value = ""; // Limpa o campo se o preço ou quantidade não forem numéricos
  }
}

/**
 * Configura os eventos de mudança no desconto e quantidade para recalcular o total.
 */
function handleDescontoChange(descontoInputId, precoUnitarioID, quantidadeID, totalInputId) {
  let descontoInput = document.getElementById(descontoInputId);
  let quantidadeInput = document.getElementById(quantidadeID);
  let totalInput = document.getElementById(totalInputId);
  let precoUnitario = parseFloat(document.getElementById(precoUnitarioID).value);

  // Define o total inicial ao carregar a página
  totalInput.value = (precoUnitario * parseInt(quantidadeInput.value)).toFixed(2);

  // Eventos de input para recalcular o total
  [descontoInput, quantidadeInput].forEach((input) => {
    input.addEventListener("input", function () {
      let descontoValue = descontoInput.value;
      calcularTotal(precoUnitarioID, descontoValue, quantidadeID, totalInputId);
    });
  });
}

/**
 * Mostra o spinner de carregamento.
 */
function showLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "block";
  document.getElementById("myTabContent").style.filter = "blur(17px)";
}

/**
 * Esconde o spinner de carregamento.
 */
function hideLoadingSpinner() {
  document.getElementById("loadingSpinner").style.display = "none";
  document.getElementById("myTabContent").style.filter = "none";
}

/**
 * Realiza uma requisição à API.
 */
function requestAPI(url, callback) {
  incrementPendingRequests();
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    } else {
      console.error("Erro na requisição. Status:", xhr.status);
    }
    decrementPendingRequests();
  };
  xhr.onerror = function () {
    console.error("Erro na requisição.");
    decrementPendingRequests();
  };
  xhr.send();
}

/**
 * Obtém o nome do cliente a partir do ID.
 */
function obterNomeCliente(clienteId) {
  showLoadingSpinner();
  requestAPI(`/api/obter_nome_cliente/?cliente_id=${clienteId}`, function (response) {
    if (response.nome_cliente) {
      document.getElementById("clientesInput").value = response.nome_cliente;
    } else {
      console.error("Erro ao obter nome do cliente:", response.error);
    }
  });
}

/**
 * Obtém o nome do vendedor a partir do ID.
 */
function obterNomeVendedor(vendedorId) {
  showLoadingSpinner();
  requestAPI(`/api/obter_nome_vendedor/?vendedor_id=${vendedorId}`, function (response) {
    if (response.nome_vendedor) {
      document.getElementById("vendedoresInput").value = response.nome_vendedor;
    } else {
      console.error("Erro ao obter nome do vendedor:", response.error);
    }
  });
}

/**
 * Obtém o preço do produto a partir do ID.
 */
function obterPrecoProduto(produtoId, precoId) {
  showLoadingSpinner();
  requestAPI(`/api/obter_preco_produto/?produto_id=${produtoId}`, function (response) {
    if (response.preco_produto) {
      document.getElementById(precoId).value = response.preco_produto;
      handleDescontoChange(
        `desconto${produtoId}Input`,
        `preco${produtoId}Input`,
        `quantidade${produtoId}Input`,
        `total${produtoId}Input`
      );
    } else {
      console.error("Erro ao obter preço do produto:", response.error);
    }
  });
}

/**
 * Obtém o nome do produto a partir do ID.
 */
function obterNomeProduto(produtoId, inputId) {
  requestAPI(`/api/obter_nome_produto/?produto_id=${produtoId}`, function (response) {
    if (response.nome_produto) {
      document.getElementById(inputId).value = response.nome_produto;
    } else {
      console.error("Erro ao obter nome do produto:", response.error);
    }
  });
}

/**
 * Adiciona um novo produto na tabela.
 */
function adicionarProduto(produtoId) {
  if (produtosAdicionados[produtoId]) {
    // Incrementa a quantidade do produto existente
    let quantidadeInput = document.getElementById(`quantidade${produtoId}Input`);
    quantidadeInput.value = parseInt(quantidadeInput.value) + 1;
    calcularTotal(
      `preco${produtoId}Input`,
      document.getElementById(`desconto${produtoId}Input`).value,
      `quantidade${produtoId}Input`,
      `total${produtoId}Input`
    );
  } else {
    // Adiciona um novo produto
    produtosAdicionados[produtoId] = { quantidade: 1 };
    obterNomeProduto(produtoId, `produto${produtoId}Input`);
    obterPrecoProduto(produtoId, `preco${produtoId}Input`);
    let novoProduto = `
                <tr class="align-items-center" id="produto${produtoId}Row">
                    <td class="col-1">
                        <input type="number" class="form-control form-control-sm" id="quantidade${produtoId}Input" placeholder="Qtd." value="1" readonly>
                    </td>
                    <td class="col-6">
                        <div class="input-group">
                            <input type="text" class="form-control form-control-sm" id="produto${produtoId}Input" placeholder="Nome do produto">
                        </div>
                    </td>
                    <td>
                        <input type="text" class="form-control form-control-sm" id="preco${produtoId}Input" placeholder="Unitário" readonly>
                    </td>
                    <td>
                        <input type="number" class="form-control form-control-sm" id="desconto${produtoId}Input" placeholder="Desconto">
                    </td>
                    <td>
                        <input type="text" class="form-control form-control-sm" id="total${produtoId}Input" placeholder="Total" readonly>
                    </td>
                    <td>
                        <button class="btn btn-danger btn-sm" onclick="removerProduto('${produtoId}')">Remover</button>
                    </td>
                </tr>`;
    document.getElementById("produtosContainer").insertAdjacentHTML("beforeend", novoProduto);
    handleDescontoChange(
      `desconto${produtoId}Input`,
      `preco${produtoId}Input`,
      `quantidade${produtoId}Input`,
      `total${produtoId}Input`
    );
  }
}

/**
 * Remove um produto da lista e do localStorage.
 */
function removerProduto(produtoId) {
  // Remove da lista local
  delete produtosAdicionados[produtoId];

  // Remove da interface
  const produtoRow = document.getElementById(`produto${produtoId}Row`);
  if (produtoRow) {
    produtoRow.remove();
  }

  // Remove do localStorage
  const contadorProdutoId = parseInt(localStorage.getItem("contadorProdutoId"));
  let novoContador = 0;
  const novosProdutos = {};

  for (let i = 1; i <= contadorProdutoId; i++) {
    const prodId = localStorage.getItem(`produtoId${i}`);
    if (prodId !== produtoId && prodId) {
      novoContador++;
      localStorage.setItem(`produtoId${novoContador}`, prodId);

      // Atualiza o objeto de novos produtos para refletir no localStorage
      novosProdutos[prodId] = { quantidade: produtosAdicionados[prodId]?.quantidade || 1 };
    }
  }

  // Remove itens excedentes no localStorage
  for (let i = novoContador + 1; i <= contadorProdutoId; i++) {
    localStorage.removeItem(`produtoId${i}`);
  }

  localStorage.setItem("contadorProdutoId", novoContador);
  produtosAdicionados = novosProdutos;
}

// Inicialização ao carregar a página
document.addEventListener("DOMContentLoaded", function () {
  const clienteId = localStorage.getItem("clienteId");
  const vendedorId = localStorage.getItem("vendedorId");
  const contadorProdutoId = localStorage.getItem("contadorProdutoId") || 0;

  if (clienteId) obterNomeCliente(clienteId);
  if (vendedorId) obterNomeVendedor(vendedorId);

  // Carrega os produtos salvos no localStorage
  for (let i = 1; i <= contadorProdutoId; i++) {
    let produtoId = localStorage.getItem(`produtoId${i}`);
    if (produtoId) {
      adicionarProduto(produtoId);
    }
  }
});
