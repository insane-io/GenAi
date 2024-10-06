from django.db import models
from Auth.models import User

class Specialist(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    photo = models.TextField(null=True, blank=True)
    degree = models.CharField(max_length=255, null=True, blank=True)
    specialization = models.TextField(null=True, blank=True)
    time = models.CharField(max_length=255, null=True, blank=True)

    def __str__(self):
        return f"{self.name}"

class Appointment(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    specialist = models.ForeignKey(Specialist, on_delete=models.CASCADE)
    time = models.DateTimeField(auto_now_add=True)
    user_mood = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.first_name} - {self.specialist.name}"
    
class Exercise(models.Model):
    name = models.CharField(max_length=255, null=True, blank=True)
    description = models.TextField(null=True, blank=True)
    photo = models.TextField(null=True, blank=True)
    duration = models.CharField(max_length=255, null=True, blank=True)
    link = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name}"
    
class Education(models.Model):
    title = models.CharField(max_length=255, null=True)
    description = models.TextField(null=True, blank=True)
    link = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.title}"