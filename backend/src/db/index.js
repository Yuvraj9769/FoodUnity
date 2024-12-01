const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const connection = await mongoose.connect(
      `${process.env.MONGODB_URL}/${process.env.DB_NAME}`
    );

    return connection;
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

module.exports = connectDB;
