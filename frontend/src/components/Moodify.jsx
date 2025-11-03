import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, MessageSquare, Mic, Video, Loader2, Sparkles } from 'lucide-react';
import useMoodStore from '../store/moodStore';

const Moodify = ({ onNavigate }) => {
  const [inputType, setInputType] = useState('text');
  const [textInput, setTextInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const { analyzeMood, loading, mood, aiMessage, error, clearMood } = useMoodStore();

  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);

  const handleTextSubmit = async (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    await analyzeMood(textInput, 'text');
    setTextInput('');
  };

  const handleVoiceRecord = async () => {
    if (!isRecording) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);

        const chunks = [];
        mediaRecorderRef.current.ondataavailable = (e) => chunks.push(e.data);
        mediaRecorderRef.current.onstop = async () => {
          const blob = new Blob(chunks, { type: 'audio/webm' });
          await analyzeMood(blob, 'voice');
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
      } catch (error) {
        console.error('Voice recording error:', error);
        alert('Please allow microphone access');
      }
    } else {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleVideoCapture = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();

        setTimeout(async () => {
          const canvas = document.createElement('canvas');
          canvas.width = videoRef.current.videoWidth;
          canvas.height = videoRef.current.videoHeight;
          canvas.getContext('2d').drawImage(videoRef.current, 0, 0);

          canvas.toBlob(async (blob) => {
            await analyzeMood(blob, 'video');
            stream.getTracks().forEach(track => track.stop());
            if (videoRef.current) videoRef.current.srcObject = null;
          });
        }, 3000);
      }
    } catch (error) {
      console.error('Video capture error:', error);
      alert('Please allow camera access');
    }
  };

  const inputTypes = [
    { id: 'text', label: 'Text', icon: MessageSquare },
    { id: 'voice', label: 'Voice', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-teal-50">
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={() => {
            clearMood();
            onNavigate('home');
          }}
          className="flex items-center gap-2 text-gray-700 hover:text-teal-600 transition-colors mb-8"
        >
          <ArrowLeft className="w-5 h-5" />
          <span>Back to Home</span>
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-3">Moodify</h1>
            <p className="text-gray-600">Express yourself in the way that feels natural</p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 mb-6">
            <div className="flex justify-center gap-4 mb-8">
              {inputTypes.map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setInputType(id)}
                  className={`flex flex-col items-center gap-2 px-6 py-4 rounded-xl transition-all ${
                    inputType === id
                      ? 'bg-teal-500 text-white shadow-lg scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="text-sm font-medium">{label}</span>
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {inputType === 'text' && (
                <motion.form
                  key="text"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  onSubmit={handleTextSubmit}
                  className="space-y-4"
                >
                  <textarea
                    value={textInput}
                    onChange={(e) => setTextInput(e.target.value)}
                    placeholder="How are you feeling today? Share your thoughts..."
                    className="w-full h-40 px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-teal-500 focus:outline-none resize-none"
                  />
                  <button
                    type="submit"
                    disabled={loading || !textInput.trim()}
                    className="w-full bg-teal-500 hover:bg-teal-600 text-white py-3 rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-5 h-5" />
                        Analyze Mood
                      </>
                    )}
                  </button>
                </motion.form>
              )}

              {inputType === 'voice' && (
                <motion.div
                  key="voice"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center space-y-6"
                >
                  <div className="flex justify-center">
                    <motion.button
                      onClick={handleVoiceRecord}
                      disabled={loading}
                      animate={isRecording ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ duration: 1, repeat: isRecording ? Infinity : 0 }}
                      className={`w-32 h-32 rounded-full flex items-center justify-center transition-all ${
                        isRecording
                          ? 'bg-red-500 hover:bg-red-600'
                          : 'bg-teal-500 hover:bg-teal-600'
                      } text-white shadow-2xl disabled:opacity-50`}
                    >
                      <Mic className="w-12 h-12" />
                    </motion.button>
                  </div>
                  <p className="text-gray-600">
                    {isRecording ? 'Recording... Click to stop' : 'Click to start recording'}
                  </p>
                </motion.div>
              )}

              {inputType === 'video' && (
                <motion.div
                  key="video"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="text-center space-y-6"
                >
                  <video
                    ref={videoRef}
                    className="w-full max-w-md mx-auto rounded-xl bg-gray-900"
                    autoPlay
                    muted
                  />
                  <button
                    onClick={handleVideoCapture}
                    disabled={loading}
                    className="bg-teal-500 hover:bg-teal-600 text-white px-8 py-3 rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center justify-center gap-2 mx-auto"
                  >
                    <Video className="w-5 h-5" />
                    Capture Emotion
                  </button>
                  <p className="text-gray-600 text-sm">
                    Camera will capture after 3 seconds
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <AnimatePresence>
            {mood && aiMessage && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white rounded-3xl shadow-xl p-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Sparkles className="w-8 h-8" />
                  <h2 className="text-2xl font-bold capitalize">Feeling: {mood}</h2>
                </div>
                <p className="text-lg leading-relaxed text-teal-50">
                  {aiMessage}
                </p>
                {error && (
                  <p className="mt-4 text-sm text-teal-100 italic">
                    Note: {error}
                  </p>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

export default Moodify;
