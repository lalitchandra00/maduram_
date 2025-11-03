import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const moodifyAPI = {
  analyzeMood: async (data) => {
    return api.post('/moodify/analyze', data);
  },

  storeMood: async (moodData) => {
    return api.post('/moodify/store', moodData);
  },
};

export const trackerAPI = {
  getHistory: async (userId, days = 7) => {
    return api.get(`/tracker/get?userId=${userId}&days=${days}`);
  },

  addJournalEntry: async (journalData) => {
    return api.post('/tracker/journal', journalData);
  },

  getJournalEntries: async (userId) => {
    return api.get(`/tracker/journal?userId=${userId}`);
  },
};

export default api;
