from django import forms

from .models import Cliente, Endereco, Vendedor


class VendedorForm(forms.ModelForm):
    class Meta:
        model = Vendedor
        fields = [
            "id",
            "nome",
            "cpf",
            "data_nascimento",
            "matricula",
            "data_contratacao",
        ]
        widgets = {
            "data_nascimento": forms.DateInput(attrs={"type": "date"}),
            "data_contratacao": forms.DateInput(attrs={"type": "date"}),
            "cpf": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "pattern": r"\d{11}",
                    "title": "Formato invalido",
                }
            ),
        }


class EnderecoForm(forms.ModelForm):
    class Meta:
        model = Endereco
        fields = [
            "rua",
            "cidade",
            "estado",
            "cep",
        ]
        widgets = {
            "cep": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "pattern": r"\+?1?\d{8,15}",
                    "title": "Insira apenas números.",
                }
            ),
        }


class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ["nome", "cpf", "data_nascimento", "email", "telefone"]
        widgets = {
            "data_nascimento": forms.DateInput(
                attrs={"type": "date", "class": "form-control"}
            ),
            "email": forms.EmailInput(attrs={"class": "form-control"}),
            "cpf": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "pattern": r"\d{11}",
                    "title": "Formato invalido",
                }
            ),
            "telefone": forms.TextInput(
                attrs={
                    "class": "form-control",
                    "pattern": r"\+?1?\d{8,15}",
                    "title": "Insira apenas números.",
                }
            ),
        }


class ProdutoForm(forms.Form):
    nome = forms.CharField(
        label="Nome do Produto",
        max_length=255,
        required=True,
    )
    preco = forms.DecimalField(
        label="Preço do Produto",
        min_value=0,
        decimal_places=2,
        required=True,
    )
    cor = forms.CharField(
        label="Cor do Produto",
        max_length=255,
        required=True,
    )
    tamanho = forms.CharField(
        label="Tamanho do Produto",
        max_length=255,
        required=True,
    )
    referencia = forms.CharField(
        label="Referência do Produto",
        max_length=255,
        required=False,
    )
