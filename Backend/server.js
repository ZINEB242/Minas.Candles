require("dotenv").config();

const dns = require("dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const express = require("express");
const mongoose = require("mongoose");
const Order = require("./models/Order");
const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.send("Minas Candles Backend fonctionne 🕯️");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connecté ✅");
  })
  .catch((error) => {
    console.error("Erreur MongoDB ❌ :", error.message);
  });

app.post("/api/orders", async (req, res) => {
  try {
    const order = new Order(req.body);

    const savedOrder = await order.save();

    console.log("Commande enregistrée :", savedOrder);

    res.status(201).json({
      success: true,
      message: "Commande enregistrée avec succès 🕯️",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Erreur lors de l'enregistrement ❌ :", error.message);

    res.status(400).json({
      success: false,
      message: "Impossible d'enregistrer la commande",
      error: error.message,
    });
  }
});

app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});