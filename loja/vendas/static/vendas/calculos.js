document.addEventListener('DOMContentLoaded', function() {
    var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
    var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl)
    })
});

function calcular() {
    document.getElementById("MSGmodificaçãoDesconto").style = "display:none;";
    const listaItens = JSON.parse(localStorage.getItem("listaItens") || "[]");

    const { totalPreco, totalDescontoBruto, quantidadeProduto } = calcularTotais(listaItens);
    atualizarCamposTotais(totalPreco, totalDescontoBruto, quantidadeProduto);
    handleDescontoTotalChange(listaItens, totalPreco);
}

function calcularTotais(listaItens) {
    let totalPreco = 0;
    let totalDescontoBruto = 0;
    let quantidadeProduto = 0;

    listaItens.forEach(itemVenda => {
        totalPreco += calcularTotalVenda(itemVenda);
        totalDescontoBruto += calcularTotalDesconto(itemVenda);
        quantidadeProduto += itemVenda.quantidade;
    });

    return { totalPreco, totalDescontoBruto, quantidadeProduto };
}

function atualizarCamposTotais(totalPreco, totalDescontoBruto, quantidadeProduto) {
    document.getElementById("totalVendaInput").value = (totalPreco - totalDescontoBruto).toFixed(2);
    const descontoMedioPercentual = Math.abs((((totalPreco - totalDescontoBruto) / totalPreco) * 100) - 100);
    document.getElementById("descontoInput").value = `${descontoMedioPercentual.toFixed(2)}%`;
    document.getElementById("comissaoInput").value = "3%";
}

function handleDescontoTotalChange(listaItens, totalPreco) {
    const descontoTotalInput = document.getElementById("descontoInput");

    descontoTotalInput.addEventListener("change", function () {
        const descontoTotalPercentual = parseFloat(descontoTotalInput.value) || 0;
        const totalVendaComDesconto = totalPreco - (totalPreco * (descontoTotalPercentual / 100));
        const descontoTotalBruto = totalPreco * (descontoTotalPercentual / 100);

        listaItens.forEach(itemVenda => {
            aplicarDescontoProporcional(itemVenda, totalPreco, descontoTotalBruto);
        });

        document.getElementById("totalVendaInput").value = totalVendaComDesconto.toFixed(2);
        document.getElementById("MSGmodificaçãoDesconto").style = "display:show;";
    });
}

function aplicarDescontoProporcional(itemVenda, totalPreco, descontoTotalBruto) {
    const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
    const descontoProporcional = (totalPreco > 0) ? (precoProduto * itemVenda.quantidade / totalPreco) : 0;
    const descontoItem = (descontoProporcional * (descontoTotalBruto));

    itemVenda.desconto = Number(descontoItem).toFixed(2);
    calcularTotal(itemVenda);

    document.getElementById(`desconto${itemVenda.produtoId}Input`).value = descontoItem.toFixed(2);
    alterarItemlistaItens(itemVenda);

    const descontoTotalInput = document.getElementById("descontoInput");
    const descontoTotalPercentual = parseFloat(descontoTotalInput.value) || 0;
    descontoTotalInput.value = `${descontoTotalPercentual.toFixed(2)}%`;
}

function calcularTotalVenda(itemVenda) {
    const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
    return precoProduto * itemVenda.quantidade;
}

function calcularTotalDesconto(itemVenda) {
    return Number(itemVenda.desconto);
}

function limparVenda() {
    localStorage.clear();
}

function obterDataAtual() {
    const dataAtual = new Date();
    const ano = dataAtual.getFullYear();
    const mes = ('0' + (dataAtual.getMonth() + 1)).slice(-2);
    const dia = ('0' + dataAtual.getDate()).slice(-2);
    return `${ano}-${mes}-${dia}`;
}

function formatarProdutoId(listaItens) {
    listaItens.forEach(item => {
        if ('produtoId' in item) {
            item.produto = item.produtoId;
            delete item.produtoId;
        }
    });
    return listaItens;
}

async function enviarVenda() {
    const cliente = localStorage.getItem("clienteId");
    const vendedor = localStorage.getItem("vendedorId");
    const listaItens = localStorage.getItem('listaItens');

    if (!cliente || !vendedor || !listaItens) {
        console.error('Dados essenciais estão faltando');
        return;
    }

    const dataHora = obterDataAtual();
    const tipoPagamento = document.getElementById("parcelasSelect").value;

    const venda = {
        vendedor: vendedor,
        cliente: cliente,
        data_venda: dataHora,
        tipo_pgto: tipoPagamento > 1 ? 2 : 1,
        parcelas_pgto: tipoPagamento > 1 ? tipoPagamento - 1 : 0,
        itens: formatarProdutoId(JSON.parse(listaItens))
    };

    try {
        const response = await fetch('/vendas/criar/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(venda)
        });

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
    localStorage.clear();
    location.reload();
}
