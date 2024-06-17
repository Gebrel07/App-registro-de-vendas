from django import forms
from .models import Vendedor,Cliente,Endereco

class VendedorForm(forms.ModelForm):
    class Meta:
        model = Vendedor
        fields = ['id', 'nome', 'cpf', 'data_nascimento', 'matricula', 'data_contratacao']
        widgets = {
            'data_nascimento': forms.DateInput(attrs={'type': 'date'}),
            'data_contratacao': forms.DateInput(attrs={'type': 'date'}),
        }

class EnderecoForm(forms.ModelForm):
    class Meta:
        model = Endereco
        fields = ['rua', 'cidade', 'estado', 'cep']  # Adicione os campos do modelo Endereco que deseja exibir

class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ['nome', 'cpf', 'data_nascimento', 'email', 'telefone']
 