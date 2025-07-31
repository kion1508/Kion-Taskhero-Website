from django import forms
from django.contrib.auth.forms import UserCreationForm
from django.contrib.auth import get_user_model

User = get_user_model()

class CustomUserCreationForm(UserCreationForm):
    first_name=forms.CharField(max_length=255,required=True)
    last_name=forms.CharField(max_length=255,required=True)
    email=forms.EmailField(required=True)
    class Meta:
        model = User
        fields=['first_name', 'last_name', 'email', 'username', 'password1', 'password2']