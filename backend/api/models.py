from django.db import models
from userauths.models import User
from django.utils import timezone
# Create your models here.

class Task(models.Model):
    # delete the user, still keep the task
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    task_title = models.CharField(unique=True, max_length=100)
    task = models.TextField()
    due_by = models.DateTimeField()
    created_datetime= models.DateTimeField(auto_now_add=True)

    class Priority(models.IntegerChoices):
        HIGH = 1
        NORAML = 2
        LOW = 3
    priority = models.IntegerField(choices=Priority.choices, default=Priority.NORAML)
    is_urgent = models.BooleanField(default=False)


    def __str__(self):
        return self.task_title

    def progress(self) -> float:
        total_toDos = ToDo.objects.filter(task=self).count()
        completed_toDos = ToDo.objects.filter(task=self, isFinished=True).count()

        if total_toDos == 0:
            return 0
        return completed_toDos/total_toDos #[0-1]

    def status(self):
        progress = self.progress()
        if abs(progress) < 1e-3:
            return "Not Started"
        elif abs(progress-1) < 1e-3:
            return "Finished"
        return "In Progress"
    

class ToDo(models.Model):
    # delete the user, still keep the task
    task = models.ForeignKey(Task, related_name="todos", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    created_datetime= models.DateTimeField(auto_now_add=True)
    isFinished = models.BooleanField(default=False)

    class Meta:
        constraints = [
            models.UniqueConstraint(fields=["task","title" ], name = "unqiue_task_to_do")
        ]

    def __str__(self):
        return f"{self.task} - {self.title}"


