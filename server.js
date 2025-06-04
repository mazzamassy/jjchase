const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const { Pool } = require("pg");

const app = express();
const PORT = process.env.PORT || 3000;

// Configura connessione al database PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: 5432,
  ssl: { rejectUnauthorized: false } // Necessario per Render
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Salvataggio dei dati ricevuti dal form nel DB
app.post("/submit", async (req, res) => {
  const { email, phone, password } = req.body;

  try {
    await pool.query(
      "INSERT INTO users (email, phone, password) VALUES ($1, $2, $3)",
      [email, phone, password]
    );
    res.status(200).send("Dati salvati nel database.");
  } catch (err) {
    console.error("❌ Errore nel salvataggio:", err);
    res.status(500).send("Errore nel database.");
  }
});

app.listen(PORT, () => {
  console.log(`✅ Server attivo sulla porta ${PORT}`);
});
