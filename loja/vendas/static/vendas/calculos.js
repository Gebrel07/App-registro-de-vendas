/**
 * @function calcular
 * Calcula o total do preço, total do desconto bruto e a quantidade de produtos
 * com base nos itens de venda. Atualiza os campos de input na interface com os 
 * valores calculados e chama a função para manipular mudanças no desconto total.
 *        REFATORAR A FUNÇAO ELA TA GRANDE DEMAIS!!!!!!!!!!!!!!!!!!!
 * @returns {void}
 */
function calcular() {
    document.getElementById("MSGmodificaçãoDesconto").style = "display:none;";
    let totalPreco = 0;
    let totalDescontoBruto = 0;
    let quantidadeProduto = 0;
    const listaItens = JSON.parse(localStorage.getItem("listaItens") || "[]");
 

    // Iterar sobre cada item de venda e calcular totais
    for (let i = 0; i < listaItens.length; i++) {
        const itemVenda = listaItens[i];
        totalPreco += calcularTotalVenda(itemVenda);
        totalDescontoBruto += calcularTotalDesconto(itemVenda);
        quantidadeProduto += itemVenda.quantidade;
    }

    // Atualizar o campo total da venda com desconto aplicado
    document.getElementById("totalVendaInput").value = (totalPreco - totalDescontoBruto).toFixed(2);

    // Calcular o desconto médio percentual
    const descontoMedioPercentual = Math.abs((((totalPreco - totalDescontoBruto) / totalPreco) * 100) - 100);
    document.getElementById("descontoInput").value = `${descontoMedioPercentual.toFixed(2)}%`;

    document.getElementById("comissaoInput").value = "3%";

    // Manipular mudanças no desconto total
    handleDescontoTotalChange(listaItens,totalPreco);
     
}

 
function handleDescontoTotalChange(listaItens, totalPreco) {
    const descontoTotalInput = document.getElementById("descontoInput");

    descontoTotalInput.addEventListener("change", function () {
        var descontoTotalPercentual = parseFloat(descontoTotalInput.value) || 0;
        const totalVendaComDesconto = totalPreco - (totalPreco * (descontoTotalPercentual / 100));
        var descontoTotalBruto = totalPreco * (descontoTotalPercentual / 100);

        // Iterar sobre cada item de venda para calcular e aplicar o desconto proporcional
        for (let i = 0; i < listaItens.length; i++) {
            const itemVenda = listaItens[i];
            const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
            const descontoProporcional = (totalPreco > 0) ? (precoProduto * itemVenda.quantidade / totalPreco) : 0;
            const descontoItem = (descontoProporcional * (descontoTotalBruto));

            itemVenda.desconto = Number(descontoItem).toFixed(2);
            calcularTotal(itemVenda);
            // Atualizar a interface com o novo desconto
            document.getElementById(`desconto${itemVenda.produtoId}Input`).value = descontoItem.toFixed(2);
            alterarItemlistaItens(itemVenda);

            descontoTotalInput.value = `${descontoTotalPercentual.toFixed(2)}%`;
        }

        // Atualizar o total da venda com o desconto total aplicado
        document.getElementById("totalVendaInput").value = totalVendaComDesconto.toFixed(2);
        document.getElementById("MSGmodificaçãoDesconto").style = "display:show;";
    });
}

 

/**
 * @function calcularTotalVenda
 * Calcula o preço total de um item de venda com base na quantidade e no preço do produto.
 * @param {Object} itemVenda - Objeto contendo os detalhes do item de venda.
 * @returns {number} Preço total do item de venda.
 */
function calcularTotalVenda(itemVenda) {
    const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
    return precoProduto * itemVenda.quantidade;
}

/**
 * @function calcularTotalDesconto
 * Calcula o total do desconto aplicado a um item de venda.
 * @param {Object} itemVenda - Objeto contendo os detalhes do item de venda.
 * @returns {number} Total do desconto aplicado ao item de venda.
 */
function calcularTotalDesconto(itemVenda) {
    return Number(itemVenda.desconto);
}

function limparVenda(){
    localStorage.clear();
}

function obterDataAtual() {
    var dataAtual = new Date();

    var ano = dataAtual.getFullYear(); // Obtém o ano com 4 dígitos
    var mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2); // Obtém o mês com zero à esquerda (01 a 12)
    var dia = ('0' + dataAtual.getDate()).slice(-2); // Obtém o dia com zero à esquerda (01 a 31)

    // Formata a data no formato yyyy-mm-dd
    var dataFormatada = ano + '-' + mes + '-' + dia;

    return dataFormatada;
}


function formatarProdutoId(listaItens) {
    // Percorre cada item na lista
    listaItens.forEach(item => {
        // Verifica se o item possui a chave 'produtoId'
        if ('produtoId' in item) {
            // Renomeia a chave 'produtoId' para 'produto'
            item.produto = item.produtoId;
            delete item.produtoId; // Remove a chave antiga 'produtoId' se necessário
        }
    });

    return listaItens;
}

async function enviarVenda() {
    // Obter cliente
    const cliente = localStorage.getItem("clienteId");

    // Obter vendedor 
    const vendedor = localStorage.getItem("vendedorId");

    // Obter a lista de itens com produtoId == produto
    const listaItens = localStorage.getItem('listaItens');


    // Validar dados essenciais
    if (!cliente || !vendedor || !listaItens) {
        console.error('Dados essenciais estão faltando');
        return;
    }

    // Obter a data no momento do click do botão
    const dataHora = obterDataAtual();

    // Obter o tipo de pagamento
    const tipoPagamento = document.getElementById("parcelasSelect").value;

    // Montar tudo em um JSON
    const venda = {
        vendedor: vendedor,
        cliente: cliente,
        data_venda: dataHora,
        tipo_pgto:  tipoPagamento > 1 ? 2 : 1,
        parcelas_pgto: tipoPagamento > 1 ? tipoPagamento - 1 : 0,
        itens: formatarProdutoId(JSON.parse(listaItens))
    };

    try {
        // Enviar a requisição POST
        const response = await fetch('/vendas/criar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        });

        // Verificar a resposta
        const contentType = response.headers.get('content-type');
        if (response.ok) {
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const data = await response.json();
                console.log('Venda criada com sucesso:', data);
            } else {
                console.log('Resposta não é JSON:', await response.text());
            }
        } else {
            if (contentType && contentType.indexOf('application/json') !== -1) {
                const errorData = await response.json();
                console.error('Erro ao criar venda:', errorData);
            } else {
                console.error('Erro ao criar venda. Resposta não é JSON:', await response.text());
            }
        }
    } catch (error) {
        console.error('Erro na requisição:', error);
    }
    console.log(venda);
}

document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});