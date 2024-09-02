
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

def reverse_populate_space_objects(apps, schema_editor):
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
        SpaceObject.objects.filter(name=space_object_name).delete()

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0008_adding_1st_planet'),
    ]

    operations = [
        migrations.RunPython(populate_space_objects, reverse_populate_space_objects),
    ]

