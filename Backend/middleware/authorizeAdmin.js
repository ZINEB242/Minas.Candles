
const User = require("../models/User");

async function authorizeAdmin(req, res, next) {
  try {
    const user = await User.findById(req.userId).select("role");

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Utilisateur introuvable.",
      });
    }

    if (user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Accès réservé à l'administrateur.",
      });
    }

    next();
  } catch (error) {
    console.error("Erreur de vérification admin :", error);

    return res.status(500).json({
      success: false,
      message: "Erreur lors de la vérification des autorisations.",
    });
  }
}

module.exports = authorizeAdmin;
