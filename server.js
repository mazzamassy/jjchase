const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Connessione al DB PostgreSQL su Render
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false }
});

// ✅ Crea la tabella se non esiste (una sola volta)
pool.query(`
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    password TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  )
`)
.then(() => console.log("✅ Tabella 'users' pronta."))
.catch(err => console.error("❌ Errore creazione tabella:", err));

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Salvataggio dei dati dal form
app.post("/submit", async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (email, phone, password) VALUES ($1, $2, $3)",
      [email, phone, password]
    );
    res.status(200).send("✅ Dati salvati nel database.");
  } catch (err) {
    console.error("❌ Errore salvataggio dati:", err);
    res.status(500).send("Errore nel database.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server attivo sulla porta ${PORT}`);
});
