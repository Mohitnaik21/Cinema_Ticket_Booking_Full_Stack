from django.contrib import admin

from .models import Movie, PaymentCard, User

admin.site.register(Movie)
admin.site.register(PaymentCard)
admin.site.register(User)