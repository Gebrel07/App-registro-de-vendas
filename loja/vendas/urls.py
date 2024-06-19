from django.urls import path

from . import views
from .produto.views import criar_produto

urlpatterns = [
    path("", views.home, name="home"),
    path("vendas/", views.page_vendas, name="page_vendas"),
    path("vendedores/", views.listar_vendedores, name="listar_vendedores"),
    path(
        "vendedores/criar/", views.criar_vendedor, name="criar_vendedor"
    ),  # Criar vendedor
    path(
        "vendedores/editar/<int:vendedor_id>/",
        views.editar_vendedor,
        name="editar_vendedor",
    ),  # Editar vendedor
    path("clientes/", views.listar_clientes, name="listar_clientes"),
    path("clientes/criar/", views.criar_cliente, name="criar_cliente"),
    path(
        "clientes/editar/<int:cliente_id>/",
        views.editar_cliente,
        name="editar_cliente",
    ),
    path(
        "vendas/selecionar_cliente",
        views.selecionar_cliente,
        name="selecionar_cliente",
    ),
    path(
        "vendas/selecionar_vendedor",
        views.selecionar_vendedor,
        name="selecionar_vendedor",
    ),
    path("produtos/criar", criar_produto, name="criar_produto"),
]
