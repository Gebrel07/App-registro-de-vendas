from django.urls import path
from . import views

urlpatterns = [
    path('',views.home,name='home'),
    path('criar/', views.criar_vendedor, name='criar_vendedor'),  # Criar vendedor
    path('editar/<int:vendedor_id>/', views.editar_vendedor, name='editar_vendedor'),  # Editar vendedor
]
