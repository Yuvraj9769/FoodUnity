const { getUserFeedback } = require("../controllers/feedback.controller");
const verifyJwt = require("../middlewares/jwtVerify.middleware");

const router = require("express").Router();

router.route("/userfeedback").post(verifyJwt, getUserFeedback);

module.exports = router;
