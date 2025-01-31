require("dotenv").config();
const app = require("./app");
const connectDB = require("./db/index");

connectDB()
  .then((_) => {
    app.listen(process.env.PORT || 3000, () => {
      console.log("Database connected");
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  })
  .catch((_) => process.exit(1));
