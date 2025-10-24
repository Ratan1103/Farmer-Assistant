from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.tokens import RefreshToken

from .serializers import FarmerSerializer

Farmer = get_user_model()


# ✅ Register new farmer
class RegisterFarmerView(generics.CreateAPIView):
    queryset = Farmer.objects.all()
    serializer_class = FarmerSerializer
    permission_classes = [permissions.AllowAny]


# ✅ Farmer Profile (View & Update)
class FarmerProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = FarmerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user


# ✅ Farmer Login with Phone + Password
class FarmerLoginView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        phone = request.data.get("phone")
        password = request.data.get("password")

        if not phone or not password:
            return Response(
                {"error": "Phone and password are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user = authenticate(request, phone=phone, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response(
                {
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                    "user": {
                        "id": user.id,
                        "full_name": user.full_name,
                        "phone": user.phone,
                        "email": user.email,
                        "district": user.district,
                        "pincode": user.pincode,
                        "preferred_language": user.preferred_language,
                        "crop": user.crop,
                    },
                }
            )
        return Response(
            {"error": "Invalid phone or password"},
            status=status.HTTP_401_UNAUTHORIZED,
        )
