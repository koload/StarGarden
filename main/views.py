from django.shortcuts import get_list_or_404
from django.shortcuts import render
from django.http.response import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import (
    UserSerializer,
    SpaceObjectPriceSerializer, 
    SpaceObjectSerializer,
    UserSpaceObjectSerializer, 
    UserGridSerializer,
    UserResourcesSerializer
    )
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import SpaceObjectPrice, SpaceObject, UserSpaceObject, UserGrid, UserResources, Resource


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

@api_view(['GET'])
def get_resources_by_id(request):
    # Log the full query parameters
    print(f"Full query params: {request.query_params}")
    
    resource_ids = request.query_params.getlist('resource_ids')
    print(f"Resource ids after getlist: {resource_ids}")  # Debugging print
    
    if not resource_ids:
        return Response({"detail": "resource_ids are required."}, status=status.HTTP_400_BAD_REQUEST)

    resources = get_list_or_404(Resource, id__in=resource_ids)
    resource_names = {resource.id: resource.name for resource in resources}
    return Response(resource_names, status=status.HTTP_200_OK)

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

        # try and make the serializer work? It doesnt have to be used however in easy operations like deletion
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
    resources = request.data.get('resources')

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
    # Going through all objects, so we don't create the same user
    queryset = User.objects.all()
    # serializer class tells view what kind of data we want (name and password in this case)
    serializer_class = UserSerializer
    # permission class specifies who can can call this, in this case its anyone
    permission_classes = [AllowAny]


def index(response):
    return HttpResponse("IndexSite")

