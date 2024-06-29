from django.db import models

from ..cliente.models import Cliente
from ..produto.models import Produto
from ..vendedor.models import Vendedor


# TODO: atualizar diagrama de tabelas
class Venda(models.Model):
    PGTO_AVISTA = 1
    PGTO_PARCELADO = 2
    TIPOS_PGTO = {PGTO_AVISTA: "A vista", PGTO_PARCELADO: "Parcelado"}

    vendedor = models.ForeignKey(
        to=Vendedor, on_delete=models.SET_NULL, null=True
    )
    cliente = models.ForeignKey(
        to=Cliente, on_delete=models.SET_NULL, null=True
    )
    data_venda = models.DateField(null=False)
    tipo_pgto = models.IntegerField(
        null=False, choices=TIPOS_PGTO, default=PGTO_AVISTA
    )
    parcelas_pgto = models.PositiveIntegerField(null=False, default=0)

    def __str__(self) -> str:
        return f"id: {self.id}, data_venda: {self.data_venda}"

    def total_venda(self):
        return sum(item.total_item() for item in self.itens.all())

    def total_comissao(self):
        return sum(item.total_comissao() for item in self.itens.all())


# NOTE: se o preço de um produto for atualizado, alterará o total
# de todas as suas vendas anteriores.
# Necessário registrar preco do produto nesta tabela no momento da venda para evitar isso?
class ItemVenda(models.Model):
    venda = models.ForeignKey(
        Venda, related_name="itens", on_delete=models.CASCADE, null=False
    )
    produto = models.ForeignKey(Produto, on_delete=models.CASCADE, null=False)
    quantidade = models.PositiveIntegerField(null=False, default=1)
    desconto = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)
    comissao = models.DecimalField(max_digits=5, decimal_places=2, default=0.00)

    def __str__(self) -> str:
        return f"id: {self.id}, produto_id: {self.produto.id}, quantidade: {self.quantidade}"

    def total_item(self):
        return self.quantidade * self.produto.preco * (1 - self.desconto / 100)

    def total_comissao(self):
        return self.total_item() * (self.comissao / 100)
