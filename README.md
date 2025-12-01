# 🌱 AgroVision – AI-Driven Crop Guidance & Plant Disease Diagnosis

**Developers:** Jatin Goel, Vaibhav Gupta, Naman Arora, Ayush Mittal

AgroVision is an integrated AI-powered platform designed to assist farmers with **crop recommendation**, **plant disease detection**, and an **agricultural query chatbot**—all within a seamless web interface.

The system uses **Machine Learning**, **Deep Learning**, and the **Gemini API** for conversational assistance to deliver actionable insights instantly.

---

## 🚀 Features

### ✔️ Crop Recommendation  
Predict the best crops suited for a farmer’s land using:
- Soil type  
- pH value  
- N-P-K nutrient levels  
- Temperature & humidity  
- Season & water source  

Model used: **CatBoost** (Best accuracy: *96.8%*). See project report for details.

---

### ✔️ Plant Disease Detection  
Upload an image of a leaf and get instant diagnosis across **38 disease classes**.

Deep Learning models used:
- EfficientNetB3  
- ResNet50  
- MobileNetV2

Details and evaluation results are available in the project report.

---

### ✔️ Agricultural Chatbot (Gemini API)  
A Gemini-powered chatbot answers farming-related questions such as:
- Fertilizer guidance  
- Irrigation tips  
- Crop care  
- Pest control  

Note: We use **Gemini API** for chat responses (no model training is included in this repo).

---

## 🏗️ Project Structure

```
ML_DL Training/
│── Catboost.py
│── resnet50.ipynb

client/
│── assets/
│── components/
│── hooks/
│── lib/
│── pages/
│── App.jsx
│── global.css
│── index.html
│── package.json
│── vite.config.js

ml_service/
│── models/
│── app.py
│── requirements.txt

server/
│── config/
│── controller/
│── models/
│── routes/
│── shared/
│── server.js
```

---

## 🧠 Tech Stack

**Frontend**
- React, Vite

**Backend**
- Node.js / Express
- Python (Flask/FastAPI for ML service)

**Machine Learning**
- CatBoost, XGBoost, LightGBM

**Deep Learning**
- TensorFlow / PyTorch (EfficientNet, ResNet, MobileNet)

**Chatbot**
- Gemini API

**Database**
- MongoDB

---

## 📊 Datasets Used

- **Crop Recommendation:** ~57,000 rows (Kaggle dataset). 
- **Plant Disease Images:** ~87,000 images across 38 classes.

---

## ⚙️ How to Run the Project

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/yourusername/AgroVision.git
cd AgroVision
```

---

### 2️⃣ Start the Frontend
```bash
cd client
npm install
npm run dev
```

---

### 3️⃣ Start the Backend (Node.js API)
```bash
cd server
npm install
node server.js
```

---

### 4️⃣ Start the ML/DL Service (Python)

Create and activate a virtual environment, then install requirements and run the service:

```bash
cd ml_service

# create venv (Linux/macOS)
python3 -m venv venv
source venv/bin/activate

# create venv (Windows PowerShell)
python -m venv venv
venv\Scripts\Activate.ps1

# or Windows CMD
venv\Scripts\activate.bat

# then install requirements and run
pip install -r requirements.txt
python app.py
```

---

## 🔑 Environment Variables

Create a `.env` file (in backend / server root) with:

```
MONGO_URI=your_mongodb_uri
GEMINI_API_KEY=your_gemini_api_key
```

---

## 📄 License
This project is for academic & research purposes.

---

