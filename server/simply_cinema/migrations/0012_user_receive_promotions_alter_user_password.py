# Generated by Django 4.2.6 on 2023-10-30 21:44

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simply_cinema', '0011_user_forgot_password_code_user_verification_code_and_more'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='receive_promotions',
            field=models.BooleanField(default=False),
        ),
        migrations.AlterField(
            model_name='user',
            name='password',
            field=models.CharField(max_length=64),
        ),
    ]
