from django.db import models
from django.conf import settings

class Diagnosis(models.Model):
    farmer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    crop_image = models.ImageField(upload_to="disease_images/")
    disease_name = models.CharField(max_length=100)
    severity = models.CharField(max_length=20)
    confidence = models.FloatField()
    remedy = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
