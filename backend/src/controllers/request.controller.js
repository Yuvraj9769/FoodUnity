const foodModel = require("../models/food.model");
const requestModel = require("../models/request.model");
const userModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendMail = require("../utils/sendMail");
const otpGenerator = require("otp-generator");
const moment2 = require("moment-timezone");
const moment = require("moment");
const getISTTime = require("../utils/getISTTime");

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

  if (moment(foodPost.expiryTime).isBefore(moment())) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Food Post has been expired"));
  }

  const newRequest = await requestModel.create({
    foodId: id,
    requesterId: req.user._id,
    donorId: foodPost.userId,
    status: "requested",
  });

  if (!newRequest) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Request not created"));
  }

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

  const reqData = await requestModel.findOne({ foodId: fid, requesterId: uid });

  if (!reqData) {
    return res.status(404).json(new ApiResponse(404, null, "No request found"));
  }

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        _id: foodItem._id,
        foodImage: foodItem.foodImage,
        foodTitle: foodItem.foodTitle,
        foodDescription: foodItem.description,
        uname: user.username,
        pickupOptions: foodItem.pickupOptions,
        pickupLocation: foodItem.pickupLocation,
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
        "-quantity -pickupTime -contactName -contactNumber -userId -status",
    })
    .select("-donorId -requesterId -updatedAt")
    .populate({
      path: "requesterId",
      select: "username email -_id",
    });

  if (notificationPosts.length === 0) {
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

  const formattedTime = moment2
    .utc(foodData.expiryTime) // Keep it in UTC
    .format("dddd, MMMM D, YYYY hh:mm:ss A"); // Format with "UTC" label

  const currentISTTime = getISTTime();

  if (foodData.expiryTime <= currentISTTime) {
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

  if (foodData.status === "approved") {
    requestData.status = "rejected";
    await requestData.save();

    await sendMail(
      recipientEmail,
      `Request Rejected Notification`,
      "Hello",
      `<p>Hello <b>${recipient.username}</b>,</p>
         <p>We wanted to inform you that your food request has been <b>${"Rejected".toLowerCase()}</b> by donor <b>${username}.</b></p>
         <p>Unfortunately, the food post you requested has already been approved for another recipient.</p>
         <p>Explore more food posts and stay connected with Food Unity!</p>
         <p>Thank you for being a part of Food Unity.</p>
         <p>Best regards,</p>
         <p><b>Food Unity Team.</b></p>`
    );

    return res
      .status(400)
      .json(
        new ApiResponse(
          400,
          null,
          "The post has already been approved for another recipient."
        )
      );
  }

  const reqFinalStatus = reqStatus === "Accept" ? "approved" : "rejected";

  requestData.status = reqFinalStatus;
  await requestData.save();

  foodData.status = reqFinalStatus;
  await foodData.save({
    validateBeforeSave: false,
  });

  const notificationPosts = await requestModel
    .find()
    .populate({
      path: "foodId",
      select:
        "-quantity -pickupTime -contactName -contactNumber -userId -status",
    })
    .select("-donorId -requesterId -updatedAt")
    .populate({
      path: "requesterId",
      select: "username email -_id",
    });

  if (notificationPosts.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No notifications found"));
  }

  let updatedNotifications = await Promise.all(
    notificationPosts
      .filter(
        (item) => item.status !== "OTP Expired" && item.status !== "approved"
      )
      .map(async (item) => {
        if (
          foodId === item.foodId._id.toString() &&
          item.status !== "approved"
        ) {
          item.status = "rejected";
          await item.save({
            validateBeforeSave: false,
          });
          await sendMail(
            item.requesterId.email,
            `Request Rejected Notification`,
            "Hello",
            `<p>Hello <b>${item.requesterId.username}</b>,</p>
           <p>We wanted to inform you that your food request has been <b>${"Rejected".toLowerCase()}</b> by donor <b>${username}.</b></p>
           <p>Unfortunately, the food post you requested has already been approved for another recipient.</p>
           <p>Explore more food posts and stay connected with Food Unity!</p>
           <p>Thank you for being a part of Food Unity.</p>
           <p>Best regards,</p>
           <p><b>Food Unity Team.</b></p>`
          );
        }
        return item;
      })
  );

  if (updatedNotifications.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No notifications found"));
  }

  updatedNotifications = updatedNotifications.filter(
    (item) => item.status !== "rejected"
  );

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
      `Request ${reqFinalStatus} Notification`,
      "Hello",
      `<p>Hello <b>${recipient.username}</b>,</p>
      <p>We wanted to inform you that your food request has been <b>${reqFinalStatus.toLowerCase()}</b> by donor <b>${username}.</b></p>
      <p>Your OTP for verification is: <b>${otp}</b></p>
      <p><strong>⚠️ Important Notice:</strong> Your OTP is valid until <span style="color: #e60000; font-weight: bold;">${formattedTime}</span>. <br/> Please use it before this time to ensure it's accepted.</p>
      <p>You can view the location of the donor using the following link: <a href="https://www.google.com/maps?q=${
        requestData.donorId.pickupCoordinates.coordinates[0]
      },${
        requestData.donorId.pickupCoordinates.coordinates[1]
      }" target="_blank">View Location</a></p>
      <p>Thank you for being a part of Food Unity.</p>
      <p>Explore more food posts and stay connected with Food Unity!</p>
      <p>Best regards,</p>
      <p><b>Food Unity Team.</b></p>`
    );
  } else {
    await sendMail(
      recipientEmail,
      `Request ${reqFinalStatus} Notification`,
      "Hello",
      `<p>Hello <b>${recipient.username}</b>,</p>
         <p>We wanted to inform you that your food request has been <b>${reqFinalStatus.toLowerCase()}</b> by donor <b>${username}.</b></p>
         <p>Explore more food posts and stay connected with Food Unity!</p>
         <p>Thank you for being a part of Food Unity.</p>
         <p>Best regards,</p>
         <p><b>Food Unity Team.</b></p>`
    );
  }

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedNotifications || [], "Request Status Update")
    );
});

const searchNotification = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery || searchQuery.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a search"));
  }

  const searchData = await requestModel
    .find({
      $and: [
        {
          donorId: req.user._id,
        },
        {
          status: "requested",
        },
      ],
    })
    .populate({
      path: "foodId",
      match: {
        $or: [
          {
            foodTitle: { $regex: searchQuery, $options: "i" },
          },
          {
            foodType: { $regex: `^${searchQuery}$`, $options: "i" },
          },
          {
            pickupOptions: { $regex: searchQuery, $options: "i" },
          },
        ],
      },
      select: "-_id -quantity -contactName -contactNumber",
    })
    .populate("requesterId", "username");

  if (searchData.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No matching notifications found"));
  }

  const filteredResults = searchData.filter(
    (item) => item.foodId !== null && !item.isDelete
  );

  if (filteredResults.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry post not found"));
  }

  return res.status(200).json(new ApiResponse(200, filteredResults, "Ok"));
});

const searchUserReqHistory = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery || searchQuery.trim() === "") {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a search"));
  }

  let historyData = await requestModel
    .find({
      requesterId: req.user._id,
    })
    .populate({
      path: "foodId",
      match: {
        $or: [
          {
            foodTitle: { $regex: searchQuery, $options: "i" },
          },
          {
            foodType: { $regex: `^${searchQuery}$`, $options: "i" },
          },
        ],
      },
    })
    .select("-createdAt -donorId -requesterId -updatedAt -_id -__v");

  historyData = historyData.filter((item) => item.foodId !== null);

  if (historyData.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Sorry post not found"));
  }

  return res.status(200).json(new ApiResponse(200, historyData, "Ok"));
});

module.exports = {
  sendOrderMailRequest,
  showNotifications,
  getDonorsAllNotifications,
  sendRequestResponseMail,
  searchNotification,
  searchUserReqHistory,
};
