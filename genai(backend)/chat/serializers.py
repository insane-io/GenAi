from rest_framework import serializers
from .models import *

class ChatMessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = ChatMessage
        fields = ['user_message', 'bot_response', 'timestamp']

class ChatSessionSerializer(serializers.ModelSerializer):
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = ChatSession
        fields = ['session_id', 'user', 'created_at', 'messages']

class SummarySerializer(serializers.ModelSerializer):

    class Meta:
        model = ChatSession
        fields = ['user', 'summary', 'created_at', 'session_id']