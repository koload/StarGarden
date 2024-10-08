# Generated by Django 5.0.7 on 2024-10-07 12:41

from django.db import migrations

def populate_resources(apps, schema_editor):
    Resource = apps.get_model('main', 'Resource')
    resources = [
            "Heat",
            "Energy",
            "Life",
            "Obsidian",
            "Iron"
    ]
    for resource_name in resources:
        Resource.objects.create(name=resource_name)


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0026_test_instance_of_userSpaceObjects'),
    ]

    operations = [
        migrations.RunPython(populate_resources)
    ]
