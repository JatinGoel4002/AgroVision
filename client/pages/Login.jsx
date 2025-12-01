import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useState } from "react";
import { login } from "@/lib/auth";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./login.css";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(6, "Min 6 characters"),
});

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const onSubmit = async (e) => {
    e.preventDefault();
    const res = schema.safeParse(form);
    if (!res.success) {
      setError(res.error.issues[0]?.message || "Invalid input");
      return;
    }
    try {
      await login({ email: form.email, password: form.password });
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    }
  };

  return (
    <div className="login-page">
      <main className="login-main">
        <div className="login-card">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Log in to access your AgroVision dashboard.</p>
          <form onSubmit={onSubmit} className="login-form">
            {/* Only email and password fields */}
            <div className="form-group">
              <label className="form-label">Email</label>
              <input
                className="form-input"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
                type="email"
                autoComplete="email"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input
                className="form-input"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="Your password"
                type="password"
                autoComplete="current-password"
              />
            </div>
            {error && <p className="form-error">{error}</p>}
            <Button type="submit" className="login-btn">Log in</Button>
            <p className="login-link">No account? <Link to="/signup">Sign up</Link></p>
          </form>
        </div>
      </main>
    </div>
  );
}
