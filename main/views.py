from django.shortcuts import render
from django.http.response import HttpResponse
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


class CreateUserView(generics.CreateAPIView):
    # Going through all objects, so we don't create the same user
    queryset = User.objects.all()

    # serializer class tells view what kind of data we want (name and password in this case
    serializer_class = User

    # permission class specifies who can can call this, in this case its anyone
    permission_classes = [AllowAny]


def index(response):
    return HttpResponse("testview")


def v1(response):
    return HttpResponse("view1 working? sadasworking.")
# Create your views here.
