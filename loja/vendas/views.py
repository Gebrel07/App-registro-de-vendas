from django.shortcuts import render, redirect, get_object_or_404
from .forms import VendedorForm
from .models import Vendedor


def home(request):
    return redirect('listar_vendedores')  # Redireciona para a lista de vendedores
def listar_vendedores(request):
    vendedores = Vendedor.objects.all()
    return render(request, 'vendedor/listar_vendedores.html', {'vendedores_list': vendedores})

def criar_vendedor(request):
    if request.method == 'POST':
        form = VendedorForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect('listar_vendedores')
    else:
        form = VendedorForm()
    return render(request, 'vendedor/criar_vendedor.html', {'form': form})

def editar_vendedor(request, vendedor_id):
    vendedor = get_object_or_404(Vendedor, id=vendedor_id)
    if request.method == 'POST':
        form = VendedorForm(request.POST, instance=vendedor)
        if form.is_valid():
            form.save()
            return redirect('listar_vendedores')
    else:
        form = VendedorForm(instance=vendedor)
    return render(request, 'vendedor/editar_vendedor.html', {'form': form})
