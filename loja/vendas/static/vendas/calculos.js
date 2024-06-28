function func(){
    let totalPreco = 0;  
    let totalDescontoBruto = 0; // Valor total de desconto
    let quantidadeProduto = 0;

    let contadorProdutoId = Number(localStorage.getItem("contadorProdutoId")); // Conversão para número
    for (let i = 1; i <= contadorProdutoId; i++) {
        let itemVenda = JSON.parse(localStorage.getItem("dictVenda" + i));
        totalPreco += totalVenda(itemVenda);
        totalDescontoBruto += totalDesconto(itemVenda);
        quantidadeProduto += totalQuantidade(itemVenda);
    }

    document.getElementById("totalVendaInput").value = (totalPreco-totalDescontoBruto).toFixed(2);

    // Calculando o desconto médio percentual
    let descontoMedioPercentual = Math.abs((((totalPreco-totalDescontoBruto)/totalPreco)*100)-100);
    document.getElementById("descontoInput").value = `${descontoMedioPercentual}%`;
}

function totalVenda(itemVenda) {
    let quantidadeProduto = itemVenda.quantidade;
    let precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value); // Conversão para número
    return (precoProduto * quantidadeProduto);  
}

function totalDesconto(itemVenda) {
    let descontoProduto = itemVenda.desconto;
    return descontoProduto;
}

function totalQuantidade(itemVenda) {
    let quantidadeProduto = itemVenda.quantidade;
    return Number(quantidadeProduto);
}
