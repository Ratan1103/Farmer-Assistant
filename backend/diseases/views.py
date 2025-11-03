import os
import json
from dotenv import load_dotenv
from openai import OpenAI
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import localtime
from .models import Diagnosis
from .ai_utils import run_model

# ✅ Load environment variables
load_dotenv()

# ✅ Initialize OpenAI client properly
api_key = os.getenv("OPENAI_API_KEY")
if not api_key:
    print("⚠️  OPENAI_API_KEY not found! Please set it in your .env file.")
else:
    print("✅  OpenAI API key loaded successfully.")

client = OpenAI(api_key=api_key)


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def diagnose_crop(request):
    """
    Upload crop image -> run AI model -> get AI treatment & prevention -> save -> return
    """
    image = request.FILES.get("image")
    if not image:
        return Response({"error": "No image provided"}, status=400)

    # 🧠 Step 1: Run your ML model (CNN / ResNet)
    disease, confidence, severity, remedy = run_model(image)

    # 🧠 Step 2: Ask AI for treatment & prevention
    prompt = (
        f"You are an expert agricultural advisor. A farmer has a crop infected with '{disease}'. "
        "Provide detailed and practical guidance in JSON format with 3 sections: "
        "\"treatment\", \"prevention\", and \"tips_to_overcome\". "
        "Each section should contain 4-6 short, actionable bullet points using simple farmer-friendly language. "
        "Example:\n"
        "{\n"
        "  \"treatment\": [\"point1\", \"point2\"],\n"
        "  \"prevention\": [\"point1\", \"point2\"],\n"
        "  \"tips_to_overcome\": [\"point1\", \"point2\"]\n"
        "}"
    )

    ai_response = None
    try:
        # ✅ Correct usage of the OpenAI client
        completion = client.responses.create(
            model="gpt-4.1-mini",
            input=prompt,
            temperature=0.7,
        )

        raw_text = completion.output_text.strip()
        print("🔥 Raw AI Response:", raw_text)
        ai_response = json.loads(raw_text)

    except Exception as e:
    
        ai_response = {
            "treatment": [
                "Spray organic fungicides such as neem oil or copper sulfate.",
                "Remove and destroy infected leaves immediately.",
                "Ensure proper air circulation between plants.",
                "Avoid overwatering; keep soil slightly moist only.",
            ],
            "prevention": [
                "Use disease-resistant crop varieties.",
                "Rotate crops yearly to avoid fungal buildup.",
                "Sterilize gardening tools regularly.",
                "Keep the area weed-free and well-drained.",
            ],
            "tips_to_overcome": [
                "Monitor plants weekly for early signs.",
                "Apply balanced fertilizer to boost plant immunity.",
                "Ensure proper spacing to reduce humidity.",
            ],
        }


    # ✅ Step 3: Save to DB
    diagnosis = Diagnosis.objects.create(
        farmer=request.user,
        crop_image=image,
        disease_name=disease,
        severity=severity,
        confidence=confidence,
        remedy=remedy,
    )

    # ✅ Step 4: Return everything to frontend
    return Response({
        "id": diagnosis.id,
        "disease_name": diagnosis.disease_name,
        "confidence": round(diagnosis.confidence, 2),
        "severity": diagnosis.severity,
        "image": request.build_absolute_uri(diagnosis.crop_image.url),
        "timestamp": localtime(diagnosis.timestamp).isoformat(),
        "display_date": localtime(diagnosis.timestamp).strftime("%d %b %Y, %I:%M %p"),
        "treatment": ai_response.get("treatment", []),
        "prevention": ai_response.get("prevention", []),
        "tips_to_overcome": ai_response.get("tips_to_overcome", []),
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def diagnosis_history(request):
    """
    Returns previous diagnosis records + stats
    """
    qs = Diagnosis.objects.filter(farmer=request.user).order_by("-timestamp")

    total = qs.count()
    healthy = qs.filter(disease_name__icontains="healthy").count()
    avg_conf = round(sum([d.confidence for d in qs]) / total, 2) if total else 0

    history = [
        {
            "id": d.id,
            "image": request.build_absolute_uri(d.crop_image.url) if d.crop_image else None,
            "disease_name": d.disease_name,
            "severity": d.severity,
            "confidence": round(d.confidence, 2),
            "timestamp": localtime(d.timestamp).isoformat(),
            "display_date": localtime(d.timestamp).strftime("%d %b %Y, %I:%M %p"),
        }
        for d in qs
    ]

    return Response({
        "stats": {
            "total": total,
            "healthy": healthy,
            "avgConfidence": avg_conf,
        },
        "history": history,
    })
