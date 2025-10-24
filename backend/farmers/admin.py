from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Farmer

class FarmerAdmin(UserAdmin):
    model = Farmer
    list_display = ("id", "phone", "email", "district", "preferred_language", "is_staff")
    list_filter = ("is_staff", "preferred_language")

    fieldsets = (
        (None, {"fields": ("phone", "password")}),
        ("Personal Info", {"fields": ("email", "aadhaar", "district", "pincode", "location", "land_size", "preferred_language", "crop")}),
        ("Permissions", {"fields": ("is_active", "is_staff", "is_superuser", "groups", "user_permissions")}),
    )

    add_fieldsets = (
        (None, {
            "classes": ("wide",),
            "fields": ("phone", "password1", "password2", "is_staff", "is_superuser"),
        }),
    )

    search_fields = ("phone", "email")
    ordering = ("phone",)

admin.site.register(Farmer, FarmerAdmin)
