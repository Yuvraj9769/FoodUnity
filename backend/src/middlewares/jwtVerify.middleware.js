const jwt = require("jsonwebtoken");
const asyncHandler = require("../utils/asyncHandler");
const ApiResponse = require("../utils/ApiResponse");
const userModel = require("../models/user.model");

const verifyJwt = asyncHandler(async (req, res, next) => {
  let token = null;
  let decoded = null;
  let rememberme = false;

  if (
    req?.cookies["auth_005_Login-s"] ||
    req?.header("Authorizatoin")?.replace("Bearer ", "")
  ) {
    token =
      req?.cookies["auth_005_Login-s"] ||
      req?.header("Authorizatoin")?.replace("Bearer ", "");
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY);
  } else if (req?.cookies["auth_005_Login-l"]) {
    rememberme = true;
    token = req?.cookies["auth_005_Login-l"];
    decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY_LONG);
  }

  console.log("Token = ", token);

  if (!token) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Please login first"));
  }

  const user = await userModel.findById(decoded?._id);

  if (!user) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please register first"));
  }

  req.user = {
    _id: user._id,
    username: user.username,
    rememberme,
  };

  next();
});

module.exports = verifyJwt;
