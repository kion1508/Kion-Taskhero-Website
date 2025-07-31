from django.db import models
from django.contrib.auth.models import User
from django.utils import timezone

# Create your models here.
class Task(models.Model):
    class Priority(models.TextChoices):
        HIGH='high', 'HIGH'
        MEDIUM='medium', 'MEDIUM'
        LOW='low', 'LOW'
    class Status(models.TextChoices):
        TODO = 'todo', 'To Do'
        IN_PROGRESS = 'inprogress', 'In Progress'
        COMPLETED = 'completed', 'Completed'

    user= models.ForeignKey(User,on_delete=models.CASCADE)
    title=models.CharField(max_length=255)
    description=models.TextField(blank=False)
    status = models.CharField(
        max_length=20,
        choices=Status.choices,
        default=Status.TODO,
    )
    priority = models.CharField(
        max_length=10,
        choices=Priority.choices,
        default=Priority.MEDIUM,
    )

    due_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return f"{self.title}"



# 415772280178-3dr1mj18lpuq27prvar15583m8q04ik0.apps.googleusercontent.com