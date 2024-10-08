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
} = require("../controllers/user.controller");
const verifyJwt = require("../middlewares/jwtVerify.middleware");

const router = require("express").Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/sendMail").post(sendForgetPasswordMail);
router.route("/ispassword-reset-token-valid").post(checkTokenExipry);
router.route("/resetPassword").post(resetPassword);

//secured routes: -
router.route("/checkislogin").get(verifyJwt, checkIsLogin);
router.route("/getData").get(verifyJwt, userData);
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/location").post(verifyJwt, getUserLocation);

module.exports = router;
