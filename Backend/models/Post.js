
const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    content: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },

    type: {
      type: String,
      enum: ["photo", "atelier", "evenement", "produit", "general"],
      default: "general",
    },

   image: {
  type: String,
  default: "",
},

images: {
  type: [String],
  default: [],
},

    title: {
      type: String,
      default: "",
    },

status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},

    product: {
      name: { type: String, default: "" },
      price: { type: Number, default: 0 },
    },

   
likedBy: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
comments: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 1000,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
],

    shares: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);
