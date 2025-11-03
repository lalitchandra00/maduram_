import { create } from 'zustand';
import { trackerAPI } from '../api/api';

const useTrackerStore = create((set, get) => ({
  feelingHistory: [],
  journalEntries: [],
  loading: false,
  error: null,
  userId: 'user123',

  fetchHistory: async (days = 7) => {
    set({ loading: true, error: null });

    try {
      const response = await trackerAPI.getHistory(get().userId, days);
      set({
        feelingHistory: response.data.history,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch history:', error);

      const mockHistory = generateMockHistory(days);
      set({
        feelingHistory: mockHistory,
        loading: false,
        error: 'Using mock data - backend not connected',
      });
    }
  },

  fetchJournalEntries: async () => {
    set({ loading: true, error: null });

    try {
      const response = await trackerAPI.getJournalEntries(get().userId);
      set({
        journalEntries: response.data.entries,
        loading: false,
      });
    } catch (error) {
      console.error('Failed to fetch journal entries:', error);

      const mockJournal = generateMockJournal();
      set({
        journalEntries: mockJournal,
        loading: false,
        error: 'Using mock data - backend not connected',
      });
    }
  },

  addJournalEntry: async (entryText) => {
    const newEntry = {
      text: entryText,
      timestamp: new Date().toISOString(),
      userId: get().userId,
    };

    set((state) => ({
      journalEntries: [newEntry, ...state.journalEntries],
    }));

    try {
      await trackerAPI.addJournalEntry(newEntry);
    } catch (error) {
      console.error('Failed to save journal entry:', error);
    }
  },

  getMoodSummary: () => {
    const history = get().feelingHistory;
    if (history.length === 0) return null;

    const moodCounts = {};
    history.forEach((entry) => {
      moodCounts[entry.mood] = (moodCounts[entry.mood] || 0) + 1;
    });

    const sortedMoods = Object.entries(moodCounts).sort((a, b) => b[1] - a[1]);
    const dominantMood = sortedMoods[0]?.[0];

    return {
      dominantMood,
      moodDistribution: moodCounts,
      totalEntries: history.length,
    };
  },
}));

function generateMockHistory(days) {
  const moods = ['peaceful', 'anxious', 'joyful', 'stressed', 'calm', 'energetic'];
  const history = [];

  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);

    const entriesPerDay = Math.floor(Math.random() * 3) + 1;

    for (let j = 0; j < entriesPerDay; j++) {
      history.push({
        mood: moods[Math.floor(Math.random() * moods.length)],
        timestamp: date.toISOString(),
        message: 'Mock analysis message',
      });
    }
  }

  return history;
}

function generateMockJournal() {
  return [
    {
      text: 'Today I practiced meditation for 20 minutes. Felt more centered and focused.',
      timestamp: new Date().toISOString(),
    },
    {
      text: 'Work was stressful but I managed to stay calm by taking regular breaks.',
      timestamp: new Date(Date.now() - 86400000).toISOString(),
    },
    {
      text: 'Grateful for the support of my family. Feeling blessed and peaceful.',
      timestamp: new Date(Date.now() - 172800000).toISOString(),
    },
  ];
}

export default useTrackerStore;
