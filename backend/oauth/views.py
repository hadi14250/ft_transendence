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

# Replace with your actual values
INTRA_AUTHORIZE_URL = "https://api.intra.42.fr/oauth/authorize"
INTRA_TOKEN_URL = "https://api.intra.42.fr/oauth/token"
INTRA_USER_INFO_URL = "https://api.intra.42.fr/v2/me"
CLIENT_ID = 'u-s4t2ud-434210c1463ba59055ca161772f77b2fafc69b6e8f210036ffdb992f09b57f76'
CLIENT_SECRET = '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'
REDIRECT_URI = 'http://localhost:80/oauth/callback/'


@api_view(['GET'])
@permission_classes([AllowAny])
def authorize(request):
    params = {
        'client_id': CLIENT_ID,
        'redirect_uri': REDIRECT_URI,
        'response_type': 'code',
        'scope': 'public',
        'prompt': 'login',  # Add this parameter to force login prompt
    }
    authorize_url = f"{INTRA_AUTHORIZE_URL}?{requests.compat.urlencode(params)}"
    return Response({"authorization_url": authorize_url})

@api_view(['POST'])
@permission_classes([AllowAny])
def auth_token(request):
    code = request.data.get('code')
    if not code:
        return Response({"error": "Code not provided"}, status=status.HTTP_400_BAD_REQUEST)

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': CLIENT_ID,
        'client_secret': CLIENT_SECRET,
        'code': code,
        'redirect_uri': REDIRECT_URI,
    }

    # Log request data for debugging
    print("Token Request Data:", token_data)

    token_response = requests.post(INTRA_TOKEN_URL, data=token_data)

    # Log response for debugging
    print("Token Response Status Code:", token_response.status_code)
    print("Token Response Data:", token_response.json())

    if token_response.status_code != 200:
        return Response({"error": "Failed to obtain access token"}, status=token_response.status_code)

    token_response_data = token_response.json()
    access_token = token_response_data.get('access_token')
    if not access_token:
        return Response({"error": "Access token not found in the response"}, status=status.HTTP_400_BAD_REQUEST)

    user_info_response = requests.get(INTRA_USER_INFO_URL, headers={
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
