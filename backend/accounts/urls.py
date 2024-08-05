from django.urls import path
from .views import authorize, auth_token, me, save_prefs, logout, send_otp, verify_otp

urlpatterns = [
    path('oauth/authorize/', authorize, name='authorize'),
    path('oauth/authToken/', auth_token, name='auth_token'),
    path('me/', me, name='me'),
    path('save-prefs/', save_prefs, name='save_prefs'),
    path('logout/', logout, name='logout'),
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
]