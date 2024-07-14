from django.contrib import messages
from django.http import HttpRequest, JsonResponse
from rest_framework import generics
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser, ParseError

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


@api_view(["POST"])
def criar_venda(request: HttpRequest):
    try:
        serializer = VendaWriteSerializer(data=JSONParser().parse(request))

    except ParseError:
        messages.error(request=request, message="Erro ao finalizar a venda!")
        return JsonResponse({"detail": "Invalid JSON"}, status=400)

    if not serializer.is_valid():
        messages.error(request=request, message="Erro ao finalizar a venda!")
        return JsonResponse(serializer.errors, status=400)

    messages.success(request=request, message="Venda concluida com sucesso!")
    serializer.save()
    return JsonResponse(serializer.data, status=201)
