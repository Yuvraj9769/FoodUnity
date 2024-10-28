const adminModel = require("../models/admin.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");

const checkIsAdminLogin = asyncHandler(async (req, res) => {
  const admin = await adminModel.findById(req.user.id);

  if (!admin) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry please register first"));
  }

  if (admin.isLogin) {
    return res.status(200).json(new ApiResponse(200, null, "OK"));
  }
  return res.status(401).json(new ApiResponse(401, null, "Please login first"));
});

const registerAdmin = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  const existingAdmin = await adminModel.findOne({
    $or: [{ email }, { username }],
  });

  if (existingAdmin) {
    if (
      existingAdmin.fullName === fullName &&
      existingAdmin.email === email &&
      existingAdmin.username === username
    ) {
      return res
        .status(200)
        .json(new ApiResponse(200, null, "Admin already exists, please login"));
    }

    if (existingAdmin.username === username) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Username already exists"));
    }

    if (existingAdmin.email === email) {
      return res
        .status(400)
        .json(new ApiResponse(400, null, "Email already exists"));
    }
  }

  const newAdmin = await adminModel.create({
    fullName,
    email,
    username,
    password,
  });

  if (!newAdmin) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create admin"));
  }

  return res
    .status(201)
    .json(
      new ApiResponse(
        201,
        null,
        "Registration successful! Welcome to our community!"
      )
    );
});

const loginAdmin = asyncHandler(async (req, res) => {
  const { identifier, password } = req.body;

  if ([identifier, password].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  const admin = await adminModel
    .findOne({
      $or: [{ email: identifier }, { username: identifier }],
    })
    .select("-twoFACode -passwordResetToken -passwordResetExpires");

  if (!admin) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Please register first"));
  }

  const isMatch = await admin.verifyPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json(
        new ApiResponse(401, null, "Incorrect password. Please try again.")
      );
  }

  const adminDataToSend = {
    id: admin._id,
    username: admin.username,
    fullName: admin.fullName,
    email: admin.email,
  };

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  };

  const token = admin.generateAccessToken();

  if (!token) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Sorry internal error occured"));
  }

  res.cookie("admin-005-Login", token, options);

  return res
    .status(200)
    .json(new ApiResponse(200, adminDataToSend, "Login successfully"));
});

module.exports = {
  checkIsAdminLogin,
  registerAdmin,
  loginAdmin,
};
