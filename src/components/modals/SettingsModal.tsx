'use client';

import React, { useState, useEffect } from 'react';
import { X, Settings, Volume2, Key, Cpu, ExternalLink, Save, Check } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
}

export default function SettingsModal({ isOpen, onClose, onSave }: SettingsModalProps) {
  const [provider, setProvider] = useState('groq');
  const [baseUrl, setBaseUrl] = useState('https://api.groq.com/openai/v1');
  const [apiKey, setApiKey] = useState('');
  const [model, setModel] = useState('qwen/qwen3.6-27b');
  const [googleKey, setGoogleKey] = useState('');
  const [geminiVoice, setGeminiVoice] = useState('Aoede');
  const [elKey, setElKey] = useState('');
  const [elVoice, setElVoice] = useState('21m00Tcm4TlvDq8ikWAM');

  useEffect(() => {
    if (isOpen) {
      setProvider(localStorage.getItem('ai_provider') || 'groq');
      setBaseUrl(localStorage.getItem('ai_base_url') || 'https://api.groq.com/openai/v1');
      setApiKey(localStorage.getItem('ai_api_key') || '');
      setModel(localStorage.getItem('ai_model') || 'qwen/qwen3.6-27b');
      setGoogleKey(localStorage.getItem('google_tts_api_key') || '');
      setGeminiVoice(localStorage.getItem('gemini_tts_voice') || 'Aoede');
      setElKey(localStorage.getItem('elevenlabs_api_key') || '');
      setElVoice(localStorage.getItem('elevenlabs_voice_id') || '21m00Tcm4TlvDq8ikWAM');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('ai_provider', provider);
    localStorage.setItem('ai_base_url', baseUrl);
    localStorage.setItem('ai_api_key', apiKey);
    localStorage.setItem('ai_model', model);
    localStorage.setItem('google_tts_api_key', googleKey);
    localStorage.setItem('gemini_tts_voice', geminiVoice);
    localStorage.setItem('elevenlabs_api_key', elKey);
    localStorage.setItem('elevenlabs_voice_id', elVoice);

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-xl glass-panel rounded-2xl border border-gold/30 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-100">Impostazioni AI & Sintesi Vocale</h3>
            <p className="text-xs text-slate-400">Configura i provider LLM e i parametri vocali</p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-gold" />
              Provider LLM
            </label>
            <select
              value={provider}
              onChange={(e) => {
                setProvider(e.target.value);
                if (e.target.value === 'groq') {
                  setBaseUrl('https://api.groq.com/openai/v1');
                  setModel('qwen/qwen3.6-27b');
                } else if (e.target.value === 'openrouter') {
                  setBaseUrl('https://openrouter.ai/api/v1');
                  setModel('deepseek/deepseek-r1:free');
                }
              }}
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold"
            >
              <option value="groq">Groq Cloud (qwen3.6 / llama3.3 — Ultra Veloce)</option>
              <option value="openrouter">OpenRouter AI (DeepSeek / Gemini)</option>
              <option value="custom">Endpoint OpenAI Compatibile Personalizzato</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Key className="w-3.5 h-3.5 text-gold" />
                API Key LLM ({provider})
              </span>
              <a
                href={provider === 'groq' ? 'https://console.groq.com/keys' : 'https://openrouter.ai/keys'}
                target="_blank"
                rel="noreferrer"
                className="text-[0.7rem] text-cyan-accent hover:underline flex items-center gap-1"
              >
                Ottieni Chiave <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </label>
            <input
              type="password"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="gsk_... o sk-or-..."
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Nome Modello
            </label>
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold font-mono"
            />
          </div>

          {/* Voice Settings Section */}
          <div className="pt-4 border-t border-gold/15">
            <h4 className="text-sm font-serif font-bold text-gold flex items-center gap-2 mb-3">
              <Volume2 className="w-4 h-4 text-cyan-accent" />
              Sintesi Vocale Neurale (Google Gemini Flash TTS)
            </h4>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                  <span>Google AI Studio Key (100% Free - Senza Carta)</span>
                  <a
                    href="https://aistudio.google.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-[0.7rem] text-cyan-accent hover:underline flex items-center gap-1"
                  >
                    Google AI Studio ↗
                  </a>
                </label>
                <input
                  type="password"
                  value={googleKey}
                  onChange={(e) => setGoogleKey(e.target.value)}
                  placeholder="AIzaSy... (Preconfigurata nel server)"
                  className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  Timbro Voce Neurale Gemini
                </label>
                <select
                  value={geminiVoice}
                  onChange={(e) => setGeminiVoice(e.target.value)}
                  className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold"
                >
                  <option value="Aoede">Aoede (Femminile — Calda, Armoniosa, Spirituale)</option>
                  <option value="Puck">Puck (Maschile — Brillante, Dinamico, Coinvolgente)</option>
                  <option value="Charon">Charon (Maschile — Profondo, Autorevole, Solenne)</option>
                  <option value="Kore">Kore (Femminile — Dolce, Rilassante, Serena)</option>
                  <option value="Fenrir">Fenrir (Maschile — Energetico, Diretto)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                  ElevenLabs API Key (Opzionale)
                </label>
                <input
                  type="password"
                  value={elKey}
                  onChange={(e) => setElKey(e.target.value)}
                  placeholder="Inserisci la tua chiave ElevenLabs..."
                  className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold font-mono"
                />
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-gold/15">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 text-sm font-medium transition-colors"
            >
              Annulla
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-gold text-black hover:bg-gold-light font-bold text-sm transition-all shadow-[0_0_15px_rgba(223,177,91,0.35)] flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Salva Impostazioni
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
