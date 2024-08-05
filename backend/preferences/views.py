from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from accounts.models import UserProfile, OTP
from common.utils import create_and_send_otp
from django.utils import timezone

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def me(request):
    user = request.user
    user_profile, created = UserProfile.objects.get_or_create(user=user)
    user_data = {
        'username': user.username,
        'language_preference': user_profile.language_preference,
        'is_2fa_enabled': user_profile.is_2fa_enabled,
        'profile_picture_url': user_profile.profile_picture_url,
    }
    return Response(user_data)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def save_prefs(request):
    user = request.user
    user_profile = user.userprofile
    user_profile.preferences = request.data.get('preferences', user_profile.preferences)
    user_profile.language_preference = request.data.get('language_preference', user_profile.language_preference)
    user_profile.is_2fa_enabled = request.data.get('is_2fa_enabled', user_profile.is_2fa_enabled)
    user_profile.save()
    return Response({"success": True})

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def send_otp(request):
    user = request.user
    if user.userprofile.is_2fa_enabled:
        create_and_send_otp(user)
        return Response({"success": "OTP sent to email"}, status=200)
    return Response({"error": "2FA is not enabled for this user"}, status=400)

@api_view(['POST'])
@permission_classes([AllowAny])
def verify_otp(request):
    username = request.data.get('username')
    otp = request.data.get('otp')

    try:
        user = User.objects.get(username=username)
        otp_instance = OTP.objects.get(user=user)

        if otp_instance.otp == otp and otp_instance.expires_at > timezone.now():
            return Response({"success": "OTP verified"}, status=200)
        return Response({"error": "Invalid or expired OTP"}, status=400)
    except User.DoesNotExist:
        return Response({"error": "User not found"}, status=404)
    except OTP.DoesNotExist:
        return Response({"error": "OTP not found"}, status=404)
