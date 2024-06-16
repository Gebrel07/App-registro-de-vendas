from django.db import models


class Pessoa(models.Model):
    nome = models.CharField(max_length=255, null=False)
    cpf = models.CharField(max_length=11, null=False, unique=True)
    data_nascimento = models.DateField(null=False)

    def __str__(self) -> str:
        return f"id: {self.id}, nome: {self.nome}"

    class Meta:
        abstract = True


class Vendedor(Pessoa):
    matricula = models.CharField(max_length=255, null=False, unique=True)
    data_contratacao = models.DateField(null=False)

    def __str__(self) -> str:
        return f"{super().__str__()}, matricula: {self.matricula}"


class Endereco(models.Model):
    rua = models.CharField(max_length=255, null=False)
    numero = models.CharField(max_length=10, null=False)
    cidade = models.CharField(max_length=255, null=False)
    estado = models.CharField(max_length=2, null=False)
    cep = models.CharField(max_length=8, null=False)

    def __str__(self) -> str:
        return f"id: {self.id}, rua: {self.rua}, cidade: {self.cidade}, estado: {self.estado}"


class Cliente(Pessoa):
    email = models.CharField(max_length=255, null=True)
    telefone = models.CharField(max_length=20, null=True)
    endereco = models.OneToOneField(to=Endereco, on_delete=models.CASCADE)

    def __str__(self) -> str:
        return f"{super().__str__()}, email: {self.email}"
