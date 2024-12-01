const multer = require("multer");

//for local

// const storage = multer.diskStorage({
//   destination: function (_, _, cb) {
//     cb(null, "./public/temp");
//   },
//   filename: function (_, file, cb) {
//     cb(null, file.originalname);
//   },
// });

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
});

module.exports = upload;
