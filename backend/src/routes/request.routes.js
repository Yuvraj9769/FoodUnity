const express = require("express");
const {
  sendOrderMailRequest,
  showNotifications,
  getDonorsAllNotifications,
  sendRequestResponseMail,
  searchNotification,
  searchUserReqHistory,
} = require("../controllers/request.controller");
const verifyJwt = require("../middlewares/jwtVerify.middleware");
const router = express.Router();

//secured routes: -
router.route("/sendrequest").post(verifyJwt, sendOrderMailRequest);
router.route("/notifications/:uid/:fid").get(verifyJwt, showNotifications);
router
  .route("/getdonorsallnotifications")
  .get(verifyJwt, getDonorsAllNotifications);

router.route("/donor-req-activity").post(verifyJwt, sendRequestResponseMail);
router.route("/searchnotif").post(verifyJwt, searchNotification);
router.route("/searchreqhist").post(verifyJwt, searchUserReqHistory);

module.exports = router;
