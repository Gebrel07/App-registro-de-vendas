from rest_framework import generics

from ..cliente.models import Cliente
from ..cliente.serializers import ClienteReadSerializer
from ..produto.models import Produto
from ..produto.serializers import ProdutoReadSerializer
from ..venda.serializers import VendaWriteSerializer
from ..vendedor.models import Vendedor
from ..vendedor.serializers import VendedorReadSerializer


class VendedorListView(generics.ListAPIView):
    queryset = Vendedor.objects.all()
    serializer_class = VendedorReadSerializer


class ClienteListView(generics.ListAPIView):
    queryset = Cliente.objects.all()
    serializer_class = ClienteReadSerializer


class ProdutoListView(generics.ListAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoReadSerializer


class ProdutoDetalheView(generics.RetrieveAPIView):
    queryset = Produto.objects.all()
    serializer_class = ProdutoReadSerializer
    lookup_field = "id"


class VendaCreateView(generics.CreateAPIView):
    serializer_class = VendaWriteSerializer
