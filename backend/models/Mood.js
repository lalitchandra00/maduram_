import mongoose from "mongoose";

const moodSchema = new mongoose.Schema({
    userId: {
        type: String, // we’re getting UUID from frontend localStorage
        required: true,
    },
    moodType: {
        type: String,
        required: true,
    },
    sourceType: {
        type: String, // "text" | "voice" | "webcam"
        default: "text",
    },
    aiAdvice: {
        type: String, // optional AI suggestion
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
});

export const Mood = mongoose.model("Mood", moodSchema);
