# Generated by Django 4.2.6 on 2023-10-31 14:58

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simply_cinema', '0012_user_receive_promotions_alter_user_password'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentcard',
            name='card_number',
            field=models.CharField(max_length=64),
        ),
    ]
