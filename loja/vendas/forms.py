from django import forms
from .models import Vendedor

class VendedorForm(forms.ModelForm):
    class Meta:
        model = Vendedor
        fields = ['id', 'nome', 'cpf', 'data_nascimento', 'matricula', 'data_contratacao']
        widgets = {
            'data_nascimento': forms.DateInput(attrs={'type': 'date'}),
            'data_contratacao': forms.DateInput(attrs={'type': 'date'}),
        }
