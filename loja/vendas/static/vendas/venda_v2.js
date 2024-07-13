import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

// escopo global do app venda
const store = reactive({
  itens: [],
  contadorItens: 0,
  adicionarItem() {
    // usar contador para gerar id unica para cada item que não seja a id do produto
    this.contadorItens++;
    this.itens.push({ idItem: this.contadorItens, idProduto: "", qtd: 1, desconto: 0 });
  },
  removerItem(idItem) {
    this.itens = this.itens.filter((item) => {
      return item.idItem !== idItem;
    });
  },
});

function Item({ produtos, idItem }) {
  return {
    $template: "#item-template",
    get itemAtual() {
      return (
        store.itens.find((item) => {
          return item.idItem === idItem;
        }) || {}
      );
    },
    get prodSelecionado() {
      return produtos.find((prod) => {
        return prod.id === this.itemAtual.idProduto;
      });
    },
    get total() {
      const produto = this.prodSelecionado;
      const qtd = this.itemAtual.qtd;
      if (produto && typeof qtd === "number" && qtd > 0) {
        return produto.preco * qtd;
      } else {
        return null;
      }
    },
    get totalComDesconto() {
      const desconto = this.itemAtual.desconto;
      const total = this.total;
      if (total && typeof desconto === "number") {
        return total - total * (desconto / 100);
      } else {
        return null;
      }
    },
    handleRemover() {
      store.removerItem(idItem);
    },
  };
}

createApp({
  store,
  Item,
  $delimiters: ["[[", "]]"],
  vendedores: [
    { id: 1, nome: "Vendedor 1" },
    { id: 2, nome: "Vendedor 2" },
  ],
  produtos: [
    { id: 1, preco: 10.0, nome: "Produto 1" },
    { id: 2, preco: 20.0, nome: "Produto 2" },
  ],
  clientes: [
    { id: 1, nome: "Cliente 1" },
    { id: 2, nome: "Cliente 2" },
  ],
  idVendedorSelecionado: null,
  idClienteSelecionado: null,
}).mount("#vue-app");
