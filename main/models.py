from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone
from django.db.models.signals import post_save
from django.dispatch import receiver

# #Test model
# class Note(models.Model):
#     title = models.CharField(max_length=100)
#     content = models.TextField()
#     created_at = models.DateTimeField()
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
#     objects = models.Manager()

#     def __str__(self):
#         return self.title

PREDEFINED_RESOURCES = [
    {"resource_name": "Prime Matter", "quantity": 400.00},
    {"resource_name": "Water", "quantity": 500.00},
]

@receiver(post_save, sender=User)
def create_user_resources(sender, instance, created, **kwargs):
    if created:
        for resource_data in PREDEFINED_RESOURCES:
            resource, _ = Resource.objects.get_or_create(name=resource_data["resource_name"])
            UserResources.objects.create(user=instance, resource=resource, quantity=resource_data["quantity"])

class Resource(models.Model):
    name = models.CharField(max_length=100)
    
    def __str__(self):
        return self.name


class UserProfile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name="profile")

    def __str__(self):
        return self.user.username
    

class UserResources(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_resources_users")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="user_resources_resources")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.user.username + " - " + self.resource.name + " - " + str(self.quantity)

class SpaceObject(models.Model):
    name = models.CharField(max_length=100)
    image_path = models.CharField(max_length=255)
    description = models.TextField()

    def __str__(self):
        return self.name
    

class SpaceObjectGenerates(models.Model):
    spaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="space_object_generates_space_objects")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="space_object_generates_resources")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.spaceObject.name + " - " + self.resource.name + " - " + str(self.quantity)
    

class SpaceObjectPrice(models.Model):
    spaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="space_object_prices_space_objects")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="space_object_prices_resources")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.spaceObject.name + " - " + self.resource.name + " - " + str(self.quantity)

class UserGrid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_grids_users")
    spaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="user_grids_space_objects")
    x = models.IntegerField()
    y = models.IntegerField()
    last_collected = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return self.user.username + " - " + self.spaceObject.name + " - " + str(self.x) + " - " + str(self.y)
    

class Upgrade(models.Model):
    baseSpaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="base_upgrades")
    upgradedSpaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="upgraded_upgrades")
    upgradeDescription = models.TextField(null=True, default="???")

    def __str__(self):
        return self.baseSpaceObject.name + " - " + self.upgradedSpaceObject.name
    

class UpgradeCost(models.Model):
    upgrade = models.ForeignKey(Upgrade, on_delete=models.CASCADE, related_name="upgrade_costs_upgrades")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="upgrade_costs_resources")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.upgrade.baseSpaceObject.name + " - " + self.upgrade.upgradedSpaceObject.name + " - " + self.resource.name + " - " + str(self.quantity)


class ResourceTransformation(models.Model):
    inputResource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="resource_transformations")
    outputResource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="output_transformations")
    inputQuantity = models.DecimalField(max_digits=10, decimal_places=2)
    outputQuantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.inputResource.name + " - " + str(self.inputQuantity) + " - " + self.outputResource.name + " - " + str(self.outputQuantity)
    

class UserSpaceObject(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_space_objects")
    spaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="user_space_objects")
    quantity = models.DecimalField(max_digits=10, decimal_places=2)

    def __str__(self):
        return self.user.username + " - " + self.spaceObject.name + " - " + str(self.quantity)
    

