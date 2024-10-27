const { checkIsAdminLogin } = require("../controllers/admin.controller");
const verifyAdmin = require("../middlewares/admin.verifyLogin.middleware");

const router = require("express").Router();

router.route("/checkLogin").get(verifyAdmin, checkIsAdminLogin);

module.exports = router;
