from django.urls import path

from .views import ProdutoDetalheView

api_urlpatterns = [
    path(
        "api/produtos/<int:id>",
        ProdutoDetalheView.as_view(),
        name="produto_detalhe",
    ),
]
