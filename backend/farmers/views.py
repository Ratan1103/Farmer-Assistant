import requests
from django.conf import settings
from django.contrib.auth import get_user_model, authenticate
from rest_framework import generics, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

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




@api_view(["GET"])
@permission_classes([permissions.IsAuthenticated])
def get_weather(request):
    farmer = request.user
    district = getattr(farmer, "district", None)  # ensure farmer has district field
    api_key = settings.OPENWEATHER_API_KEY

    if not district:
        return Response({"error": "District not set in profile"}, status=400)

    # 5-day / 3-hour forecast API
    url = f"http://api.openweathermap.org/data/2.5/forecast?q={district},IN&appid={api_key}&units=metric"
    res = requests.get(url).json()

    if "list" not in res or "city" not in res:
        return Response({"error": "Weather data not found", "api_response": res}, status=404)

    forecast = []
    seen_days = set()

    # ✅ Pick 1 forecast per day (noon reading preferred)
    for entry in res["list"]:
        date = entry["dt_txt"].split(" ")[0]
        if date not in seen_days and "12:00:00" in entry["dt_txt"]:
            forecast.append({
                "date": date,
                "temp": round(entry["main"]["temp"]),
                "humidity": entry["main"]["humidity"],
                "condition": entry["weather"][0]["description"].title(),
                "rainfall": entry.get("rain", {}).get("3h", 0),
                "icon": entry["weather"][0]["icon"]
            })
            seen_days.add(date)

    # ✅ Current weather (first entry)
    current = forecast[0] if forecast else None

    # ✅ Add recommendations
    recommendations = [
        {
            "title": "Irrigation",
            "advice": "Reduce irrigation frequency due to expected rainfall. Monitor soil moisture levels."
        },
        {
            "title": "Crop Care",
            "advice": "Avoid pesticide application during rainy days. Wait for clear weather before spraying."
        },
        {
            "title": "Field Work",
            "advice": "Plan harvesting activities for dry days when weather will be clear and sunny."
        }
    ]

    return Response({
        "location": res["city"]["name"],
        "current": current,
        "forecast": forecast[:7],   # ✅ limit to 7-day forecast
        "recommendations": recommendations
    })

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def farmer_profile(request):
    farmer = request.user  # current logged in farmer
    data = {
        "full_name": farmer.full_name,
        "land_size": farmer.land_size,
        "location": f"{farmer.district}, {farmer.pincode}",
        "crop": farmer.crop,
    }
    return Response(data)
