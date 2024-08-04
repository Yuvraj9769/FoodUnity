const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
  {
    unameOfRecipient: {
      type: String,
      required: true,
    },
    foodId: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("notification", notificationSchema);
