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
  let xhr = new XMLHttpRequest();
  xhr.open("GET", url, true);
  xhr.onload = function () {
    if (xhr.status == 200) {
      callback(JSON.parse(xhr.responseText));
    } else {
      console.error("Erro na requisição. Status:", xhr.status);
    }
  };
  xhr.onerror = function () {
    console.error("Erro na requisição.");
  };
  xhr.send();
}

function alterarItemlistaItens(itemVenda) {
  // Obtém a lista de produtos do localStorage
  const listaItens = JSON.parse(localStorage.getItem("listaItens")) || [];

  // Cria uma nova lista de produtos com o item alterado
  const listaItensAlterada = listaItens.map(item => {
    // Se o ID do produto corresponder ao ID do itemVenda, substitua-o
    if (item.produtoId === itemVenda.produtoId) {
      return itemVenda;
    }
    // Caso contrário, mantenha o produto original
    return item;
  });

  // Armazena a lista alterada novamente no localStorage
  localStorage.setItem("listaItens", JSON.stringify(listaItensAlterada));
}


/**
 * Função assíncrona para buscar dados de uma URL fornecida.
 *
 * @param {string} url - A URL da qual buscar os dados.
 * @returns {Promise<Object|null>} Uma promessa que resolve para os dados em formato JSON 
 *                                  se a requisição for bem-sucedida, ou null se houver um erro.
 */
async function fetchData(url) {
  try {
    const resp = await fetch(url);
    if (!resp.ok) {
      throw new Error(`Erro HTTP: ${resp.status}`);
    }
    const jsonData = await resp.json();
    return jsonData;
  } catch (error) {
    console.error("Erro no request: ", error);
    return null;
  }
}

/**
 * Obtém o nome do produto pelo ID.
 * @param {number} produtoId - O ID do produto.
 * @returns {Promise<string>} - Promise que resolve com o nome do produto ou rejeita com erro.
 */
function obterNomeProduto(produtoId) {
  return new Promise((resolve, reject) => {
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
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function adicionarProduto(itemVenda) {
  const idProduto = itemVenda.produtoId;
  fetchData(`/api/produtos/${idProduto}`).then((produto) => {
    document.getElementById(`produto${idProduto}Input`).value = produto.nome;
    document.getElementById(`preco${idProduto}Input`).value = produto.preco;
  });
  inserirNovoProduto(itemVenda);
  configurarEventosProduto(itemVenda);
}

/**
 * Insere um novo produto na interface.
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function inserirNovoProduto(itemVenda) {
  let produtoId = itemVenda.produtoId;
  let novoProduto = `
    <tr class="align-items-center" id="produto${produtoId}Row">
      <td class="col-1">
        <input type="number" class="form-control form-control-sm" id="quantidade${produtoId}Input" placeholder="Qtd." value="1">
      </td>
      <td class="col-6">
        <div class="input-group">
          <input type="text" class="form-control form-control-sm" id="produto${produtoId}Input" placeholder="Nome do produto" readonly>
        </div>
      </td>
      <td>
        <input type="text" class="form-control form-control-sm" id="preco${produtoId}Input" placeholder="Unitário" readonly>
      </td>
      <td>
        <input type="number" class="form-control form-control-sm" id="desconto${produtoId}Input" placeholder="Desconto" readonly>
      </td>
      <td>
        <input type="text" class="form-control form-control-sm" id="total${produtoId}Input" placeholder="Total" readonly>
      </td>
      <td>
        <button 
          class="btn btn-danger"
          type="button"
          data-bs-toggle="modal"
          data-bs-target="#confirmationModal"
          data-produto-id="${produtoId}"
          >Remover
        </button>
      </td>
    </tr>`;
  document.getElementById("produtosContainer").insertAdjacentHTML("beforeend", novoProduto);
}

/**
 * Configura eventos para o produto adicionado.
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function configurarEventosProduto(itemVenda) {
  let produtoId = itemVenda.produtoId;
  let quantidadeInput = document.getElementById(`quantidade${produtoId}Input`);
  let descontoInput = document.getElementById(`desconto${produtoId}Input`);

  if (quantidadeInput) {
    quantidadeInput.value = itemVenda.quantidade;
    handleQuantidadeChange(itemVenda, quantidadeInput);
  } else {
    console.error(`Elemento com ID quantidade${produtoId}Input não encontrado.`);
  }

  if (descontoInput) {
    descontoInput.value = itemVenda.desconto;
    handleDescontoChange(itemVenda, descontoInput);
  } else {
    console.error(`Elemento com ID desconto${produtoId}Input não encontrado.`);
  }
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

function removerProdutoLocalStorage(produtoId){
  const listaItens = JSON.parse(localStorage.getItem("listaItens"));

  const novalistaItens = listaItens.filter(produto => produto.produtoId !== produtoId);
  localStorage.setItem("listaItens",JSON.stringify(novalistaItens))
}



/**
 * Remove um produto da lista.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerProduto(produtoId) {

  //Remover da interface
  removerProdutoInterface(produtoId); 

  removerProdutoLocalStorage(produtoId);
}


/**
 * Calcula o total da venda e bota na input correta
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function calcularTotal(itemVenda) {
  let totalInput = document.getElementById(`total${itemVenda.produtoId}Input`);
  let preco = document.getElementById(`preco${itemVenda.produtoId}Input`);
  let total = (Number(preco.value) * itemVenda.quantidade) - itemVenda.desconto;
  totalInput.value = total.toFixed(2);
}

/**
 * Recalcula o total do produto quando a quantidade é alterada.
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 * @param {Object} quantidadeInput - Referencia o inputBox do item da venda
 */
function handleQuantidadeChange(itemVenda, quantidadeInput) {
  if (quantidadeInput) {
    quantidadeInput.addEventListener("change", function () {
      itemVenda.quantidade = quantidadeInput.value;
      alterarItemlistaItens(itemVenda);
      calcularTotal(itemVenda);
    });
  } else {
    console.error(`Elemento com ID ${quantidadeInput} não encontrado.`);
  }
}

/**
 * Lida com mudanças no desconto de um produto.
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 * @param {string} descontoInput - ID do input do desconto.
 */
function handleDescontoChange(itemVenda, descontoInput) {
  if (descontoInput) {
    descontoInput.addEventListener("change", function () {
      itemVenda.desconto = Number(descontoInput.value).toFixed(2);
      alterarItemlistaItens(itemVenda);
    });
  } else {
    console.error(`Elemento com ID ${descontoInput} não encontrado.`);
  }
}

/**
 * Configuração inicial ao carregar a página.
 */
document.addEventListener('DOMContentLoaded', async function () {
  showLoadingSpinner();

  const clienteId = localStorage.getItem('clienteId')|| 0;
  const vendedorId = localStorage.getItem('vendedorId') || 0;
  const listaItens = JSON.parse(localStorage.getItem('listaItens')) || [];
 

  if (clienteId) {
    const dadosCliente = await fetchData(`/api/obter_nome_cliente/?cliente_id=${clienteId}`);
    document.getElementById("clientesInput").value = dadosCliente.nome_cliente;
  }

  if (vendedorId) {
    const dadosVendedor = await fetchData(`/api/obter_nome_vendedor/?vendedor_id=${vendedorId}`);
    document.getElementById("vendedoresInput").value = dadosVendedor.nome_vendedor;
  }

  for (const item of listaItens) {
    adicionarProduto(item);
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

  hideLoadingSpinner();
});
