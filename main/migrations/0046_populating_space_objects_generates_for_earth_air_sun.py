# Generated by Django 5.0.7 on 2024-10-28 12:04

from django.db import migrations
def populate_space_objects_generates_for_earth_air_sun(apps, schema_editor):
    spaceObjectGeneates = apps.get_model('main', 'SpaceObjectGenerates')
    spaceObjectGeneates.objects.create(spaceObject_id=2, resource_id=2, quantity=10)
    spaceObjectGeneates.objects.create(spaceObject_id=4, resource_id=5, quantity=10)
    spaceObjectGeneates.objects.create(spaceObject_id=3, resource_id=3, quantity=10)

    # correcting earth planets description
    spaceObject = apps.get_model('main', 'SpaceObject')
    spaceObject.objects.filter(id=3).update(description="A world covered in dirt, soil and some flora.")

class Migration(migrations.Migration):

    dependencies = [
        ('main', '0045_populating_more_resource_transformations'),
    ]

    operations = [
        migrations.RunPython(populate_space_objects_generates_for_earth_air_sun),
    ]
