from django.urls import path
from . import views
app_name='tasks'
urlpatterns=[
    path('dashboard/',views.dashboard,name='dashboard'),
    path('create/',views.task_create,name='create'),
    path('delete/<int:pk>',views.delete_task,name='delete'),
    path('<int:pk>/',views.task_detail,name='detail'),
    path('<int:pk>/edit/',views.task_edit,name='edit'),
]