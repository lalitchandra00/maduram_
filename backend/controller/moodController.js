import axios from "axios";
import { Mood } from "../models/Mood.js";
import fs from "fs";
import FormData from "form-data";

/**
 * POST /api/moodify/analyze
 * Analyze mood using AI + instantly store in MongoDB
 */
export const analyzeMood = async (req, res) => {
    try {
        const { userId, inputType, inputValue } = req.body;

        if (!userId || !inputValue) {
            return res.status(400).json({ message: "Missing userId or inputValue" });
        }

        // 🧠 AI API call (replace with your real endpoint)
        const aiResponse = await axios.post("https://api.fake-ai.com/analyze", {
            input: inputValue,
        });

        const aiMood = aiResponse.data?.mood || "neutral";
        const aiAdvice =
            aiResponse.data?.advice || "Take a deep breath and relax.";

        // 💾 Save immediately in DB
        const newMood = new Mood({
            userId,
            moodType: aiMood,
            sourceType: inputType,
            aiAdvice,
        });
        await newMood.save();

        return res.status(200).json({
            success: true,
            mood: aiMood,
            advice: aiAdvice,
            saved: true,
        });
    } catch (err) {
        console.error("Error in analyzeMood:", err);
        return res
            .status(500)
            .json({ success: false, message: "Error analyzing mood" });
    }
};

/**
 * GET /api/moodify/user/:userId
 * Fetch all moods for a specific user
 */
export const getUserMoods = async (req, res) => {
    try {
        const { userId } = req.params;
        if (!userId)
            return res.status(400).json({ message: "User ID is required" });

        const moods = await Mood.find({ userId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            count: moods.length,
            moods,
        });
    } catch (err) {
        console.error("Error fetching user moods:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch moods",
        });
    }
};

/**
 * POST /api/moodify/voice-to-text
 * Receive a voice file → send to Groq API → return text
 */
export const voiceToText = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "Audio file is required" });
        }

        const filePath = req.file.path;

        // Prepare form-data for Groq API
        const formData = new FormData();
        formData.append("file", fs.createReadStream(filePath));
        formData.append("model", "whisper-large-v3"); // Groq’s model name

        const response = await axios.post(
            "https://api.groq.com/openai/v1/audio/transcriptions",
            formData,
            {
                headers: {
                    Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
                    ...formData.getHeaders(),
                },
            }
        );

        // Delete local temp file after sending
        fs.unlinkSync(filePath);

        return res.status(200).json({
            success: true,
            text: response.data.text,
        });
    } catch (err) {
        console.error("Error in voiceToText:", err);
        return res.status(500).json({
            success: false,
            message: "Speech-to-text conversion failed",
        });
    }
};
