from django.db import models

class User(models.Model):
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=10)
    email = models.CharField(max_length=50, unique=True)
    password = models.CharField(max_length=64)
    street = models.CharField(max_length=50, blank=True)
    unit = models.CharField(max_length=50, blank=True)
    city = models.CharField(max_length=50, blank=True)
    state = models.CharField(max_length=20, blank=True)
    postal_code = models.CharField(max_length=5, blank=True)
    country = models.CharField(max_length=20)
    class Role(models.IntegerChoices):
        USER = 1,
        OWNER = 2,
        ADMIN = 3,
    role = models.PositiveSmallIntegerField(
        choices=Role.choices,
        default=Role.USER
    )
    is_active = models.BooleanField(default=False)
    is_suspended = models.BooleanField(default=False)
    verification_code = models.CharField(max_length=4)
    forgot_password_code = models.CharField(max_length=4)
    receive_promotions = models.BooleanField(default=False)

class PaymentCard(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=50)
    card_number = models.CharField(max_length=64)
    expiration_date = models.DateField()
    cvv = models.CharField(max_length=3)
    street = models.CharField(max_length=50)
    unit = models.CharField(max_length=50)
    city = models.CharField(max_length=50)
    state = models.CharField(max_length=20)
    postal_code = models.CharField(max_length=5, blank=True)
    country = models.CharField(max_length=20)

class Movie(models.Model):
    title = models.CharField(max_length=100)
    year = models.PositiveIntegerField()
    runtime = models.PositiveIntegerField()
    genre = models.CharField(max_length=50)
    director = models.CharField(max_length=100)
    producer = models.CharField(max_length=100)
    cast = models.CharField(max_length=500)
    synopsis = models.CharField(max_length=500)
    image_url = models.CharField(max_length=500)
    trailer_url = models.CharField(max_length=50)
    review_score = models.PositiveSmallIntegerField()
    rating = models.CharField(max_length=10)
    class Status(models.IntegerChoices):
        COMING_SOON = 1, "Coming Soon"
        CURRENTLY_SHOWING = 2, "Currently Showing"
        NO_LONGER_SHOWING = 3, "No Longer Showing"
    status = models.PositiveSmallIntegerField(
        choices=Status.choices,
        default=Status.COMING_SOON
    )

class Price(models.Model):
    type = models.CharField(max_length=50)
    price = models.DecimalField(max_digits=4, decimal_places=2)

class Fee(models.Model):
    type = models.CharField(max_length=50)
    rate = models.PositiveSmallIntegerField()

class Promotion(models.Model):
    code = models.CharField(max_length=50)
    discount = models.PositiveSmallIntegerField()
    start_date = models.DateTimeField()
    end_date = models.DateTimeField()
    is_released = models.BooleanField()

class Theater(models.Model):
    name = models.CharField(max_length=50)
    address = models.CharField(max_length=50)

class Screen(models.Model):
    theater_id = models.ForeignKey(Theater, on_delete=models.CASCADE)
    name = models.CharField(max_length=1)

class Showing(models.Model):
    movie_id = models.ForeignKey(Movie, on_delete=models.CASCADE)
    screen_id = models.ForeignKey(Screen, on_delete=models.CASCADE)
    date = models.DateField()
    time = models.TimeField()

class Booking(models.Model):
    user_id = models.ForeignKey(User, on_delete=models.CASCADE)
    paymentcard_id = models.ForeignKey(PaymentCard, on_delete=models.CASCADE)
    promotion_id = models.ForeignKey(Promotion, on_delete=models.CASCADE, null=True, blank=True)
    datetime = models.DateTimeField(auto_now_add=True, blank=True)

class Ticket(models.Model):
    booking_id = models.ForeignKey(Booking, on_delete=models.CASCADE)
    showing_id = models.ForeignKey(Showing, on_delete=models.CASCADE)
    price_id = models.ForeignKey(Price, on_delete=models.CASCADE)
    seat = models.CharField(max_length=3)