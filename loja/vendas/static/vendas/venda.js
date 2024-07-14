import { createApp, reactive } from "https://unpkg.com/petite-vue?module";

// escopo global do app venda
const store = reactive({
  idVendedor: "",
  idCliente: "",
  percentComissao: 0,
  parcelasPgto: 0,
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
  resetStore() {
    this.idVendedor = "";
    this.idCliente = "";
    this.percentComissao = 0;
    this.parcelasPgto = 0;
    this.itens = [];
    this.contadorItens = 0;
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
  msg: { text: "", class: "" },
  vendedores: [],
  clientes: [],
  produtos: [],
  async fetchData(url) {
    try {
      const resp = await fetch(url);
      if (!resp.ok) {
        throw new Error(resp);
      }
      return await resp.json();
    } catch (err) {
      console.error(err);
      return [];
    }
  },
  async loadOptions() {
    this.vendedores = await this.fetchData("/api/vendedores/");
    this.clientes = await this.fetchData("/api/clientes/");
    this.produtos = await this.fetchData("/api/produtos/");
  },
  async handlePost() {
    // resetar msg
    this.msg = {};

    const data = {
      vendedor: store.idVendedor,
      comissao: store.percentComissao,
      cliente: store.idCliente,
      parcelas_pgto: store.parcelasPgto,
      itens: [],
    };

    for (const item of store.itens) {
      data.itens.push({ produto: item.idProduto, quantidade: item.qtd, desconto: item.desconto });
    }

    try {
      const resp = await fetch("/api/vendas/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (resp.ok) {
        this.msg = { text: "Venda criada com sucesso!", class: "text-success" };
        store.resetStore();
      } else if (resp.status === 400) {
        this.msg = { text: "Dados da venda inválidos", class: "text-danger" };
      } else {
        this.msg = { text: "Erro ao criar venda", class: "text-danger" };
      }
    } catch (err) {
      this.msg = { text: "Erro ao enviar venda", class: "text-danger" };
      console.console.error(err);
    }
  },
}).mount("#vue-app");
