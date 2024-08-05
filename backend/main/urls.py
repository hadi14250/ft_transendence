from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('oauth/', include('oauth.urls')),
    path('preferences/', include('preferences.urls')),
]