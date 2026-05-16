import mongoose from "mongoose";

const homepageContentSchema = new mongoose.Schema(
    {
        sectionName: {
            type: String,
            required: true,
            unique: true, // e.g., "hero", "products", "combos"
        },
        content: {
            type: mongoose.Schema.Types.Mixed, // Stores the dynamic content (json)
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        }
    },
    {
        timestamps: true,
    }
);

export const HomepageContent = mongoose.model("HomepageContent", homepageContentSchema);
