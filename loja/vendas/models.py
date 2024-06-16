from django.db import models


class Pessoa(models.Model):
    nome = models.CharField(max_length=255, null=False)
    cpf = models.CharField(max_length=11, null=False, unique=True)
    data_nascimento = models.DateField(null=False)

    class Meta:
        abstract = True


class Vendedor(Pessoa):
    matricula = models.CharField(max_length=255, null=False, unique=True)
    data_contratacao = models.DateField(null=False)

    def __str__(self) -> str:
        return f"id: {self.id}, nome: {self.nome}, matricula: {self.matricula}"
