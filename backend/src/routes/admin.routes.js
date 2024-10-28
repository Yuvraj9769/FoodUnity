const {
  checkIsAdminLogin,
  loginAdmin,
  registerAdmin,
} = require("../controllers/admin.controller");
const verifyAdmin = require("../middlewares/admin.verifyLogin.middleware");

const router = require("express").Router();

router.route("/register").post(registerAdmin);
router.route("/login").post(loginAdmin);

//secured routes : -

router.route("/checkLogin").get(verifyAdmin, checkIsAdminLogin);

module.exports = router;
