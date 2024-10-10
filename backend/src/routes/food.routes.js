const express = require("express");
const verifyJwt = require("../middlewares/jwtVerify.middleware");
const {
  createPost,
  getDonorsAllPosts,
  getAllFoodPosts,
  verifyUserOTP,
  deleteFoodPost,
} = require("../controllers/food.controller");
const upload = require("../middlewares/multer.middleware");
const router = express.Router();

//secured routes: -
router.route("/post").post(verifyJwt, upload.single("foodImage"), createPost);
router.route("/getcreatedposts").get(verifyJwt, getDonorsAllPosts);
router.route("/getfoodPosts").get(verifyJwt, getAllFoodPosts);
router.route("/verify-otp").post(verifyJwt, verifyUserOTP);
router.route("/deletePost").patch(verifyJwt, deleteFoodPost);

module.exports = router;
