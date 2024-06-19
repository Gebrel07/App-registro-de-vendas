from django.urls import path

from . import views
from .produto.views import criar_produto
from .vendedor.views import *
from .cliente.views import *

urlpatterns = [
    path("", views.home, name="home"),
    path("vendas/", views.page_vendas, name="page_vendas"),
    path("vendedores/", listar_vendedores, name="listar_vendedores"),
    path(
        "vendedores/criar/", criar_vendedor, name="criar_vendedor"
    ),  # Criar vendedor
    path(
        "vendedores/editar/<int:vendedor_id>/",
        editar_vendedor,
        name="editar_vendedor",
    ),  # Editar vendedor
    path("clientes/", listar_clientes, name="listar_clientes"),
    path("clientes/criar/", criar_cliente, name="criar_cliente"),
    path(
        "clientes/editar/<int:cliente_id>/",
        editar_cliente,
        name="editar_cliente",
    ),
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
    path("produtos/criar", criar_produto, name="criar_produto"),
]
