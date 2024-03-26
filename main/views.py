from django.shortcuts import render
from django.http.response import HttpResponse

def index(response):
    return HttpResponse("testview")
# Create your views here.


