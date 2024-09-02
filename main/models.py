from django.db import models
from django.contrib.auth.models import User

# #Test model
# class Note(models.Model):
#     title = models.CharField(max_length=100)
#     content = models.TextField()
#     created_at = models.DateTimeField()
#     author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
#     objects = models.Manager()

#     def __str__(self):
#         return self.title


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
        return self.user.username + " - " + self.resource.name
    

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
    description = models.TextField()    
    quantity = models.DecimalField(max_digits=10, decimal_places=2)
    

class UserGrid(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_grids_users")
    spaceObject = models.ForeignKey(SpaceObject, on_delete=models.CASCADE, related_name="user_grids_space_objects")
    x = models.IntegerField()
    y = models.IntegerField()

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

    

