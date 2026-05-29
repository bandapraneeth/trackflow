import { useState } from "react"
import axios from "axios"
import "./App.css"
import Admin from "./Admin";
import Profile from "./Profile";
import Settings from "./Settings";
import Login from "./Login";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";

function Home() {
  const [id, setId] = useState("")
  const [data, setData] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const track = async () => {
    if (!id.trim()) { setError("Please enter a Tracking ID ⚠️"); return; }
    try {
      setLoading(true)
      const res = await axios.get(`https://trackflow-production-06d2.up.railway.app/track/${id.toUpperCase()}`)
      setData(res.data)
      setError("")
    } catch (err) {
      setData(null)
      setError("Tracking ID not found ❌")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") track();
  }

  const statusSteps = ["Shipped", "In Transit", "Delivered"];
  const currentStep = data ? statusSteps.indexOf(data.status) : -1;

  const statusColors = {
    "Shipped": "#f59e0b",
    "In Transit": "#3b82f6",
    "Delivered": "#10b981"
  };

  return (
    <div className="app">
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">📦</span>
          <span className="brand-name">TrackFlow</span>
        </div>
        <div className="nav-links">
          <Link to="/"><button className="nav-btn active-btn">Home</button></Link>
          <Link to="/admin"><button className="nav-btn">Admin</button></Link>
          <Link to="/profile"><button className="nav-btn">Profile</button></Link>
          <Link to="/settings"><button className="nav-btn">Settings</button></Link>
          <button className="nav-btn logout-btn" onClick={() => {
            localStorage.removeItem("loggedIn");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      {/* HERO */}
      <div className="hero">
        <div className="hero-text">
          <h1 className="hero-title">Real-Time<br /><span className="accent">Package Tracking</span></h1>
          <p className="hero-sub">Enter your tracking ID to get live status updates</p>
        </div>
        <div className="image-section">
          <img src="https://cdn-icons-png.flaticon.com/512/1048/1048315.png" alt="package" className="float-img" />
        </div>
      </div>

      {/* TRACKER CARD */}
      <div className="tracker-wrapper">
        <div className="card glass-card">
          <h2 className="card-title">Track Your Package</h2>

          <div className="input-group">
            <input
              placeholder="Enter Tracking ID (e.g. TRK123)"
              value={id}
              onChange={(e) => setId(e.target.value)}
              onKeyDown={handleKeyDown}
              className="track-input"
            />
            <button className="track-btn" onClick={track}>
              {loading ? <span className="btn-loader"></span> : "🔍 Track"}
            </button>
          </div>

          {error && <p className="error-msg">{error}</p>}

          {data && (
            <div className="result fade-in">
              <div className="result-header">
                <span className="tracking-label">Tracking ID: <b>{data.tracking_id}</b></span>
                <span className="status-badge" style={{ background: statusColors[data.status] || "#888" }}>
                  {data.status}
                </span>
              </div>
              <p className="location-text">📍 Current Location: <b>{data.location}</b></p>

              {/* TIMELINE */}
              <div className="timeline">
                {statusSteps.map((step, i) => (
                  <div key={step} className={`timeline-step ${i <= currentStep ? "active" : ""}`}>
                    <div className="step-icon">
                      {i === 0 ? "📦" : i === 1 ? "🚚" : "✅"}
                    </div>
                    <div className="step-label">{step}</div>
                    {i < statusSteps.length - 1 && (
                      <div className={`step-line ${i < currentStep ? "active-line" : ""}`}></div>
                    )}
                  </div>
                ))}
              </div>

              <div className="eta-box">
                <span>🕐 Last Updated: {new Date().toLocaleString()}</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* STATS ROW */}
      <StatsBar />
    </div>
  )
}

function StatsBar() {
  const [stats, setStats] = useState(null);

  useState(() => {
    axios.get("https://trackflow-production-06d2.up.railway.app/all").then(res => {
      const all = res.data;
      setStats({
        total: all.length,
        delivered: all.filter(p => p.status === "Delivered").length,
        inTransit: all.filter(p => p.status === "In Transit").length,
        shipped: all.filter(p => p.status === "Shipped").length,
      });
    }).catch(() => {});
  }, []);

  if (!stats) return null;

  return (
    <div className="stats-bar">
      {[
        { label: "Total Packages", value: stats.total, icon: "📦", color: "#667eea" },
        { label: "Shipped", value: stats.shipped, icon: "🏭", color: "#f59e0b" },
        { label: "In Transit", value: stats.inTransit, icon: "🚚", color: "#3b82f6" },
        { label: "Delivered", value: stats.delivered, icon: "✅", color: "#10b981" },
      ].map((s) => (
        <div className="stat-card" key={s.label}>
          <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
          <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
          <div className="stat-label">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function ProtectedRoute({ children }) {
  const loggedIn = localStorage.getItem("loggedIn");
  return loggedIn ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
      </Routes>
    </Router>
  )
}

export default App
