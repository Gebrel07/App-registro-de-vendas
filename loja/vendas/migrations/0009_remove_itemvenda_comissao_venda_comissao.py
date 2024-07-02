# Generated by Django 5.0.6 on 2024-06-30 20:02

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('vendas', '0008_venda_parcelas_pgto_venda_tipo_pgto'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='itemvenda',
            name='comissao',
        ),
        migrations.AddField(
            model_name='venda',
            name='comissao',
            field=models.DecimalField(decimal_places=2, default=0.0, max_digits=5),
        ),
    ]