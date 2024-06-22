from django.http import HttpRequest
from django.shortcuts import render


def page_vendas(request: HttpRequest) -> render:
    return render(request, "vendas/venda/vendas.html")
