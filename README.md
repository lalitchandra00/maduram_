# 🌿 Maduram | Jeevan-Amrit  
*A Modern AI-Powered Health & Wellness Companion*

---

## 🧘‍♂️ Overview
**Maduram | Jeevan-Amrit** is a full-stack AI-driven wellness web application designed to help users understand and balance their emotional states through **ancient wisdom, modern AI, and mindful design**.

It unites **React (frontend)** and **Node.js + Express + MongoDB (backend)** into a calm, reflective experience inspired by Sanskrit *shlokas* that rejuvenate the mind and soul.

---

## 💡 Core Functionalities

### 1️⃣ Moodify — AI Mood & Wellness Assistant
Users can express themselves in **three ways**:
- 🗣️ **Voice input** → analyzed through **Groq’s Speech-to-Text API**
- 💬 **Text input** → directly processed for AI mood detection
- 📷 **Webcam input** → (optional feature) for facial emotion analysis

The backend connects with AI APIs that process user inputs and return:
- **Detected Mood** (happy, calm, anxious, stressed, etc.)
- **Personalized Advice** for emotional balance (like meditation or breathing)

Each result is **instantly stored in MongoDB**, allowing long-term emotional tracking.

---

### 2️⃣ Feeling Tracker — Emotion History & Insights
The **Feeling Tracker** visualizes user moods and provides emotional insights based on history.

It offers:
- 📊 **Mood analytics** (trend visualization, positivity streaks)
- 📝 **Emotional journaling** to reflect on one’s daily mood
- 🧩 **Dynamic wellness suggestions** based on the latest AI analysis

All data is linked to a **unique UUID** (stored in localStorage), ensuring lightweight, user-specific identity management.

---

## 🧠 AI & Backend Integration

The backend uses multiple AI layers:
1. **Text / Voice / Webcam Inputs** are received and analyzed.  
2. **Groq Speech-to-Text API** converts recorded voice to clean text.  
3. **AI Mood Model API** evaluates the text and generates:
   - Detected emotion label  
   - Wellness advice message  

Each mood record is automatically stored using the `Mood` schema:
```js
{
  userId,
  moodType,
  sourceType, // "text" | "voice" | "webcam"
  aiAdvice,
  timestamp
}
```
🧩 Available APIs
Method	Endpoint	Description
POST	/api/moodify/analyze	Analyze mood via AI and instantly save in MongoDB
POST	/api/moodify/voice-to-text	Convert uploaded voice to text using Groq API
GET	/api/moodify/user/:userId	Fetch all mood entries for the user
🎨 Frontend Design

Built with modern simplicity and calmness in mind:

⚛️ React + Zustand → smooth and reactive state handling

🎨 TailwindCSS → soft and balanced UI design

💫 Framer Motion → serene animation and transitions

📊 Recharts → clean mood analytics visualization

🕉️ Motivational Shlokas displayed dynamically for reflection and focus

🕉️ Philosophical Foundation

This project’s spirit is drawn from selected Shlokas (14, 15, 16, 17, 22) that speak about Sattva (purity), Rajas (activity), and Tamas (inertia) — the three gunas that influence the human mind and emotions.

These verses symbolize self-awareness and balance, guiding the tone and mood logic of the application — bridging the gap between spiritual wisdom and modern AI.

🧭 Development Timeline
Hour	Milestone	Description
1st Hour	💭 Ideation & Shloka Reflection	Brainstormed concept inspired by shlokas (14, 15, 16, 17, 22) — explored how spiritual philosophy could align with emotional AI.
Shlok 14 - I am beyond the body and senses.
Shlok 15 - I am beyond the body and senses.
Shlok 16 - I am beyond birth, death, or identity.
Shlok 17 - I am formless, eternal awareness present everywhere.
All these shlokas tell us to remove all the bad feelings and emotions from our life and just bring god and their words in our life, which will automatically bring good vibes in our life.
2nd Hour	🧠 Model & Architecture Planning	Designed the AI flow (text, voice, webcam) and data storage. Planned UUID-based user identity and structured database schemas.
3rd & 4th Hour	⚙️ Frontend, Backend & AI Integration	Built the frontend using React + Zustand and connected it with backend APIs. Integrated AI mood detection and Groq speech-to-text functionality.
Final Hour	🚀 Deployment & Refinement	Final testing, bug fixes, and deployment on Render. Ensured complete connectivity between AI model, backend, and frontend layers.
⚙️ Tech Stack
Frontend

React.js

Zustand (State Management)

TailwindCSS

Recharts

Framer Motion

Backend

Node.js + Express

MongoDB + Mongoose

Multer (for voice uploads)

Groq Speech-to-Text API

External AI Mood Analysis API

🔁 System Architecture (Flow Overview)
```
🎙️ Voice / 💬 Text / 📷 Webcam
        │
        ▼
 [Frontend: React + Zustand]
        │
        ▼
 [Backend: Node.js + Express]
        │
        ├──> Groq Speech-to-Text API (voice → text)
        ├──> AI Model API (text → mood + advice)
        ▼
 [MongoDB: Mood History Storage]
        │
        ▼
 [Frontend Visualization → Feeling Tracker]
```

🌸 Vision

Maduram | Jeevan-Amrit isn’t just an app —
it’s a digital sanctuary for mindfulness.
Through every detected mood, every thoughtful suggestion, and every ancient shloka,
we aim to help users reconnect with themselves — one emotion at a time.

“Balance is not something you find,
it’s something you create — within.”
