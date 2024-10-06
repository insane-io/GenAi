from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny,IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .serializers import *
from .models import *
from Auth.models import User
from rest_framework.decorators import api_view, permission_classes
from django.shortcuts import get_object_or_404

@api_view(['GET'])
@permission_classes([AllowAny])
def get_specialist(request):
    try:
        specialist_id = request.GET.get('id')
        if specialist_id:
            specialist = Specialist.objects.get(id=specialist_id)
            serializer = GetSpecialistSerializer(specialist)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            specialist = Specialist.objects.all()
            serializer = GetSpecialistSerializer(specialist, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Specialist.DoesNotExist:
        return Response({'Error': 'Specialist not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_education(request):
    try:
        video_id = request.GET.get('id')
        if video_id:
            education = Education.objects.get(id=video_id)
            serializer = GetEducationSerializer(education)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            education = Education.objects.all()
            serializer = GetEducationSerializer(education, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Education.DoesNotExist:
        return Response({'Error': 'Education not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([AllowAny])
def get_exercise(request):
    try:
        exercise_id = request.GET.get('id')
        if exercise_id:
            exercise = Exercise.objects.get(id=exercise_id)
            serializer = GetExerciseSerializer(exercise)
            return Response(serializer.data, status=status.HTTP_200_OK)
        else:
            exercise = Exercise.objects.all()
            serializer = GetExerciseSerializer(exercise, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
    except Exercise.DoesNotExist:
        return Response({'Error': 'Exercise not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def book_session(request):
    try:
        user = get_object_or_404(User, email=request.user.email)
        specialist_id = request.data.get('id')
        specialist = Specialist.objects.get(id=specialist_id)
        user_mood = request.data.get('user_mood')
        appointment = Appointment.objects.create(user=user, specialist=specialist, user_mood=user_mood)
        serializer = BookSessionsSerializer(appointment)
        return Response(serializer.data, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_appointment(request):
    try:
        user = request.user
        appoint = Appointment.objects.filter(user=user)
        # print(appoint)
        serializer = GetAppointmentSerializer(appoint, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Appointment.DoesNotExist:
        return Response({'Error': 'Appointment not found'}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({'Error': str(e)}, status=status.HTTP_400_BAD_REQUEST)