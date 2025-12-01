import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";
import { signup } from "@/lib/auth";
import { useNavigate } from "react-router-dom";
import "./Signup.css";

const schema = z.object({
  name: z.string().min(2, "Enter your name"),
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export default function Signup() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  
  const onSubmit = (e) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      setError(res.error.issues[0]?.message || "Invalid input");
      return;
    }
    signup(form);
    navigate("/login", { replace: true });
  };
  
  return (
    <div className="signup-container">
      <main className="signup-main">
        <div className="signup-card">
          <h1 className="signup-title">Create your account</h1>
          <p className="signup-subtitle">Join AgroVision to get AI-driven crop guidance.</p>
          <form onSubmit={onSubmit} className="signup-form">
            <div className="form-group">
              <label className="form-label">Name</label>
              <input
                className="form-input"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Farmer Joe"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                type="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="••••••••"
                type="password"
              />
            </div>
            {error && <p className="error-message">{error}</p>}
            <Button type="submit" className="submit-button">Sign up</Button>
          </form>
        </div>
      </main>
    </div>
  );
}