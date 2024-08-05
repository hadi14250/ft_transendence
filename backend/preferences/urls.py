from django.urls import path
from .views import me, save_prefs, send_otp, verify_otp

urlpatterns = [
    path('me/', me, name='me'),
    path('save-prefs/', save_prefs, name='save_prefs'),
    path('send-otp/', send_otp, name='send_otp'),
    path('verify-otp/', verify_otp, name='verify_otp'),
]
