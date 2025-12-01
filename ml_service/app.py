from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List
import numpy as np
from PIL import Image
import io
import os
import joblib
import torch
import torch.nn as nn
import torchvision.transforms as T
from torchvision.models import resnet50
import pandas as pd

# ============================
# FASTAPI CONFIG
# ============================
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============================
# LOAD CROP RECOMMENDATION MODEL
# ============================
CROP_MODEL_PATH = os.path.join("models", "catboost_crop_model.pkl")
LABEL_ENCODER_PATH = os.path.join("models", "catboost_crop_label_encoder.pkl")
FEATURE_ENCODER_PATH = os.path.join("models", "catboost_feature_label_encoders.pkl")

crop_model = joblib.load(CROP_MODEL_PATH)
y_encoder = joblib.load(LABEL_ENCODER_PATH)
feature_encoders = joblib.load(FEATURE_ENCODER_PATH)

# ORDER OF FEATURES USED IN TRAINING (must not change)
FEATURE_ORDER = [
    "SOIL", "SEASON", "WATER_SOURCE",
    "SOIL_PH", "N", "P", "K", "TEMP", "RELATIVE_HUMIDITY"
]

class CropInput(BaseModel):
    soil: str
    season: str
    water_source: str
    soil_ph: float
    n: float
    p: float
    k: float
    temp: float
    relative_humidity: float


@app.post("/predict-crop")
def predict_crop(data: CropInput):
    try:
        input_dict = {
            "SOIL": data.soil,
            "SEASON": data.season,
            "WATER_SOURCE": data.water_source,
            "SOIL_PH": data.soil_ph,
            "N": data.n,
            "P": data.p,
            "K": data.k,
            "TEMP": data.temp,
            "RELATIVE_HUMIDITY": data.relative_humidity,
        }

        # Apply label encoding to categorical columns
        for col in ["SOIL", "SEASON", "WATER_SOURCE"]:
            input_dict[col] = feature_encoders[col].transform([input_dict[col]])[0]

        # Build dataframe in correct order
        input_df = pd.DataFrame([input_dict], columns=FEATURE_ORDER)

        # Predict
        prediction = crop_model.predict(input_df)
        predicted_crop = y_encoder.inverse_transform(prediction.astype(int))[0]

        return {"predicted_crop": predicted_crop}

    except Exception as e:
        print("Prediction error:", e)
        return {"error": str(e)}

# ============================
# LOAD DISEASE DETECTION MODEL
# ============================
DISEASE_MODEL_PATH = os.path.join("models", "Resnet_50.pth")

num_classes = 38  # update if needed
disease_model = resnet50(weights=None)
disease_model.fc = nn.Linear(disease_model.fc.in_features, num_classes)

state_dict = torch.load(DISEASE_MODEL_PATH, map_location="cpu")
disease_model.load_state_dict(state_dict)
disease_model.eval()

# Class names placeholder
IDX_TO_CLASS: List[str] = [f"Class_{i}" for i in range(num_classes)]

disease_transform = T.Compose([
    T.Resize((224, 224)),
    T.ToTensor(),
    T.Normalize([0.485, 0.456, 0.406], [0.229, 0.224, 0.225]),
])

# Disease label names
classes = [
"Apple___Apple_scab",
"Apple___Black_rot",
"Apple___Cedar_apple_rust",
"Apple___healthy",
"Blueberry___healthy",
"Cherry_(including_sour)___Powdery_mildew",
"Cherry_(including_sour)___healthy",
"Corn_(maize)___Cercospora_leaf_spot_Gray_leaf_spot",
"Corn_(maize)___Common_rust",
"Corn_(maize)___Northern_Leaf_Blight",
"Corn_(maize)___healthy",
"Grape___Black_rot",
"Grape___Esca_(Black_Measles)",
"Grape___Leaf_blight_(Isariopsis_Leaf_Spot)",
"Grape___healthy",
"Orange___Haunglongbing_(Citrus_greening)",
"Peach___Bacterial_spot",
"Peach___healthy",
"Pepper_bell___Bacterial_spot",
"Pepper_bell___healthy",
"Potato___Early_blight",
"Potato___Late_blight",
"Potato___healthy",
"Raspberry___healthy",
"Soybean___healthy",
"Squash___Powdery_mildew",
"Strawberry___Leaf_scorch",
"Strawberry___healthy",
"Tomato___Bacterial_spot",
"Tomato___Early_blight",
"Tomato___Late_blight",
"Tomato___Leaf_Mold",
"Tomato___Septoria_leaf_spot",
"Tomato___Spider_mites_Two_spotted_spider_mite",
"Tomato___Target_Spot",
"Tomato___Yellow_Leaf_Curl_Virus",
"Tomato___mosaic_virus",
"Tomato___healthy"
]

@app.post("/predict-disease")
async def predict_disease(file: UploadFile = File(...)):
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.png', '.jpg', '.jpeg')):
            raise HTTPException(status_code=400, detail="Invalid file type. Upload JPG or PNG")

        contents = await file.read()
        image = Image.open(io.BytesIO(contents)).convert("RGB")

        # Use correct preprocessing
        img_tensor = disease_transform(image).unsqueeze(0)

        # Forward pass
        with torch.no_grad():
            outputs = disease_model(img_tensor)
            _, predicted = torch.max(outputs, 1)
            label = classes[predicted.item()]

        return {"predicted_disease": label}

    except Exception as e:
        print("ERROR:", str(e))
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"message": "ML Service Running Successfully 🚀"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)
