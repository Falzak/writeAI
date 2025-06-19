import React, { useState } from "react";
import { Play, Pause, Download, Settings, Volume2, Mic } from "lucide-react";
import { voices } from "../data/voices";
import { Voice, VoiceSettings } from "../types";

export function TextToSpeech() {
  const [text, setText] = useState("");
  const [selectedVoice, setSelectedVoice] = useState<Voice>(voices[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
    useStyleDirection: false,
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate audio generation
      await new Promise((resolve) => setTimeout(resolve, 3000));
      // In a real app, this would call the ElevenLabs API
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control audio playback
    setTimeout(() => setIsPlaying(false), 5000);
  };

  const languageGroups = voices.reduce((groups, voice) => {
    const language = voice.language;
    if (!groups[language]) {
      groups[language] = [];
    }
    groups[language].push(voice);
    return groups;
  }, {} as Record<string, Voice[]>);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Text-to-Speech
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          Convert any text to professional audio with AI
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Text for Conversion
            </h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none placeholder-gray-500 dark:placeholder-gray-400"
              placeholder="Type or paste the text you want to convert to audio..."
            />

            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {text.length} characters •{" "}
                {text.split(" ").filter((word) => word.length > 0).length} words
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Settings
                </button>

                <button
                  onClick={handleGenerate}
                  disabled={!text.trim() || isGenerating}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Generate Audio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Audio Playback
            </h2>

            <div className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900 dark:text-white">
                    {selectedVoice.name}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    {selectedVoice.language}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlay}
                    className="w-12 h-12 bg-white dark:bg-gray-700 shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-600 dark:text-purple-400 ml-1" />
                    )}
                  </button>
                  <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-white dark:hover:bg-gray-700 rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Audio Waveform Placeholder */}
              <div className="flex items-center gap-1 h-12">
                {Array.from({ length: 50 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-purple-400 dark:bg-purple-500 rounded-full transition-all duration-200 ${
                      isPlaying && i < 25 ? "opacity-100" : "opacity-30"
                    }`}
                    style={{
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 0.1}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Voice Selection & Settings */}
        <div className="space-y-6">
          {/* Voice Selection */}
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Voice Selection
            </h2>

            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(languageGroups).map(([language, voiceList]) => (
                <div key={language}>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                    {language}
                  </h3>
                  {voiceList.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedVoice.id === voice.id
                          ? "bg-blue-50 dark:bg-blue-900/30 border-2 border-blue-200 dark:border-blue-500"
                          : "bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 border-2 border-transparent"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {voice.name}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-300 capitalize">
                            {voice.gender}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          {voice.category === "premium" && (
                            <span className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                          <button className="p-1 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                            <Play className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Voice Settings */}
          {showSettings && (
            <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Voice Settings
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Stability: {voiceSettings.stability.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.stability}
                    onChange={(e) =>
                      setVoiceSettings((prev) => ({
                        ...prev,
                        stability: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Controls voice variability
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Clarity: {voiceSettings.similarityBoost.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.similarityBoost}
                    onChange={(e) =>
                      setVoiceSettings((prev) => ({
                        ...prev,
                        similarityBoost: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Fidelity to original voice
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Style: {voiceSettings.style.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.style}
                    onChange={(e) =>
                      setVoiceSettings((prev) => ({
                        ...prev,
                        style: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    Style intensity
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-3">Premium Features</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Cloning
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Real-time Streaming
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Advanced Controls
              </div>
            </div>
            <button className="w-full mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
