# Generated by Django 5.0.7 on 2024-09-02 16:55

from django.db import migrations

def removing_redundant_SO_prices(apps, schema_editor):
    spaceObjectPrice = apps.get_model('main', 'SpaceObjectPrice')
    spaceObjectPrice.objects.filter(id__in=[3, 4]).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0023_test_SO_price'),
    ]

    operations = [
        migrations.RunPython(removing_redundant_SO_prices)
    ]