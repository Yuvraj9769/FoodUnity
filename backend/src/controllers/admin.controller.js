const adminModel = require("../models/admin.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

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

module.exports = {
  checkIsAdminLogin,
};
