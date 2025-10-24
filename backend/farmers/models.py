from django.db import models
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin, BaseUserManager


class FarmerManager(BaseUserManager):
    def create_user(self, phone, password=None, **extra_fields):
        if not phone:
            raise ValueError("Phone number is required")
        user = self.model(phone=str(phone), **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, phone, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(phone, password, **extra_fields)


class Farmer(AbstractBaseUser, PermissionsMixin):
    # ✅ Fields visible in your frontend form
    full_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    phone = models.CharField(max_length=15, unique=True)
    aadhaar = models.CharField(max_length=12, unique=True, null=True, blank=True)

    district = models.CharField(max_length=100, blank=True, null=True)
    pincode = models.CharField(max_length=6, blank=True, null=True)
    land_size = models.CharField(max_length=50, blank=True, null=True)

    preferred_language = models.CharField(max_length=50, default="English")

    CROPS = [
        ("wheat", "Wheat"),
        ("rice", "Rice"),
        ("tomato", "Tomato"),
        ("potato", "Potato"),
        ("onion", "Onion"),
        ("maize", "Maize"),
        ("sugarcane", "Sugarcane"),
        ("cotton", "Cotton"),
        ("soybean", "Soybean"),
        ("barley", "Barley"),
    ]
    crop = models.CharField(max_length=50, choices=CROPS, blank=True, null=True)

    # Django auth stuff
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)

    USERNAME_FIELD = "phone"  # ✅ login only with phone
    REQUIRED_FIELDS = []      # no username, no email required

    objects = FarmerManager()

    def __str__(self):
        return f"{self.full_name or self.phone}"
