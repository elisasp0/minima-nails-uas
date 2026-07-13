import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) {
    navigate("/", { replace: true });
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(username, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Login gagal");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page">
      <div className="login-bg-decor">
        <div className="decor-circle decor-circle-1" />
        <div className="decor-circle decor-circle-2" />
        <div className="decor-circle decor-circle-3" />
      </div>
      <div className="login-card">
        <div className="login-header">
          <div className="login-logo">
            <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
              <rect width="40" height="40" rx="10" fill="#e91e63" />
              <path d="M20 8C16 8 13 11 13 15v6c0 2 1 4 3 5v6c0 1 1 2 2 2h4c1 0 2-1 2-2v-6c2-1 3-3 3-5v-6c0-4-3-7-7-7z" fill="#fff" opacity="0.9" />
              <path d="M17 15h6M17 19h6" stroke="#e91e63" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="login-title">Minima Nails</h1>
          <p className="login-subtitle">Masuk ke akun Anda</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && (
            <div className="alert alert-error">
              <span className="alert-icon">!</span>
              {error}
            </div>
          )}
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <div className="input-wrapper">
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Masukkan username"
                required
                autoFocus
                autoComplete="username"
              />
            </div>
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Masukkan password"
                required
                autoComplete="current-password"
              />
            </div>
          </div>
          <button type="submit" className="btn-login" disabled={loading}>
            {loading ? (
              <span className="btn-loading">
                <span className="spinner" />
                Memproses...
              </span>
            ) : (
              "Masuk"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
