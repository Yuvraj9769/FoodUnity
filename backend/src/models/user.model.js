const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const getISTTime = require("../utils/getISTTime");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    profilePic: {
      type: String, //cloudinary url
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    mobileNumber: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["donor", "recipient"],
      default: "recipient",
      required: true,
    },
    notifications: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notification",
    },
    pickupCoordinates: {
      type: {
        type: String,
        default: "Point",
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

// Create a 2dsphere index on pickupCoordinates
userSchema.index({ pickupCoordinates: "2dsphere" });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessTokenShortTime = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET_KEY, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
  });
};

userSchema.methods.generateAccessTokenLongTime = function () {
  return jwt.sign({ _id: this._id }, process.env.ACCESS_TOKEN_SECRET_KEY_LONG, {
    expiresIn: process.env.ACCESS_TOKEN_LONG_EXPIRY,
  });
};

userSchema.methods.generatePasswordResetToken = async function () {
  const user = this;

  if (!user.passwordResetToken) {
    const cryptoRandomStringModule = await import("crypto-random-string");
    const cryptoRandomString = cryptoRandomStringModule.default;

    user.passwordResetToken = cryptoRandomString({
      length: 64,
      type: "url-safe",
    });

    const currentISTTime = getISTTime();

    user.passwordResetExpires = new Date(
      currentISTTime.getTime() + 5 * 60 * 1000
    ); // for 5 minutes
    await user.save();
    return user.passwordResetToken;
  }
  return null;
};

module.exports = mongoose.model("user", userSchema);
