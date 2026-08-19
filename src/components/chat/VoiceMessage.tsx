'use client';

import React, { useState } from 'react';
import { Volume2, VolumeX, Loader2 } from 'lucide-react';

interface VoiceMessageProps {
  text: string;
  isWelcome?: boolean;
  onPlayStateChange?: (isPlaying: boolean) => void;
}

let activeAudio: HTMLAudioElement | null = null;
let activeSetPlaying: ((p: boolean) => void) | null = null;

export function stopCurrentAudio() {
  if (activeAudio) {
    activeAudio.pause();
    activeAudio = null;
  }
  if (activeSetPlaying) {
    activeSetPlaying(false);
    activeSetPlaying = null;
  }
}

export default function VoiceMessage({ text, isWelcome }: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const togglePlayback = async () => {
    if (isPlaying) {
      stopCurrentAudio();
      return;
    }

    stopCurrentAudio();

    if (isWelcome) {
      setIsPlaying(true);
      activeSetPlaying = setIsPlaying;
      activeAudio = new Audio('/audio/welcome.wav');
      activeAudio.onended = () => stopCurrentAudio();
      activeAudio.onerror = () => stopCurrentAudio();
      try {
        await activeAudio.play();
      } catch (err) {
        console.error('Welcome audio error:', err);
        stopCurrentAudio();
      }
      return;
    }

    // Clean plain text
    const cleanText = text
      .replace(/<[^>]*>/g, '')
      .replace(/[#*`_\[\]()]/g, ' ')
      .replace(/https?:\/\/\S+/g, '')
      .replace(/\n+/g, '. ')
      .trim();

    if (!cleanText) return;

    setIsLoading(true);

    try {
      const geminiVoice = localStorage.getItem('gemini_tts_voice') || 'Aoede';
      const googleKey = localStorage.getItem('google_tts_api_key') || '';

      const res = await fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanText.slice(0, 4800),
          voice: geminiVoice,
          apiKey: googleKey
        })
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Errore HTTP ${res.status}`);
      }

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      setIsLoading(false);
      setIsPlaying(true);
      activeSetPlaying = setIsPlaying;

      activeAudio = new Audio(url);
      activeAudio.onended = () => stopCurrentAudio();
      activeAudio.onerror = () => stopCurrentAudio();
      await activeAudio.play();
    } catch (err: any) {
      setIsLoading(false);
      stopCurrentAudio();
      alert(`⚠️ Errore sintesi vocale: ${err.message}`);
    }
  };

  return (
    <button
      onClick={togglePlayback}
      disabled={isLoading}
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200 ${
        isPlaying
          ? 'bg-gold/20 text-gold border-gold/60 shadow-[0_0_12px_rgba(223,177,91,0.3)]'
          : 'bg-white/5 hover:bg-white/10 text-slate-300 border-white/10 hover:border-gold/40'
      }`}
    >
      {isLoading ? (
        <>
          <Loader2 className="w-3.5 h-3.5 animate-spin text-gold" />
          <span>Generazione voce...</span>
        </>
      ) : isPlaying ? (
        <>
          <div className="soundwave">
            <span className="soundwave-bar"></span>
            <span className="soundwave-bar"></span>
            <span className="soundwave-bar"></span>
          </div>
          <span>In riproduzione</span>
          <VolumeX className="w-3.5 h-3.5 ml-1 text-slate-400 hover:text-white" />
        </>
      ) : (
        <>
          <Volume2 className="w-3.5 h-3.5 text-gold" />
          <span>Ascolta</span>
        </>
      )}
    </button>
  );
}
