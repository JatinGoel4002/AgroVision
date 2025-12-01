import { useState } from "react";
import { Button } from "@/components/ui/button";
import "./CropRecommendation.css";

function Field({ label, name, value, type = "number", onChange }) {
  return (
    <div className="field-container">
      <label className="field-label">{label}</label>
      <input
        className="field-input"
        value={value}
        type={type}
        onChange={onChange}
      />
    </div>
  );
}

export default function CropRecommendation() {
  const [form, setForm] = useState({
    soil: "",
    season: "",
    water_source: "",
    soil_ph: 6.5,
    n: 90,
    p: 40,
    k: 40,
    temp: 25,
    relative_humidity: 70
  });

  const [result, setResult] = useState(null);

  const submit = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:8000/predict-crop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await response.json();
    setResult(data.predicted_crop || "Error predicting crop");
  };

  return (
    <div className="page-container" style={{ marginTop: '2rem' }}>
      <div className="content-wrapper">
        <h1 className="page-title">Enter Soil & Climate Parameters</h1>

        <form onSubmit={submit} className="form-card">
          <div className="form-grid">

            {/* DROPDOWNS */}
            <div className="field-container">
              <label className="field-label">Soil Type</label>
              <select className="field-input" value={form.soil}
                onChange={(e) => setForm({ ...form, soil: e.target.value })}>
                <option value="">Select</option>
                <option value="Loamy soil">Loamy soil</option>
                <option value="Clay soil">Clay soil</option>
                <option value="Sandy soil">Sandy soil</option>
                <option value="Silty soil">Silty soil</option>
                <option value="Alluvial soil">Alluvial soil</option>
                <option value="well-drained soil">Well-Drained Soil</option>
                <option value="Red soil">Red soil</option>
                <option value="clay Loamy soil">Clay Loamy Soil</option>
                <option value="Black Soil">Black Soil</option>
                <option value="sandy Loamy soil">Sandy Loamy Soil</option>
                <option value="Laterite soil">Laterite Soil</option>
                <option value="friable soil">Friable Soil</option>
                <option value="deep soil">Deep Soil</option>
              </select>
            </div>

            <div className="field-container">
              <label className="field-label">Season</label>
              <select className="field-input" value={form.season}
                onChange={(e) => setForm({ ...form, season: e.target.value })}>
                <option value="">Select</option>
                <option value="kharif">Kharif</option>
                <option value="rabi">Rabi</option>
                <option value="zaid">Zaid</option>
              </select>
            </div>

            <div className="field-container">
              <label className="field-label">Water Source</label>
              <select className="field-input" value={form.water_source}
                onChange={(e) => setForm({ ...form, water_source: e.target.value })}>
                <option value="">Select</option>
                <option value="irrigated">Irrigated</option>
                <option value="rainfed">Rainfed</option>
              </select>
            </div>

            {/* NUMERIC INPUTS */}
            <Field
              label="Soil pH"
              name="soil_ph"
              value={form.soil_ph}
              onChange={(e) => setForm({ ...form, soil_ph: Number(e.target.value) })}
            />

            <Field
              label="Nitrogen (N)"
              name="n"
              value={form.n}
              onChange={(e) => setForm({ ...form, n: Number(e.target.value) })}
            />

            <Field
              label="Phosphorus (P)"
              name="p"
              value={form.p}
              onChange={(e) => setForm({ ...form, p: Number(e.target.value) })}
            />

            <Field
              label="Potassium (K)"
              name="k"
              value={form.k}
              onChange={(e) => setForm({ ...form, k: Number(e.target.value) })}
            />

            <Field
              label="Temperature (°C)"
              name="temp"
              value={form.temp}
              onChange={(e) => setForm({ ...form, temp: Number(e.target.value) })}
            />

            <Field
              label="Relative Humidity (%)"
              name="relative_humidity"
              value={form.relative_humidity}
              onChange={(e) => setForm({ ...form, relative_humidity: Number(e.target.value) })}
            />

          </div>

          <div className="button-container">
            <Button type="submit">Get Crop Recommendation</Button>
          </div>
        </form>

        {result && (
          <div className="result-card">
            <p className="result-label">Recommended Crop</p>
            <p className="result-value">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
