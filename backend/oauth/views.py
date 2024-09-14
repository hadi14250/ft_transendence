from dotenv import load_dotenv
import os
import requests
from django.conf import settings
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from accounts.models import UserProfile
from datetime import datetime
from django.utils import timezone

load_dotenv()

intraAuthUrl = os.environ.get("INTRA_AUTHORIZE_URL")
intraTokenUrl = os.environ.get("INTRA_TOKEN_URL")
intraUserInfoUrl = os.environ.get("INTRA_USER_INFO_URL")
clientId = os.environ.get("CLIENT_ID")
clientSecret = os.environ.get("CLIENT_SECRET")
redirectUri = os.environ.get("REDIRECT_URI")

@api_view(['GET'])
@permission_classes([AllowAny])
def authorize(request):
    params = {
        'client_id': clientId,
        'redirect_uri': redirectUri,
        'response_type': 'code',
        'scope': 'public',
        'prompt': 'login',  # Add this parameter to force login prompt
    }
    authorize_url = f"{intraAuthUrl}?{requests.compat.urlencode(params)}"
    return Response({"authorization_url": authorize_url})

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_token(request):
    code = request.data.get('code')
    if not code:
        return Response({"error": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': clientId,
        'client_secret': clientSecret,
        'code': code,
        'redirect_uri': redirectUri,
    }

    # Log request data for debugging
    print("Token Request Data:", token_data)

    token_response = requests.post(intraTokenUrl, data=token_data)

    # Log response for debugging
    print("Token Response Status Code:", token_response.status_code)
    print("Token Response Data:", token_response.json())

    if token_response.status_code != 200:
        return Response({"error": "Failed to obtain access token"}, status=token_response.status_code)

    token_response_data = token_response.json()
    access_token = token_response_data.get('access_token')
    if not access_token:
        return Response({"error": "Access token not found in the response"}, status=status.HTTP_400_BAD_REQUEST)

    user_info_response = requests.get(intraUserInfoUrl, headers={
        'Authorization': f'Bearer {access_token}'
    })

    # Log response for debugging
    print("User Info Response Status Code:", user_info_response.status_code)
    print("User Info Response Data:", user_info_response.json())

    if user_info_response.status_code != 200:
        return Response({"error": "Failed to fetch user information"}, status=user_info_response.status_code)

    user_info = user_info_response.json()

    user, created = User.objects.get_or_create(
        username=user_info['login'],
        defaults={
            'first_name': user_info['first_name'],
            'last_name': user_info['last_name'],
            'email': user_info['email'],
        }
    )

    # Extract profile picture URL
    profile_picture_url = user_info.get('image', {}).get('versions', {}).get('medium', '')

    # Update or create the UserProfile
    UserProfile.objects.update_or_create(
        user=user,
        defaults={
            'profile_picture_url': profile_picture_url
        }
    )

    refresh = RefreshToken.for_user(user)
    return Response({
        'access_token': str(refresh.access_token),
        'refresh_token': str(refresh),
    })


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout(request):
    print("Logout endpoint")
    try:
        refresh_token = request.data.get("refresh_token")
        token = RefreshToken(refresh_token)
        token.blacklist()
        return Response({"success": "Successfully logged out"}, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
