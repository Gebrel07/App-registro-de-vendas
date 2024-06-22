from django.db import models

from ..cliente.models import Cliente
from ..produto.models import Produto
from ..vendedor.models import Vendedor


# TODO: incluir relação many to many entre Produto e Venda
class Venda(models.Model):
    data_venda = models.DateField(null=False)
    quantidade = models.IntegerField(default=1, null=False)
    comissao = models.FloatField(default=0, null=False)
    vendedor = models.ForeignKey(
        to=Vendedor, on_delete=models.SET_NULL, null=True
    )
    cliente = models.ForeignKey(
        to=Cliente, on_delete=models.SET_NULL, null=True
    )
    produto = models.ForeignKey(to=Produto, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"id: {self.id}, data_venda: {self.data_venda}, quantidade: {self.quantidade}"
