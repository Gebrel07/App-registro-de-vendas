from django.http import HttpRequest
from django.shortcuts import get_object_or_404, redirect, render
from .forms import ClienteForm,EnderecoForm,Cliente,Endereco
from django.urls import reverse
from django.contrib import messages


def listar_clientes(request: HttpRequest) -> render:
    clientes = Cliente.objects.all()
    return render(
        request,
        "vendas/clientes/listar_clientes.html",
        {"clientes_list": clientes},
    )


def criar_cliente(request: HttpRequest) -> render:
    if request.method == "POST":
        cliente_form = ClienteForm(request.POST)
        endereco_form = EnderecoForm(request.POST)

        if cliente_form.is_valid() and endereco_form.is_valid():
            try:
                endereco = endereco_form.save()  # Salva primeiro o endereço
                cliente = cliente_form.save(commit=False)
                cliente.endereco = endereco  # Associa o endereço ao cliente
                cliente.save()
                messages.success(request=request,
                                 message="Cliente criado com sucesso!")
            except Exception:
                # TODO:
                messages.error(request=request,
                                 message="Erro ao criar cliente!")
            finally:
                return redirect(
                    "criar_cliente"
                )  # Redireciona para a lista de clientes

    else:
        cliente_form = ClienteForm()
        endereco_form = EnderecoForm()

    return render(
        request,
        "vendas/clientes/criar_cliente.html",
        {"cliente_form": cliente_form, "endereco_form": endereco_form},
    )


def editar_cliente(request: HttpRequest, cliente_id: int) -> render:
    cliente = get_object_or_404(Cliente, id=cliente_id)
    endereco = get_object_or_404(Endereco, id=cliente_id)

    if request.method == "POST":
        cliente_form = ClienteForm(request.POST, instance=cliente)
        endereco_form = EnderecoForm(request.POST, instance=endereco)
        if cliente_form.is_valid() and endereco_form.is_valid():
            try:
                cliente_form.save()
                endereco_form.save()
                messages.success(request=request,
                                 message="Cliente editado com sucesso!")
            except:
                # TODO: possiveis erros
                messages.error(
                    request=request,
                    message = "Erro ao editar cliente"
                               )
            finally:
                return redirect(reverse('editar_cliente', args=[cliente_id]))
    else:
        cliente_form = ClienteForm(instance=cliente)
        endereco_form = EnderecoForm(instance=endereco)

    return render(
        request,
        "vendas/clientes/editar_cliente.html",
        {
            "cliente_form": cliente_form,
            "endereco_form": endereco_form,
        },
    )


def selecionar_cliente(request: HttpRequest) -> render:
    clientes = Cliente.objects.all()
    return render(
        request,
        "vendas/clientes/selecionar_cliente.html",
        {"clientes": clientes},
    )

 
 
def deletar_cliente(request: HttpRequest, cliente_id: int):
    cliente = get_object_or_404(Cliente, id=cliente_id)
    endereco = get_object_or_404(Endereco, id=cliente_id)
    clientes = Cliente.objects.all()
    
    if request.method == "POST":
        try:
            cliente.delete()
            endereco.delete()
            messages.success(request, "Cliente deletado com sucesso!")
        except Exception as e:
            messages.error(request, "Erro ao deletar cliente!")
    
    return render(
            request,
            "vendas/clientes/listar_clientes.html",
            {"clientes_list": clientes},
        )
 