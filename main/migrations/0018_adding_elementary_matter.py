# Generated by Django 5.0.7 on 2024-09-02 16:22

from django.db import migrations

def create_elementary_matter_resource(apps, schema_editor):
    Resource = apps.get_model('main', 'Resource')
    Resource.objects.create(name="Elementary Matter")
    


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0017_adding_elementary_matter'),
    ]

    operations = [
        migrations.RunPython(create_elementary_matter_resource)
    ]
