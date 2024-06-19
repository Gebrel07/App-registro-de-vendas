from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from .forms import Vendedor,VendedorForm
from django.contrib import messages
from django.urls import reverse

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
            try:
                form.save()
                messages.success(request=request,
                                 message="Vendedor criado com sucesso",
                                 )
            except Exception:
                # TODO: possiveis erros 
                messages.error(request=request,
                               message="Erro ao criar produto",
                               )
            finally:
                return redirect("criar_vendedor")
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
            try:
                form.save()
                messages.success(
                    request=request,
                    message="Vendedor editado com sucesso"
                                 )
            except:
                #TODO : detalhar erros
                messages.error(request=request,
                               message="Erro ao editar vendedor"
                               )
            finally:
                return redirect(reverse(editar_vendedor , args=[vendedor_id]))
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

def deletar_vendedor(request: HttpRequest, vendedor_id: int):
    vendedor = get_object_or_404(Vendedor, id=vendedor_id)
    vendedores = Vendedor.objects.all()
    
    if request.method == "POST":
        try:
            vendedor.delete()
            messages.success(request, "Vendedor deletado com sucesso!")
        except Exception as e:
            messages.error(request, "Erro ao deletar vendedor!")
    
    return render(
            request,
            "vendas/vendedor/listar_vendedores.html",
            {"vendedores_list": vendedores},
        )
