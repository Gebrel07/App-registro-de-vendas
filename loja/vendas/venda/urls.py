from django.urls import path

from .views import (page_vendas, selecionar_cliente, selecionar_produto,
                    selecionar_vendedor)

urlpatterns = [
    path("vendas/", page_vendas, name="page_vendas"),
    path(
        "vendas/selecionar_cliente",
        selecionar_cliente,
        name="selecionar_cliente",
    ),
    path(
        "vendas/selecionar_vendedor",
        selecionar_vendedor,
        name="selecionar_vendedor",
    ),
    path(
        "vendas/selecionar_produto",
        selecionar_produto,
        name="selecionar_produto",
    ),
]
