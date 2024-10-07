"""
URL configuration for stargarden project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from main.views import (
    CreateUserView,
    index,
    current_user,
    space_object_prices,
    space_objects,
    space_object_by_user_id,
    place_space_object_on_grid,
    remove_space_object_from_inventory,
    remove_space_object_from_grid,
    get_space_object_from_grid,
    buy_space_object
)

from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path("main/user/register/", CreateUserView.as_view(), name="register"),
    path("main/token/", TokenObtainPairView.as_view(), name="get_token"),
    path("main/token/refresh/", TokenRefreshView.as_view(), name="refresh"),
    path("main-auth/", include("rest_framework.urls")),
    path("current_user/", current_user, name="current_user"),
    path('space_object_prices/', space_object_prices, name="space_object_prices"),
    path('space_objects/', space_objects, name="space_object"),
    path('user_space_objects/', space_object_by_user_id, name="user_space_objects"),
    path('place_space_object/', place_space_object_on_grid, name="place_space_object"),
    path('remove_space_object_from_inventory/', remove_space_object_from_inventory, name="remove_space_object_from_inventory"),
    path('remove_space_object_from_grid/', remove_space_object_from_grid, name="remove_space_object_from_grid"),
    path('get_space_object_from_grid/', get_space_object_from_grid, name="get_space_object"),
    path('buy_space_object/', buy_space_object, name="buy_space_object"),
    path('main/', include("main.urls")),
    path('', index)
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
