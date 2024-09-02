from django.shortcuts import render
from django.http.response import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.permissions import IsAuthenticated, AllowAny


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
def current_user(request):
    serializer = UserSerializer(request.user)
    return Response(serializer.data)


class CreateUserView(generics.CreateAPIView):
    # Going through all objects, so we don't create the same user
    queryset = User.objects.all()
    # serializer class tells view what kind of data we want (name and password in this case)
    serializer_class = UserSerializer
    # permission class specifies who can can call this, in this case its anyone
    permission_classes = [AllowAny]


def index(response):
    return HttpResponse("IndexSite")


def v1(response):
    return HttpResponse("test view1")
