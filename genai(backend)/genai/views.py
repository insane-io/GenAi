import json
import requests
from Auth.models import User
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from Auth.models import *

@csrf_exempt
@api_view(['POST'])
@permission_classes([AllowAny])
def google_auth(request):
    try:
        access_token = request.data.get('token')

        if not access_token:
            return JsonResponse({'error': 'Token is missing'}, status=400)

        user_info_url = 'https://www.googleapis.com/oauth2/v3/tokeninfo?id_token='+str(access_token)
        user_info_response = requests.get(user_info_url)
        if user_info_response.status_code != 200:
            return JsonResponse({'error': 'Failed to fetch user info from Google'}, status=400)

        user_info = user_info_response.json()

        email = user_info.get('email')
        first_name = user_info.get('given_name', '')
        last_name = user_info.get('family_name', '')

        if not email:
            return JsonResponse({'error': 'Failed to fetch email from Google'}, status=400)

        user, created = User.objects.get_or_create(email=email, defaults={'username': email, 'first_name': first_name, 'last_name': last_name})
        if created:
            user.set_unusable_password()
            user.save()
        refresh = RefreshToken.for_user(user)
        response = {
                'refresh': str(refresh),
                'access': str(refresh.access_token)
            }
        return Response(response, status=status.HTTP_200_OK)
    except requests.RequestException as e:
        return JsonResponse({'error': f'Failed to fetch user info from Google: {str(e)}'}, status=500)
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON response from Google'}, status=500)
    except Exception as e:
        return JsonResponse({'error': str(e)}, status=500)