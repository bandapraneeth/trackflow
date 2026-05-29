import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./App.css";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      setError("Please fill in all fields ⚠️");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await axios.post("https://trackflow-production-06d2.up.railway.app/login", { username, password });

      if (res.data.message === "Login success") {
        localStorage.setItem("loggedIn", "true");
        localStorage.setItem("username", username);
        navigate("/");
      }
    } catch (err) {
      setError("Invalid username or password ❌");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleLogin();
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0f0c29, #302b63, #24243e)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "'Space Grotesk', sans-serif",
      color: "white"
    }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Mono&display=swap');
        * { box-sizing: border-box; }
        .login-input {
          width: 100%;
          padding: 13px 16px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.08);
          color: white;
          font-family: 'Space Grotesk', sans-serif;
          font-size: 15px;
          outline: none;
          transition: 0.2s;
          margin-top: 12px;
        }
        .login-input::placeholder { color: rgba(255,255,255,0.35); }
        .login-input:focus {
          border-color: #6c63ff;
          background: rgba(108,99,255,0.12);
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-14px); }
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* BRAND */}
      <div style={{ marginBottom: "30px", textAlign: "center", animation: "fadeIn 0.5s ease" }}>
        <img
          src="https://cdn-icons-png.flaticon.com/512/1048/1048315.png"
          alt="logo"
          style={{ width: "70px", animation: "float 3s ease-in-out infinite", filter: "drop-shadow(0 10px 30px rgba(108,99,255,0.6))" }}
        />
        <h1 style={{ fontSize: "32px", fontWeight: "700", letterSpacing: "-1px", marginTop: "14px" }}>
          Track<span style={{ color: "#00d4aa" }}>Flow</span>
        </h1>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "15px" }}>Package Tracking System</p>
      </div>

      {/* CARD */}
      <div style={{
        background: "rgba(255,255,255,0.07)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.14)",
        borderRadius: "20px",
        padding: "40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 30px 80px rgba(0,0,0,0.5)",
        animation: "fadeIn 0.6s ease"
      }}>
        <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>Welcome back 👋</h2>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", marginBottom: "8px" }}>Sign in to continue</p>

        <input
          className="login-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <input
          className="login-input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          style={{ marginTop: "12px" }}
        />

        {error && (
          <p style={{ color: "#fc8181", fontWeight: "600", marginTop: "14px", fontSize: "14px" }}>{error}</p>
        )}

        <button
          onClick={handleLogin}
          disabled={loading}
          style={{
            width: "100%",
            marginTop: "22px",
            padding: "14px",
            background: loading ? "rgba(108,99,255,0.5)" : "#6c63ff",
            color: "white",
            border: "none",
            borderRadius: "10px",
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: "16px",
            fontWeight: "700",
            cursor: loading ? "not-allowed" : "pointer",
            transition: "all 0.2s",
            letterSpacing: "0.3px"
          }}
        >
          {loading ? "Signing in..." : "Sign In →"}
        </button>

        <p style={{ marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.4)", textAlign: "center" }}>
          Default: admin / admin
        </p>
      </div>
    </div>
  );
}

export default Login;
