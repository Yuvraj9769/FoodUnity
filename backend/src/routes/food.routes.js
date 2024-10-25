const express = require("express");
const verifyJwt = require("../middlewares/jwtVerify.middleware");
const {
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
} = require("../controllers/food.controller");
const upload = require("../middlewares/multer.middleware");
const router = express.Router();

//secured routes: -
router.route("/post").post(verifyJwt, upload.single("foodImage"), createPost);
router.route("/getcreatedposts").get(verifyJwt, getDonorsAllPosts);
router.route("/getfoodPosts").get(verifyJwt, getAllFoodPosts);
router.route("/verify-otp").post(verifyJwt, verifyUserOTP);
router.route("/deletePost").patch(verifyJwt, deleteFoodPost);
router
  .route("/updatefoodpost")
  .patch(verifyJwt, upload.single("foodImage"), updateFoodPost);
router.route("/getUserPostHistory").get(verifyJwt, userPostsHistory);
router.route("/getUsersRequestPost").get(verifyJwt, getUsersRequestPost);
router.route("/searchfood").post(verifyJwt, searchItem);
router.route("/searchforuser").post(verifyJwt, searchPostForUser);
router.route("/searchrequest").post(verifyJwt, searchUserRequestData);
router.route("/getFiltredPosts").get(verifyJwt, getFifteenKMPosts);

module.exports = router;
