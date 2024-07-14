from rest_framework import serializers

from .models import Cliente


class ClienteReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = "__all__"
