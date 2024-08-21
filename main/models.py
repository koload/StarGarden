from django.db import models
from django.contrib.auth.models import User

#Test model
class Note(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    created_at = models.DateTimeField()
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="notes")
    objects = models.Manager()

    def __str__(self):
        return self.title
    
class SpaceObject(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()


    def __str__(self):
        return self.name

class Resource(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

class UserResources(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="user_resources")
    resource = models.ForeignKey(Resource, on_delete=models.CASCADE, related_name="user_resources")
    quantity = models.IntegerField()

    def __str__(self):
        return self.user.username + " - " + self.resource.name
    
