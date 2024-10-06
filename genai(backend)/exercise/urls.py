from django.urls import path
from . import views

urlpatterns = [
    path('get_specialist/',views.get_specialist,name='get_specialist'),
    path('get_education/',views.get_education,name='get_education'),
    path('get_exercise/',views.get_exercise,name='get_exercise'),
    path('book_session/',views.book_session,name='book_session'),
    path('get_appointment/',views.get_appointment,name='get_appointment'),
]