const {
  registerUser,
  loginUser,
  userData,
  logoutUser,
  sendForgetPasswordMail,
  getUserLocation,
  checkIsLogin,
} = require("../controllers/user.controller");
const verifyJwt = require("../middlewares/jwtVerify.middleware");

const router = require("express").Router();

router.route("/registerUser").post(registerUser);
router.route("/loginUser").post(loginUser);
router.route("/sendMail").post(sendForgetPasswordMail);

//secured routes: -
router.route("/checkislogin").get(verifyJwt, checkIsLogin);
router.route("/getData").get(verifyJwt, userData);
router.route("/logout").get(verifyJwt, logoutUser);
router.route("/location").post(verifyJwt, getUserLocation);

module.exports = router;
