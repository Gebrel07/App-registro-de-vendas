from django.http import HttpRequest
from django.shortcuts import render

from .models import Venda


def nova_venda(request: HttpRequest):
    return render(request=request, template_name="vendas/venda/nova_venda.html")


def listar_vendas(request: HttpRequest):
    vendas = Venda.objects.all().order_by("-data_venda", "-pk")
    return render(
        request=request,
        template_name="vendas/venda/listar_vendas.html",
        context={"vendas": vendas},
    )
