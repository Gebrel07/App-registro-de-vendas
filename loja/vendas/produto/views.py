from django.contrib import messages
from django.http import HttpRequest
from django.shortcuts import redirect, render

from .forms import ProdutoForm
from .models import Produto


def criar_produto(request: HttpRequest) -> render:
    if request.method == "POST":
        form = ProdutoForm(request.POST)
        if form.is_valid():
            try:
                novo_produto = Produto(
                    nome=form.cleaned_data["nome"],
                    preco=form.cleaned_data["preco"],
                    cor=form.cleaned_data["cor"],
                    tamanho=form.cleaned_data["tamanho"],
                    referencia=form.cleaned_data["referencia"],
                )
                novo_produto.save()
                messages.success(
                    request=request,
                    message="Produto criado com sucesso!",
                )
            except Exception:
                # TODO: logar erros
                messages.error(
                    request=request,
                    message="Erro ao criar produto",
                )
            finally:
                return redirect("criar_produto")
    else:
        form = ProdutoForm()
        return render(
            request=request,
            template_name="vendas/produto/criar_produto.html",
            context={"form": form},
        )
