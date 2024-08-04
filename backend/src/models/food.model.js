const mongoose = require("mongoose");

const foodSchema = new mongoose.Schema(
  {
    foodTitle: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
    foodType: {
      type: String,
      enum: ["vegetarian", "non-vegetarian"],
      required: true,
    },
    expiryTime: {
      type: String,
      required: true,
    },
    pickupLocation: {
      type: {},
      required: true,
    },
    foodImage: {
      type: String,
      required: true,
    },
    pickupTime: {
      type: String,
      required: true,
    },
    contactName: {
      type: String,
      required: true,
    },
    contactNumber: {
      type: String,
      required: true,
    },
    pickupOptions: {
      type: String,
      enum: ["pickup", "delivery"],
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    status: {
      type: String,
      default: "Pending",
    },
    verifyOTP: {
      type: Number,
    },
    OTPExpiryTime: {
      type: Date,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("food", foodSchema);
