from django.urls import path

from .views import listar_vendas, nova_venda

venda_urlpatterns = [
    path("vendas/", listar_vendas, name="listar_vendas"),
    path("vendas/nova-venda", nova_venda, name="nova_venda"),
]
