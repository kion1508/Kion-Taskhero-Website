# TaskHero Django Implementation Instructions

## Project Structure Overview

The frontend templates and static files have been created with the following structure:

```
templates/
├── partials/
│   └── base.html          # Base template with navigation and common elements
├── home/
│   └── landing.html       # Landing page
├── accounts/
│   ├── login.html         # User login page
│   ├── signup.html        # User registration page
│   └── logout.html        # Logout confirmation (optional)
└── tasks/
    ├── dashboard.html     # Main task dashboard with kanban board
    ├── task_detail.html   # Individual task detail page
    ├── task_create.html   # Create new task form
    └── task_edit.html     # Edit existing task form

static/
├── css/
│   └── style.css          # Main stylesheet with themes and responsive design
├── js/
│   └── script.js          # JavaScript for interactivity and theme management
└── images/
    └── (placeholder for your assets)
```

## Required Django Apps

Based on the template structure, you should create the following Django apps:

### 1. `home` app
**Purpose**: Handle the landing page and general site pages

**Views to create**:
- `landing_view` → renders `home/landing.html`

**URL patterns** (`home/urls.py`):
```python
app_name = 'home'
urlpatterns = [
    path('', views.landing_view, name='landing'),
]
```

### 2. `accounts` app  
**Purpose**: Handle user authentication (registration, login, logout)

**Views to create**:
- `signup_view` → renders `accounts/signup.html`
- `login_view` → renders `accounts/login.html` 
- `logout_view` → handles logout and redirects
- (Optional) `logout_confirmation_view` → renders `accounts/logout.html`

**URL patterns** (`accounts/urls.py`):
```python
app_name = 'accounts'
urlpatterns = [
    path('signup/', views.signup_view, name='signup'),
    path('login/', views.login_view, name='login'),
    path('logout/', views.logout_view, name='logout'),
]
```

### 3. `tasks` app
**Purpose**: Handle all task-related functionality (CRUD operations)

**Views to create**:
- `dashboard_view` → renders `tasks/dashboard.html`
- `task_detail_view` → renders `tasks/task_detail.html`
- `task_create_view` → renders `tasks/task_create.html`
- `task_edit_view` → renders `tasks/task_edit.html`
- `task_delete_view` → handles task deletion (redirect after success)

**URL patterns** (`tasks/urls.py`):
```python
app_name = 'tasks'
urlpatterns = [
    path('dashboard/', views.dashboard_view, name='dashboard'),
    path('<int:pk>/', views.task_detail_view, name='detail'),
    path('create/', views.task_create_view, name='create'),
    path('<int:pk>/edit/', views.task_edit_view, name='edit'),
    path('<int:pk>/delete/', views.task_delete_view, name='delete'),
]
```

## Main Project URLs

In your main `urls.py` file:

```python
from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', include('home.urls')),
    path('accounts/', include('accounts.urls')),
    path('tasks/', include('tasks.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
```

## Required Django Models

### Task Model (`tasks/models.py`)
```python
from django.db import models
from django.contrib.auth.models import User
from django.urls import reverse

class Task(models.Model):
    STATUS_CHOICES = [
        ('todo', 'To Do'),
        ('progress', 'In Progress'),
        ('completed', 'Completed'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
    ]
    
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    due_date = models.DateField()
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='todo')
    priority = models.CharField(max_length=10, choices=PRIORITY_CHOICES, default='medium')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='tasks')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        ordering = ['due_date', '-priority']
    
    def __str__(self):
        return self.title
    
    def get_absolute_url(self):
        return reverse('tasks:detail', kwargs={'pk': self.pk})
    
    @property
    def is_overdue(self):
        from django.utils import timezone
        return self.due_date < timezone.now().date() and self.status != 'completed'
```

## Django Settings Requirements

### Required Settings
```python
# Static files
STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']

# Authentication
LOGIN_URL = '/accounts/login/'
LOGIN_REDIRECT_URL = '/tasks/dashboard/'
LOGOUT_REDIRECT_URL = '/'

# For Google OAuth (if implementing)
# Add your Google OAuth settings here
```

## Template Context Variables

The templates expect these context variables:

### `tasks/dashboard.html`
- `tasks` - QuerySet of user's tasks
- `todo_tasks` - Tasks with status='todo'
- `progress_tasks` - Tasks with status='progress'  
- `completed_tasks` - Tasks with status='completed'
- `overdue_tasks` - Tasks that are overdue
- Statistics counts for each category

### `tasks/task_detail.html`
- `task` - Single Task object

### `tasks/task_create.html` & `tasks/task_edit.html`
- `form` - Task form instance
- `task` - Task object (for edit view only)

## Form Implementation

### Task Form (`tasks/forms.py`)
```python
from django import forms
from .models import Task

class TaskForm(forms.ModelForm):
    class Meta:
        model = Task
        fields = ['title', 'description', 'due_date', 'status', 'priority']
        widgets = {
            'due_date': forms.DateInput(attrs={'type': 'date'}),
            'description': forms.Textarea(attrs={'rows': 6}),
        }
```

## Additional Features to Implement

1. **User Authentication**: Use Django's built-in authentication
2. **Form Validation**: Add proper validation for all forms
3. **Success Messages**: Use Django's messages framework
4. **CSRF Protection**: Already included in templates
5. **Responsive Design**: CSS is already responsive
6. **Dark/Light Theme**: JavaScript theme switcher included
7. **Search/Filter**: Add search functionality to dashboard
8. **Pagination**: For large numbers of tasks
9. **Email Notifications**: For due dates
10. **Google OAuth**: Integration for social login

## JavaScript Functionality Included

The `script.js` file includes:
- Theme switching (dark/light mode)
- Responsive navigation
- Form validation and enhancement
- Modal management
- Notification system
- Scroll animations
- Task management functions

## Next Steps

1. Create the Django apps (`home`, `accounts`, `tasks`)
2. Implement the models and run migrations
3. Create the views with proper authentication and authorization
4. Implement forms and form handling
5. Set up URL routing
6. Add Django messages framework integration
7. Test all functionality
8. Deploy with proper static file serving

The frontend is complete and ready for backend integration!