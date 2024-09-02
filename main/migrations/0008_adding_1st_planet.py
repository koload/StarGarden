# Generated by Django 5.0.7 on 2024-08-21 16:09

from django.db import migrations

def populate_space_objects(apps, schema_editor):
    SpaceObject = apps.get_model('main', 'SpaceObject')
    spaceObjects = [
        {
            "WaterWorld",
            "WaterWorld_clouds",
            "WaterWorld_land",
            "WaterWorld_clouds_land"
        },
    ]
    for space_object_name in spaceObjects:
        SpaceObject.objects.create(name=space_object_name)

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0007_delete_storeitem'),
    ]

    operations = [
        migrations.RunPython(populate_space_objects),
    ]