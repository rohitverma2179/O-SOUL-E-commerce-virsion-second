const multer = require("multer");
const path = require("path");
const fs = require("fs");

const uploadDirectory = path.join(__dirname, "..", "uploads");
fs.mkdirSync(uploadDirectory, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDirectory),
  filename: (_req, file, callback) => {
    const safeName = path.basename(file.originalname, path.extname(file.originalname)).replace(/[^a-z0-9_-]/gi, "-");
    callback(null, `${Date.now()}-${safeName}${path.extname(file.originalname).toLowerCase()}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024, files: 5 },
  fileFilter: (_req, file, callback) => {
    if (!file.mimetype.startsWith("image/")) return callback(new Error("Only image files are allowed"));
    callback(null, true);
  }
});

module.exports = upload;
