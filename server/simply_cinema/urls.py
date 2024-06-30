from django.urls import include, path
from rest_framework import routers

from . import views

router = routers.DefaultRouter()

router.register(r'titleimages', views.TitleImageViewSet)
router.register(r'movies', views.MovieViewSet)
router.register(r'paymentcards', views.PaymentCardViewSet)
router.register(r'users', views.UserViewSet)
router.register(r'promotions', views.PromotionViewSet)
router.register(r'prices', views.PriceViewSet)
router.register(r'fees', views.FeeViewSet)
router.register(r'theaters', views.TheaterViewSet)
router.register(r'screens', views.ScreenViewSet)
router.register(r'showings', views.ShowingViewSet)
router.register(r'bookings', views.BookingViewSet)
router.register(r'tickets', views.TicketViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('create-account', views.create_account),
    path('verify-account', views.verify_account),
    path('email-available', views.email_available),
    path('forgot-password', views.forgot_password),
    path('verify-reset-password', views.verify_reset_pasword),
    path('reset-password', views.reset_password),
    path('login', views.login),
    path('fetch-profile', views.fetch_profile),
    path('update-profile', views.update_profile),
    path('get-showings', views.get_showings),
    path('create-showing', views.create_showing),
    path('email-promotion', views.email_promotion),
    path('theaters-showing-movie', views.theaters_showing_movie),
    path('screens-not-showing-movie', views.screens_not_showing_movie),
    path('not-showing-times', views.not_showing_times),
    path('get-timings-on-date', views.get_timings_on_date),
    path('get-seats', views.get_seats),
    path('order-summary', views.order_summary),
    path('api-auth/', include('rest_framework.urls', namespace='rest_framework'))
]