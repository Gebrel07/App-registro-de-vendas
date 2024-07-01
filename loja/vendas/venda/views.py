from django.http import HttpRequest, JsonResponse
from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.parsers import JSONParser, ParseError
from django.contrib import messages

from ..cliente.models import Cliente
from ..produto.models import Produto
from ..vendedor.models import Vendedor
from .models import Venda  # noqa
from .serializers import VendaWriteSerializer


@api_view(["POST"])
def criar_venda(request: HttpRequest):
    try:
        serializer = VendaWriteSerializer(data=JSONParser().parse(request))
        
    except ParseError:
        messages.error(request=request,message="Erro ao finalizar a venda!")
        return JsonResponse({"detail": "Invalid JSON"}, status=400)
         

    if not serializer.is_valid():
        messages.error(request=request,message="Erro ao finalizar a venda!")
        return JsonResponse(serializer.errors, status=400)
    
    messages.success(request=request,message="Venda concluida com sucesso!")
    serializer.save()
    return JsonResponse(serializer.data, status=201)


def page_vendas(request: HttpRequest) -> render:
    return render(request, "vendas/venda/vendas.html")


def selecionar_cliente(request: HttpRequest) -> render:
    clientes = Cliente.objects.all()
    return render(
        request,
        "vendas/cliente/selecionar_cliente.html",
        {"clientes": clientes},
    )


def selecionar_vendedor(request: HttpRequest) -> render:
    vendedores = Vendedor.objects.all()
    return render(
        request,
        "vendas/vendedor/selecionar_vendedor.html",
        {"vendedores": vendedores},
    )


def selecionar_produto(request: HttpRequest) -> render:
    produtos = Produto.objects.all()
    return render(
        request,
        "vendas/produto/selecionar_produto.html",
        {"produtos": produtos},
    )
