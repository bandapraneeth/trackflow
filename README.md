# 📦 TrackFlow - Package Tracking System v2.0

## Project Structure
```
trackflow/
├── frontend/        ← React App
│   ├── public/
│   └── src/
│       ├── App.js         Main app + Home page
│       ├── App.css        Full design system
│       ├── Login.js       Login page
│       ├── Admin.js       Admin panel
│       ├── Profile.js     Profile page
│       └── Settings.js    Settings page
└── backend/         ← Express + MySQL
    ├── index.js     API server
    └── package.json
```

## ⚡ Setup Instructions

### 1. MySQL Setup
```sql
CREATE DATABASE tracker;
```
> Tables (packages, users) are auto-created on first run.
> Default login: admin / admin

### 2. Backend
```bash
cd backend
npm install
node index.js
# Runs on http://localhost:5000
```

### 3. Frontend
```bash
cd frontend
npm install
npm start
# Runs on http://localhost:3000
```

## 🔑 Default Login
- Username: `admin`
- Password: `admin`

## 🚀 Features
- 🔐 Login with session protection
- 📦 Real-time package tracking with timeline
- 📊 Live stats dashboard
- ➕ Add / ✏️ Update / 🗑️ Delete packages
- 🔍 Search & filter in admin panel
- 💾 Persistent settings via localStorage
- 🌙 Dark mode toggle
- 📍 Auto location update on status change
