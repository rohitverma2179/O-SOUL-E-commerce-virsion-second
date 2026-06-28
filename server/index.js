require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const port = process.env.PORT || 5000;

connectDB()
  .then(() => {
    app.listen(port, () => console.log(`Server is running on port ${port}`));
  })
  .catch((error) => {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  });
