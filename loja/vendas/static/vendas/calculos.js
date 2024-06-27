function func(){
    let totalPreco = 0;  
    let totalDescontoBruto = 0 //%
    let quantidadeProduto = 0

    let contadorProdutoId = Number(localStorage.getItem("contadorProdutoId")); // Conversão para número
    for (let i = 1; i <= contadorProdutoId; i++) {
        let itemVenda = JSON.parse(localStorage.getItem("dictVenda" + i));
        totalPreco+=totalVenda(itemVenda);
        totalDescontoBruto+=totalDesconto(itemVenda);
        quantidadeProduto+= totalQuantidade(itemVenda)
    }
    alert(totalDescontoBruto);
    document.getElementById("totalVendaInput").value = totalPreco.toFixed(2);
    //document.getElementById("descontoInput").value = quantidadeProduto;
}



function totalVenda(itemVenda) {
    let quantidadeProduto = itemVenda.quantidade;
    let descontoProduto = itemVenda.desconto;
    let precoProduto = Number(document.getElementById(`preco${itemVenda.produtoId}Input`).value); // Conversão para número
    return (precoProduto*quantidadeProduto)-descontoProduto;  
}

function totalDesconto(itemVenda){
    let descontoProduto = itemVenda.desconto;
    return descontoProduto

}

function totalQuantidade(itemVenda){
    let quantidadeProduto = itemVenda.quantidade;
    return Number(quantidadeProduto);
}