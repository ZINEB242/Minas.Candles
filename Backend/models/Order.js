const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
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
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;