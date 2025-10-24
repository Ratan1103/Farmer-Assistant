from rest_framework import serializers
from django.contrib.auth import get_user_model

Farmer = get_user_model()


class FarmerSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = Farmer
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "aadhaar",
            "district",
            "pincode",
            "land_size",
            "preferred_language",
            "crop",
            "password",
        ]
        extra_kwargs = {
            "password": {"write_only": True},
            "email": {"required": False, "allow_blank": True},
        }

    def create(self, validated_data):
        password = validated_data.pop("password", None)
        farmer = Farmer(**validated_data)
        if password:
            farmer.set_password(password)
        farmer.save()
        return farmer

    def update(self, instance, validated_data):
        password = validated_data.pop("password", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        if password:
            instance.set_password(password)

        instance.save()
        return instance
