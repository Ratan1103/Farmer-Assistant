from django.contrib.auth.backends import ModelBackend
from django.contrib.auth import get_user_model

Farmer = get_user_model()

class PhoneBackend(ModelBackend):
    def authenticate(self, request, phone=None, password=None, **kwargs):
        try:
            user = Farmer.objects.get(phone=phone)
        except Farmer.DoesNotExist:
            return None
        if user.check_password(password):
            return user
        return None
