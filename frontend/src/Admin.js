import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./App.css";

const LOCATION_MAP = {
  "Shipped": "Warehouse - Chennai",
  "In Transit": "Distribution Hub - Mumbai",
  "Delivered": "Delivered to Customer"
};

function Admin() {
  const [data, setData] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [msgType, setMsgType] = useState("success");

  // UPDATE form
  const [updateId, setUpdateId] = useState("");
  const [updateStatus, setUpdateStatus] = useState("");

  // ADD form
  const [addId, setAddId] = useState("");
  const [addStatus, setAddStatus] = useState("");
  const [addLocation, setAddLocation] = useState("");

  // MODAL
  const [confirmDelete, setConfirmDelete] = useState(null);

  const getAll = async () => {
    const res = await fetch("http://https://trackflow-production-06d2.up.railway.app/all");
    const result = await res.json();
    setData(result);
  };

  useEffect(() => { getAll(); }, []);

  // Filter & search
  useEffect(() => {
    let d = [...data];
    if (filterStatus !== "All") d = d.filter(p => p.status === filterStatus);
    if (search.trim()) {
      const q = search.toLowerCase();
      d = d.filter(p =>
        p.tracking_id?.toLowerCase().includes(q) ||
        p.location?.toLowerCase().includes(q) ||
        p.status?.toLowerCase().includes(q)
      );
    }
    setFiltered(d);
  }, [data, search, filterStatus]);

  const showMsg = (text, type = "success") => {
    setMessage(text);
    setMsgType(type);
    setTimeout(() => setMessage(""), 3000);
  };

  const handleUpdate = async () => {
    if (!updateId.trim()) { showMsg("❌ Enter Tracking ID", "error"); return; }
    if (!updateStatus) { showMsg("❌ Select a status", "error"); return; }
    try {
      setLoading(true);
      await fetch("http://https://trackflow-production-06d2.up.railway.app/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_id: updateId.toUpperCase(),
          status: updateStatus,
          location: LOCATION_MAP[updateStatus] || ""
        })
      });
      showMsg("✅ Status updated!");
      setUpdateId(""); setUpdateStatus("");
      getAll();
    } catch { showMsg("❌ Update failed", "error"); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!addId.trim() || !addStatus || !addLocation.trim()) {
      showMsg("❌ Fill all fields", "error"); return;
    }
    try {
      setLoading(true);
      await fetch("http://https://trackflow-production-06d2.up.railway.app/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tracking_id: addId.toUpperCase(),
          status: addStatus,
          location: addLocation
        })
      });
      showMsg("✅ Package added!");
      setAddId(""); setAddStatus(""); setAddLocation("");
      getAll();
    } catch { showMsg("❌ Add failed", "error"); }
    finally { setLoading(false); }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://https://trackflow-production-06d2.up.railway.app/delete/${id}`, { method: "DELETE" });
      showMsg("🗑️ Package deleted!");
      setConfirmDelete(null);
      getAll();
    } catch { showMsg("❌ Delete failed", "error"); }
  };

  const stats = {
    total: data.length,
    shipped: data.filter(p => p.status === "Shipped").length,
    transit: data.filter(p => p.status === "In Transit").length,
    delivered: data.filter(p => p.status === "Delivered").length,
  };

  const getStatusPill = (status) => {
    if (status === "Shipped") return <span className="pill-shipped">📦 Shipped</span>;
    if (status === "In Transit") return <span className="pill-transit">🚚 In Transit</span>;
    if (status === "Delivered") return <span className="pill-delivered">✅ Delivered</span>;
    return <span>{status}</span>;
  };

  return (
    <div className="page-wrapper">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&display=swap');
        .admin-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
        .search-bar { display: flex; gap: 10px; margin-bottom: 16px; flex-wrap: wrap; }
        .confirm-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.7); display: flex; align-items: center; justify-content: center; z-index: 999; }
        .confirm-box { background: #1e1b3a; border: 1px solid rgba(255,255,255,0.15); border-radius: 16px; padding: 30px; text-align: center; }
      `}</style>

      {/* NAVBAR */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="brand-icon">📦</span>
          <span className="brand-name">TrackFlow</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: "14px", marginLeft: "8px" }}>/ Admin</span>
        </div>
        <div className="nav-links">
          <Link to="/"><button className="nav-btn">⬅ Home</button></Link>
          <Link to="/profile"><button className="nav-btn">Profile</button></Link>
          <Link to="/settings"><button className="nav-btn">Settings</button></Link>
          <button className="nav-btn logout-btn" onClick={() => {
            localStorage.removeItem("loggedIn");
            window.location.href = "/login";
          }}>Logout</button>
        </div>
      </nav>

      <div style={{ padding: "30px 40px" }}>

        {/* STATS ROW */}
        <div style={{ display: "flex", gap: "16px", marginBottom: "28px", flexWrap: "wrap" }}>
          {[
            { label: "Total", value: stats.total, icon: "📦", color: "#6c63ff" },
            { label: "Shipped", value: stats.shipped, icon: "🏭", color: "#f59e0b" },
            { label: "In Transit", value: stats.transit, icon: "🚚", color: "#3b82f6" },
            { label: "Delivered", value: stats.delivered, icon: "✅", color: "#10b981" },
          ].map(s => (
            <div key={s.label} className="stat-card" style={{ flex: "1", minWidth: "120px" }}>
              <div className="stat-icon" style={{ color: s.color }}>{s.icon}</div>
              <div className="stat-value" style={{ color: s.color }}>{s.value}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>

        {/* FORMS GRID */}
        <div className="admin-grid" style={{ marginBottom: "28px" }}>

          {/* UPDATE CARD */}
          <div className="center-card slide-up">
            <h3 style={{ marginBottom: "16px", fontSize: "17px" }}>✏️ Update Package Status</h3>
            <input
              className="form-input"
              placeholder="Enter Tracking ID"
              value={updateId}
              onChange={e => setUpdateId(e.target.value)}
            />
            <select className="form-select" value={updateStatus} onChange={e => setUpdateStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option>Shipped</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>
            {updateStatus && (
              <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "13px", marginTop: "8px" }}>
                📍 Auto-location: {LOCATION_MAP[updateStatus]}
              </p>
            )}
            <button className="btn-primary" onClick={handleUpdate} disabled={loading} style={{ width: "100%" }}>
              {loading ? "Updating..." : "Update Status"}
            </button>
          </div>

          {/* ADD CARD */}
          <div className="center-card slide-up">
            <h3 style={{ marginBottom: "16px", fontSize: "17px" }}>➕ Add New Package</h3>
            <input
              className="form-input"
              placeholder="Tracking ID (e.g. TRK456)"
              value={addId}
              onChange={e => setAddId(e.target.value)}
            />
            <select className="form-select" value={addStatus} onChange={e => setAddStatus(e.target.value)}>
              <option value="">Select Status</option>
              <option>Shipped</option>
              <option>In Transit</option>
              <option>Delivered</option>
            </select>
            <input
              className="form-input"
              placeholder="Location"
              value={addLocation}
              onChange={e => setAddLocation(e.target.value)}
            />
            <button className="btn-primary" onClick={handleAdd} disabled={loading} style={{ width: "100%", background: "#10b981" }}>
              {loading ? "Adding..." : "➕ Add Package"}
            </button>
          </div>
        </div>

        {/* GLOBAL MESSAGE */}
        {message && (
          <p className={msgType === "success" ? "msg-success" : "msg-error"} style={{ marginBottom: "16px", textAlign: "center" }}>
            {message}
          </p>
        )}

        {/* TABLE SECTION */}
        <div className="center-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", flexWrap: "wrap", gap: "12px" }}>
            <h3 style={{ fontSize: "17px" }}>📋 All Packages ({filtered.length})</h3>
            <div className="search-bar">
              <input
                className="form-input"
                placeholder="🔍 Search..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ marginTop: 0, width: "200px" }}
              />
              <select
                className="form-select"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                style={{ marginTop: 0, width: "150px" }}
              >
                <option value="All">All Status</option>
                <option>Shipped</option>
                <option>In Transit</option>
                <option>Delivered</option>
              </select>
            </div>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Tracking ID</th>
                  <th>Status</th>
                  <th>Location</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan="5" style={{ textAlign: "center", color: "rgba(255,255,255,0.4)", padding: "30px" }}>No packages found</td></tr>
                ) : (
                  filtered.map((item) => (
                    <tr key={item.id}>
                      <td style={{ color: "rgba(255,255,255,0.4)", fontFamily: "DM Mono, monospace" }}>{item.id}</td>
                      <td style={{ fontFamily: "DM Mono, monospace", fontWeight: "600" }}>{item.tracking_id}</td>
                      <td>{getStatusPill(item.status)}</td>
                      <td style={{ color: "rgba(255,255,255,0.7)" }}>{item.location}</td>
                      <td>
                        <button className="btn-danger" onClick={() => setConfirmDelete(item)}>
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* CONFIRM DELETE MODAL */}
      {confirmDelete && (
        <div className="confirm-overlay">
          <div className="confirm-box slide-up">
            <p style={{ fontSize: "36px", marginBottom: "12px" }}>⚠️</p>
            <h3 style={{ marginBottom: "8px" }}>Delete Package?</h3>
            <p style={{ color: "rgba(255,255,255,0.6)", marginBottom: "24px" }}>
              Tracking ID: <b>{confirmDelete.tracking_id}</b>
            </p>
            <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
              <button className="btn-danger" style={{ padding: "10px 24px" }} onClick={() => handleDelete(confirmDelete.id)}>
                Delete
              </button>
              <button className="btn-primary" style={{ marginTop: 0 }} onClick={() => setConfirmDelete(null)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Admin;
