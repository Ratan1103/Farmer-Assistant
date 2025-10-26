from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.utils.timezone import localtime
from .models import Diagnosis
from .ai_utils import run_model


@api_view(["POST"])
@permission_classes([IsAuthenticated])   # only logged-in farmers can diagnose
def diagnose_crop(request):
    """
    Upload crop image -> run AI model -> save to DB -> return result
    """
    image = request.FILES.get("image")
    if not image:
        return Response({"error": "No image provided"}, status=400)

    # Run AI model
    disease, confidence, severity, remedy = run_model(image)

    # Save to DB
    diagnosis = Diagnosis.objects.create(
        farmer=request.user,
        crop_image=image,
        disease_name=disease,
        severity=severity,
        confidence=confidence,
        remedy=remedy,
    )

    return Response({
        "id": diagnosis.id,
        "disease_name": diagnosis.disease_name,
        "confidence": round(diagnosis.confidence, 2),
        "severity": diagnosis.severity,
        "remedy": diagnosis.remedy,
        "image": request.build_absolute_uri(diagnosis.crop_image.url),
        "timestamp": localtime(diagnosis.timestamp).isoformat(),       # ✅ ISO with +05:30
        "display_date": localtime(diagnosis.timestamp).strftime("%d/%m/%Y %H:%M"),  # ✅ IST formatted
    })


@api_view(["GET"])
@permission_classes([IsAuthenticated])   # each farmer sees only their history
def diagnosis_history(request):
    """
    Get all past diagnoses of the logged-in farmer + stats
    """
    qs = Diagnosis.objects.filter(farmer=request.user).order_by("-timestamp")

    total = qs.count()
    healthy = qs.filter(disease_name__icontains="healthy").count()
    avg_conf = round(sum([d.confidence for d in qs]) / total, 2) if total else 0

    history = [
        {
            "id": d.id,
            "image": request.build_absolute_uri(d.crop_image.url),
            "disease_name": d.disease_name,
            "severity": d.severity,
            "confidence": round(d.confidence, 2),
            "remedy": d.remedy,
            "timestamp": localtime(d.timestamp).isoformat(),       # ✅ proper IST timestamp
            "display_date": localtime(d.timestamp).strftime("%d/%m/%Y %H:%M"),  # ✅ formatted IST
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
