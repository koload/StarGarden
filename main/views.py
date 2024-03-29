from django.shortcuts import render
from django.http.response import HttpResponse


def index(response):
    return HttpResponse("testview")

def v1(response):
    return HttpResponse("view1 working? sadasworking.")
# Create your views here.
