import { motion } from 'framer-motion';
import { Sparkles, Heart, TrendingUp } from 'lucide-react';

const Home = ({ onNavigate }) => {
  const shlokas = [
    {
      sanskrit: 'शान्तिः शान्तिः शान्तिः',
      english: 'Peace, Peace, Peace',
      description: 'May peace pervade everywhere',
    },
    {
      sanskrit: 'सर्वे भवन्तु सुखिनः',
      english: 'May all beings be happy',
      description: 'Universal wellbeing and harmony',
    },
  ];

  const currentShloka = shlokas[Math.floor(Date.now() / 86400000) % shlokas.length];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-green-50 to-emerald-50">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-block mb-6"
          >
            <Heart className="w-16 h-16 text-teal-600 mx-auto" />
          </motion.div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mb-4">
            मधुरम् | जीवन-अमृत
          </h1>
          <h2 className="text-3xl md:text-4xl font-light text-teal-700 mb-8">
            Maduram | Jeevan-Amrit
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A sacred space for emotional wellness and self-discovery
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="max-w-3xl mx-auto mb-16 bg-white/80 backdrop-blur rounded-3xl shadow-xl p-8 md:p-12"
        >
          <div className="text-center mb-6">
            <p className="text-3xl md:text-4xl text-gray-800 font-serif mb-4">
              {currentShloka.sanskrit}
            </p>
            <p className="text-xl text-teal-700 font-medium mb-2">
              {currentShloka.english}
            </p>
            <p className="text-gray-600 italic">
              {currentShloka.description}
            </p>
          </div>
        </motion.div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-8">
          <motion.button
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('moodify')}
            className="bg-gradient-to-br from-teal-500 to-green-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <Sparkles className="w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-3">Moodify</h3>
            <p className="text-teal-50">
              Express your feelings through text, voice, or video and receive
              personalized insights
            </p>
          </motion.button>

          <motion.button
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            whileHover={{ scale: 1.05, y: -5 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate('tracker')}
            className="bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300"
          >
            <TrendingUp className="w-12 h-12 mb-4 mx-auto" />
            <h3 className="text-2xl font-bold mb-3">Feeling Tracker</h3>
            <p className="text-emerald-50">
              Visualize your emotional journey and maintain a wellness journal
            </p>
          </motion.button>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-16 text-gray-600"
        >
          <p className="text-sm">
            Your journey to inner peace begins with awareness
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
