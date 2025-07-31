from django.shortcuts import render,redirect,get_object_or_404
from .forms import TaskForm
from.models import Task
from django.contrib.auth.decorators import login_required
from django.utils import timezone

# Create your views here.
@login_required
def dashboard(request):

    user=request.user
    today = timezone.now().date()

    tasks = Task.objects.filter(user=user)
    todo_tasks = Task.objects.filter(user=user, status=Task.Status.TODO)
    in_progress_tasks = Task.objects.filter(user=user, status=Task.Status.IN_PROGRESS)
    completed_tasks = Task.objects.filter(user=user, status=Task.Status.COMPLETED)
    overdue_tasks = Task.objects.filter(
        user=user,
        due_date__lt=today,  # due date is earlier than today
        status__in=[Task.Status.TODO, Task.Status.IN_PROGRESS]  # not completed
    )
    context={
        'todo_tasks': tasks.filter(status='todo'),
        'inprogress_tasks': tasks.filter(status='inprogress'),
        'completed_tasks': tasks.filter(status='completed'),
        'todo_count': todo_tasks.count(),
        'in_progress_count': in_progress_tasks.count(),
        'completed_count': completed_tasks.count(),
         'overdue_count': overdue_tasks.count(),
    }
    return  render(request,'tasks/dashboard.html',context)
@login_required
def task_create(request):
    form=TaskForm()
    if request.method=='POST':
        form=TaskForm(request.POST)
        if form.is_valid():
            task = form.save(commit=False)
            task.user = request.user 
            task.save()
            # form.save()
            return redirect('tasks:detail',pk=task.pk)
    form=TaskForm()
    context={
        'form':form
    }
    return  render(request,'tasks/task_create.html',context)
@login_required
def task_detail(request,pk):
    task=get_object_or_404(Task,pk=pk,user=request.user)


    return  render(request,'tasks/task_detail.html',{'task':task})

@login_required
def task_edit(request,pk):

    form=TaskForm()
    task=get_object_or_404(Task,pk=pk,user=request.user)
    if request.method == 'POST':
        form=TaskForm(request.POST,instance=task)
        if form.is_valid():
            form.save()
            return redirect('tasks:detail',pk=task.pk)    
    else:
        form=TaskForm(instance=task)    
    context={
        'form':form,
        'task':task,
    }
    return  render(request,'tasks/task_edit.html',context)
@login_required
def delete_task(request,pk):
    task=get_object_or_404(Task,pk=pk,user=request.user)
    if request.method=='POST':
        task.delete()
        return redirect('tasks:dashboard')
    return render(request,'tasks/confirm_delete.html',{'task':task})












