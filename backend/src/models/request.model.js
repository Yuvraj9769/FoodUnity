const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema(
  {
    foodId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "food",
      required: true,
    },
    requesterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    donorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
    },
    status: {
      type: String,
      enum: [
        "request",
        "approved",
        "requested",
        "rejected",
        "received",
        "OTP Expired",
      ],
      default: "request",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Request", requestSchema);
