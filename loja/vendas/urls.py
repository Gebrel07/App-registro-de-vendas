from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path('vendedores/',views.listar_vendedores, name="listar_vendedores"),
    path('vendedores/criar/', views.criar_vendedor, name='criar_vendedor'),  # Criar vendedor
    path('vendedores/editar/<int:vendedor_id>/', views.editar_vendedor, name='editar_vendedor'),  # Editar vendedor
    path('clientes/',views.listar_clientes , name="listar_clientes"),
    path('clientes/criar/',views.criar_cliente, name='criar_cliente'),
    path('clientes/editar/<int:cliente_id>/', views.editar_cliente, name='editar_cliente'),
]
