# Generated by Django 5.0.7 on 2024-10-27 19:22

from django.db import migrations
def populate_resource_transformatons(apps, schema_editor):
    resourceTransformation = apps.get_model('main', 'ResourceTransformation')
    resourceTransformation.objects.create(inputResource_id=2, outputResource_id=4, inputQuantity=10, outputQuantity=1)
    resourceTransformation.objects.create(inputResource_id=3, outputResource_id=4, inputQuantity=10, outputQuantity=1)
    resourceTransformation.objects.create(inputResource_id=5, outputResource_id=4, inputQuantity=10, outputQuantity=1)

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0044_removing_thrash_data'),
    ]

    operations = [
        migrations.RunPython(populate_resource_transformatons)
    ]