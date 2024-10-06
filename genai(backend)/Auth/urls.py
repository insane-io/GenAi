from django.urls import path
from . import views

app_name = 'Auth'

urlpatterns = [
    path('signup/',views.signup_view,name='signup'),
    path('login/',views.login_view,name='login'),
    path('profile/',views.get_profile,name='get_profile'),
    path('update_profile/',views.update_profile,name='update_profile'),
]