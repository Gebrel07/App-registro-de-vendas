from django.shortcuts import render, redirect, get_object_or_404
from .forms import VendedorForm
from .models import Vendedor


def home(request):
    return render(request,'vendas/home.html')   

def listar_clientes(request):
    pass

def criar_cliente(request):
    pass

def editar_cliente(request):
    pass

def listar_vendedores(request):

    vendedores = Vendedor.objects.all()
    return render(request, 'vendas/vendedor/listar_vendedores.html', {'vendedores_list': vendedores})

def criar_vendedor(request):
    if request.method == 'POST':
        form = VendedorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('listar_vendedores')
    else:
        form = VendedorForm()
    return render(request, 'vendas/vendedor/criar_vendedor.html', {'form': form})

def editar_vendedor(request, vendedor_id):
    vendedor = get_object_or_404(Vendedor, id=vendedor_id)
    if request.method == 'POST':
        form = VendedorForm(request.POST, instance=vendedor)
        if form.is_valid():
            form.save()
            return redirect('listar_vendedores')
    else:
        form = VendedorForm(instance=vendedor)
    return render(request, 'vendas/vendedor/editar_vendedor.html', {'form': form})
