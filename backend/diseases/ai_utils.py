# diseases/ai_utils.py
from transformers import AutoImageProcessor, AutoModelForImageClassification
from PIL import Image
import torch

MODEL_ID = "linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification"

# Load processor + model once
processor = AutoImageProcessor.from_pretrained(MODEL_ID)
model = AutoModelForImageClassification.from_pretrained(MODEL_ID)
model.eval()

def run_model(image_file):
    """Takes an uploaded image file, runs model inference, returns results"""
    image = Image.open(image_file).convert("RGB")
    inputs = processor(images=image, return_tensors="pt")

    with torch.no_grad():
        outputs = model(**inputs)
        probs = torch.nn.functional.softmax(outputs.logits, dim=-1)
        idx = probs.argmax(dim=-1).item()
        confidence = probs[0, idx].item() * 100
        disease = model.config.id2label[idx]

    # Simple severity + remedy mapping
    if "healthy" in disease.lower():
        severity = "mild"
    elif any(x in disease.lower() for x in ["blight", "rot"]):
        severity = "severe"
    else:
        severity = "moderate"

    remedies = {
        "Tomato___Bacterial_spot": "Use copper sprays, avoid overhead watering.",
        "Corn___Northern_Leaf_Blight": "Use resistant varieties, rotate crops.",
        "Apple___Apple_scab": "Apply fungicide, remove infected leaves.",
        "healthy": "No disease detected, continue good practices."
    }
    remedy = remedies.get(disease, "Consult local agri expert for treatment.")

    return disease, round(confidence, 2), severity, remedy
