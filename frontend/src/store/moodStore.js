import { create } from 'zustand';
import { moodifyAPI } from '../api/api';

const useMoodStore = create((set, get) => ({
  mood: null,
  history: [],
  loading: false,
  error: null,
  aiMessage: '',

  setMood: (mood) => set({ mood }),

  analyzeMood: async (inputData, inputType) => {
    set({ loading: true, error: null });

    try {
      const response = await moodifyAPI.analyzeMood({
        input: inputData,
        type: inputType,
        timestamp: new Date().toISOString(),
      });

      const moodAnalysis = response.data;

      set({
        mood: moodAnalysis.mood,
        aiMessage: moodAnalysis.message,
        loading: false,
      });

      get().addToHistory(moodAnalysis);
      await get().storeMood(moodAnalysis);

      return moodAnalysis;
    } catch (error) {
      console.error('Mood analysis error:', error);

      const mockMoods = ['peaceful', 'anxious', 'joyful', 'stressed', 'calm', 'energetic'];
      const mockMood = mockMoods[Math.floor(Math.random() * mockMoods.length)];

      const mockAnalysis = {
        mood: mockMood,
        message: getMockMessage(mockMood),
        timestamp: new Date().toISOString(),
        suggestions: getMockSuggestions(mockMood),
      };

      set({
        mood: mockAnalysis.mood,
        aiMessage: mockAnalysis.message,
        loading: false,
        error: 'Using mock data - backend not connected',
      });

      get().addToHistory(mockAnalysis);

      return mockAnalysis;
    }
  },

  addToHistory: (moodEntry) => {
    set((state) => ({
      history: [moodEntry, ...state.history].slice(0, 50),
    }));
  },

  storeMood: async (moodData) => {
    try {
      await moodifyAPI.storeMood({
        ...moodData,
        userId: 'user123',
      });
    } catch (error) {
      console.error('Failed to store mood:', error);
    }
  },

  clearMood: () => set({ mood: null, aiMessage: '', error: null }),
}));

function getMockMessage(mood) {
  const messages = {
    peaceful: 'Your mind reflects the stillness of a serene lake. Continue nurturing this tranquility through mindful breathing.',
    anxious: 'Like clouds passing through the sky, your worries are temporary. Ground yourself in the present moment.',
    joyful: 'Your spirit radiates positive energy. Share this light with those around you and let gratitude flow.',
    stressed: 'Remember: You are not your thoughts. Take three deep breaths and return to your center.',
    calm: 'You have found your equilibrium. This balanced state is your natural essence.',
    energetic: 'Channel this vibrant energy into purposeful action. Let it fuel your creative endeavors.',
  };
  return messages[mood] || 'Your emotional landscape is unique. Honor what you feel in this moment.';
}

function getMockSuggestions(mood) {
  const suggestions = {
    peaceful: ['Meditation', 'Nature walk', 'Gentle yoga'],
    anxious: ['Breathing exercises', 'Journaling', 'Progressive relaxation'],
    joyful: ['Creative expression', 'Social connection', 'Gratitude practice'],
    stressed: ['Body scan', 'Aromatherapy', 'Digital detox'],
    calm: ['Reading', 'Tea ceremony', 'Mindful observation'],
    energetic: ['Dynamic yoga', 'Dance', 'Creative projects'],
  };
  return suggestions[mood] || ['Mindful breathing', 'Self-reflection', 'Gentle movement'];
}

export default useMoodStore;
