from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from userauths.models import  User
from api.models import ToDo, Task
from django.contrib.auth.password_validation import validate_password

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["full_name"] = user.full_name
        token["email"] = user.email
        token["username"] = user.username

        return token
    
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only = True, required = True, validators = [validate_password])
    password2 = serializers.CharField(write_only = True, required = True)
    
    class Meta:
        model = User
        fields = ["full_name", "email", "password", "password2"]
    
    def validate(self, attr):
        if attr["password"] != attr["password2"]:
            raise serializers.ValidationError({"password": "Password fields did not match!"})
        return attr

    def create(self, validated_data):
        user = User.objects.create(
            full_name = validated_data["full_name"],
            email = validated_data["email"]
        )

        email_username, _ = user.email.split("@")
        user.username = email_username
        user.set_password(validated_data["password"])
        user.save()
        return user


class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = "__all__"


class ToDoSerializer(serializers.ModelSerializer):

    class Meta:
        model = ToDo
        fields = "__all__"


class TaskSerializer(serializers.ModelSerializer):
    todos = ToDoSerializer(many=True, read_only=True,)
    user_email = serializers.SerializerMethodField()

    class Meta:
        model = Task
        fields = ["id","user", "user_email", "task_title", "task", "due_by", "created_datetime", "priority", "is_urgent", "todos"]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None
    
class TaskSummarySerializer(serializers.ModelSerializer):
    """Get the progress and status for task"""
    todos = ToDoSerializer(many=True, read_only=True,)
    user_email = serializers.SerializerMethodField()
    class Meta:
        model = Task
        fields = ["id","user","user_email", "task_title", "task", "due_by", "created_datetime", "priority", "is_urgent", "todos", "progress", "status"]

    def get_user_email(self, obj):
        return obj.user.email if obj.user else None
    
class SummaryInputSerializer(serializers.Serializer):
    user_email = serializers.EmailField()
    isOnlyIncludeYou = serializers.BooleanField(required=False, default=True, label="Only Include You")
    isInlucdeAllTime = serializers.BooleanField(required=False, default=False, label="Include All Time")
    upComingDays = serializers.IntegerField(required=False, default=30, max_value=100, min_value=1, label="Upcoming Days")
