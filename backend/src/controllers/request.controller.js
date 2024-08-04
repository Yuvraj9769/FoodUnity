const foodModel = require("../models/food.model");
const requestModel = require("../models/request.model");
const userModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendMail = require("../utils/sendMail");
const otpGenerator = require("otp-generator");

const moment = require("moment");

const sendOrderMailRequest = asyncHandler(async (req, res) => {
  const { id } = req.body;

  const foodPost = await foodModel.findById(id).populate({
    path: "userId",
    select:
      "-password -profilePic -role -passwordResetToken -passwordResetExpires -fullName",
  });

  if (!foodPost) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry food post not found"));
  }

  const existingRequest = await requestModel.findOne({
    foodId: id,
    requesterId: req.user._id,
  });

  if (existingRequest) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Request already exists"));
  }

  const newRequest = await requestModel.create({
    foodId: id,
    requesterId: req.user._id,
    donorId: foodPost.userId,
    status: "requested",
  });

  const loginLink = `${process.env.FRONTEND_SERVER}foods/notifications/${req.user._id}/${foodPost._id}`;

  await sendMail(
    foodPost.userId.email,
    "Request Received Notification",
    "Hello ",
    `<p>Hello <b>${foodPost.userId.username}</b> </p>
      <p>You have received a request from a recipient.</p>
  <p>Please log in to your account to view details and respond accordingly.</p>
  <p><a href="${loginLink}" style="background-color: #007bff; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Check here</a></p>
  <p>Best regards,</p>
  <p><b>Food Unity Team</b></p>`
  );

  if (!newRequest) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Request not created"));
  }

  return res.status(200).json(new ApiResponse(200, null, "Request sent"));
});

const showNotifications = asyncHandler(async (req, res) => {
  const { uid, fid } = req.params;
  const user = await userModel.findById(uid);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const foodItem = await foodModel.findById(fid);

  if (!foodItem) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Food Item not found"));
  }

  // const notification = await notificationModel.create({
  //   unameOfRecipient: user.username,
  //   foodId: foodItem._id,
  //   date: Date.now(),
  // });

  // if (!notification) {
  //   return res.status(500).json(new ApiResponse(500, null, "Error Occured"));
  // }

  // user.notifications = notification._id;
  // await user.save();

  const reqData = await requestModel.findOne({ foodId: fid, requesterId: uid });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: foodItem._id,
        foodImage: foodItem.foodImage,
        foodTitle: foodItem.foodTitle,
        foodDescription: foodItem.description,
        uname: user.username,
        requestCreateAt: reqData.createdAt,
        email: user.email,
      },
      "Notification"
    )
  );
});

const getDonorsAllNotifications = asyncHandler(async (req, res) => {
  const { _id } = req.user;

  if (!_id) {
    return res.status(401).json(new ApiResponse(401, null, "Unauthorized"));
  }

  const notificationPosts = await requestModel
    .find({
      donorId: _id,
      status: "requested",
    })
    .populate({
      path: "foodId",
      select:
        "-quantity -pickupLocation -pickupTime -contactName -contactNumber -pickupOptions -userId -status",
    })
    .select("-donorId -requesterId -status -updatedAt")
    .populate({
      path: "requesterId",
      select: "username email -_id",
    });

  if (!notificationPosts) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No Notifications Found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, notificationPosts, "All Notifications"));
});

const sendRequestResponseMail = asyncHandler(async (req, res) => {
  const { recipientEmail, reqStatus, foodId } = req.body;
  const { username } = req.user;

  if (
    [recipientEmail, reqStatus, foodId].some((field) => field.trim() === "")
  ) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid Request"));
  }

  const recipient = await userModel.findOne({
    email: recipientEmail,
  });

  if (!recipient) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Recipient Not Found"));
  }

  const foodData = await foodModel.findById(foodId);

  if (!foodData) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Food Post Not Found"));
  }

  const foodOTPExpiryTime = moment(foodData.expiryTime).format(
    "MMMM D, YYYY hh:mm:ss A"
  );

  if (moment(foodData.expiryTime).isBefore(moment())) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Food Post has been expired"));
  }

  const requestData = await requestModel
    .findOne({
      requesterId: recipient._id,
      foodId,
    })
    .populate("donorId");

  if (!requestData) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Request Not Found"));
  }

  const reqFinalStatus = reqStatus === "Accept" ? "approved" : "rejected";

  requestData.status = reqFinalStatus;
  await requestData.save();

  if (reqFinalStatus === "approved") {
    const otp = otpGenerator.generate(6, {
      digits: true,
      lowerCaseAlphabets: false,
      upperCaseAlphabets: false,
      specialChars: false,
    });

    foodData.verifyOTP = otp;

    await foodData.save({
      validateBeforeSave: false,
    });

    await sendMail(
      recipientEmail,
      `Request ${reqStatus} Notification`,
      "Hello",
      `<p>Hello <b>${recipient.username}</b>,</p>
      <p>We wanted to inform you that your food request has been <b>${reqStatus.toLowerCase()}</b> by donor <b>${username}.</b></p>
      <p>Your OTP for verification is: <b>${otp}</b></p>
      <p><strong>⚠️ Important Notice:</strong> Your OTP is valid until <span style="color: #e60000; font-weight: bold;">${foodOTPExpiryTime}</span>. <br/> Please use it before this time to ensure it's accepted.</p>
      <p>You can view the location of the donor using the following link: <a href="https://www.google.com/maps?q=${
        requestData.donorId.locationCoordinates.lat
      },${
        requestData.donorId.locationCoordinates.long
      }" target="_blank">View Location</a></p>
      <p>Thank you for being a part of Food Unity.</p>
      <p>Explore more food posts and stay connected with Food Unity!</p>
      <p>Best regards,</p>
      <p><b>Food Unity Team.</b></p>`
    );
  } else {
    await sendMail(
      recipientEmail,
      `Request ${reqStatus} Notification`,
      "Hello",
      `<p>Hello <b>${recipient.username}</b>,</p>
         <p>We wanted to inform you that your food request has been <b>${reqStatus.toLowerCase()}</b> by donor <b>${username}.</b></p>
         <p>Explore more food posts and stay connected with Food Unity!</p>
         <p>Thank you for being a part of Food Unity.</p>
         <p>Best regards,</p>
         <p><b>Food Unity Team.</b></p>`
    );
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Request Status Update"));
});

module.exports = {
  sendOrderMailRequest,
  showNotifications,
  getDonorsAllNotifications,
  sendRequestResponseMail,
};
