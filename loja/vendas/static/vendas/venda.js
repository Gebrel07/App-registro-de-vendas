let produtosAdicionados = {};
let pendingRequests = 0;

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
      hideLoadingSpinner();
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
      hideLoadingSpinner();
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
      hideLoadingSpinner();
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
      hideLoadingSpinner();
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
    obterNomeProduto(itemVenda.produtoId)
      .then(nomeProduto => {
        document.getElementById(`produto${itemVenda.produtoId}Input`).value = nomeProduto;
      })
      .catch(error => {
        console.error("Erro ao obter nome do produto:", error);
      });

    obterPrecoProduto(itemVenda.produtoId)
      .then(precoProduto => {
        document.getElementById(`preco${itemVenda.produtoId}Input`).value = precoProduto;
        calcularTotal(itemVenda);
      })
      .catch(error => {
        console.error("Erro ao obter preço do produto:", error);
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
 * Remove um produto da lista.
 * @param {number} produtoId - O ID do produto a ser removido.
 */
function removerProduto(produtoId) {
  let orderIdList = JSON.parse(localStorage.getItem("orderIdList"));
 
   
  delete produtosAdicionados[produtoId];
  //remover da interface
  removerProdutoInterface(produtoId); 
  //remove do localStorage

  localStorage.removeItem("itemVenda"+produtoId);

  //decremente o contador de linhas
  contador = localStorage.getItem('contadorProdutoId');
  contador--;
  localStorage.setItem("contadorProdutoId",contador);

  //remover da lista de ordem de carregamento
  orderIdList = JSON.parse(localStorage.getItem("orderIdList"));
  index = orderIdList.indexOf(`${produtoId}`);
  orderIdList.splice(index, 1);
  localStorage.setItem("orderIdList",JSON.stringify(orderIdList));


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


function calcularTotal(itemVenda) {
  let totalInput = document.getElementById(`total${itemVenda.produtoId}Input`);
  let preco = document.getElementById(`preco${itemVenda.produtoId}Input`);
  let total = (Number(preco.value) * itemVenda.quantidade) - itemVenda.desconto;
  totalInput.value = total.toFixed(2);
}

/**
 * Recalcula o total do produto quando a quantidade é alterada.
 * @param {Object} itemVenda - Dicionário com dados da venda (produtoId, quantidade, desconto).
 */
function handleQuantidadeChange(itemVenda, quantidadeInput) {
  if (quantidadeInput) {
    quantidadeInput.addEventListener("change", function () {
      itemVenda.quantidade = quantidadeInput.value;
      localStorage.setItem(`itemVenda${itemVenda.produtoId}`, JSON.stringify(itemVenda));
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
      localStorage.setItem(`itemVenda${itemVenda.produtoId}`, JSON.stringify(itemVenda));
      calcularTotal(itemVenda);
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
  var orderIdList = JSON.parse(localStorage.getItem("orderIdList"));

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
    if (orderIdList){
      let itemVenda = JSON.parse(localStorage.getItem(`itemVenda${orderIdList[i-1]}`));

      if (itemVenda) {
        
        adicionarProduto(itemVenda);
      }
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
