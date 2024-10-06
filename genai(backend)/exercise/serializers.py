from rest_framework import serializers
from .models import *
from Auth.serializers import ProfileSerializer

class GetSpecialistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Specialist
        fields = ['id', 'name', 'photo', 'degree', 'specialization', 'time']

class BookSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'

class GetAppointmentSerializer(serializers.ModelSerializer):
    user = ProfileSerializer()
    class Meta:
        model = Appointment
        fields = ['id', 'user', 'specialist', 'time', 'user_mood']
        depth = 1

class GetEducationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Education
        fields = '__all__'

class GetExerciseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Exercise
        fields = '__all__'

class GetBookSessionsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Appointment
        fields = '__all__'
        depth = 1