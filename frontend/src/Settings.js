import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

function Settings() {
  const [darkMode, setDarkMode] = useState(() => JSON.parse(localStorage.getItem("darkMode") || "false"));
  const [notifications, setNotifications] = useState(() => JSON.parse(localStorage.getItem("notifications") || "true"));
  const [autoUpdate, setAutoUpdate] = useState(() => JSON.parse(localStorage.getItem("autoUpdate") || "true"));
  const [compactMode, setCompactMode] = useState(() => JSON.parse(localStorage.getItem("compactMode") || "false"));
  const [sound, setSound] = useState(() => JSON.parse(localStorage.getItem("sound") || "true"));
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (darkMode) {
      document.body.style.background = "#0d0d0d";
    } else {
      document.body.style.background = "linear-gradient(135deg, #0f0c29, #302b63, #24243e)";
    }
  }, [darkMode]);

  const handleSave = () => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode));
    localStorage.setItem("notifications", JSON.stringify(notifications));
    localStorage.setItem("autoUpdate", JSON.stringify(autoUpdate));
    localStorage.setItem("compactMode", JSON.stringify(compactMode));
    localStorage.setItem("sound", JSON.stringify(sound));
    setMessage("✅ Settings saved!");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleReset = () => {
    setDarkMode(false);
    setNotifications(true);
    setAutoUpdate(true);
    setCompactMode(false);
    setSound(true);
    setMessage("🔄 Settings reset to default!");
    setTimeout(() => setMessage(""), 3000);
  };

  const toggles = [
    { icon: "🌙", label: "Dark Mode", sub: "Switch to a darker interface", value: darkMode, set: setDarkMode },
    { icon: "🔔", label: "Notifications", sub: "Get alerts on status changes", value: notifications, set: setNotifications },
    { icon: "🔄", label: "Auto Update", sub: "Refresh package data every 30s", value: autoUpdate, set: setAutoUpdate },
    { icon: "📐", label: "Compact Mode", sub: "Reduce padding and font size", value: compactMode, set: setCompactMode },
    { icon: "🔊", label: "Sound Effects", sub: "Play sounds on events", value: sound, set: setSound },
  ];

  return (
    <div className="page-wrapper">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">📦</span>
          <span className="brand-name">TrackFlow</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginLeft: "8px" }}>/ Settings</span>
        </div>
        <div className="nav-links">
          <Link to="/"><button className="nav-btn">⬅ Home</button></Link>
          <Link to="/admin"><button className="nav-btn">Admin</button></Link>
          <Link to="/profile"><button className="nav-btn">Profile</button></Link>
          <button className="nav-btn logout-btn" onClick={() => {
            localStorage.removeItem("loggedIn");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "520px" }}>

          <div className="center-card slide-up">
            <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "6px" }}>⚙️ App Settings</h2>
            <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginBottom: "24px" }}>
              Preferences are saved to your browser
            </p>

            {toggles.map(({ icon, label, sub, value, set }) => (
              <div key={label} className="toggle-row">
                <div>
                  <div style={{ fontWeight: "600", fontSize: "15px" }}>{icon} {label}</div>
                  <div style={{ color: "rgba(255,255,255,0.4)", fontSize: "13px", marginTop: "2px" }}>{sub}</div>
                </div>
                <label className="switch">
                  <input type="checkbox" checked={value} onChange={() => set(!value)} />
                  <span className="slider"></span>
                </label>
              </div>
            ))}

            {message && (
              <p className="msg-success" style={{ textAlign: "center", marginTop: "16px" }}>{message}</p>
            )}

            <div style={{ display: "flex", gap: "12px", marginTop: "24px" }}>
              <button className="btn-primary" onClick={handleSave} style={{ flex: 1 }}>
                💾 Save Settings
              </button>
              <button
                onClick={handleReset}
                style={{
                  flex: 1, marginTop: "14px", padding: "11px 22px",
                  background: "rgba(255,255,255,0.08)",
                  color: "rgba(255,255,255,0.7)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  borderRadius: "8px", fontFamily: "'Space Grotesk', sans-serif",
                  fontWeight: "600", fontSize: "14px", cursor: "pointer"
                }}
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* VERSION INFO */}
          <div className="center-card" style={{ marginTop: "20px", fontSize: "13px", color: "rgba(255,255,255,0.35)", textAlign: "center" }}>
            TrackFlow v2.0.0 · Built with React + Express + MySQL
          </div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
