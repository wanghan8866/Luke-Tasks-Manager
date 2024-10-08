# Generated by Django 4.2.7 on 2024-08-13 23:25

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('task_title', models.CharField(max_length=100, unique=True)),
                ('task', models.TextField()),
                ('due_by', models.DateTimeField()),
                ('created_datetime', models.DateTimeField(default=django.utils.timezone.now)),
                ('priority', models.IntegerField(choices=[(1, 'High'), (2, 'Noraml'), (3, 'Low')], default=2)),
                ('is_urgent', models.BooleanField(default=False)),
                ('user', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='ToDo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('to_do_title', models.CharField(max_length=200)),
                ('created_datetime', models.DateTimeField(default=django.utils.timezone.now)),
                ('isFinished', models.BooleanField(default=False)),
                ('task', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.task')),
            ],
        ),
        migrations.AddConstraint(
            model_name='todo',
            constraint=models.UniqueConstraint(fields=('task', 'to_do_title'), name='unqiue_task_to_do'),
        ),
    ]
