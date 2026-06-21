import dotenv from "dotenv";
import mongoose from "mongoose";
import dns from "dns";

dotenv.config({ path: './.env' });

console.log("=== O'Soul Server Diagnostic Starting ===");
console.log("Loaded Environment Variables:");
console.log(`- PORT: ${process.env.PORT || "Not Defined (Defaulting to 8000)"}`);
console.log(`- CORS_ORIGIN: ${process.env.CORS_ORIGIN || "Not Defined"}`);
console.log(`- MONGODB_URI: ${process.env.MONGODB_URI ? "Defined (Masked)" : "Not Defined"}`);
console.log(`- EMAIL_HOST: ${process.env.EMAIL_HOST || "Not Defined"}`);
console.log(`- EMAIL_USER: ${process.env.EMAIL_USER || "Not Defined"}`);

// Check DNS resolution for mongo
const checkDns = () => {
  return new Promise((resolve) => {
    if (!process.env.MONGODB_URI) {
      resolve(false);
      return;
    }
    // Extract host from URI
    try {
      const match = process.env.MONGODB_URI.match(/@([^/]+)/);
      if (match && match[1]) {
        const host = match[1].split(':')[0];
        console.log(`Resolving DNS for MongoDB host: ${host}...`);
        dns.resolve(host, (err, addresses) => {
          if (err) {
            console.error(`❌ DNS Resolution Failed for MongoDB host: ${err.message}`);
            console.error("This usually means your internet connection is offline or blocking MongoDB Atlas.");
            resolve(false);
          } else {
            console.log(`✅ DNS Resolved successfully to: ${addresses.join(', ')}`);
            resolve(true);
          }
        });
      } else {
        resolve(true);
      }
    } catch (e) {
      resolve(true);
    }
  });
};

const checkMongo = async () => {
  if (!process.env.MONGODB_URI) {
    console.error("❌ MONGODB_URI is missing in .env!");
    return;
  }
  
  console.log("Connecting to MongoDB Database...");
  try {
    const conn = await mongoose.connect(`${process.env.MONGODB_URI}/osoul`, {
      serverSelectionTimeoutMS: 5000
    });
    console.log(`✅ MongoDB connected successfully! Host: ${conn.connection.host}`);
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB.");
  } catch (error) {
    console.error("❌ MongoDB connection FAILED!");
    console.error(error);
    console.error("\nPotential causes:\n1. Your IP Address is not whitelisted on MongoDB Atlas.\n2. Incorrect database username or password.\n3. Network/firewall blocking outgoing port 27017.");
  }
};

const runDiagnostics = async () => {
  const dnsOk = await checkDns();
  await checkMongo();
  
  console.log("\nTrying to import server modules to check for syntax/import errors...");
  try {
    const { app } = await import("./src/app.js");
    console.log("✅ server/src/app.js parsed and imported successfully!");
    const { registerUser } = await import("./src/controllers/user.controller.js");
    console.log("✅ server/src/controllers/user.controller.js parsed and imported successfully!");
    console.log("\n=== Diagnostics Complete. No syntax errors found in code! ===");
  } catch (err) {
    console.error("❌ Crash during server code import!");
    console.error(err);
  }
};

runDiagnostics();
