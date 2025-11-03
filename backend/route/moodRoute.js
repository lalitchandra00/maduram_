import express from "express";
import multer from "multer";
import {
  analyzeMood,
  getUserMoods,
  voiceToText,
} from "../controllers/moodController.js";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/analyze", analyzeMood);
router.get("/user/:userId", getUserMoods);
router.post("/voice-to-text", upload.single("audio"), voiceToText);

export default router;
