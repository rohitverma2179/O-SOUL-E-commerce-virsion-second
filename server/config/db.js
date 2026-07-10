const { MongoClient } = require('mongodb');
const mongoose = require("mongoose");

let isConnected = false;

const connectDB = async () => {
  if (isConnected || mongoose.connection.readyState === 1) {
    return;
  }
  const configuredUri = process.env.MONGODB_URI || process.env.MONGO_URL;

  if (!configuredUri) {
    throw new Error("MONGODB_URI (or MONGO_URL) is not defined in server/config/.env");
  }

  const parsedUri = new URL(configuredUri);
  if (!parsedUri.pathname || parsedUri.pathname === "/") parsedUri.pathname = "/osoul";

  const connection = await mongoose.connect(parsedUri.toString(), {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    autoIndex: false
  });
  isConnected = true;
  console.log(`MongoDB connected: ${connection.connection.host}`);
};

module.exports = connectDB;

