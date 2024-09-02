from django.contrib.auth.models import User
from .models import UserProfile, SpaceObject, UserGrid, Resource, SpaceObjectPrice, UserResources
from rest_framework import serializers

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        print(validated_data)
        user = User.objects.create_user(**validated_data)
        return user





# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content" "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}



