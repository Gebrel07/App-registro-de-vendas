from django.urls import path

from .views import (ClienteListView, ProdutoDetalheView, ProdutoListView,
                    VendaCreateView, VendedorListView)

api_urlpatterns = [
    path("api/clientes/", ClienteListView.as_view()),
    path("api/produtos/", ProdutoListView.as_view()),
    path("api/produtos/<int:id>/", ProdutoDetalheView.as_view()),
    path("api/vendas/", VendaCreateView.as_view()),
    path("api/vendedores/", VendedorListView.as_view()),
]
