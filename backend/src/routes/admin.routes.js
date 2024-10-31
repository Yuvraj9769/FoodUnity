const {
  checkIsAdminLogin,
  loginAdmin,
  registerAdmin,
  resetPasswordSendMail,
  checkAdminTokenExipry,
  resetAdminPassword,
  getAllUserForAdmin,
  deleteUserAsAdminPrevilage,
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
router.route("/getAllUserForAdmin").get(verifyAdmin, getAllUserForAdmin);
//delete user and user related all posts, notifications etc.
router.route("/deleteUser/:id").delete(verifyAdmin, deleteUserAsAdminPrevilage);

module.exports = router;
