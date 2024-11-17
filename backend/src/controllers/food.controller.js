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

  const response = await fetch(
    `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(
      pickupLocation
    )}&key=${process.env.MAP_API_KEY}`
  );

  const data = await response.json();
  const { lat, lng } = data.results[0].geometry;

  if (!lat || !lng) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Invalid pickup location"));
  }

  const foodPost = await foodModel.create({
    foodTitle,
    description,
    quantity,
    foodType,
    expiryTime,
    pickupLocation,
    pickupCoordinates: {
      type: "Point", // GeoJSON type
      coordinates: [lng, lat],
    },
    pickupTime,
    contactName,
    contactNumber,
    pickupOptions,
    foodImage: cloudinaryResonse.secure_url,
  });

  if (!foodPost) {
    return res
      .status(500)
      .json(new ApiResponse(500, null, "Failed to create food post"));
  }

  foodPost.userId = req.user._id;
  await foodPost.save();

  res
    .status(201)
    .json(new ApiResponse(201, foodPost, "Food post created successfully"));
});

//updation remaining (can add pagination other done) in follow: -
const getDonorsAllPosts = asyncHandler(async (req, res) => {
  const foodPosts = await foodModel.find({
    userId: req.user._id,
    isDelete: false,
  });

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

  const foods = await foodModel.find({
    isDelete: false,
    status: {
      $nin: ["approved"],
    },
    // expiryTime: {
    //   $gte: new Date(),
    // },
  });

  if (foods.length === 0 || !foods) {
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
    .filter(({ requestStatus }) => {
      return (
        requestStatus != "OTP Expired" &&
        requestStatus != "approved" &&
        requestStatus != "rejected"
      );
    });

  if (foodsWithStatus.length === 0) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "No food posts found"));
  }

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

  foodData.status = "delivered";
  foodData.verifyOTP = undefined;
  await foodData.save({
    validateBeforeSave: false,
  });

  return res.status(200).json(new ApiResponse(200, user, "OTP Verified"));
});

const deleteFoodPost = asyncHandler(async (req, res) => {
  //not deleting post just setting isDelete: true because user has this data in his history else that will also delete.

  const { delId } = req.body;

  if (!delId) {
    return res.status(400).json(new ApiResponse(400, null, "Invalid Request"));
  }

  const foodPost = await foodModel.findByIdAndUpdate(
    delId,
    {
      $set: {
        isDelete: true,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!foodPost) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Food post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post deleted successfully"));
});

const updateFoodPost = asyncHandler(async (req, res) => {
  const {
    id,
    title,
    quantity,
    foodType,
    expTime,
    pickupTime,
    pickupOption,
    name,
    desc,
    number,
    pickupLocation,
  } = req.body;

  if (
    [
      id,
      title,
      foodType,
      expTime,
      pickupTime,
      pickupOption,
      name,
      desc,
      number,
      pickupLocation,
    ].some((field) => field.trim() === "")
  ) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "All fields are required"));
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
      .json(new ApiResponse(500, null, "Failed to upload image"));
  }

  const foodPost = await foodModel.findByIdAndUpdate(
    id,
    {
      $set: {
        foodTitle: title,
        description: desc,
        quantity,
        foodType,
        foodImage: cloudinaryResonse.secure_url,
        expiryTime: expTime,
        pickupLocation,
        pickupTime,
        contactName: name,
        contactNumber: number,
        pickupOptions: pickupOption,
      },
    },
    {
      new: true,
      runValidators: true,
    }
  );

  if (!foodPost) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Food post not found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Post updated successfully"));
});

const userPostsHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const posts = await requestModel
    .find({ requesterId: userId })
    .populate(
      "foodId",
      "foodTitle description foodType expiryTime foodImage pickupTime contactName pickupLocation pickupOptions createdAt"
    )
    .select("status")
    .lean();

  if (!posts) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  const foodPosts = posts.map(({ foodId, ...rest }) => {
    return {
      ...rest,
      ...foodId,
    };
  });

  return res.status(200).json(new ApiResponse(200, foodPosts, "ok"));
});

const getUsersRequestPost = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const requestData = await requestModel
    .find({ requesterId: userId })
    .populate(
      "foodId",
      "foodTitle description foodType expiryTime pickupLocation pickupOptions foodImage pickupTime contactName pickupOptions createdAt"
    )
    .select("status")
    .lean();

  if (!requestData) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  const postData = requestData
    .map(({ foodId, ...rest }) => {
      return {
        ...rest,
        ...foodId,
      };
    })
    .filter((e) => e.status === "requested");

  if (!postData || postData.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  return res.status(200).json(new ApiResponse(200, postData, "ok"));
});

const searchItem = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a search"));
  }

  let searchData = await foodModel.find({
    $or: [
      {
        foodTitle: { $regex: searchQuery, $options: "i" },
      },
      {
        foodType: { $regex: `^${searchQuery}$`, $options: "i" },
      },
    ],
  });

  searchData = searchData.filter((item) => !item.isDelete);

  if (!searchData || searchData.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  return res.status(200).json(new ApiResponse(200, searchData, "Ok"));
});

const searchPostForUser = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a search"));
  }

  let foodPosts = await foodModel.find({
    $and: [
      {
        isDelete: false,
      },
      {
        $or: [
          { foodTitle: { $regex: searchQuery, $options: "i" } },
          { foodType: { $regex: `^${searchQuery}$`, $options: "i" } },
        ],
      },
    ],
  });

  if (foodPosts.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  const requests = await requestModel.find({ requesterId: req.user._id });

  const requestStatusMap = {};

  requests.forEach((request) => {
    requestStatusMap[request.foodId.toString()] = request.status;
  });

  const foodsWithStatus = foodPosts
    .map((food) => {
      const requestStatus = requestStatusMap[food._id.toString()] || "request";
      return {
        food,
        requestStatus,
      };
    })
    .filter(({ requestStatus, food }) => {
      return (
        requestStatus != "OTP Expired" &&
        requestStatus != "approved" &&
        !food.isDelete
        // && moment().diff(moment(food.createdAt), "days") < 1
      );
    });

  if (foodsWithStatus.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  res
    .status(200)
    .json(new ApiResponse(200, foodsWithStatus, "Food Posts Fetched"));
});

const searchUserRequestData = asyncHandler(async (req, res) => {
  const { searchQuery } = req.body;

  if (!searchQuery) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please provide a search"));
  }

  let requestData = await requestModel
    .find({
      $and: [
        {
          requesterId: req.user._id,
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
        ],
      },
      select: "-_id -quantity -contactNumber",
    })
    .select("-createdAt -donorId -requesterId -updatedAt -_id -__v");

  if (requestData.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  requestData = requestData.filter((item) => item.foodId !== null);

  if (requestData.length === 0) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  return res.status(200).json(new ApiResponse(200, requestData, "Ok"));
});

const getFifteenKMPosts = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const user = await userModel.findById(userId);

  if (!user) {
    return res.status(404).json(new ApiResponse(404, null, "User not found"));
  }

  const distanceInKM = 15;

  const requestedUserData = await requestModel.find({
    requesterId: req.user._id,
  });

  if (requestedUserData.length === 0 || !requestedUserData) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  const nearbyPosts = await foodModel
    .find({
      pickupCoordinates: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [
              user.pickupCoordinates.coordinates[1],
              user.pickupCoordinates.coordinates[0],
            ],
          },
          $maxDistance: distanceInKM * 1000,
        },
      },
      expiryTime: {
        $gte: new Date(),
      },
    })
    .select("-pickupCoordinates");

  if (nearbyPosts.length === 0 || !nearbyPosts) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  const newFilteredPostsWithRequestStatus = nearbyPosts.map((e) => {
    const sampleData = requestedUserData.filter((e2) => {
      return (
        e2.foodId.toString() === e._id.toString() &&
        e2.status !== "rejected" &&
        e2.status !== "OTP Expired"
      );
    });

    const objData = {
      requestStatus: sampleData[0]?.status || "request",
      food: e,
    };

    return objData;
  });

  if (
    newFilteredPostsWithRequestStatus.length === 0 ||
    !newFilteredPostsWithRequestStatus
  ) {
    return res.status(404).json(new ApiResponse(404, null, "No posts found"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, newFilteredPostsWithRequestStatus, "Ok"));
});

module.exports = {
  createPost,
  getDonorsAllPosts,
  getAllFoodPosts,
  verifyUserOTP,
  deleteFoodPost,
  updateFoodPost,
  userPostsHistory,
  getUsersRequestPost,
  searchItem,
  searchPostForUser,
  searchUserRequestData,
  getFifteenKMPosts,
};
