from django.contrib.auth.models import User
from .models import UserProfile, SpaceObject, UserGrid, Resource, SpaceObjectPrice, UserResources, UserSpaceObject, ResourceTransformation, Upgrade, UpgradeCost
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
    resource_name = serializers.SerializerMethodField()

    class Meta:
        model = SpaceObjectPrice
        fields = ["id", "quantity", "resource_id", "resource_name", "spaceObject_id"]
        read_only_fields = ["id", "quantity", "resource_id", "resource_name", "spaceObject_id"]

    def get_resource_name(self, obj):
        return obj.resource.name

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
        fields = ["id", "user_id", "spaceObject_id", "x", "y", "last_collected"]

class UserResourcesSerializer(serializers.ModelSerializer):
    user_id = serializers.PrimaryKeyRelatedField(queryset=User.objects.all(), source='user')
    resource_id = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(), source='resource')

    class Meta:
        model = UserResources
        fields = ["id", "user_id", "resource_id", "quantity"]

class ResourceTransformationSerializer(serializers.ModelSerializer):
    inputResource_id = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(), source='inputResource')
    outputResource_id = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(), source='outputResource')

    class Meta:
        model = ResourceTransformation
        fields = ["id", "inputResource_id", "outputResource_id", "inputQuantity", "outputQuantity"]


class UpgradeSerializer(serializers.ModelSerializer):
    baseSpaceObject_id = serializers.PrimaryKeyRelatedField(queryset=SpaceObject.objects.all(), source='baseSpaceObject')
    upgradedSpaceObject_id = serializers.PrimaryKeyRelatedField(queryset=SpaceObject.objects.all(), source='upgradedSpaceObject')

    class Meta:
        model = Upgrade
        fields = ["id", "baseSpaceObject_id", "upgradedSpaceObject_id", "upgradeDescription"]

class UpgradeCostSerializer(serializers.ModelSerializer):
    resource_name = serializers.SerializerMethodField()
    upgrade_id = serializers.PrimaryKeyRelatedField(queryset=Upgrade.objects.all(), source='upgrade')
    resource_id = serializers.PrimaryKeyRelatedField(queryset=Resource.objects.all(), source='resource')

    class Meta:
        model = UpgradeCost
        fields = ["id", "upgrade_id", "resource_id", "quantity", 'resource_name']
    
    def get_resource_name(self, obj):
        resource = Resource.objects.get(id=obj.resource_id)
        return resource.name


# Can delete this probobly
class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = ["id", "name", "description", "image_path"]
        read_only_fields = ["id", "name", "description", "image_path"]
        
# class NoteSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = Note
#         fields = ["id", "title", "content" "created_at", "author"]
#         extra_kwargs = {"author": {"read_only": True}}



