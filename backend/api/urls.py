from api import views as api_views
from django.urls import path

from rest_framework_simplejwt.views import TokenRefreshView

urlpatterns = [
    # Authentication Endpoints

    path("user/token/", api_views.MyTokenObtainPairView.as_view()),
    path("user/token/refresh/", TokenRefreshView.as_view()),
    path("user/register/", api_views.RegisterView.as_view()),
    path("user/password-reset/<email>/", api_views.PasswordResetEmailVerifyAPIView.as_view()),
    path("user/password-change/", api_views.PasswordChangeAPIView.as_view()),

    # Tasks
    path("user/summary/<user_id>/", api_views.UserSummaryAPIView.as_view()),
    path("user/task-all/", api_views.AllTaskListAPIView.as_view()),
    path("user/task-lists/<user_id>/", api_views.UsertaskListAPIView.as_view()),
    path("user/task-create/", api_views.TaskCreateAPIView.as_view()),
    path("user/task-update/<task_id>/", api_views.TaskUpdateAPIView.as_view()),
    path("user/task-detail/<task_id>/", api_views.TaskDetailAPIView.as_view()),
    path("user/task-delete/<task_id>/", api_views.TasktDeleteAPIView.as_view()),
    path("user/task-delete-all/<user_id>/", api_views.TasktDeleteAllAPIView.as_view()),
   
   
    # ToDos
    path("user/todo-lists/<user_id>/", api_views.UserToDoListAPIView.as_view()),
    path("user/todo-create/", api_views.ToDoCreateAPIView.as_view()),
    path("user/todo-update/<todo_id>/", api_views.ToDoUpdateAPIView.as_view()),
    path("user/todo-detail/<todo_id>/", api_views.ToDoDetailAPIView.as_view()),
    path("user/todo-delete/<todo_id>/", api_views.ToDoDeleteAPIView.as_view()),
    path("user/todo-completed/<todo_id>/", api_views.TaskToDoCompletedCreateAPIView.as_view()),
   
   # Testing
    path("test/random-create/", api_views.TestCreateRandomTasksAndToDos.as_view()),
    path("test/delete-all/", api_views.TestDeleteAllTasksAndToDos.as_view()),

]
