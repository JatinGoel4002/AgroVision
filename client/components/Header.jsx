import { Link, useLocation, useNavigate } from "react-router-dom";
import { getUser, logout } from "@/lib/auth";
import { useEffect, useState } from "react";
import "./Header.css"; // ✅ Import external CSS

export default function Header() {
  const [userEmail, setUserEmail] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const u = getUser();
    setUserEmail(u?.email ?? null);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo">
          <span className="logo-icon" />
          <span className="logo-text">AgroVision</span>
        </Link>
        <nav className="nav">
          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
        </nav>
        <div className="auth-section">
          {userEmail ? (
            <>
              <span className="user-email">{userEmail}</span>
              <button
                className="btn-outline"
                onClick={() => {
                  logout();
                  navigate("/");
                }}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn-ghost">Log in</Link>
              <Link to="/signup" className="btn-primary">Sign up</Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
