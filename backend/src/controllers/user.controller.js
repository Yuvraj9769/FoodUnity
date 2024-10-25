const userModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const sendMail = require("../utils/sendMail");
const sendPasswordResetMail = require("../utils/sendMail");
const axios = require("axios");
const moment = require("moment");

const generateAccessTokenForAllTime = async (id, rememberme) => {
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return null;
    }
    let accessToken;
    if (rememberme) {
      accessToken = user.generateAccessTokenLongTime();
    } else {
      accessToken = user.generateAccessTokenShortTime();
    }
    return accessToken;
  } catch (error) {
    return null;
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, fullName, password, mobNo, userType, location } =
    req.body;

  if (
    [username, email, fullName, password, userType].some(
      (field) => field.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  if (!mobNo) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Mobile number is required"));
  }

  if (!location) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Location is required"));
  }

  const existingUser = await userModel.findOne({
    $or: [{ username }, { email }],
  });

  if (existingUser) {
    if (
      existingUser.username === username &&
      existingUser.email === email &&
      existingUser.fullName === fullName
    ) {
      return res.status(409).json(new ApiResponse(409, null, "Please login"));
    } else if (existingUser.username === username) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Username already exists"));
    } else if (existingUser.email === email) {
      return res
        .status(409)
        .json(new ApiResponse(409, null, "Email already exists"));
    }
  }

  const user = await userModel.create({
    fullName,
    username,
    email,
    mobileNumber: mobNo,
    password,
    role: userType,
    pickupCoordinates: {
      type: "Point",
      coordinates: [location.latitude, location.longitude],
    },
  });

  const createdUser = await userModel
    .findById(user._id)
    .select("-password -passwordResetToken -passwordResetExpires");

  if (!createdUser) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Something went wrong"));
  }

  await sendMail(
    user?.email,
    "Registration Successful",
    "Hello",
    `<p>Hello, <b>${user?.fullName}</b></p>
     <p>Thank you for registering! Your account has been successfully created.</p>
     <p>If you have any questions or need assistance, feel free to contact us.</p>
     <p>Best Regards,</p>
     <b>Food Unity.</b>`
  );

  res
    .status(201)
    .json(new ApiResponse(201, user, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const {
    email = "email",
    username = "username",
    password,
    rememberme = false,
  } = req.body;

  if (
    [email, username, password].some((field) => !field || field.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  const user = await userModel.findOne({
    $or: [{ email }, { username }],
  });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "Please register"));
  }

  const isMatch = await user.verifyPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "Incorrect password"));
  }

  const accessToken = await generateAccessTokenForAllTime(user._id, rememberme);

  if (rememberme) {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
    };
    res.cookie("auth_005_Login-l", accessToken, options);
  } else {
    const options = {
      httpOnly: true,
      secure: true,
      sameSite: "Lax",
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day from now
    };
    res.cookie("auth_005_Login-s", accessToken, options);
  }

  if (user.role === "donor") {
    return res
      .status(200)
      .json(new ApiResponse(200, user.role, "Login Successfully"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user.role, "Login Successfully"));
});

const userData = asyncHandler(async (req, res) => {
  const user = await userModel
    .findById(req.user._id)
    .select("-password -passwordResetToken -passwordResetExpires");
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  return res.status(200).json(new ApiResponse(200, user, "Ok"));
});

const sendForgetPasswordMail = asyncHandler(async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Please register first"));
  }

  if (user?.passwordResetToken) {
    if (user.passwordResetExpires >= Date.now()) {
      return res
        .status(409)
        .json(
          new ApiResponse(409, null, "Password reset request already sent")
        );
    }
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
  }

  const token = await user.generatePasswordResetToken();

  if (!token) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return res.status(500).json(new ApiResponse(500, null, "Please try later"));
  }

  const url = `${process.env.FRONTEND_SERVER}reset-password/${token}`;

  await sendPasswordResetMail(
    user?.email,
    "Password Reset Confirmation",
    "Hello ",
    `<p>Hello, <b>${user?.fullName}</b></p>
    <p>Your password reset request is pending. It will expire in 5 minutes. Please click the button below to proceed:</p>
      <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
       <p>If you did not request this, please ignore this email.</p>`
  );

  return res.status(200).json(new ApiResponse(200, null, "Email sent "));
});

const checkTokenExipry = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json(new ApiResponse(400, null, "Unauthorized"));
  }

  const userWithToken = await userModel.findOne({ passwordResetToken: token });

  if (!userWithToken) {
    return res
      .status(410)
      .json(
        new ApiResponse(
          410,
          null,
          "The password reset link is either invalid or has already been used."
        )
      );
  }

  if (moment(userWithToken.passwordResetExpires).isSameOrAfter(moment())) {
    return res.status(200).json(new ApiResponse(200, null, "Ok"));
  }

  userWithToken.passwordResetToken = undefined;
  userWithToken.passwordResetExpires = undefined;
  await userWithToken.save();
  return res.status(401).json(new ApiResponse(401, null, "Link expired"));
});

const resetPassword = asyncHandler(async (req, res) => {
  const { username, newPassword, token } = req.body;

  if (!token) {
    return res.status(400).json(new ApiResponse(400, null, "Unauthorized"));
  }

  const user = await userModel.findOne({ username });
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  if (moment(user.passwordResetExpires).isBefore(moment())) {
    return res.status(401).json(new ApiResponse(401, null, "Link expired"));
  }

  user.password = newPassword;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  await sendPasswordResetMail(
    user?.email,
    "Password Reset Successful",
    "Hello ",
    `<p>Hello, <b>${user?.fullName}</b></p>
    <p>Your password has been successfully reset. If you did not initiate this action, please contact us immediately at ${process.env.USER}.</p>`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully."));
});

const logoutUser = asyncHandler(async (req, res) => {
  const { _id, rememberme } = req.user;

  if (!_id) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const user = await userModel.findById(_id);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const options = {
    httpOnly: true,
    secure: true,
    sameSite: "Lax",
  };

  if (rememberme) {
    res.clearCookie("auth_005_Login-l", options);
  } else {
    res.clearCookie("auth_005_Login-s", options);
  }
  return res.status(200).json(new ApiResponse(200, null, "Logged out"));
});

const updateProfilePic = asyncHandler(async (req, res) => {
  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }
  const response = await uploadOnCloudinary(req.file.path);
  if (!response) {
    return res.status(500).json(new ApiResponse(500, null, "Please try later"));
  }
  user.profilePic = response.secure_url;
  await user.save();
  return res
    .status(200)
    .json(new ApiResponse(200, null, "Profile pic updated"));
});

const updateProfile = asyncHandler(async (req, res) => {
  const { username, email, fullName, mobNo } = req.body;

  if ([username, email, fullName].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  if (!mobNo) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Mobile number is required"));
  }

  const user = await userModel
    .findByIdAndUpdate(
      req.user._id,
      {
        $set: {
          fullName,
          username,
          email,
          mobileNumber: mobNo,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .select("-password -passwordResetToken -passwordResetExpires");

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  return res.status(200).json(new ApiResponse(200, user, "Profile updated"));
});

const getUserLocation = asyncHandler(async (req, res) => {
  const { lat, long } = req.body;

  if (!lat || !long) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Latitude and Longitude are required"));
  }

  let userLocationData = null;

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${long}&key=${process.env.MAP_API_KEY}`
    );

    const components = response.data.results[0].components;
    const city =
      components.suburb ||
      components.city ||
      components.town ||
      components.village ||
      "City not found";

    userLocationData = city;
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          error?.message || "Sorry something went wrong"
        )
      );
  }

  if (!userLocationData || userLocationData === "City not found")
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry location not found"));

  const user = await userModel.findById(req.user._id);

  if (user.pickupCoordinates.coordinates.length === 0) {
    user.pickupCoordinates.coordinates = [lat, long];

    await user.save({ validateBeforeSave: false });
  }

  return res.status(200).json(new ApiResponse(200, userLocationData));
});

const getUserLocationWhileRegister = asyncHandler(async (req, res) => {
  const { latitude, longitude } = req.body;

  if (!latitude || !longitude) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Latitude and Longitude are required"));
  }

  let userLocationData = null;

  try {
    const response = await axios.get(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=${process.env.MAP_API_KEY}`
    );

    const components = response.data.results[0].components;
    const city =
      components.suburb ||
      components.city ||
      components.town ||
      components.village ||
      "City not found";

    userLocationData = city;
  } catch (error) {
    return res
      .status(500)
      .json(
        new ApiResponse(
          500,
          null,
          error?.message || "Sorry something went wrong"
        )
      );
  }

  if (!userLocationData || userLocationData === "City not found")
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry location not found"));

  return res.status(200).json(new ApiResponse(200, userLocationData));
});

const checkIsLogin = asyncHandler(async (req, res) => {
  if (!req.user) {
    return res
      .status(401)
      .json(new ApiResponse(401, null, "You are not logged in"));
  }

  return res.status(200).json(new ApiResponse(200, null, "Logged In"));
});

const ChangePassword = asyncHandler(async (req, res) => {
  const { username, oldPassword, newPassword } = req.body;

  if (
    [username, oldPassword, newPassword].some((field) => field.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All Fields Required"));
  }

  const user = await userModel.findOne({ username });

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const match = await user.verifyPassword(oldPassword);

  if (!match) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Old Password is incorrect"));
  }

  user.password = newPassword;
  await user.save();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

module.exports = {
  registerUser,
  loginUser,
  userData,
  checkTokenExipry,
  sendForgetPasswordMail,
  resetPassword,
  logoutUser,
  updateProfilePic,
  updateProfile,
  getUserLocation,
  checkIsLogin,
  ChangePassword,
  getUserLocationWhileRegister,
};
