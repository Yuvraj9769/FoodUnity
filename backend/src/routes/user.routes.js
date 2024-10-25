const {
  registerUser,
  loginUser,
  userData,
  logoutUser,
  sendForgetPasswordMail,
  getUserLocation,
  checkIsLogin,
  checkTokenExipry,
  resetPassword,
  updateProfile,
  ChangePassword,
  updateProfilePic,
  getUserLocationWhileRegister,
} = require("../controllers/user.controller");
const verifyJwt = require("../middlewares/jwtVerify.middleware");
const upload = require("../middlewares/multer.middleware");

const router = require("express").Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/sendMail").post(sendForgetPasswordMail);
router.route("/ispassword-reset-token-valid").post(checkTokenExipry);
router.route("/resetPassword").post(resetPassword);
router.route("/getLocation").post(getUserLocationWhileRegister);

//secured routes: -
router.route("/checkislogin").get(verifyJwt, checkIsLogin);
router.route("/getData").get(verifyJwt, userData);
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/location").post(verifyJwt, getUserLocation);
router.route("/updateProfile").patch(verifyJwt, updateProfile);
router
  .route("/updateProfilePic")
  .patch(verifyJwt, upload.single("profilePic"), updateProfilePic);
router.route("/changePassword").patch(verifyJwt, ChangePassword);

module.exports = router;
