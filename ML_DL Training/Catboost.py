#CATBOOST ML MODEL 

# -------------------- IMPORTS --------------------
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, label_binarize
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix, roc_curve, auc
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from catboost import CatBoostClassifier

# -------------------- LOAD DATA --------------------
file_path = r"C:\Users\mso20\Downloads\Dataset4(56k).csv"
df = pd.read_csv(file_path)

# -------------------- FEATURE-TARGET SPLIT --------------------
y = df['CROPS']
X = df.drop(columns=['CROPS'])

# -------------------- ENCODE CATEGORICAL FEATURES --------------------
label_encoders = {}
for col in ['SOIL', 'SEASON', 'WATER_SOURCE']:
    le = LabelEncoder()
    X[col] = le.fit_transform(X[col])
    label_encoders[col] = le

y_encoder = LabelEncoder()
y = y_encoder.fit_transform(y)

# -------------------- TRAIN-TEST SPLIT --------------------
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.3, random_state=42, stratify=y
)

# -------------------- TRAIN CATBOOST MODEL --------------------
model = CatBoostClassifier(
    iterations=300,
    learning_rate=0.1,
    depth=6,
    random_state=42,
    verbose=0
)
model.fit(X_train, y_train)

# -------------------- PREDICTIONS & METRICS --------------------
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)

print("✅ Accuracy:", accuracy)
print("\n✅ Classification Report:\n", classification_report(y_test, y_pred, target_names=y_encoder.classes_))

# -------------------- CONFUSION MATRIX --------------------
plt.figure(figsize=(10, 8))
cm = confusion_matrix(y_test, y_pred)
sns.heatmap(cm, cmap="Blues")
plt.title("CatBoost Confusion Matrix")
plt.xlabel("Predicted")
plt.ylabel("Actual")
plt.show()

# -------------------- ROC CURVE --------------------
y_test_bin = label_binarize(y_test, classes=np.arange(len(y_encoder.classes_)))
y_pred_proba = model.predict_proba(X_test)

fpr, tpr, roc_auc = {}, {}, {}
for i in range(len(y_encoder.classes_)):
    fpr[i], tpr[i], _ = roc_curve(y_test_bin[:, i], y_pred_proba[:, i])
    roc_auc[i] = auc(fpr[i], tpr[i])

plt.figure(figsize=(10, 8))
for i, crop in enumerate(y_encoder.classes_):
    plt.plot(fpr[i], tpr[i], label=f"{crop} (AUC={roc_auc[i]:.2f})")
plt.plot([0, 1], [0, 1], "k--")
plt.title("CatBoost ROC Curve (One-vs-Rest)")
plt.xlabel("False Positive Rate")
plt.ylabel("True Positive Rate")
plt.legend()
plt.show()

# -------------------- SAVE MODEL & ENCODERS --------------------
joblib.dump(model, "catboost_crop_model.pkl")
joblib.dump(y_encoder, "catboost_crop_label_encoder.pkl")
joblib.dump(label_encoders, "catboost_feature_label_encoders.pkl")
print("💾 CatBoost model and encoders saved successfully!")

# -------------------- SUGGEST CROP FUNCTION --------------------
def suggest_crop(user_input):
    model = joblib.load("catboost_crop_model.pkl")
    y_encoder = joblib.load("catboost_crop_label_encoder.pkl")
    label_encoders = joblib.load("catboost_feature_label_encoders.pkl")

    for col in ['SOIL', 'SEASON', 'WATER_SOURCE']:
        user_input[col] = label_encoders[col].transform([user_input[col]])[0]

    user_df = pd.DataFrame([user_input])
    prediction = model.predict(user_df)
    return y_encoder.inverse_transform(prediction.astype(int))[0]

# -------------------- EXAMPLE USAGE --------------------
user_input = {
    'SOIL': 'Loamy soil',
    'SEASON': 'kharif',
    'WATER_SOURCE': 'irrigated',
    'SOIL_PH': 6.5,
    'N': 90,
    'P': 40,
    'K': 45,
    'TEMP': 28,
    'RELATIVE_HUMIDITY': 70
}
print("\n🌾 Suggested Crop (CatBoost):", suggest_crop(user_input))