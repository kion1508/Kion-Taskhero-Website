from django.shortcuts import render,redirect
from .forms import CustomUserCreationForm
from django.contrib.auth import authenticate, login
from django.contrib.auth.views import LoginView
from django.contrib.auth.forms import AuthenticationForm
# Create your views here.
def signup(request):
    form = CustomUserCreationForm()
    if request.method=='POST':
        form=CustomUserCreationForm(request.POST)
        if form.is_valid():
            form.save()
            return redirect("accounts:login")
        else:
            print("form not valid")
            print(form.errors)
    context={
        'form':form
    }
    return render(request,'accounts/signup.html',context)
# def login_form(request):
#     if request.method=='POST':
#         form=AuthenticationForm(data=request.POST)
#         if form.is_valid():
#             login(request,form.get_user())
#             return redirect('tasks:dashboard')
#     else:
#         form=AuthenticationForm()

#     return render(request,'accounts/login.html
class CustomLoginView(LoginView):
    template_name='accounts/login.html'
    def form_valid(self, form):
        return super().form_valid(form)