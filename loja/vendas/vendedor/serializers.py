from rest_framework import serializers

from .models import Vendedor


class VendedorReadSerializer(serializers.ModelSerializer):
    class Meta:
        model = Vendedor
        fields = "__all__"
