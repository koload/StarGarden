# Generated by Django 5.0.7 on 2024-10-27 15:14

from django.db import migrations
def populate_space_objects(apps, schema_editor):
    spaceObjects = apps.get_model('main', 'SpaceObject')
    spaceObjects.objects.filter(id=2).update(image_path="images/Planets/AirWorld.svg")

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0037_populating_store'),
    ]

    operations = [
        migrations.RunPython(populate_space_objects)
    ]
