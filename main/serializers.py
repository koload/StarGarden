from django.contrib.auth.models import User
from .models import UserProfile, SpaceObject, UserGrid, Resource, SpaceObjectPrice, UserResources, UserSpaceObject
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


class SpaceObjectPriceSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceObjectPrice
        fields = ["id", "quantity", "resource_id", "spaceObject_id"]
        read_only_fields = ["id", "quantity", "resource_id", "spaceObject_id"]


class SpaceObjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = SpaceObject
        fields = ["id", "name", "description", "image_path"]
        read_only_fields = ["id", "name", "description", "price_id"]


class UserSpaceObjectSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
    spaceObject_id = serializers.PrimaryKeyRelatedField(queryset=SpaceObject.objects.all(), source='spaceObject')

    class Meta:
        model = UserSpaceObject
        fields = ["id", "quantity", "spaceObject_id", "user_id"]
    

class UserGridSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
    spaceObject_id = serializers.PrimaryKeyRelatedField(queryset=SpaceObject.objects.all(), source='spaceObject')

    class Meta:
        model = UserGrid
        fields = ["id", "user_id", "spaceObject_id", "x", "y"]





# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content" "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}



