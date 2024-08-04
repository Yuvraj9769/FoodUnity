const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (_, _, cb) {
    cb(null, "./public/temp");
  },
  filename: function (_, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

module.exports = upload;
