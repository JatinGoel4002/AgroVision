import { useState } from "react";
import "./DiseaseDetection.css";
import { askGemini } from "@/lib/gemini";

export default function DiseaseDetection() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState("—");
  const [loading, setLoading] = useState(false);

  const [info, setInfo] = useState({
    description: "—",
    symptoms: "—",
    treatment: "—",
    prevention: "—",
  });

  // ===============================
  // Gemini fetch function (background)
  // ===============================
  const fetchGeminiInfo = async (disease) => {
    const gen = async (topic) => {
      return await askGemini(
        `In exactly 2 short, simple lines, give ${topic.toLowerCase()} for the plant disease: ${disease}.
         Keep it farmer-friendly, no markdown, no bullets.`
      );
    };

    try {
      const [description, symptoms, treatment, prevention] = await Promise.all([
        gen("Description"),
        gen("Symptoms"),
        gen("Treatment"),
        gen("Prevention"),
      ]);

      setInfo({
        description,
        symptoms,
        treatment,
        prevention,
      });
    } catch (err) {
      console.error("Gemini AI error:", err);
      setInfo({
        description: "AI error",
        symptoms: "AI error",
        treatment: "AI error",
        prevention: "AI error",
      });
    }
  };

  // ===============================
  // File Upload Handler
  // ===============================
  const onFile = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setImage(url);
    setLoading(true);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:8000/predict-disease", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const disease = data.predicted_disease || "Unknown";

      // 🔥 Show disease name instantly
      setResult(disease);

      // 🔥 Show temp placeholders for Gemini
      setInfo({
        description: "Loading description...",
        symptoms: "Loading symptoms...",
        treatment: "Loading treatment...",
        prevention: "Loading prevention...",
      });

      // 🔥 Fetch Gemini info in background (non-blocking)
      setTimeout(() => fetchGeminiInfo(disease), 50);

    } catch (err) {
      console.error("Error:", err);
      setResult("Server error");

      setInfo({
        description: "AI error",
        symptoms: "AI error",
        treatment: "AI error",
        prevention: "AI error",
      });
    }

    setLoading(false);
  };

  // ===============================
  // JSX
  // ===============================
  return (
    <div className="disease-detection-wrapper" style={{ marginTop: "2rem" }}>
      <div className="disease-detection-container">
        <h1 className="page-title">Disease Detection</h1>

        <div className="content-grid">
          {/* Image Upload Section */}
          <div className="upload-card">
            <input
              type="file"
              accept="image/*"
              onChange={onFile}
              className="file-input"
            />

            {image && (
              <img
                alt="upload preview"
                src={image}
                className="preview-image"
              />
            )}
          </div>

          {/* Results Section */}
          <div className="results-card">
            <p className="result-label">Detected Condition</p>

            <p className="result-value">
              {loading ? "Detecting..." : result}
            </p>

            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{ width: loading ? "70%" : "100%" }}
              />
            </div>

            {/* AI Info Cards */}
            <div className="info-grid">
              <div className="info-card">
                <p className="info-title">Description</p>
                <p className="info-text">{info.description}</p>
              </div>

              <div className="info-card">
                <p className="info-title">Symptoms</p>
                <p className="info-text">{info.symptoms}</p>
              </div>

              <div className="info-card">
                <p className="info-title">Treatment</p>
                <p className="info-text">{info.treatment}</p>
              </div>

              <div className="info-card">
                <p className="info-title">Prevention</p>
                <p className="info-text">{info.prevention}</p>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
