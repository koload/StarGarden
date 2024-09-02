# Generated by Django 5.0.7 on 2024-09-02 16:52

from django.db import migrations

def create_space_object_price(apps, schema_editor):
    SpaceObjectPrice = apps.get_model('main', 'SpaceObjectPrice')

    print("Creating SpaceObjectPrice entries...")

    SpaceObjectPrice.objects.create(spaceObject_id=1, resource_id=4, quantity=100)
    SpaceObjectPrice.objects.create(spaceObject_id=1, resource_id=1, quantity=240)

    print("SpaceObjectPrice entries created.")



class Migration(migrations.Migration):

    dependencies = [
        ('main', '0022_test_SO_price'),
    ]

    operations = [
        migrations.RunPython(create_space_object_price)
    ]
