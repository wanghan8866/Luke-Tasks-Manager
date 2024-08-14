from django.shortcuts import render
from api import serializer as api_serializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import generics, status
from rest_framework.views import APIView
from userauths.models import User
from api import models as api_models
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.response import Response
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.conf import settings
from django.utils import timezone
from datetime import datetime, time
import random
from faker import Faker
# Create your views here.
fake = Faker()

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = api_serializer.MyTokenObtainPairSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = api_serializer.RegisterSerializer

def generate_random_otp(length = 7):
    otp = "".join([str(random.randint(0, 9)) for _ in range(length)])
    return otp

class PasswordResetEmailVerifyAPIView(generics.RetrieveAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer

    def get_object(self):
        email = self.kwargs["email"]
        user = User.objects.filter(email = email).first()

        if user:
            uuidb64 = user.pk
             
            refresh = RefreshToken.for_user(user)
            refresh_token = str(refresh.access_token)

            user.refresh_token = refresh_token
            user.otp = generate_random_otp()

            user.save()

            # link = f"http://localhost:8000/api/v1/user/password-change/?otp={user.otp}&uuidb64={uuidb64}&refresh_token={refresh_token}"
            link = f"http://localhost:5173/create-new-password/?otp={user.otp}&uuidb64={uuidb64}&refresh_token={refresh_token}"
            
            email_data = {
                "link": link,
                "username": user.username
            }

            subject = "Password Reset Email"
            text_body = render_to_string("email/password_reset.txt",  email_data)
            html_body = render_to_string("email/password_reset.html",  email_data)


            print(f"Password Reset: {link}")
            msg = EmailMultiAlternatives(
                subject=subject,
                from_email=settings.FROM_EMAIL,
                to=[user.email],
                body=text_body

            )
            print(user.email)
            msg.attach_alternative(html_body, "text/html")
            msg.send()


        return user

class PasswordChangeAPIView(generics.CreateAPIView):
    permission_classes = [AllowAny]
    serializer_class = api_serializer.UserSerializer
    

    def create(self, request, *args, **kwargs):
        payload = request.data
        otp = payload["otp"]
        uuidb64 = payload["uuidb64"]
        password = payload["password"]
        refresh_token = payload["refresh_token"]

        user = User.objects.get(id=uuidb64, otp = otp)
        print(user, )
        if user:
            user.set_password(password)
            if not settings.DEBUG:
                user.otp = ""
            user.save()

            return Response({"Message":"Password changed successfully!"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"Message":"User Does Not Exists!"}, status=status.HTTP_404_NOT_FOUND)
        

# For Tasks

    

class UserSummaryAPIView(generics.ListAPIView):
    """Get essentail summary of Tasks for a user"""

    serializer_class = api_serializer.TaskSummarySerializer
    permission_classes = [AllowAny]
    
    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user = User.objects.get(id=user_id)

        total_tasks = api_models.Task.objects.filter(user=user)
        # print([task.progress() for task in total_tasks])
        # print([task.status() for task in total_tasks])

        return total_tasks
    
class AllTaskListAPIView(generics.ListAPIView):
    """Get all tasks for a user"""
    serializer_class = api_serializer.TaskSummarySerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        return api_models.Task.objects.all()

class UsertaskListAPIView(generics.ListAPIView):
    """Get all tasks for a user"""
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user =  User.objects.get(id=user_id)
        return api_models.Task.objects.filter(user=user)


class TaskCreateAPIView(generics.CreateAPIView):
    """Create a task"""
    queryset = api_models.Task.objects.all()
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]

    # def get_queryset(self):
    #     teacher_id = self.kwargs['teacher_id']
    #     teacher = api_models.Teacher.objects.get(id=teacher_id)
    #     return api_models.Notification.objects.filter(teacher=teacher, seen=False)
    


class TaskUpdateAPIView(generics.RetrieveUpdateAPIView):
    """Update a task from a user"""
    queryset = api_models.Task.objects.all()
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]
    

    def get_object(self):
        task_id = self.kwargs['task_id']
        task = api_models.Task.objects.get(id = task_id)
        return task

class TaskDetailAPIView(generics.RetrieveAPIView):
    """Get a task and all its ToDos from a user"""
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        task_id = self.kwargs['task_id']
        task = api_models.Task.objects.get(id=task_id)
        # print(task)
        # t = api_serializer.TaskSerializer(task)
        # print(t.data)
        return task

class TasktDeleteAPIView(generics.DestroyAPIView):
    """Delete a task from a user"""
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        task_id = self.kwargs['task_id']
        task = api_models.Task.objects.get(id=task_id)
        return task

class TasktDeleteAllAPIView(APIView):
    """Delete all tasks from a user"""
    serializer_class = api_serializer.TaskSerializer
    permission_classes = [AllowAny]

    def delete(self, request, *args, **kwargs):
        user_id = self.kwargs['user_id']
        user =  User.objects.get(id=user_id)
        # User.email
        tasks_deleted, _ = api_models.Task.objects.filter(user=user).delete()
        return Response(
            {"message":f"Deleted all {tasks_deleted} tasks for user {user.email}"},
            status=status.HTTP_204_NO_CONTENT
        )

# For ToDos

class UserToDoListAPIView(generics.ListAPIView):
    """Show All ToDo for a user"""
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        user_id = self.kwargs['user_id']
        user =  User.objects.get(id=user_id)
        return api_models.ToDo.objects.filter(task__user = user)

class ToDoCreateAPIView(generics.CreateAPIView):
    """Create a new ToDo for a task"""
    queryset = api_models.ToDo.objects.all()
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]

class ToDoUpdateAPIView(generics.RetrieveUpdateAPIView):
    """Update a new ToDo for a task from a user"""
    queryset = api_models.ToDo.objects.all()
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]
    

    def get_object(self):
        todo_id = self.kwargs['todo_id']
        todo = api_models.ToDo.objects.get(id = todo_id)
        return todo
    
class ToDoDetailAPIView(generics.RetrieveAPIView):
    """Get detail of a toDo"""
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        todo_id = self.kwargs['todo_id']
        todo = api_models.ToDo.objects.get(id = todo_id)
        return todo
    


class ToDoDeleteAPIView(generics.DestroyAPIView):
    """Delete a new ToDo for a task from a user"""
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        todo_id = self.kwargs['todo_id']
        todo = api_models.ToDo.objects.get(id = todo_id)
        return todo

class TaskToDoCompletedCreateAPIView(generics.UpdateAPIView):
    """Mark complete on a ToDo for a task"""
    queryset = api_models.ToDo.objects.all()
    serializer_class = api_serializer.ToDoSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        todo_id = self.kwargs['todo_id']
        todo = api_models.ToDo.objects.get(id = todo_id)
        return todo

    def patch(self, request, *args, **kwargs):

        todo = self.get_object()
        todo.isFinished = True
        todo.save()
        return Response({'message': 'Task marked as finished.'}, status=status.HTTP_200_OK)
    

class TestCreateRandomTasksAndToDos(APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, *args, **kwargs):
        users = User.objects.all()

        # Max Number of tasks and Todos per User
        max_num_tasks = 10
        min_to_dos_per_tasks = 2
        max_to_dos_per_tasks = 5

        today = timezone.now().date()
        # work start with 9am
        due_time = datetime.combine(today, time(9, 0, 0))

        # for i in range(10):
        #     print(due_time + timezone.timedelta(days=random.randint(1, 30)) + timezone.timedelta(hours=random.randint(1, 4)*2))
        for user in users:
            for _ in range(max_num_tasks):
                task = api_models.Task.objects.create(
                    user = user,
                    task_title = fake.sentence(nb_words=4),
                    task = fake.paragraph(),
                    # bue within 45 days during working hour
                    due_by=due_time + timezone.timedelta(days=random.randint(1, 45)) + timezone.timedelta(hours=random.randint(1, 4)*2),
                    created_datetime = timezone.now(),
                    priority=random.choice([1,2,3]),
                    is_urgent=random.choice([True, False])                                  
                )

                for _ in range(random.randint(min_to_dos_per_tasks, max_to_dos_per_tasks)):
                    api_models.ToDo.objects.create(
                        task = task,
                        title=fake.sentence(nb_words=6),
                        created_datetime = timezone.now(),
                        isFinished = random.choice([True, False]) 
                    )


        return Response({
            "message": "Random tasks and todos created successfully."
        }, status=status.HTTP_201_CREATED)


class TestDeleteAllTasksAndToDos(APIView):
    """Delete all tasks from all users"""
    # serializer_class = api_serializer.TaskSerializer
    permission_classes = [IsAdminUser]

    def delete(self, request, *args, **kwargs):
        users = User.objects.all()
        tasks_count = 0
        for user in users:
            tasks_deleted, _ = api_models.Task.objects.filter(user=user).delete()
            tasks_count += tasks_deleted

        return Response(
            {"message":f"Deleted all {tasks_count} tasks for all {users.count()} users"},
            status=status.HTTP_204_NO_CONTENT
        )