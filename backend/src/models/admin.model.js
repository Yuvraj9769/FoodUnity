const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const AdminSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
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
    },
    twoFACode: {
      type: Number,
    },
    password: {
      type: String,
      required: true,
    },
    passwordResetToken: String,
    passwordResetExpires: Date,
  },
  { timestamps: true }
);

AdminSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  try {
    this.password = await bcrypt.hash(this.password, 10);
  } catch (error) {
    return next(error);
  }
});

AdminSchema.methods.verifyPassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

AdminSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      id: this._id,
      username: this.username,
    },
    process.env.ADMIN_SECRET_KEY,
    {
      expiresIn: "7d",
    }
  );
};

AdminSchema.methods.generatePasswordResetToken = async function () {
  if (this.passwordResetToken) {
    return this.passwordResetToken;
  }

  const cryptoRandomStringModule = await import("crypto-random-string");
  const cryptoRandomString = cryptoRandomStringModule.default;

  this.passwordResetToken = cryptoRandomString({
    length: 64,
    type: "url-safe",
  });

  this.passwordResetExpires = Date.now() + 15 * 60 * 1000; // for 15 minutes
  await this.save();
  return this.passwordResetToken;
};

module.exports = mongoose.model("admin", AdminSchema);
