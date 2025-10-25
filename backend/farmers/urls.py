from django.urls import path
from .views import RegisterFarmerView, FarmerProfileView, FarmerLoginView, get_weather

urlpatterns = [
    path("register/", RegisterFarmerView.as_view(), name="register"),
    path("profile/", FarmerProfileView.as_view(), name="profile"),
    path("login/", FarmerLoginView.as_view(), name="login"),
    path("weather/", get_weather, name="get_weather"),
]
