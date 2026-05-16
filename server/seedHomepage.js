import mongoose from "mongoose";
import dotenv from "dotenv";
import { HomepageContent } from "./src/models/homepage.model.js";

dotenv.config();

const seedData = [
    {
        sectionName: "hero",
        content: {
            tagline: "First drop · Live now",
            titleLine1: "Wear it.",
            titleLine2: "Forget you're wearing it.",
            description: "Everyday tees, joggers, shorts, hoodies, and harem pants. Built for sitting, walking, and doing your actual day — without pulling, tugging, or thinking about what you're wearing.",
            primaryBtnText: "Shop The First Drop →",
            primaryBtnLink: "/shop",
            secondaryBtnText: "Shop Combos",
            secondaryBtnLink: "/combos",
            images: [
                "https://res.cloudinary.com/demo/image/upload/v1652345678/osoul/hero1.jpg",
                "https://res.cloudinary.com/demo/image/upload/v1652345678/osoul/hero2.jpg",
                "https://res.cloudinary.com/demo/image/upload/v1652345678/osoul/hero3.jpg"
            ]
        }
    }
];

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("Connected to MongoDB for seeding...");

        for (const item of seedData) {
            await HomepageContent.findOneAndUpdate(
                { sectionName: item.sectionName },
                item,
                { upsert: true, new: true }
            );
        }

        console.log("Homepage content seeded successfully!");
        process.exit(0);
    } catch (error) {
        console.error("Error seeding database:", error);
        process.exit(1);
    }
};

seedDB();
