from rest_framework import generics

from ..produto.models import Produto
from ..produto.serializers import ProdutoReadSerializer


class ProdutoDetalheView(generics.RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoReadSerializer
    lookup_field = "id"
