const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
  ssl: {
    rejectUnauthorized: false
  }
});

db.connect((err) => {
  if (err) {
    console.error("❌ MySQL Connection Failed:", err.message);
    return;
  }

  console.log("✅ MySQL Connected");

  db.query(`
    CREATE TABLE IF NOT EXISTS packages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      tracking_id VARCHAR(50) UNIQUE NOT NULL,
      status VARCHAR(50) DEFAULT 'Shipped',
      location VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `);

  db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      role VARCHAR(50) DEFAULT 'admin',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.query(
    "INSERT IGNORE INTO users (username, password, role) VALUES (?, ?, ?)",
    ["admin", "123", "admin"],
    (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("✅ Admin user ready");
      }
    }
  );
});

app.get('/health', (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString()
  });
});

app.get('/track/:id', (req, res) => {
  const id = req.params.id;

  db.query(
    'SELECT * FROM packages WHERE UPPER(tracking_id) = UPPER(?)',
    [id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Server error"
        });
      }

      if (result.length === 0) {
        return res.status(404).json({
          error: "Not found"
        });
      }

      res.json(result[0]);
    }
  );
});

app.get('/all', (req, res) => {
  db.query('SELECT * FROM packages ORDER BY id DESC', (err, result) => {

    if (err) {
      console.log(err);

      return res.status(500).json({
        error: err.message
      });
    }

    res.json(result);
  });
});

app.get('/stats', (req, res) => {
  db.query(`
    SELECT 
      COUNT(*) as total,
      SUM(status = 'Shipped') as shipped,
      SUM(status = 'In Transit') as in_transit,
      SUM(status = 'Delivered') as delivered
    FROM packages
  `, (err, result) => {
    if (err) {
      return res.status(500).json({
        error: "Server error"
      });
    }

    res.json(result[0]);
  });
});

app.post('/add', (req, res) => {
  const { tracking_id, status, location } = req.body;

  if (!tracking_id || !status) {
    return res.status(400).json({
      error: "tracking_id and status are required"
    });
  }

  db.query(
    'INSERT INTO packages (tracking_id, status, location) VALUES (?, ?, ?)',
    [tracking_id.toUpperCase(), status, location || ""],
    (err) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({
            error: "Tracking ID already exists"
          });
        }

        return res.status(500).json({
          error: "Insert failed"
        });
      }

      res.json({
        message: "Package added successfully",
        tracking_id
      });
    }
  );
});

app.post('/update', (req, res) => {
  const { tracking_id, status, location } = req.body;

  if (!tracking_id || !status) {
    return res.status(400).json({
      error: "tracking_id and status are required"
    });
  }

  const locationUpdate = location || getDefaultLocation(status);

  db.query(
    'UPDATE packages SET status = ?, location = ? WHERE UPPER(tracking_id) = UPPER(?)',
    [status, locationUpdate, tracking_id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Update failed"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Tracking ID not found"
        });
      }

      res.json({
        message: "Updated successfully"
      });
    }
  );
});

app.delete('/delete/:id', (req, res) => {
  db.query(
    'DELETE FROM packages WHERE id = ?',
    [req.params.id],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Delete failed"
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          error: "Package not found"
        });
      }

      res.json({
        message: "Deleted successfully"
      });
    }
  );
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({
      error: "Username and password required"
    });
  }

  db.query(
    'SELECT * FROM users WHERE username = ? AND password = ?',
    [username, password],
    (err, result) => {
      if (err) {
        console.log(err);

        return res.status(500).json({
          error: "Server error"
        });
      }

      if (result.length === 0) {
        return res.status(401).json({
          error: "Invalid credentials"
        });
      }

      res.json({
        message: "Login success",
        user: {
          id: result[0].id,
          username: result[0].username,
          role: result[0].role
        }
      });
    }
  );
});

app.get('/search', (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.json([]);
  }

  db.query(
    `SELECT * FROM packages 
     WHERE tracking_id LIKE ? 
     OR status LIKE ? 
     OR location LIKE ?
     ORDER BY id DESC`,
    [`%${q}%`, `%${q}%`, `%${q}%`],
    (err, result) => {
      if (err) {
        return res.status(500).json({
          error: "Search failed"
        });
      }

      res.json(result);
    }
  );
});

function getDefaultLocation(status) {
  const map = {
    "Shipped": "Warehouse - Chennai",
    "In Transit": "Distribution Hub - Mumbai",
    "Delivered": "Delivered to Customer"
  };

  return map[status] || "";
}

app.listen(process.env.PORT || 5000, () => {
  console.log(`🚀 Server running on port ${process.env.PORT || 5000}`);
});