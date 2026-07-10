const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");
const connectDB = require("./config/db");

// Initialize Database connection
connectDB().catch((err) => console.error("Database connection failed:", err.message));

const productRoutes = require("./routes/product.routes");
const comboRoutes = require("./routes/combo.routes");
const errorHandler = require("./middlewares/error.middleware");
const adminRoutes = require("./routes/admin.routes");
const userRoutes = require("./routes/user.routes");
const paymentRoutes = require("./routes/payment.routes");
const popupRoutes = require("./routes/popup.routes");
const footerRoutes = require("./routes/footer.routes");

const app = express();

const allowedOrigin = process.env.CLIENT_URL;
const allowedOriginsList = [
  allowedOrigin,
  "https://osoul.in",
  "https://www.osoul.in"
].filter(Boolean);

app.use(cors({
  credentials: true,
  origin(origin, callback) {
    const isLocalClient = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin || "");
    const isVercelPreview = /\.vercel\.app$/.test(origin || "");
    if (!origin || isLocalClient || isVercelPreview || allowedOriginsList.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error("This origin is not allowed by CORS"));
  }
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.get("/", (_req, res) => res.json({ success: true, message: "Welcome to O-SOUL E-commerce API! Server is running." }));
app.get("/api/health", (_req, res) => res.json({ success: true, message: "Server is running" }));
app.use("/api/products", productRoutes);
app.use("/api/combos", comboRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/payments", paymentRoutes);
app.use("/api/popup", popupRoutes);
app.use("/api/footer", footerRoutes);

app.use((_req, res) => res.status(404).json({ success: false, message: "Route not found" }));
app.use(errorHandler);

module.exports = app;