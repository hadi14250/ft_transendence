from django.urls import path
from .views import authorize, auth_token, logout

urlpatterns = [
    path('authorize/', authorize, name='authorize'),
    path('authToken/', auth_token, name='auth_token'),
    path('logout/', logout, name='logout'),
]
