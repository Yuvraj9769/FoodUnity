const {
  checkIsAdminLogin,
  loginAdmin,
  registerAdmin,
  resetPasswordSendMail,
  checkAdminTokenExipry,
  resetAdminPassword,
} = require("../controllers/admin.controller");
const verifyAdmin = require("../middlewares/admin.verifyLogin.middleware");

const router = require("express").Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);
router.route("/reset-password").post(resetPasswordSendMail);
router.route("/check-token-exp").post(checkAdminTokenExipry);
router.route("/reset-admin-password").post(resetAdminPassword);

//secured routes : -

router.route("/checkLogin").get(verifyAdmin, checkIsAdminLogin);

module.exports = router;
