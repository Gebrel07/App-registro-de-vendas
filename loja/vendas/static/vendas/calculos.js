function calcular() {
    document.getElementById("MSGmodificaçãoDesconto").style = "display:none;"
    let totalPreco = 0;
    let totalDescontoBruto = 0;
    let quantidadeProduto = 0;
    const orderIdList = JSON.parse(localStorage.getItem("orderIdList") || "[]");
    const contadorProdutoId = Number(localStorage.getItem("contadorProdutoId")) || 0;

    // Iterar sobre cada item de venda e calcular totais
    for (let i = 0; i < contadorProdutoId; i++) {
        const itemVenda = obterItemVenda(orderIdList[i]);
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
    handleDescontoTotalChange(contadorProdutoId, totalPreco, orderIdList);
}

function handleDescontoTotalChange(contadorProdutoId, totalPreco, orderIdList) {
    const descontoTotalInput = document.getElementById("descontoInput");

    descontoTotalInput.addEventListener("change", function () {
        var descontoTotalPercentual = parseFloat(descontoTotalInput.value) || 0;
        const totalVendaComDesconto = totalPreco - (totalPreco * (descontoTotalPercentual / 100));
        var descontoTotalBruto = totalPreco*(descontoTotalPercentual/100)
        // Iterar sobre cada item de venda para calcular e aplicar o desconto proporcional
        for (let i = 0; i < contadorProdutoId; i++) {
            const itemVenda = obterItemVenda(orderIdList[i]);
            const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
            const descontoProporcional = (totalPreco > 0) ? (precoProduto*itemVenda.quantidade / totalPreco) : 0;
            const descontoItem = (descontoProporcional*(descontoTotalBruto));
    

            itemVenda.desconto = Number(descontoItem);

            // Atualizar a interface com o novo desconto
            document.getElementById(`desconto${itemVenda.produtoId}Input`).value = descontoItem.toFixed(2);
            localStorage.setItem("itemVenda" + orderIdList[i], JSON.stringify(itemVenda));

            descontoTotalInput.value = `${descontoTotalPercentual.toFixed(2)}%`;
        }

        // Atualizar o total da venda com o desconto total aplicado
        document.getElementById("totalVendaInput").value = totalVendaComDesconto.toFixed(2);
        document.getElementById("MSGmodificaçãoDesconto").style = "display:show;"
    });
}

function obterItemVenda(orderId) {
    return JSON.parse(localStorage.getItem("itemVenda" + orderId) || "{}");
}

function calcularTotalVenda(itemVenda) {
    const precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value) || 0;
    return precoProduto * itemVenda.quantidade;
}

function calcularTotalDesconto(itemVenda) {
    return Number(itemVenda.desconto);
}
