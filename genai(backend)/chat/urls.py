# backend/Doctor/urls.py

from django.urls import path
from .views import *

urlpatterns = [
    path('start-session/', start_chat_session, name='start_session'),
    path('start_chat/', chatbot_view, name='chatbot_view'),
    path('get_chat/', get_chat_session, name='get_chat_session'),
    path('get_chat_session/', get_user_chats, name='get_user_chats'),
]
