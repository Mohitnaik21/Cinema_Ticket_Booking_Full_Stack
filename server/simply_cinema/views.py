from django.core.mail import send_mail
from django.core.serializers import serialize
from django.shortcuts import render
from django.http import HttpResponse, JsonResponse
from django.conf import settings
from rest_framework import viewsets
from rest_framework.decorators import api_view, permission_classes
from simply_cinema.serializers import TitleImageSerializer, MovieSerializer, PaymentCardSerializer, PromotionSerializer, UserSerializer, PriceSerializer, FeeSerializer, TheaterSerializer, ScreenSerializer, ShowingSerializer, BookingSerializer, TicketSerializer
from simply_cinema.models import Movie, PaymentCard, Promotion, Showing, User, Price, Fee, Theater, Screen, Showing, Booking, Ticket
from django.views.decorators.csrf import csrf_exempt
import json, random, string, hashlib
from datetime import datetime

def index(request):
    return HttpResponse("You've connected to the Simply Cinema server!")

def encrypt(str):
    return hashlib.sha256(str.encode("utf-8")).hexdigest()

def verify(uid):
    user = User.objects.get(pk=uid)
    verification_code = "".join(random.choices(string.ascii_letters + string.digits, k=4))
    user.verification_code = verification_code
    user.save()
    name = user.first_name + " " + user.last_name
    subject = "Welcome To SimplyCinema"
    message = f"Hello {name} thank you for registering for SimplyCinema. To activate your account, enter the code below.\n{verification_code}"
    email_from = settings.EMAIL_HOST_USER
    email_to = [user.email]
    send_mail(subject, message, email_from, email_to)

def format_exp_date(date):
    month = date[:2]
    year = date[3:]
    return year + "-" + month + "-01"

def unformat_exp_date(date):
    return date.strftime("%m/%Y")

@api_view(['POST'])
@csrf_exempt
def create_account(request):
    data = json.loads(request.body)
    user = data[0]
    user_obj = User(
        email=user["email"], 
        password=encrypt(user["password"]), 
        first_name=user["first_name"], 
        last_name=user["last_name"], 
        phone_number=user["phone_number"], 
        city=user["city"],
        country=user["country"],
        postal_code=user["postal_code"],
        state=user["state"],
        street=user["street"],
        unit=user["unit"],
        receive_promotions=user["receive_promotions"]
        )
    user_obj.save()
    uid = user_obj.id
    for i in range(1, len(data)):
        card = data[i]
        PaymentCard(
            user = User.objects.get(pk=uid),
            card_number=encrypt(card["card_number"]),
            expiration_date=format_exp_date(card["expiration_date"]),
            cvv=card["cvv"],
            name=card["name"],
            city=card["city"],
            country=card["country"],
            postal_code=card["postal_code"],
            state=card["state"],
            street=card["street"],
            unit=card["unit"]
        ).save()
    
    verify(uid)
    
    return HttpResponse("Account created.")

@api_view(['POST'])
@csrf_exempt
def verify_account(request):
    data = json.loads(request.body)
    user = User.objects.filter(email=data["email"])[0]
    if user.verification_code == data["code"]:
        user.is_active = True
        user.save()
        return HttpResponse(True)

    return HttpResponse(False)

@api_view(['POST'])
@csrf_exempt
def email_available(request):
    email = json.loads(request.body)["email"]
    if User.objects.filter(email=email).exists():
        return HttpResponse(False)

    return HttpResponse(True)

@api_view(['POST'])
@csrf_exempt
def forgot_password(request):
    email = json.loads(request.body)["email"]
    user = User.objects.filter(email=email)[0]
    code = "".join(random.choices(string.ascii_letters + string.digits, k=4))
    user.forgot_password_code = code
    user.save()
    name = user.first_name + " " + user.last_name
    subject = "Recover Your SimplyCinema Password"
    message = f"Hello {name}, someone has requested to reset the password on your SimplyCinema account. Please enter the code below to reset your password\n{code}"
    email_from = settings.EMAIL_HOST_USER
    email_to = [user.email]
    send_mail(subject, message, email_from, email_to)

    return HttpResponse(True)

@api_view(['POST'])
@csrf_exempt
def verify_reset_pasword(request):
    data = json.loads(request.body)
    user = User.objects.filter(email=data["email"])[0]
    if user.forgot_password_code == data["code"]:
        return JsonResponse({'result': True})

    return JsonResponse({'result': False})

@api_view(['POST'])
@csrf_exempt
def reset_password(request):
    data = json.loads(request.body)
    user = User.objects.filter(email=data["email"])[0]
    new_password = encrypt(data["new_password"])
    user.password = new_password
    user.save()
    
    return HttpResponse("Reset password.")

@api_view(['POST'])
@csrf_exempt
def login(request):
    data = json.loads(request.body)
    try:
        user = User.objects.filter(email=data["email"])[0]
    except:
        return HttpResponse(False)

    print(encrypt(data["password"]))
    if user.password != encrypt(data["password"]):
        return HttpResponse(False)

    return JsonResponse(
        {
            "id": user.id,
            "role": user.role
        }
        )

@api_view(['POST'])
@csrf_exempt
def fetch_profile(request):
    id = json.loads(request.body)["id"]
    user = User.objects.get(pk=id)
    json_obj = [{
        "first_name": user.first_name,
        "last_name": user.last_name,
        #"password": user.password,
        "phone_number": user.phone_number,
        "street": user.street,
        "unit": user.unit,
        "city": user.city,
        "state": user.state,
        "postal_code": user.postal_code,
        "country": user.country,
        "receive_promotions": user.receive_promotions
    }]

    cards = PaymentCard.objects.filter(user_id=id)
    for card in cards:
        json_obj.append(
            {
                "name": card.name,
                "card_number": card.id, # temporary
                "expiration_date": unformat_exp_date(card.expiration_date),
                "cvv": card.cvv,
                "street": card.street,
                "unit": card.unit,
                "city": card.city,
                "state": card.state,
                "postal_code": card.postal_code,
                "country": card.country
            }
        )

    return JsonResponse(json_obj, safe=False)

@api_view(['POST'])
@csrf_exempt
def update_profile(request):
    all_data = json.loads(request.body)
    data = all_data[0]
    user = User.objects.get(pk=data["id"])
    user.first_name = data["first_name"]
    user.last_name = data["last_name"]
    if len(data["password"]) > 0: user.password = encrypt(data["password"])
    user.phone_number = data["phone_number"]
    user.street = data["street"]
    user.unit = data["unit"]
    user.city = data["city"]
    user.state = data["state"]
    user.postal_code = data["postal_code"]
    user.country = data["country"]
    user.receive_promotions = data["receive_promotions"]
    user.save()

    name = user.first_name + " " + user.last_name
    subject = "Profile has been updated on SimplyCinema"
    message = f"Hello {name}, your profile has been updated successfully!"
    email_from = settings.EMAIL_HOST_USER
    email_to = [data["email"]]
    send_mail(subject, message, email_from, email_to)

    cards = PaymentCard.objects.filter(user_id=data["id"])

    for i in range(len(all_data) - 1):
        card = cards[i]
        new_card = all_data[i + 1]
        card.name = new_card["name"]
        if len(data["card_number"]) > 0: card.card_number = encrypt(new_card["card_number"])
        card.expiration_date = format_exp_date(new_card["expiration_date"])
        card.cvv = new_card["cvv"]
        card.street = new_card["street"]
        card.unit = new_card["unit"]
        card.city = new_card["city"]
        card.state = new_card["state"]
        card.postal_code = new_card["postal_code"]
        card.country = new_card["country"]
        card.save()

    return HttpResponse("Updated profile.")

@api_view(['GET'])
@csrf_exempt
def get_showings(request):
    objs = Showing.objects.filter(movie_id=request.GET.get("movie_id")).filter(date=datetime.strptime(request.GET.get("date"), "%m-%d-%Y").date())
    data = serialize("json", objs)

    return HttpResponse(data, content_type='application/json')

@api_view(['POST'])
@csrf_exempt
def create_showing(request):
    data = json.loads(request.body)
    if not Showing.objects.filter(screen=data["screen"]).filter(date=datetime.strptime(data["date"], "%m-%d-%Y").date()).filter(time=datetime.strptime(data["time"], "%H:%M:%S").time()).exists():
        showing_obj = Showing(
            movie_id = Movie.objects.get(pk=data["movie_id"]),
            screen=data["screen"],
            date=datetime.strptime(data["date"], "%m-%d-%Y").date(),
            time=datetime.strptime(data["time"], "%H:%M:%S").time(),
        )
        showing_obj.save()
    else:
        return HttpResponse(f"Showing on screen {data['screen']} already exists at {data['time']}.")

    return HttpResponse("Successfully added showing.")

@api_view(['GET'])
@csrf_exempt
def email_promotion(request):
    id = request.GET.get("id")
    promotion = Promotion.objects.get(pk=id)
    users = User.objects.filter(receive_promotions=True)
    subject = "SimplyCinema Promotion"
    message = f"Hello valued SimplyCinema customer; thank you for your loyalty! We are giving you a {promotion.discount}% discount when using the code {promotion.code}. \n valid {promotion.start_date} - {promotion.end_date}"
    email_from = settings.EMAIL_HOST_USER
    email_to = []
    for user in users:
        email_to.append(user.email)

    send_mail(subject, message, email_from, email_to)

    return HttpResponse("Successfully sent emails.")

@api_view(['GET'])
@csrf_exempt
def theaters_showing_movie(request):
    movie_id = request.GET.get("movie_id")
    showings = Showing.objects.filter(movie_id=movie_id)
    theaters = []
    for showing in showings:
        theaters.append(showing.screen_id.theater_id)
    theaters = list(set(theaters))  # remove duplicates

    json_obj = []
    for theater in theaters:
        json_obj.append(
            {
                "id": theater.id,
                "name": theater.name
                #"address": theater.address
            }
        )

    return JsonResponse(json_obj, safe=False)

@api_view(['GET'])
@csrf_exempt
def screens_not_showing_movie(request):
    movie_id = request.GET.get("movie_id")
    theater_id = request.GET.get("theater_id")
    date = request.GET.get("date")

    # Get screens from the theater
    screens = Screen.objects.filter(theater_id=theater_id)

    # Get showings at one of the screens
    showings = Showing.objects.filter(screen_id__in=screens)

    # Filter showings by date and movie_id
    showings = showings.filter(date=date).filter(movie_id=movie_id)

    # Get all of the screens those showings are on
    excluded_screens = Screen.objects.filter(id__in=showings.values('screen_id'))

    screens = screens.difference(excluded_screens)

    json_obj = []
    for screen in screens:
        json_obj.append(
            {
                "id": screen.id,
                "name": screen.name
            }
        )

    return JsonResponse(json_obj, safe=False)

@api_view(['GET'])
@csrf_exempt
def not_showing_times(request):
    movie_id = request.GET.get("movie_id")
    screen_id = request.GET.get("screen_id")
    #theater_id = request.GET.get("theater_id")
    date = request.GET.get("date")

    times = {"09:00:00", "12:00:00", "15:00:00", "18:00:00", "21:00:00"}

    showings = Showing.objects.filter(date=date).filter(screen_id=screen_id).filter(movie_id=movie_id)
    
    for showing in showings:
        times.discard(showing.time.strftime("%H:%M:%S"))
    
    json_obj = []
    for time in times:
        json_obj.append(
            {
                "showtime": time
            }
        )

    return JsonResponse(json_obj, safe=False)

@api_view(['GET'])
@csrf_exempt
def get_timings_on_date(request):
    movie_id = request.GET.get("movie_id")
    date = request.GET.get("date")

    showings = Showing.objects.filter(movie_id=movie_id).filter(date=date)
    theaters = Theater.objects.filter(id__in=Screen.objects.filter(id__in=showings.values('screen_id')).values('theater_id'))
    json_obj = []
    for theater in theaters:
        screens = Screen.objects.filter(theater_id=theater)
        theater_showings = showings.filter(screen_id__in=screens.values('id'))

        timings = []
        for showing in theater_showings:
            timings.append(showing.time)
        
        json_obj.append(
            {
                "movie_id": movie_id,
                "movie_title": Movie.objects.get(pk=movie_id).title,
                "theater_id": theater.id,
                "name": theater.name,
                "timings": timings
            }
        )

    return JsonResponse(json_obj, safe=False)

@api_view(['GET'])
@csrf_exempt
def get_seats(request):
    movie_id = request.GET.get("movie_id")
    theater_id = request.GET.get("theater_id")
    date = request.GET.get("date")
    time = request.GET.get("time")

    screens = Screen.objects.filter(theater_id=theater_id)
    showing = Showing.objects.filter(movie_id=movie_id).filter(screen_id__in=screens).filter(date=date).filter(time=time)[0]
    tickets = Ticket.objects.filter(showing_id=showing.id)
    seats = []
    for ticket in tickets:
        seats.append(ticket.seat)

    json_obj = {
        "seats": seats,
        "screen_id": showing.screen_id.id,
        "screen_name": Screen.objects.get(pk=showing.screen_id.id).name,
        "theater_name": Theater.objects.get(pk=theater_id).name,
        "movie_name": Movie.objects.get(pk=movie_id).title
    }

    return JsonResponse(json_obj, safe=False)

@api_view(['GET'])
@csrf_exempt
def order_summary(request):
    user_id = request.GET.get("user_id")

    bookings = Booking.objects.filter(user_id=user_id)
    json_obj = []
    for booking in bookings:
        tickets = Ticket.objects.filter(booking_id=booking)
        movie = Movie.objects.get(pk=tickets[0].showing_id.movie_id.id).title
        seats = []
        for ticket in tickets:
            seats.append(ticket.seat)
        json_obj.append(
            {
                "id": booking.id,
                "movie": movie,
                "date": booking.datetime.date(),
                "seats": seats
            }
        )
    
    return JsonResponse(json_obj, safe=False)

class TitleImageViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = TitleImageSerializer

class MovieViewSet(viewsets.ModelViewSet):
    queryset = Movie.objects.all()
    serializer_class = MovieSerializer

    def create(self, request):
        movie = Movie(
            title="Placeholder",
            year=1000,
            runtime=1000,
            genre="Placeholder",
            director="Placeholder",
            producer="Placeholder",
            cast="Placeholder",
            synopsis="Placeholder",
            image_url="Placeholder",
            trailer_url="Placeholder",
            review_score=1000,
            rating="G",
            status=3,
        )
        movie.save()

        return HttpResponse(movie.id)

class PaymentCardViewSet(viewsets.ModelViewSet):
    queryset = PaymentCard.objects.all()
    serializer_class = PaymentCardSerializer

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer

class PromotionViewSet(viewsets.ModelViewSet):
    queryset = Promotion.objects.all()
    serializer_class = PromotionSerializer

    def create(self, request):
        promotion = Promotion(
            code="PLACEHOLDER",
            discount=0,
            start_date=datetime.strptime("01-01-1000 00:00:00", "%m-%d-%Y %H:%M:%S"),
            end_date=datetime.strptime("01-01-1000 00:00:00", "%m-%d-%Y %H:%M:%S"),
            is_released=False,
        )
        promotion.save()

        return HttpResponse(promotion.id)

class PriceViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = PriceSerializer

class FeeViewSet(viewsets.ModelViewSet):
    queryset = Price.objects.all()
    serializer_class = FeeSerializer

class TheaterViewSet(viewsets.ModelViewSet):
    queryset = Theater.objects.all()
    serializer_class = TheaterSerializer

class ScreenViewSet(viewsets.ModelViewSet):
    queryset = Screen.objects.all()
    serializer_class = ScreenSerializer

class ShowingViewSet(viewsets.ModelViewSet):
    queryset = Showing.objects.all()
    serializer_class = ShowingSerializer

class BookingViewSet(viewsets.ModelViewSet):
    queryset = Booking.objects.all()
    serializer_class = BookingSerializer

class TicketViewSet(viewsets.ModelViewSet):
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer