const adminModel = require("../models/admin.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const bcrypt = require("bcryptjs");
const moment = require("moment");
const sendPasswordResetMail = require("../utils/sendMail");
const sendMail = require("../utils/sendMail");
const userModel = require("../models/user.model");
const requestModel = require("../models/request.model");
const foodModel = require("../models/food.model");

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

  await sendMail(
    newAdmin?.email,
    "Registration Successful",
    "Hello",
    `<p>Hello, <b>${newAdmin?.fullName}</b></p>
     <p>Thank you for registering! Your account has been successfully created.</p>
     <p>If you have any questions or need assistance, feel free to contact us.</p>
     <p>Best Regards,</p>
     <b>Food Unity.</b>`
  );

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

const resetPasswordSendMail = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide email"));
  }

  const admin = await adminModel.findOne({
    email,
  });

  if (!admin) {
    return res.status(404).json(new ApiResponse(404, null, "Admin not found"));
  }

  if (
    admin?.passwordResetToken &&
    moment(admin?.passwordResetExpires).isSameOrAfter(moment())
  ) {
    return res
      .status(409)
      .json(new ApiResponse(409, null, "Password reset token is alredy sent"));
  }

  const passwordResetToken = await admin.generatePasswordResetToken();

  if (!passwordResetToken) {
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();
    return res.status(500).json(new ApiResponse(500, null, "Please try later"));
  }

  const url = `${process.env.FRONTEND_SERVER}admin-reset-password/${passwordResetToken}`;

  await sendPasswordResetMail(
    admin?.email,
    "Password Reset Confirmation",
    "Hello ",
    `<p>Hello, <b>${admin?.fullName}</b></p>
    <p>Your password reset request is pending. It will expire in 15 minutes. Please click the button below to proceed:</p>
      <a href="${url}" target="_blank" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
       <p>If you did not request this, please ignore this email.</p>`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Email sent, please check your email"));
});

const checkAdminTokenExipry = asyncHandler(async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide token"));
  }

  const admin = await adminModel.findOne({ passwordResetToken: token });

  if (!admin) {
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

  if (moment(admin.passwordResetExpires).isSameOrBefore(moment())) {
    admin.passwordResetToken = undefined;
    admin.passwordResetExpires = undefined;
    await admin.save();
    return res.status(401).json(new ApiResponse(401, null, "Link expired"));
  }

  return res.status(200).json(new ApiResponse(200, null, "Ok"));
});

const resetAdminPassword = asyncHandler(async (req, res) => {
  const { password, confPassword, token } = req.body;

  if (password !== confPassword) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Passwords do not match"));
  }

  if (!token) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide token"));
  }

  const admin = await adminModel.findOne({
    passwordResetToken: token,
  });

  if (!admin) {
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

  if (moment(admin.passwordResetExpires).isSameOrBefore(moment())) {
    return res.status(401).json(new ApiResponse(401, null, "Link expired"));
  }

  admin.password = password;
  admin.passwordResetToken = undefined;
  admin.passwordResetExpires = undefined;
  await admin.save();

  await sendPasswordResetMail(
    admin?.email,
    "Password Updated",
    "Hello ",
    `<p>Hello, <b>${admin?.fullName}</b></p>
    <p>Your password is updated successfully!.</p>
    <p>If you have already updated your password successfully, please ignore this email. If you did not perform this action, please contact us at FoodUnity.</p>
`
  );

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password reset successfully"));
});

const getAllUserForAdmin = asyncHandler(async (req, res) => {
  const users = await userModel
    .find()
    .select(
      "-password -notifications -pickupCoordinates -passwordResetToken -passwordResetExpires -locationCoordinates"
    );

  if (users.length === 0 || !users) {
    return res.status(404).json(new ApiResponse(404, null, "No users found"));
  }

  return res.status(200).json(new ApiResponse(200, users, "OK"));
});

const deleteUserAsAdminPrevilage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "User ID is required"));
  }

  await requestModel.deleteMany({
    $or: [{ requesterId: id }, { donorId: id }],
  });

  await foodModel.deleteMany({
    userId: id,
  });

  const delUser = await userModel.findByIdAndDelete(id);
  if (!delUser) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const remainingUsers = await userModel.find();

  if (!remainingUsers) {
    return res
      .status(404)
      .json(
        new ApiResponse(
          404,
          null,
          "User Deleted Successfully, new users not found"
        )
      );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, remainingUsers, "User Deleted Successfully"));
});

const updateUserDataAsAdminPrivilage = asyncHandler(async (req, res) => {
  const { email, fullName, mobileNumber, role, username } = req.body;

  if (
    [email, fullName, mobileNumber, role, username].some(
      (field) => field.trim() === ""
    )
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
  }

  const userWithExistingUsernameOrEmail = await userModel.find({
    $or: [{ username }, { email }],
  });

  if (userWithExistingUsernameOrEmail.length > 1) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Username or email already exists"));
  }

  const user = await userModel
    .findOneAndUpdate(
      {
        $or: [{ email }, { username }],
      },
      {
        $set: {
          email,
          fullName,
          mobileNumber,
          role,
          username,
        },
      },
      {
        new: true,
        runValidators: true,
      }
    )
    .select(
      "-password -notifications -pickupCoordinates -passwordResetToken -passwordResetExpires -locationCoordinates"
    );

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User Not Found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User updated successfully"));
});

const getAllFoodPostsForAdmin = asyncHandler(async (req, res) => {
  const foods = await foodModel.find({
    isDelete: false,
  });

  if (!foods) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No food posts found"));
  }

  res.status(200).json(new ApiResponse(200, foods, "Food Posts Fetched"));
});

const getSearchedPost = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Search query is required"));
  }

  const foodPosts = await foodModel.find({
    $or: [
      { foodTitle: { $regex: searchQuery, $options: "i" } },
      {
        foodType: { $regex: `^${searchQuery}$`, $options: "i" },
      },
    ],
  });

  if (foodPosts.length === 0 || !foodPosts) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No food posts found"));
  }

  return res.status(200).json(new ApiResponse(200, foodPosts, "OK"));
});

const deletePostAsAdminPrevilage = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiResponse(400, null, "ID is required"));
  }

  const deletePost = await foodModel.findByIdAndDelete(id);

  if (!deletePost) {
    return res.status(404).json(new ApiResponse(404, null, "No post found"));
  }

  await requestModel.findOneAndDelete({
    foodId: id,
  });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const searchUserForAdmin = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;
  if (!searchQuery) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Search query is required"));
  }

  const user = await userModel
    .find({
      $or: [
        { username: { $regex: searchQuery, $options: "i" } },
        { email: { $regex: searchQuery, $options: "i" } },
      ],
    })
    .select(
      "-password -notifications -pickupCoordinates -passwordResetToken -passwordResetExpires -locationCoordinates"
    );

  if (user.length === 0 || !user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  return res.status(200).json(new ApiResponse(200, user, "OK"));
});

const getAllDonorAndRecipients = asyncHandler(async (_, res) => {
  const donor = await userModel.countDocuments({ role: "donor" });
  const recipient = await userModel.countDocuments({ role: "recipient" });

  if (donor.length === 0 && recipient.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No users found"));
  }

  const users = [
    {
      donorsCount: donor,
    },
    {
      recipientsCount: recipient,
    },
  ];

  return res.status(200).json(new ApiResponse(200, users, "OK"));
});

module.exports = {
  checkIsAdminLogin,
  registerAdmin,
  loginAdmin,
  resetPasswordSendMail,
  checkAdminTokenExipry,
  resetAdminPassword,
  getAllUserForAdmin,
  deleteUserAsAdminPrevilage,
  updateUserDataAsAdminPrivilage,
  getAllFoodPostsForAdmin,
  getSearchedPost,
  deletePostAsAdminPrevilage,
  searchUserForAdmin,
  getAllDonorAndRecipients,
};
