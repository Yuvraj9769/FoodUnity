const adminModel = require("../models/admin.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyAdmin = asyncHandler(async (req, res, next) => {
  const token =
    req?.cookies["admin-005-Login"] ||
    req?.header("Authorizatoin")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const decodedData = jwt.verify(token, process.env.ADMIN_SECRET_KEY);

  if (!decodedData) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const admin = await adminModel.findById(decodedData.id);

  if (!admin) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry please register first"));
  }

  if (!admin.isLogin) {
    admin.isLogin = true;
    await admin.save();
  }

  req.user = {
    id: admin._id,
    username: admin.username,
  };

  next();
});

module.exports = verifyAdmin;
