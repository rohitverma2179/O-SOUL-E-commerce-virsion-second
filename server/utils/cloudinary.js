const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.COLUDNARY_CLOUD_NAME,
  api_key: process.env.COLUDNARY_API_KEY,
  api_secret: process.env.COLUDNARY_API_SECRET,
});

/**
 * Uploads a file buffer directly to Cloudinary.
 * @param {Buffer} fileBuffer - The file buffer from multer memoryStorage.
 * @param {string} folder - The folder destination in Cloudinary.
 * @returns {Promise<object>} - Returns the upload result object containing secure_url.
 */
const uploadToCloudinary = (fileBuffer, folder = "osou") => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Extracts the public ID from a Cloudinary secure URL.
 * @param {string} url - The Cloudinary image URL.
 * @returns {string|null} - The public ID (with folder prefix), or null if extraction fails.
 */
const getPublicIdFromUrl = (url) => {
  try {
    const parts = url.split("/upload/");
    if (parts.length < 2) return null;
    const pathAfterUpload = parts[1]; // e.g. "v1719782400/osou/xyz123.jpg" or "osou/xyz123.jpg"
    // Remove the version prefix if it exists (e.g. "v1719782400/")
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");
    // Remove the file extension to get the clean public ID
    const lastDotIndex = pathWithoutVersion.lastIndexOf(".");
    const publicId = lastDotIndex !== -1 ? pathWithoutVersion.substring(0, lastDotIndex) : pathWithoutVersion;
    return publicId;
  } catch (error) {
    console.error("Failed to extract public ID from URL:", url, error);
    return null;
  }
};

/**
 * Deletes an image from Cloudinary using its URL.
 * @param {string} url - The Cloudinary image URL.
 * @returns {Promise<void>}
 */
const deleteFromCloudinary = async (url) => {
  if (!url) return;
  const publicId = getPublicIdFromUrl(url);
  if (publicId) {
    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error("Cloudinary delete error:", error);
    }
  }
};

module.exports = {
  uploadToCloudinary,
  deleteFromCloudinary,
};
