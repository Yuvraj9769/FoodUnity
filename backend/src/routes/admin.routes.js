const {
  checkIsAdminLogin,
  loginAdmin,
  registerAdmin,
  resetPasswordSendMail,
  checkAdminTokenExipry,
  resetAdminPassword,
  getAllUserForAdmin,
  deleteUserAsAdminPrevilage,
  updateUserDataAsAdminPrivilage,
  getAllFoodPostsForAdmin,
  getSearchedPost,
  deletePostAsAdminPrevilage,
  searchUserForAdmin,
  getAllDonorAndRecipients,
  getAllFoodPostsMonthWise,
  getDeliveredPosts,
  requestPendingPosts,
  logoutAdmin,
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
router.route("/updateUser").patch(verifyAdmin, updateUserDataAsAdminPrivilage);
router.route("/getAllPosts").get(verifyAdmin, getAllFoodPostsForAdmin);
router.route("/getSearchedPost").post(verifyAdmin, getSearchedPost);
//delete food and food related all data, notifications etc.
router
  .route("/deletePostAdmin/:id")
  .delete(verifyAdmin, deletePostAsAdminPrevilage);
router.route("/searchuserForAdmin").post(verifyAdmin, searchUserForAdmin);
router.route("/usersWithCategory").get(verifyAdmin, getAllDonorAndRecipients);
router.route("/monthWisePosts").get(verifyAdmin, getAllFoodPostsMonthWise);
router.route("/deliveredPosts").get(verifyAdmin, getDeliveredPosts);
router.route("/reqPendingPosts").get(verifyAdmin, requestPendingPosts);
router.route("/logout-admin").get(verifyAdmin, logoutAdmin);

module.exports = router;
