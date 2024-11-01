const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(express.json({ limit: "14kb" }));
app.use(express.urlencoded({ limit: "14kb", extended: true }));
app.use(cookieParser());
app.use(express.static("public"));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    credentials: true,
  })
);

const userRoutes = require("./routes/user.routes");
const foodRoutes = require("./routes/food.routes");
const requestRoutes = require("./routes/request.routes");
const userfeedback = require("./routes/feedback.routes");
const adminRoutes = require("./routes/admin.routes");

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/foods", foodRoutes);
app.use("/api/v1/request", requestRoutes);
app.use("/api/v1/feedback", userfeedback);

//admin routes : -
app.use("/api/v1/admin", adminRoutes);

module.exports = app;
