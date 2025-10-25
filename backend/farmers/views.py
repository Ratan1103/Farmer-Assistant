import requests
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

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


# ✅ Weather API using farmer's pincode
@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_weather(request):
    farmer = request.user
    district = farmer.district
    api_key = settings.OPENWEATHER_API_KEY

    if not district:
        return Response({"error": "District not set in profile"}, status=400)

    # ✅ Fetch weather based on district (city query)
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={district},IN&appid={api_key}&units=metric"
    res = requests.get(url).json()

    if "list" not in res or "city" not in res:
        return Response({"error": "Weather data not found", "api_response": res}, status=404)

    forecast = []
    # Take one reading per day (every 8th item = 24h)
    for entry in res["list"][:24*3:8]:  
        forecast.append({
            "date": entry["dt_txt"],
            "temp": entry["main"]["temp"],
            "humidity": entry["main"]["humidity"],
            "weather": entry["weather"][0]["description"],
        })

    return Response({
        "location": res["city"]["name"],
        "forecast": forecast
    })
