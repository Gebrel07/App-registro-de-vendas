from django.http import HttpRequest
from django.shortcuts import  render

 
def home(request: HttpRequest) -> render:
    return render(request, "vendas/pages/home.html")


def page_vendas(request: HttpRequest) -> render:
    return render(request, "vendas/pages/vendas.html")


 