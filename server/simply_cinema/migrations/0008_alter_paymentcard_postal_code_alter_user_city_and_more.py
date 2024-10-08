# Generated by Django 4.2.6 on 2023-10-27 21:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simply_cinema', '0007_remove_paymentcard_first_name_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='paymentcard',
            name='postal_code',
            field=models.CharField(blank=True, max_length=5),
        ),
        migrations.AlterField(
            model_name='user',
            name='city',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='phone_number',
            field=models.CharField(max_length=10),
        ),
        migrations.AlterField(
            model_name='user',
            name='postal_code',
            field=models.CharField(blank=True, max_length=5),
        ),
        migrations.AlterField(
            model_name='user',
            name='state',
            field=models.CharField(blank=True, max_length=20),
        ),
        migrations.AlterField(
            model_name='user',
            name='street',
            field=models.CharField(blank=True, max_length=50),
        ),
        migrations.AlterField(
            model_name='user',
            name='unit',
            field=models.CharField(blank=True, max_length=50),
        ),
    ]
