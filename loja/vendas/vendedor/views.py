from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from .forms import Vendedor,VendedorForm

def listar_vendedores(request: HttpRequest) -> render:
    vendedores = Vendedor.objects.all()
    return render(
        request,
        "vendas/vendedor/listar_vendedores.html",
        {"vendedores_list": vendedores},
    )


def criar_vendedor(request: HttpRequest) -> render:
    if request.method == "POST":
        form = VendedorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("listar_vendedores")
    else:
        form = VendedorForm()
    return render(
        request, "vendas/vendedor/criar_vendedor.html", {"form": form}
    )


def editar_vendedor(request: HttpRequest, vendedor_id: int) -> render:
    vendedor = get_object_or_404(Vendedor, id=vendedor_id)
    if request.method == "POST":
        form = VendedorForm(request.POST, instance=vendedor)
        if form.is_valid():
            form.save()
            return redirect("listar_vendedores")
    else:
        form = VendedorForm(instance=vendedor)
    return render(
        request, "vendas/vendedor/editar_vendedor.html", {"form": form}
    )


def selecionar_vendedor(request: HttpRequest) -> render:
    vendedores = Vendedor.objects.all()
    return render(
        request,
        "vendas/vendedor/selecionar_vendedor.html",
        {"vendedores": vendedores},
    )
