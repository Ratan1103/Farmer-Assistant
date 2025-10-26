from django.urls import path
from .views import diagnose_crop, diagnosis_history

urlpatterns = [
    path("diagnose/", diagnose_crop, name="diagnose"),
    path("history/", diagnosis_history, name="history"),
]
