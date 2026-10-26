
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // Compte client associé à la commande
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    name: {
      type: String,
      required: true,
    },

    fragrance: {
      type: String,
      required: true,
    },

    color: {
      type: String,
      required: true,
    },

    message: {
      type: String,
      default: "",
    },

    photo: {
      type: String,
      default: "",
    },

    phone: {
      type: String,
      required: true,
    },

    address: {
      type: String,
      required: true,
    },

    orderType: {
      type: String,
      required: true,
    },

    status: {
      type: String,
      enum: [
        "En attente",
        "Confirmée",
        "En préparation",
        "Expédiée",
        "Livrée",
        "Annulée",
      ],
      default: "En attente",
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
