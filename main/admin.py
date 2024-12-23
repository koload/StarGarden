from django.contrib import admin
from django.apps import apps
from .models import *

app = apps.get_app_config('main')

for model_name, model in app.models.items():
    admin.site.register(model)