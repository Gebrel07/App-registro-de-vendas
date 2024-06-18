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
        }


class EnderecoForm(forms.ModelForm):
    class Meta:
        model = Endereco
        fields = [
            "rua",
            "cidade",
            "estado",
            "cep",
        ]  # Adicione os campos do modelo Endereco que deseja exibir


class ClienteForm(forms.ModelForm):
    class Meta:
        model = Cliente
        fields = ["nome", "cpf", "data_nascimento", "email", "telefone"]


class ProdutoForm(forms.Form):
    nome_produto = forms.CharField(
        label="Nome do Produto",
        max_length=255,
        required=True,
    )
    preco_produto = forms.DecimalField(
        label="Preço do Produto",
        min_value=0,
        decimal_places=2,
        required=True,
    )
    cor_produto = forms.CharField(
        label="Cor do Produto",
        max_length=255,
        required=True,
    )
    tamanho_produto = forms.CharField(
        label="Tamanho do Produto",
        max_length=255,
        required=True,
    )
    referencia_produto = forms.CharField(
        label="Referência do Produto",
        max_length=255,
        required=False,
    )
