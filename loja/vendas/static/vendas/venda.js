// Variável para contagem de requisições pendentes
let pendingRequests = 0;
// Dicionário para armazenar produtos adicionados
let produtosAdicionados = {};

/**
 * Incrementa a quantidade de requisições pendentes.
 */
function incrementPendingRequests() {
  pendingRequests++;
}

/**
 * Decrementa a quantidade de requisições pendentes.
 * Esconde o spinner de carregamento se não houver mais requisições pendentes.
 */
function decrementPendingRequests() {
  pendingRequests--;
  if (pendingRequests === 0) {
    hideLoadingSpinner();
  }
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
 * Faz uma requisição ao servidor.
 * @param {string} url - A URL para fazer a requisição.
 * @param {function} callback - Função callback chamada com a resposta.
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
 * Obtém o nome do cliente pelo ID.
 * @param {number} clienteId - O ID do cliente.
 * @returns {Promise<string>} - Promise que resolve com o nome do cliente ou rejeita com erro.
 */
function obterNomeCliente(clienteId) {
  return new Promise((resolve, reject) => {
    showLoadingSpinner();
    requestAPI(`/api/obter_nome_cliente/?cliente_id=${clienteId}`, function (response) {
      if (response.nome_cliente) {
        resolve(response.nome_cliente);
      } else {
        console.error("Erro ao obter nome do cliente:", response.error);
        reject(response.error);
      }
    });
  });
}

/**
 * Obtém o nome do vendedor pelo ID.
 * @param {number} vendedorId - O ID do vendedor.
 * @returns {Promise<string>} - Promise que resolve com o nome do vendedor ou rejeita com erro.
 */
function obterNomeVendedor(vendedorId) {
  return new Promise((resolve, reject) => {
    showLoadingSpinner();
    requestAPI(`/api/obter_nome_vendedor/?vendedor_id=${vendedorId}`, function (response) {
      if (response.nome_vendedor) {
        resolve(response.nome_vendedor);
      } else {
        console.error("Erro ao obter nome do vendedor:", response.error);
        reject(response.error);
      }
    });
  });
}

/**
 * Obtém o nome do produto pelo ID.
 * @param {number} produtoId - O ID do produto.
 * @returns {Promise<string>} - Promise que resolve com o nome do produto ou rejeita com erro.
 */
function obterNomeProduto(produtoId) {
  return new Promise((resolve, reject) => {
    showLoadingSpinner();
    requestAPI(`/api/obter_nome_produto/?produto_id=${produtoId}`, function (response) {
      if (response.nome_produto) {
        resolve(response.nome_produto);
      } else {
        console.error("Erro ao obter nome do produto:", response.error);
        reject(response.error);
      }
    });
  });
}

/**
 * Obtém o preço do produto pelo ID.
 * @param {number} produtoId - O ID do produto.
 * @returns {Promise<number>} - Promise que resolve com o preço do produto ou rejeita com erro.
 */
function obterPrecoProduto(produtoId) {
  return new Promise((resolve, reject) => {
    showLoadingSpinner();
    requestAPI(`/api/obter_preco_produto/?produto_id=${produtoId}`, function (response) {
      if (response.preco_produto) {
        resolve(response.preco_produto);
      } else {
        console.error("Erro ao obter preço do produto:", response.error);
        reject(response.error);
      }
    });
  });
}

/**
 * Adiciona um produto à lista.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function adicionarProduto(dictVenda) {
  if (produtosAdicionados[dictVenda.produtoId]) {
    incrementarQuantidadeProduto(dictVenda.produtoId);
  } else {
    produtosAdicionados[dictVenda.produtoId] = { quantidade: 1 };
    obterNomeProduto(dictVenda.produtoId)
      .then(nomeProduto => {
        document.getElementById(`produto${dictVenda.produtoId}Input`).value = nomeProduto;
      })
      .catch(error => {
        console.error("Erro ao obter nome do produto:", error);
      });

    obterPrecoProduto(dictVenda.produtoId)
      .then(precoProduto => {
        document.getElementById(`preco${dictVenda.produtoId}Input`).value = precoProduto.toFixed(2);
        calcularTotal(dictVenda)
      })
      .catch(error => {
        console.error("Erro ao obter preço do produto:", error);
      });

    inserirNovoProduto(dictVenda);
    configurarEventosProduto(dictVenda);
  }
}

/**
 * Insere um novo produto na interface.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function inserirNovoProduto(dictVenda) {
  let produtoId = dictVenda.produtoId;
  let novoProduto = `
    <tr class="align-items-center" id="produto${produtoId}Row">
      <td class="col-1">
        <input type="number" class="form-control form-control-sm" id="quantidade${produtoId}Input" placeholder="Qtd." value="1">
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
        <button 
          class="btn btn-danger"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#modal"
          data-produto-id="${produtoId}"
          >Remover
        </button>
      </td>
    </tr>`;
  document.getElementById("produtosContainer").insertAdjacentHTML("beforeend", novoProduto);
}

/**
 * Configura eventos para o produto adicionado.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function configurarEventosProduto(dictVenda) {
  let produtoId = dictVenda.produtoId;
  let quantidadeInput = document.getElementById(`quantidade${produtoId}Input`);
  let descontoInput = document.getElementById(`desconto${produtoId}Input`);

  if (quantidadeInput) {
    quantidadeInput.value = dictVenda.quantidade;
    handleQuantidadeChange(dictVenda, quantidadeInput);
  } else {
    console.error(`Elemento com ID quantidade${produtoId}Input não encontrado.`);
  }

  if (descontoInput) {
    descontoInput.value = dictVenda.desconto.toFixed(2);
    handleDescontoChange(dictVenda, descontoInput);
  } else {
    console.error(`Elemento com ID desconto${produtoId}Input não encontrado.`);
  }
}

/**
 * Remove um produto da lista.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerProduto(produtoId) {
  delete produtosAdicionados[produtoId];
  removerProdutoInterface(produtoId);
  atualizarLocalStorage(produtoId);
}

/**
 * Remove um produto da interface.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerProdutoInterface(produtoId) {
  const produtoRow = document.getElementById(`produto${produtoId}Row`);
  if (produtoRow) {
    produtoRow.remove();
  }
}

/**
 * Atualiza o LocalStorage após a remoção de um produto.
 * @param {number} produtoId - O ID do produto a ser removido do LocalStorage.
 */
function atualizarLocalStorage(produtoId) {
  const contadorProdutoId = parseInt(localStorage.getItem("contadorProdutoId"));
  let novoContador = 0;
  const novosProdutos = {};

  for (let i = 1; i <= contadorProdutoId; i++) {
    const dictVenda = JSON.parse(localStorage.getItem(`dictVenda${i}`));
    if (dictVenda.produtoId !== produtoId.toString() && dictVenda.produtoId) {
      novoContador++;
      localStorage.setItem(`dictVenda${novoContador}`, JSON.stringify(dictVenda));
      novosProdutos[dictVenda.produtoId] = { quantidade: produtosAdicionados[dictVenda.produtoId]?.quantidade || 1 };
    }
  }

  for (let i = novoContador + 1; i <= contadorProdutoId; i++) {
    localStorage.removeItem(`dictVenda${i}`);
  }

  localStorage.setItem("contadorProdutoId", novoContador);
  produtosAdicionados = novosProdutos;
}

/**
 * Calcula o total do produto.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function calcularTotal(dictVenda) {
  let totalInput = document.getElementById(`total${dictVenda.produtoId}Input`);
  let preco = document.getElementById(`preco${dictVenda.produtoId}Input`);
  let total = (Number(preco.value) * dictVenda.quantidade) - dictVenda.desconto;
  totalInput.value = total.toFixed(2);
}

/**
 * Recalcula o total do produto quando a quantidade é alterada.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 * @param {HTMLElement} quantidadeInput - Elemento de input da quantidade.
 */
function handleQuantidadeChange(dictVenda, quantidadeInput) {
  if (quantidadeInput) {
    quantidadeInput.addEventListener("change", function () {
      dictVenda.quantidade = quantidadeInput.value;
      localStorage.setItem(`dictVenda${dictVenda.produtoId}`, JSON.stringify(dictVenda));
      calcularTotal(dictVenda);
    });
  } else {
    console.error(`Elemento com ID ${quantidadeInput} não encontrado.`);
  }
}

/**
 * Lida com mudanças no desconto de um produto.
 * @param {Object} dictVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 * @param {HTMLElement} descontoInput - Elemento de input do desconto.
 */
function handleDescontoChange(dictVenda, descontoInput) {
  if (descontoInput) {
    descontoInput.addEventListener("change", function () {
      dictVenda.desconto = Number(descontoInput.value).toFixed(2);
      localStorage.setItem(`dictVenda${dictVenda.produtoId}`, JSON.stringify(dictVenda));
      calcularTotal(dictVenda);
    });
  } else {
    console.error(`Elemento com ID ${descontoInput} não encontrado.`);
  }
}

/**
 * Configuração inicial ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', async function () {
  const clienteId = localStorage.getItem('clienteId');
  const vendedorId = localStorage.getItem('vendedorId');
  const contadorProdutoId = localStorage.getItem('contadorProdutoId') || 0;

  if (clienteId) {
    try {
      const nomeCliente = await obterNomeCliente(clienteId);
      document.getElementById('clientesInput').value = nomeCliente;
    } catch (error) {
      console.error("Erro ao obter nome do cliente:", error);
    }
  }

  if (vendedorId) {
    try {
      const nomeVendedor = await obterNomeVendedor(vendedorId);
      document.getElementById('vendedoresInput').value = nomeVendedor;
    } catch (error) {
      console.error("Erro ao obter nome do vendedor:", error);
    }
  }

  for (let i = 1; i <= contadorProdutoId; i++) {
    let dictVenda = JSON.parse(localStorage.getItem(`dictVenda${i}`));
    if (dictVenda) {
      adicionarProduto(dictVenda);
    }
  }

  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function () {
      let produtoId = button.getAttribute('data-produto-id');
      let produtoNome = document.getElementById(`produto${produtoId}Input`).value;
      document.getElementById("nomeProdutoModal").textContent = produtoNome;
      vendaToRemove = produtoId;
    });
  });

  document.getElementById('confirmRemoveBtn').addEventListener('click', function () {
    if (vendaToRemove) {
      removerProduto(vendaToRemove);
      vendaToRemove = null;
      document.getElementById('modal').classList.remove('show');
      location.reload();
    }
  });
});
