import React, { useState } from 'react';
import { Play, Pause, Download, Settings, Volume2, Mic } from 'lucide-react';
import { voices } from '../data/voices';
import { Voice, VoiceSettings } from '../types';

export function TextToSpeech() {
  const [text, setText] = useState('');
  const [selectedVoice, setSelectedVoice] = useState<Voice>(voices[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>({
    stability: 0.5,
    similarityBoost: 0.75,
    style: 0.3,
    useStyleDirection: false
  });
  const [showSettings, setShowSettings] = useState(false);

  const handleGenerate = async () => {
    if (!text.trim()) return;
    
    setIsGenerating(true);
    try {
      // Simulate audio generation
      await new Promise(resolve => setTimeout(resolve, 3000));
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
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Text-to-Speech</h1>
        <p className="text-gray-600">Converta qualquer texto em áudio profissional com IA</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Text Input */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Texto para Conversão</h2>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={12}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Digite ou cole o texto que deseja converter em áudio..."
            />
            
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-500">
                {text.length} caracteres • {text.split(' ').filter(word => word.length > 0).length} palavras
              </div>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                  Configurações
                </button>
                
                <button
                  onClick={handleGenerate}
                  disabled={!text.trim() || isGenerating}
                  className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Gerando...
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      Gerar Áudio
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Audio Player */}
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Reprodução de Áudio</h2>
            
            <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-medium text-gray-900">{selectedVoice.name}</h3>
                  <p className="text-sm text-gray-600">{selectedVoice.language}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handlePlay}
                    className="w-12 h-12 bg-white shadow-md rounded-full flex items-center justify-center hover:shadow-lg transition-shadow"
                  >
                    {isPlaying ? (
                      <Pause className="w-6 h-6 text-purple-600" />
                    ) : (
                      <Play className="w-6 h-6 text-purple-600 ml-1" />
                    )}
                  </button>
                  <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-white rounded-lg transition-colors">
                    <Download className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              {/* Audio Waveform Placeholder */}
              <div className="flex items-center gap-1 h-12">
                {Array.from({ length: 50 }, (_, i) => (
                  <div
                    key={i}
                    className={`w-1 bg-purple-400 rounded-full transition-all duration-200 ${
                      isPlaying && i < 25 ? 'opacity-100' : 'opacity-30'
                    }`}
                    style={{ 
                      height: `${Math.random() * 40 + 10}px`,
                      animationDelay: `${i * 0.1}s`
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
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Seleção de Voz</h2>
            
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {Object.entries(languageGroups).map(([language, voiceList]) => (
                <div key={language}>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">{language}</h3>
                  {voiceList.map((voice) => (
                    <div
                      key={voice.id}
                      onClick={() => setSelectedVoice(voice)}
                      className={`p-3 rounded-lg cursor-pointer transition-all ${
                        selectedVoice.id === voice.id
                          ? 'bg-blue-50 border-2 border-blue-200'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{voice.name}</p>
                          <p className="text-sm text-gray-600 capitalize">{voice.gender}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {voice.category === 'premium' && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
                              Premium
                            </span>
                          )}
                          <button className="p-1 text-gray-400 hover:text-gray-600">
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
            <div className="bg-white rounded-xl border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Configurações de Voz</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estabilidade: {voiceSettings.stability.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.stability}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, stability: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Controla a variabilidade da voz</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Clareza: {voiceSettings.similarityBoost.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.similarityBoost}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, similarityBoost: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Fidelidade à voz original</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estilo: {voiceSettings.style.toFixed(2)}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.01"
                    value={voiceSettings.style}
                    onChange={(e) => setVoiceSettings(prev => ({ ...prev, style: parseFloat(e.target.value) }))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-xs text-gray-500 mt-1">Intensidade do estilo</p>
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-6 text-white">
            <h3 className="font-semibold mb-3">Recursos Premium</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                Voice Cloning
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                Streaming em Tempo Real
              </div>
              <div className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Controles Avançados
              </div>
            </div>
            <button className="w-full mt-4 bg-white text-purple-600 px-4 py-2 rounded-lg font-medium hover:bg-purple-50 transition-colors">
              Upgrade para Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}