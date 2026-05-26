import { Link } from "react-router-dom";
import "./App.css";

function Profile() {
  const username = localStorage.getItem("username") || "Admin";
  const initials = username.slice(0, 2).toUpperCase();

  const stats = [
    { label: "Packages Managed", value: "128" },
    { label: "Updates Made", value: "342" },
    { label: "Days Active", value: "47" },
  ];

  return (
    <div className="page-wrapper">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');`}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">📦</span>
          <span className="brand-name">TrackFlow</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginLeft: "8px" }}>/ Profile</span>
        </div>
        <div className="nav-links">
          <Link to="/"><button className="nav-btn">⬅ Home</button></Link>
          <Link to="/admin"><button className="nav-btn">Admin</button></Link>
          <Link to="/settings"><button className="nav-btn">Settings</button></Link>
          <button className="nav-btn logout-btn" onClick={() => {
            localStorage.removeItem("loggedIn");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "40px", display: "flex", justifyContent: "center" }}>
        <div style={{ width: "100%", maxWidth: "600px" }}>

          {/* PROFILE CARD */}
          <div className="center-card slide-up" style={{ textAlign: "center", marginBottom: "20px" }}>
            {/* AVATAR */}
            <div style={{
              width: "90px", height: "90px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, #6c63ff, #00d4aa)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "32px", fontWeight: "700",
              margin: "0 auto 16px",
              boxShadow: "0 0 40px rgba(108,99,255,0.5)"
            }}>
              {initials}
            </div>

            <h2 style={{ fontSize: "26px", fontWeight: "700", letterSpacing: "-0.5px" }}>{username}</h2>
            <p style={{ color: "rgba(255,255,255,0.5)", marginTop: "6px" }}>Tracker Manager</p>

            <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "12px" }}>
              <span className="pill-delivered">✅ Admin</span>
              <span className="pill-transit">🔵 Active</span>
            </div>
          </div>

          {/* STATS */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px", marginBottom: "20px" }}>
            {stats.map(s => (
              <div key={s.label} className="stat-card">
                <div className="stat-value" style={{ color: "#6c63ff", fontSize: "28px" }}>{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* INFO CARD */}
          <div className="center-card slide-up">
            <h3 style={{ marginBottom: "16px", fontSize: "17px" }}>📋 Account Details</h3>
            {[
              { icon: "👤", label: "Username", value: username },
              { icon: "📧", label: "Email", value: `${username.toLowerCase()}@trackflow.com` },
              { icon: "🔐", label: "Role", value: "Administrator" },
              { icon: "📍", label: "Location", value: "Chennai, India" },
              { icon: "📅", label: "Member Since", value: "Jan 2024" },
            ].map(item => (
              <div key={item.label} style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "13px 0",
                borderBottom: "1px solid rgba(255,255,255,0.07)"
              }}>
                <span style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px" }}>
                  {item.icon} {item.label}
                </span>
                <span style={{ fontWeight: "600", fontSize: "14px" }}>{item.value}</span>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Profile;
