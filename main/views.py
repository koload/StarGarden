from django.shortcuts import get_list_or_404
from django.shortcuts import render
from django.http.response import HttpResponse
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework import generics
from .tasks import test_func
from .serializers import (
    UserSerializer,
    SpaceObjectPriceSerializer, 
    SpaceObjectSerializer,
    UserSpaceObjectSerializer, 
    UserGridSerializer,
    UserResourcesSerializer,
    ResourceTransformationSerializer,
    UpgradeSerializer,
    ResourceSerializer,
    UpgradeCostSerializer
    )
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from datetime import datetime, timezone
from decimal import Decimal
import math
from .models import SpaceObjectPrice, SpaceObject, UserSpaceObject, UserGrid, UserResources, Resource, SpaceObjectGenerates, ResourceTransformation, Upgrade, UpgradeCost
    
@api_view(['POST'])
def update_space_object(request):
    user_id = request.user.id
    baseSpaceObject_id = request.data.get("baseSpaceObject_id")
    upgradedSpaceObject_id = request.data.get("upgradedSpaceObject_id")
    upgrade_id = request.data.get("upgrade_id")
    x = request.data.get("x")
    y = request.data.get("y")

    # deducting resources from user
    upgrade_cost = UpgradeCost.objects.filter(upgrade_id=upgrade_id).first()
    user_resource = UserResources.objects.filter(user_id=user_id, resource_id=upgrade_cost.resource_id).first()

    if not user_resource:
        print(f"User does not have resource with id: {upgrade_cost.resource_id}")
        return Response({"detail": "Resource not avaible."})
    elif user_resource.quantity < upgrade_cost.quantity:
        print(f"User has {user_resource.quantity} but needs {upgrade_cost.quantity}")
        return Response({"detail": "Not enough resources."})
    else:
        user_space_object = UserGrid.objects.filter(user_id=user_id, spaceObject_id=baseSpaceObject_id, x=x, y=y).first()
        user_space_object.spaceObject_id = upgradedSpaceObject_id
        user_space_object.last_collected = datetime.now(timezone.utc)

        # remove resources from user
        user_resource.quantity -= upgrade_cost.quantity
        user_resource.save()

        user_space_object.save()
        space_object_data = SpaceObjectSerializer(user_space_object.spaceObject)

        return Response({
            "detail": "Space object updated.",
            "user_space_object": space_object_data.data
            }, status=status.HTTP_200_OK)


@api_view(['GET'])
def get_space_objects_list_by_ids(request):
    space_object_ids = request.query_params.get('spaceObject_ids')

    if space_object_ids:
        id_list = [int(id) for id in space_object_ids.split(",")]
        
        space_object = SpaceObject.objects.filter(id__in=id_list).all()
        serializer = SpaceObjectSerializer(space_object, many=True)

        return Response(serializer.data)
    else:
        return Response({"error": "No space object ids provided"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def get_space_object_upgrades(request):
    user_id = request.user.id
    baseSpaceObject_id = request.query_params.get("baseSpaceObject_id")
    spaceObjectUpgrades = Upgrade.objects.filter(baseSpaceObject_id=baseSpaceObject_id).all()
    serializer = UpgradeSerializer(spaceObjectUpgrades, many=True)

    return Response(serializer.data)


@api_view(['GET'])
def get_resource_transformation(request):
    resource_transformation = ResourceTransformation.objects.all()
    serializer = ResourceTransformationSerializer(resource_transformation, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def handle_resource_transformation(request):
    user_id = request.user.id
    inputResource_id = request.data.get("inputResource_id")
    outputResource_id = request.data.get("outputResource_id")
    inputResource_quantity = request.data.get("inputResource_quantity")
    outputResource_quantity = request.data.get("outputResource_quantity")
    
    user_resource_to_deduct_from = UserResources.objects.filter(user_id=user_id, resource_id=inputResource_id).first()
    user_resorce_to_add_too = UserResources.objects.filter(user_id=user_id, resource_id=outputResource_id).first()

    if user_resorce_to_add_too:
        user_resource_to_deduct_from.quantity -= Decimal(inputResource_quantity)
        user_resorce_to_add_too.quantity += Decimal(outputResource_quantity)

        user_resource_to_deduct_from.save()
        user_resorce_to_add_too.save()

    else:
        user_resorce_to_add_too = UserResources.objects.create(user_id=user_id, resource_id=outputResource_id, quantity=outputResource_quantity)

    resource_deducted_from_data = UserResourcesSerializer(user_resource_to_deduct_from).data
    resource_added_to_data = UserResourcesSerializer(user_resorce_to_add_too).data

    return Response({
        "resource_deducted_from": resource_deducted_from_data,
        "resource_added_to": resource_added_to_data
    }, status=status.HTTP_200_OK)

@api_view(["GET"])
def get_output_transformation_resources(request):
    inputResource_id = request.query_params.get("inputResource_id")  
    inputResource_quantity = request.query_params.get("inputResource_quantity")  
    outputResource_id = request.query_params.get("outputResource_id")

    resource_transformation = ResourceTransformation.objects.filter(inputResource_id=inputResource_id, outputResource_id=outputResource_id).first()

    if math.isnan(float(inputResource_quantity)) and resource_transformation:
        print(inputResource_quantity)
        return Response({"output_resource_quantity": ''}, status=status.HTTP_200_OK)

    elif resource_transformation:
        print(inputResource_quantity)
        output_resource_quantity = Decimal(inputResource_quantity) / resource_transformation.inputQuantity
        return Response({"output_resource_quantity": float(output_resource_quantity)}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Resource transformation not found"}, status=status.HTTP_404_NOT_FOUND)


@api_view(["POST"])
def claim_resources(request):
    user_id = request.user.id
    userGridSpaceObjects = request.data.get("userGridSpaceObjects")
    try:
        for spaceObject in userGridSpaceObjects:
            last_collected = spaceObject["last_collected"]

            last_collected_time = datetime.fromisoformat(last_collected.replace("Z", "+00:00"))
            last_collected_time.strftime("%Y-%m-%d %H:%M:%S")

            time_now = datetime.now(timezone.utc)

            time_delta_hours = (time_now - last_collected_time).total_seconds() / 3600

            if time_delta_hours >= 24:
                time_delta_hours = 24

            # checking resource quantity and type to generate
            space_object_id = spaceObject["spaceObject_id"]
            space_object_generates = SpaceObjectGenerates.objects.filter(spaceObject_id=space_object_id)
            print(f"Space object generates: {space_object_generates}")

            for generate in space_object_generates:
                print(f"Generate: {generate}")
                generated_resource_quantity = generate.quantity * Decimal(time_delta_hours)
                generated_resource_id = generate.resource_id
                
                # checking if the user already has the resource
                user_resource = UserResources.objects.filter(user_id=user_id, resource_id=generated_resource_id).first()

                # accessing a specific instance of the user grid space object
                user_grid_space_object = UserGrid.objects.filter(user_id=user_id, spaceObject_id=space_object_id, x=spaceObject["x"], y=spaceObject["y"]).first()

                if user_resource:
                    user_resource.quantity += generated_resource_quantity
                    user_grid_space_object.last_collected = time_now
                    user_grid_space_object.save()
                else:
                    user_resource = UserResources.objects.create(user_id=user_id, resource_id=generated_resource_id, quantity=generated_resource_quantity)
                    user_grid_space_object.last_collected = time_now
                    user_grid_space_object.save()

                user_resource.save()

        return Response(status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(["GET"])
def get_user_space_objects_from_grid(request):
    try:
        user_space_objects = UserGrid.objects.filter(user_id=request.user.id).all()
        serializer = UserGridSerializer(user_space_objects, many=True)
        if serializer:
            return Response(serializer.data)
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return Response({"error": "Error in caliming resoure"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

def add_space_object_to_inventory(user_id, space_object_id):
    try:
        # check if the user_space_object already exists
        user_space_object = UserSpaceObject.objects.filter(user_id=user_id, spaceObject_id=space_object_id).first()
        if user_space_object:
            user_space_object.quantity += 1
            user_space_object.save()
            print(f"Updated quantity for user_space_object: {user_space_object}")
            return {"detail": "Space object added to inventory.", "status": status.HTTP_200_OK}
        
        # if it doesnt not exist, create a new one
        data = {
            'user_id': user_id,
            'spaceObject_id': space_object_id,
            'quantity': 1
        }
        
        serializer = UserSpaceObjectSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return {"data": serializer.data, "status": status.HTTP_201_CREATED}
        else:
            print(f"Serializer errors: {serializer.errors}")
            return {"errors": serializer.errors, "status": status.HTTP_400_BAD_REQUEST}
    except Exception as e:
        print(f"Exception occurred: {str(e)}")
        return {"detail": str(e), "status": status.HTTP_500_INTERNAL_SERVER_ERROR}

    
# test view
# class NoteListCreate(generics.ListCreateAPIView):
#     serializer_class = NoteSerializer
#     permission_classes = [AllowAny]

#     def get_queryset(self):
#         user = self.request.user
#         return Note.objects.filter(author=user)

#     def perform_create(self, serializer):
#         if serializer.is_valid():
#             serializer.save(author=self.request.user)
#         else:
#             print(serializer.errors)


# Test view
# class NoteDelete(generics.DestroyAPIView):
#     queryset = Note.objects.all()
#     serializer_class = NoteSerializer
#     permission_classes = [IsAuthenticated]

#     def get_queryset(self):
#         user = self.request.user
#         return Note.objects.filter(author=user)    


@api_view(['POST'])
def get_resources_by_id(request):
    resource_ids = request.data.get('resource_ids', [])
    if not resource_ids:
        return Response({"detail": "resource_ids are required."}, status=status.HTTP_400_BAD_REQUEST)

    resources = get_list_or_404(Resource, id__in=resource_ids)
    resource_names = {resource.id: resource.name for resource in resources}
    return Response(resource_names, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def get_resource_by_id(request):
#     resource_id = request.query_params.get('resource_id')

#     if not resource_id:
#         return Response({"detail": "resource_id is required."}, status=status.HTTP_400_BAD_REQUEST)
#     else:
#         resource = Resource.objects.filter(id=resource_id).first()
#         resource_data = ResourceSerializer(resource).data
#         return Response(resource_data)

@api_view(['GET'])
def user_resources(request):
    user_id = request.user.id
    user_resources = UserResources.objects.filter(user_id=user_id)
    serializer = UserResourcesSerializer(user_resources, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


@api_view(['GET'])
def space_object_prices(request):
    space_object_prices = SpaceObjectPrice.objects.all()
    serializer = SpaceObjectPriceSerializer(space_object_prices, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def space_objects(request):
    space_object = SpaceObject.objects.all()
    serializer = SpaceObjectSerializer(space_object, many=True)
    return Response(serializer.data)


@api_view(['GET'])
def space_object_by_user_id(request):
        user_id = request.user.id
        space_object = UserSpaceObject.objects.filter(user_id=user_id)
        serializer = UserSpaceObjectSerializer(space_object, many=True)
        return Response(serializer.data)


@api_view(['GET'])
def get_space_object_from_grid(request):
    user_id = request.user.id
    x = request.query_params.get('x')
    y = request.query_params.get('y')

    if not (x and y):
        return Response({"detail": "x and y are required."}, status=status.HTTP_400_BAD_REQUEST)
    
    user_grid = UserGrid.objects.filter(user_id=user_id, x=x, y=y).first()
    
    if not user_grid:
        return Response({"detail": "Space object not found."}, status=status.HTTP_200_OK)
    
    space_object = user_grid.spaceObject
    serializer = SpaceObjectSerializer(space_object)

    return Response(serializer.data)

@api_view(['DELETE'])
def remove_space_object_from_inventory(request):
    user_id = request.data.get('user_id')
    spaceObject_id = request.data.get('spaceObject_id')
    
    if not spaceObject_id:
        return Response({"detail": "spaceObject_id is required."}, status=status.HTTP_400_BAD_REQUEST)
    
    user_space_object = UserSpaceObject.objects.filter(user_id=user_id, spaceObject_id=spaceObject_id).first()

    if user_space_object.quantity > 1:
        user_space_object.quantity -= 1
        user_space_object.save()
        print(f"minus one to quantity of space object: {user_space_object}")
        return Response({"detail": "Space object removed from inventory."}, status=status.HTTP_204_NO_CONTENT)
    try:
        user_space_object = UserSpaceObject.objects.filter(user_id=user_id, spaceObject_id=spaceObject_id)
        if user_space_object.exists():
            user_space_object.delete()
            return Response({"detail": "Space object removed from inventory."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Space object not found in inventory."}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        print("Exception occurred:", str(e))
        return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['DELETE'])
def remove_space_object_from_grid(request):
    try:
        user_id = request.user.id
        spaceObject_id = request.data.get('spaceObject_id')
        x = request.data.get('x')
        y = request.data.get('y')

        data = {
            'user_id': user_id,
            'spaceObject_id': spaceObject_id,
            'x': x,
            'y': y
        }

        # try and make the serializer work? However it doesnt have to be used in easy operations like deletion in that case
        # serializer = UserGridSerializer(data=data)
        # if not serializer.is_valid():
        #     print("Validation errors:", serializer.errors)
        #     return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        user_grid_space_object = UserGrid.objects.filter(
            user_id=user_id,
            x=x,
            y=y
        )

        if spaceObject_id:
            inventory_result = add_space_object_to_inventory(user_id, spaceObject_id)
            if inventory_result["status"] != status.HTTP_200_OK and inventory_result["status"] != status.HTTP_201_CREATED:
                return Response(inventory_result.get("data", {"detail": inventory_result["detail"]}), status=inventory_result["status"])
        
        if user_grid_space_object.exists():
            user_grid_space_object.delete()
            return Response({"detail": "Space object removed from grid."}, status=status.HTTP_204_NO_CONTENT)
        else:
            return Response({"detail": "Space object not found in grid."}, status=status.HTTP_404_NOT_FOUND)

    except Exception as e:
        print("Exception occurred:", str(e))
        return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


@api_view(['POST'])
def buy_space_object(request):
    user_id = request.user.id
    space_object_id = request.data.get('spaceObject_id')
    resourcesCost = request.data.get('resources')
    
    resource_cost_mapping ={resources_cost["type"]: resources_cost["quantity"] for resources_cost in resourcesCost}

    user_resources = UserResources.objects.filter(user_id=user_id, resource_id__in=resource_cost_mapping.keys())

    user_resource_dict = {resource.resource_id: resource.quantity for resource in user_resources}

    
    can_buy = True
    for resource_type, required_quantity in resource_cost_mapping.items():
        print(user_resource_dict.get(resource_type, 0))
        user_quantity = user_resource_dict.get(resource_type, 0)
        if user_quantity < Decimal(required_quantity):
            can_buy = False
            print(f"Not enough resources: {resource_type}, required: {required_quantity}, available: {user_quantity}")
            break

    if not can_buy:
        return Response({"detail": "Not enough resources."}, status=status.HTTP_400_BAD_REQUEST)

    for resource_type, required_quantity in resource_cost_mapping.items():
        # Update users resource quantities
        user_resource = user_resources.get(resource_id=resource_type)
        user_resource.quantity -= Decimal(required_quantity)
        user_resource.save()

    inventory_result = add_space_object_to_inventory(user_id, space_object_id)
    if inventory_result["status"] != status.HTTP_200_OK and inventory_result["status"] != status.HTTP_201_CREATED:
        return Response(inventory_result.get("data", {"detail": inventory_result["detail"]}), status=inventory_result["status"])
    
    return Response({"detail": "Space object added to inventory and resources deducted."}, status=status.HTTP_200_OK)


@api_view(['POST'])
def place_space_object_on_grid(request):
    try:
        user_id = request.user.id
        spaceObject_id = request.data.get('spaceObject_id')
        
        if not spaceObject_id:
            return Response({"detail": "spaceObject_id is required."}, status=status.HTTP_400_BAD_REQUEST)

        data = {
            'user_id': user_id,
            'spaceObject_id': spaceObject_id,
            'x': request.data.get('x'),
            'y': request.data.get('y')
        }

        serializer = UserGridSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            print("Validation errors:", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        print("Exception occurred:", str(e))
        return Response({"detail": "An error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    # serializer class tells view what kind of data we want (name and password in this case)
    serializer_class = UserSerializer
    # permission class specifies who can can call this, in this case its anyone
    permission_classes = [AllowAny]


class UpgradeCostDetailView(generics.RetrieveAPIView):
    queryset = UpgradeCost.objects.all()
    serializer_class = UpgradeCostSerializer
    lookup_field = 'upgrade_id'

    def get_object(self):
        print("UpgradeCostDetailView is being processed")
        return super().get_object()


def index(response):
    return HttpResponse("IndexSite")

class TestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "Token is valid!"})