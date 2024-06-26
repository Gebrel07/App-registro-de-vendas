let pendingRequests = 0;
let produtosAdicionados = {};

/**
 * Incrementa a quantidade de requisições pendentes.
 */
function incrementPendingRequests() {
  pendingRequests++;
}

/**
 * Decrementa a quantidade de requisições pendentes.
 * Se não houver mais requisições pendentes, esconde o spinner de carregamento.
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
 * @param {function} callback - A função callback a ser chamada com a resposta.
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
 * @returns {Promise<string>} - Uma Promise que resolve com o nome do cliente, serve para fazer
 * resolve e reject 
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
 * @returns {Promise<string>} - Uma Promise que resolve com o nome do vendedor,serve para fazer
 * resolve e reject 
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
 * @returns {Promise<string>} - Uma Promise que resolve com o nome do produto, serve para fazer
 * resolve e reject 
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
 * @returns {Promise<number>} - Uma Promise que resolve com o preço do produto, serve para fazer
 * resolve e reject 
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
 * @param {number} produtoId - O ID do produto a ser adicionado.
 */
function adicionarProduto(produtoId) {
  if (produtosAdicionados[produtoId]) {
    incrementarQuantidadeProduto(produtoId);
  } else {
    produtosAdicionados[produtoId] = { quantidade: 1 };

    obterNomeProduto(produtoId)
      .then(nomeProduto => {
        document.getElementById(`produto${produtoId}Input`).value = nomeProduto;
      })
      .catch(error => {
        console.error("Erro ao obter nome do produto:", error);
      });

    obterPrecoProduto(produtoId)
      .then(precoProduto => {
        document.getElementById(`preco${produtoId}Input`).value = precoProduto;
        handleDescontoChange(
          `desconto${produtoId}Input`,
          `preco${produtoId}Input`,
          `quantidade${produtoId}Input`,
          `total${produtoId}Input`
        );
      })
      .catch(error => {
        console.error("Erro ao obter preço do produto:", error);
      });

    inserirNovoProduto(produtoId);
    configurarEventosProduto(produtoId);
  }
}

/**
 * Incrementa a quantidade de um produto já adicionado.
 * @param {number} produtoId - O ID do produto a ter sua quantidade incrementada.
 */
function incrementarQuantidadeProduto(produtoId) {
  let quantidadeInput = document.getElementById(`quantidade${produtoId}Input`);
  quantidadeInput.value = parseInt(quantidadeInput.value) + 1;
  recalcularTotal(produtoId);
}

/**
 * Insere um novo produto na interface.
 * @param {number} produtoId - O ID do produto a ser inserido.
 */
function inserirNovoProduto(produtoId) {
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
        <button class="btn btn-danger" type="button" data-bs-toggle="modal" data-bs-target="#modal" data-produto-id="${produtoId}">Remover</button>
      </td>
    </tr>`;
  document.getElementById("produtosContainer").insertAdjacentHTML("beforeend", novoProduto);
}

/**
 * Configura eventos para o produto adicionado.
 * @param {number} produtoId - O ID do produto a ter eventos configurados.
 */
function configurarEventosProduto(produtoId) {
  handleDescontoChange(
    `desconto${produtoId}Input`,
    `preco${produtoId}Input`,
    `quantidade${produtoId}Input`,
    `total${produtoId}Input`
  );
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
    const prodId = localStorage.getItem(`produtoId${i}`);
    if (prodId !== produtoId && prodId) {
      novoContador++;
      localStorage.setItem(`produtoId${novoContador}`, prodId);
      novosProdutos[prodId] = { quantidade: produtosAdicionados[prodId]?.quantidade || 1 };
    }
  }


  for (let i = novoContador + 1; i <= contadorProdutoId; i++) {
    localStorage.removeItem(`produtoId${i}`);
  }

  localStorage.setItem("contadorProdutoId", novoContador);
  produtosAdicionados = novosProdutos;
}
/**
 * Funções para calcular e atualizar os valores dos produtos.
 */

/**
 * Calcula o total do produto com base no preço unitário, desconto e quantidade.
 * @param {string} precoUnitarioID - ID do elemento de entrada do preço unitário.
 * @param {number} desconto - Valor do desconto.
 * @param {string} quantidadeID - ID do elemento de entrada da quantidade.
 * @param {string} totalInputId - ID do elemento de entrada do total.
 */
function calcularTotal(precoUnitarioID, desconto, quantidadeID, totalInputId) {
  let preco = parseFloat(document.getElementById(precoUnitarioID).value);
  let desc = parseFloat(desconto);
  let quantidade = parseInt(document.getElementById(quantidadeID).value);

  if (!isNaN(preco) && !isNaN(quantidade)) {
    let total = preco * quantidade - (isNaN(desc) ? 0 : desc);
    document.getElementById(totalInputId).value = total.toFixed(2);
  } else {
    document.getElementById(totalInputId).value = "";
  }
}

/**
 * Recalcula o total do produto quando a quantidade ou desconto é alterada.
 * @param {number} produtoId - ID do produto.
 */
function recalcularTotal(produtoId) {
  let quantidadeInput = document.getElementById(`quantidade${produtoId}Input`);
  let descontoInput = document.getElementById(`desconto${produtoId}Input`);
  let precoInput = document.getElementById(`preco${produtoId}Input`);
  let totalInput = document.getElementById(`total${produtoId}Input`);

  calcularTotal(precoInput.id, descontoInput.value, quantidadeInput.id, totalInput.id);
}

/**
 * Trata a mudança no desconto e atualiza o total.
 * @param {string} descontoInputId - ID do elemento de entrada do desconto.
 * @param {string} precoUnitarioID - ID do elemento de entrada do preço unitário.
 * @param {string} quantidadeID - ID do elemento de entrada da quantidade.
 * @param {string} totalInputId - ID do elemento de entrada do total.
 */
function handleDescontoChange(descontoInputId, precoUnitarioID, quantidadeID, totalInputId) {
  let descontoInput = document.getElementById(descontoInputId);
  let quantidadeInput = document.getElementById(quantidadeID);
  let totalInput = document.getElementById(totalInputId);
  let precoUnitario = parseFloat(document.getElementById(precoUnitarioID).value);

  totalInput.value = (precoUnitario * parseInt(quantidadeInput.value)).toFixed(2);

  [descontoInput, quantidadeInput].forEach((input) => {
    input.addEventListener("input", function () {
      let descontoValue = descontoInput.value;
      calcularTotal(precoUnitarioID, descontoValue, quantidadeID, totalInputId);
    });
  });
}

/**
 * Configuração inicial ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', async function() {
  const clienteId = localStorage.getItem('clienteId');
  const vendedorId = localStorage.getItem('vendedorId');
  const contadorProdutoId = localStorage.getItem('contadorProdutoId') || 0;
  let produtoIdToRemove;

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
    let produtoId = localStorage.getItem(`produtoId${i}`);
    if (produtoId) {
      adicionarProduto(produtoId);
    }
  }
//Função que monitora o click no botão de abrir o modal
  document.querySelectorAll('[data-bs-toggle="modal"]').forEach(button => {
    button.addEventListener('click', function() {
      let produtoNome = document.getElementById("produto" + this.getAttribute('data-produto-id') + "Input").value;
      document.getElementById("nomeProdutoModal").textContent = produtoNome;
      produtoIdToRemove = this.getAttribute('data-produto-id');
    });
  });

  //Função que monitora o click do botão confirmar no modal
  document.getElementById('confirmRemoveBtn').addEventListener('click', function() {
    if (produtoIdToRemove) {
      removerProduto(produtoIdToRemove);
      produtoIdToRemove = null;
      document.getElementById('modal').classList.remove('show');
      location.reload();
    }
  });
});
