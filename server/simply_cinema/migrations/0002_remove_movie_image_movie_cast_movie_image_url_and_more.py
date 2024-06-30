# Generated by Django 4.2.5 on 2023-09-26 20:56

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('simply_cinema', '0001_initial'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='movie',
            name='image',
        ),
        migrations.AddField(
            model_name='movie',
            name='cast',
            field=models.CharField(default='Bob Smith', max_length=500),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='movie',
            name='image_url',
            field=models.CharField(default='url', max_length=100),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='movie',
            name='review_score',
            field=models.FloatField(default=7.5),
            preserve_default=False,
        ),
        migrations.AlterField(
            model_name='movie',
            name='director',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='movie',
            name='producer',
            field=models.CharField(max_length=100),
        ),
        migrations.AlterField(
            model_name='movie',
            name='title',
            field=models.CharField(max_length=100),
        ),
    ]
