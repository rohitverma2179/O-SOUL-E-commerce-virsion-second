const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const productRoutes = require("./routes/product.routes");
const comboRoutes = require("./routes/combo.routes");
const errorHandler = require("./middlewares/error.middleware");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");

const app = express();

const allowedOrigin = process.env.CLIENT_URL;
app.use(cors({
  credentials: true,
  origin(origin, callback) {
    const isLocalClient = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
    if (!origin || isLocalClient || origin === allowedOrigin) return callback(null, true);
    callback(new Error("This origin is not allowed by CORS"));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/api/health", (_req, res) => res.json({ success: true, message: "Server is running" }));
app.use("/api/products", productRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

module.exports = app;
