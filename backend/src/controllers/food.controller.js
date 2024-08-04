const foodModel = require("../models/food.model");
const requestModel = require("../models/request.model");
const userModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const { uploadOnCloudinary } = require("../utils/cloudinary");
const sendMail = require("../utils/sendMail");
const moment = require("moment");

const createPost = asyncHandler(async (req, res) => {
  const {
    foodTitle,
    description = "",
    quantity,
    foodType,
    expiryTime,
    pickupLocation,
    pickupTime,
    contactName,
    contactNumber,
    pickupOptions,
  } = req.body;

  if (
    [
      foodTitle,
      foodType,
      expiryTime,
      pickupLocation,
      pickupTime,
      contactName,
      pickupOptions,
    ].some((field) => field.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please fill all the fields"));
  }

  const localFilePath = req?.file?.path;

  if (!localFilePath) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Image is required"));
  }

  const cloudinaryResonse = await uploadOnCloudinary(localFilePath);

  if (!cloudinaryResonse) {
    return res
      .status(500)
      .json(
        new ApiResponse(500, null, "Error in uploading image please try later.")
      );
  }

  const foodPost = await foodModel.create({
    foodTitle,
    description,
    quantity,
    foodType,
    expiryTime,
    pickupLocation,
    pickupTime,
    contactName,
    contactNumber,
    pickupOptions,
    foodImage: cloudinaryResonse.secure_url,
  });

  const createdFoodPost = await foodModel.findById(foodPost._id);

  if (!createdFoodPost) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create food post"));
  }

  createdFoodPost.userId = req.user._id;
  await createdFoodPost.save();

  res
    .status(201)
    .json(new ApiResponse(201, foodPost, "Food post created successfully"));
});

//updation remaining (can add pagination other done) in follow: -
const getDonorsAllPosts = asyncHandler(async (req, res) => {
  const foodPosts = await foodModel.find({ userId: req.user._id });

  if (!foodPosts) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No food posts found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, foodPosts, "Post fetched successfully"));
});

const getAllFoodPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const foods = await foodModel.find();

  if (!foods) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No food posts found"));
  }

  const requests = await requestModel.find({ requesterId: userId });

  const requestStatusMap = {};

  requests.forEach((request) => {
    requestStatusMap[request.foodId.toString()] = request.status;
  });

  const foodsWithStatus = foods
    .map((food) => {
      const requestStatus = requestStatusMap[food._id.toString()] || "request";
      return {
        food,
        requestStatus,
      };
    })
    .filter(
      ({ requestStatus }) =>
        requestStatus != "OTP Expired" && requestStatus != "approved"
    );

  res
    .status(200)
    .json(new ApiResponse(200, foodsWithStatus, "Food Posts Fetched"));
});

const verifyUserOTP = asyncHandler(async (req, res) => {
  const { otp, donorUsername } = req.body;

  if (!otp) {
    return res.status(400).json(new ApiResponse(400, null, "OTP is required"));
  }
  if (!donorUsername || donorUsername.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Donor Username is required"));
  }

  const foodData = await foodModel.findOne({
    verifyOTP: otp,
    userId: req.user._id,
  });

  if (!foodData) {
    return res.status(404).json(new ApiResponse(404, null, "Invalid OTP"));
  }

  const reqData = await requestModel.findOne({
    foodId: foodData._id,
  });

  if (!reqData) {
    return res.status(404).json(new ApiResponse(404, null, "No request found"));
  }

  const currTime = moment();
  const foodOTPExpiryTime = moment(foodData.expiryTime);

  if (currTime.isAfter(foodOTPExpiryTime)) {
    foodData.verifyOTP = undefined;
    await foodData.save({
      validateBeforeSave: false,
    });
    if (reqData.status !== "OTP Expired") {
      reqData.status = "OTP Expired";
      await reqData.save({
        validateBeforeSave: false,
      });
    }
    return res.status(404).json(new ApiResponse(404, null, "OTP Expired"));
  }

  const user = await userModel
    .findById(reqData.requesterId)
    .select("username email fullName -_id");

  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Recipient not found"));
  }

  await sendMail(
    user.email,
    "Food Received Notification",
    "Hello",
    ` <h3>Food Received Notification</h3>
        <p>Hello <strong>${user.fullName}</strong>,</p>
        <p>You have received food from <strong>${donorUsername}</strong>. Here are the details:</p>
        <ul>
            <li>Food Item: <strong>${foodData.foodTitle}</strong></li>
            <li>Donor: <strong>${donorUsername}</strong></li>
        </ul>
         <p>Best regards,</p>
         <p><b>Food Unity Team</b></p>
        `
  );

  foodData.status = "approved";
  foodData.verifyOTP = undefined;
  await foodData.save({
    validateBeforeSave: false,
  });

  return res.status(200).json(new ApiResponse(200, user, "OTP Verified"));
});

module.exports = {
  createPost,
  getDonorsAllPosts,
  getAllFoodPosts,
  verifyUserOTP,
};
