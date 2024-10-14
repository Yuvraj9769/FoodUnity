const feedbackModel = require("../models/feedback.model");
const userModel = require("../models/user.model");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");
const sendMail = require("../utils/sendMail");

const getUserFeedback = asyncHandler(async (req, res) => {
  const { name, email, rating, comments } = req.body;

  if ([name, email, rating, comments].some((field) => field.trim() === "")) {
    return res
      .status(400)
      .json(new ApiResponse(400, null, "Please fill all fields"));
  }

  const feedback = await feedbackModel.create({
    name,
    email,
    rating,
    comments,
  });

  if (!feedback) {
    return res
      .status(400)
      .json(new ApiResponse(200, null, "Failed to create feedback"));
  }

  const user = await userModel.findById(req.user._id);
  if (!user) {
    return res
      .status(404)
      .json(new ApiResponse(404, null, "Your account does not exist"));
  }

  await sendMail(
    user?.email,
    "Thank You for Your Valuable Feedback",
    "Hello",
    `<p>Hello, <b>${user?.fullName}</b></p>
     <p>Thank you for your valuable feedback! We greatly appreciate your input.</p>
     <p>If you have any further comments or questions, feel free to reach out to us.</p>
     <p>Best Regards,</p>
     <b>Food Unity.</b>`
  );

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        null,
        "Thanks for your feedback! We truly appreciate it."
      )
    );
});

module.exports = {
  getUserFeedback,
};
