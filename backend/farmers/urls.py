from django.urls import path
from .views import RegisterFarmerView, FarmerProfileView, FarmerLoginView

urlpatterns = [
    path("register/", RegisterFarmerView.as_view(), name="register"),
    path("profile/", FarmerProfileView.as_view(), name="profile"),
    path("login/", FarmerLoginView.as_view(), name="login"),
]
