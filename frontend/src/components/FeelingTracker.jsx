import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, PieChart, BookOpen, Send } from 'lucide-react';
import { LineChart, Line, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import useTrackerStore from '../store/trackerStore';

const MOOD_COLORS = {
  peaceful: '#10b981',
  anxious: '#f59e0b',
  joyful: '#f59e0b',
  stressed: '#ef4444',
  calm: '#3b82f6',
  energetic: '#8b5cf6',
};

const FeelingTracker = ({ onNavigate }) => {
  const [journalText, setJournalText] = useState('');
  const [activeTab, setActiveTab] = useState('trends');

  const {
    feelingHistory,
    journalEntries,
    loading,
    error,
    fetchHistory,
    fetchJournalEntries,
    addJournalEntry,
    getMoodSummary,
  } = useTrackerStore();

  useEffect(() => {
    fetchHistory(7);
    fetchJournalEntries();
  }, []);

  const handleJournalSubmit = (e) => {
    e.preventDefault();
    if (!journalText.trim()) return;

    addJournalEntry(journalText);
    setJournalText('');
  };

  const getWeeklyTrend = () => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return date.toISOString().split('T')[0];
    });

    return last7Days.map((date) => {
      const dayEntries = feelingHistory.filter(
        (entry) => entry.timestamp.split('T')[0] === date
      );

      const moodScores = {
        peaceful: 5,
        calm: 4,
        joyful: 5,
        energetic: 4,
        anxious: 2,
        stressed: 1,
      };

      const avgScore =
        dayEntries.length > 0
          ? dayEntries.reduce((sum, entry) => sum + (moodScores[entry.mood] || 3), 0) / dayEntries.length
          : 3;

      return {
        date: new Date(date).toLocaleDateString('en-US', { weekday: 'short' }),
        score: Math.round(avgScore * 10) / 10,
      };
    });
  };

  const getMoodDistribution = () => {
    const summary = getMoodSummary();
    if (!summary) return [];

    return Object.entries(summary.moodDistribution).map(([mood, count]) => ({
      name: mood.charAt(0).toUpperCase() + mood.slice(1),
      value: count,
      color: MOOD_COLORS[mood] || '#6b7280',
    }));
  };

  const weeklyData = getWeeklyTrend();
  const moodDistribution = getMoodDistribution();
  const moodSummary = getMoodSummary();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => onNavigate('home')}
          className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-6xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Feeling Tracker</h1>
            <p className="text-gray-600">Your emotional wellness journey visualized</p>
          </div>

          {moodSummary && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-3xl shadow-xl p-8 mb-8"
            >
              <h2 className="text-2xl font-bold mb-4">7-Day Mood Summary</h2>
              <div className="grid md:grid-cols-3 gap-6">
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-teal-100 text-sm mb-1">Dominant Mood</p>
                  <p className="text-2xl font-bold capitalize">{moodSummary.dominantMood}</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-teal-100 text-sm mb-1">Total Entries</p>
                  <p className="text-2xl font-bold">{moodSummary.totalEntries}</p>
                </div>
                <div className="bg-white/20 rounded-xl p-4">
                  <p className="text-teal-100 text-sm mb-1">Tracked Days</p>
                  <p className="text-2xl font-bold">7</p>
                </div>
              </div>
            </motion.div>
          )}

          <div className="flex gap-4 mb-6">
            <button
              onClick={() => setActiveTab('trends')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'trends'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <Calendar className="w-5 h-5" />
              Trends
            </button>
            <button
              onClick={() => setActiveTab('distribution')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'distribution'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <PieChart className="w-5 h-5" />
              Distribution
            </button>
            <button
              onClick={() => setActiveTab('journal')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${
                activeTab === 'journal'
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              <BookOpen className="w-5 h-5" />
              Journal
            </button>
          </div>

          {activeTab === 'trends' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Weekly Wellness Trend</h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading trends...</div>
              ) : (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={weeklyData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="date" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" domain={[0, 5]} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #14b8a6',
                        borderRadius: '12px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#14b8a6"
                      strokeWidth={3}
                      dot={{ fill: '#14b8a6', r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
              <p className="text-sm text-gray-600 mt-4 text-center">
                Wellness score ranges from 1 (stressed) to 5 (peaceful)
              </p>
              {error && <p className="text-sm text-amber-600 mt-2 text-center">{error}</p>}
            </motion.div>
          )}

          {activeTab === 'distribution' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              <h2 className="text-2xl font-bold text-gray-800 mb-6">Mood Distribution</h2>
              {loading ? (
                <div className="text-center py-12 text-gray-500">Loading distribution...</div>
              ) : moodDistribution.length > 0 ? (
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <ResponsiveContainer width="100%" height={300}>
                    <RePieChart>
                      <Pie
                        data={moodDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {moodDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                  <div className="space-y-3">
                    {moodDistribution.map((mood) => (
                      <div key={mood.name} className="flex items-center gap-3">
                        <div
                          className="w-6 h-6 rounded-full"
                          style={{ backgroundColor: mood.color }}
                        />
                        <span className="text-gray-700 font-medium">
                          {mood.name}: {mood.value} entries
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-center py-12 text-gray-500">
                  No mood data available yet. Start tracking your feelings!
                </div>
              )}
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              <div className="bg-white rounded-3xl shadow-xl p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Wellness Journal</h2>
                <form onSubmit={handleJournalSubmit} className="space-y-4">
                  <textarea
                    value={journalText}
                    onChange={(e) => setJournalText(e.target.value)}
                    placeholder="Reflect on your day, thoughts, and feelings..."
                    className="w-full h-32 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={!journalText.trim()}
                    className="flex items-center gap-2 bg-teal-500 hover:bg-teal-600 text-white px-6 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Send className="w-5 h-5" />
                    Add Entry
                  </button>
                </form>
              </div>

              <div className="space-y-4">
                {journalEntries.map((entry, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl shadow-lg p-6"
                  >
                    <p className="text-gray-700 mb-3">{entry.text}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(entry.timestamp).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default FeelingTracker;
