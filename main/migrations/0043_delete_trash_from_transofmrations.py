# Generated by Django 5.0.7 on 2024-10-27 19:10

from django.db import migrations
def delete_specific_resource_transformations(apps, schema_editor):
    ResourceTransformation = apps.get_model('main', 'ResourceTransformation')
    
    ResourceTransformation.objects.filter(id__in=[9, 8, 7, 6]).delete()


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0042_delete_trash_from_transofmrations'),
    ]

    operations = [
        migrations.RunPython(delete_specific_resource_transformations),
    ]