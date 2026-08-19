'use client';

import React, { useState } from 'react';
import { X, Sparkles, Wand2, Calendar, User, Clock, MapPin, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WizardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmitData: (data: { name: string; birthDate: string; birthTime: string; birthPlace: string; analysisType: string }) => void;
}

export default function WizardModal({ isOpen, onClose, onSubmitData }: WizardModalProps) {
  const [name, setName] = useState('Andrea Giuliano');
  const [birthDate, setBirthDate] = useState('1992-11-28');
  const [birthTime, setBirthTime] = useState('12:45');
  const [birthPlace, setBirthPlace] = useState('Catania, Italia');
  const [analysisType, setAnalysisType] = useState('2');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !birthDate) {
      alert('Inserisci almeno Nome e Data di Nascita.');
      return;
    }

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.6 },
      colors: ['#DFB15B', '#38EF7D', '#FFFFFF']
    });

    onSubmitData({
      name,
      birthDate,
      birthTime,
      birthPlace,
      analysisType
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-lg glass-panel rounded-2xl border border-gold/30 shadow-2xl p-6 sm:p-8 animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2.5 rounded-xl bg-gold/10 border border-gold/30 text-gold">
            <Wand2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-serif font-bold text-slate-100">Modulo Guidato Matrice</h3>
            <p className="text-xs text-slate-400">Compila i dati per l'analisi a 14 sezioni</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gold" />
              Nome Completo all'Anagrafe
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="es. Andrea Giuliano"
              required
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-gold" />
                Data di Nascita
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                required
                className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-gold" />
                Ora di Nascita (Opzionale)
              </label>
              <input
                type="time"
                value={birthTime}
                onChange={(e) => setBirthTime(e.target.value)}
                className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-gold" />
              Luogo di Nascita
            </label>
            <input
              type="text"
              value={birthPlace}
              onChange={(e) => setBirthPlace(e.target.value)}
              placeholder="es. Catania, Italia"
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-gold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
              Tipologia di Analisi Desiderata
            </label>
            <select
              value={analysisType}
              onChange={(e) => setAnalysisType(e.target.value)}
              className="w-full bg-black/50 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:border-gold"
            >
              <option value="1">1. Solo Numerologica (Matrice del Destino pura)</option>
              <option value="2">2. Numerologica + Astrologica Simbolica (Consigliata)</option>
              <option value="3">3. Analisi Completa (Focus Professionale & Relazionale)</option>
            </select>
          </div>

          <div className="pt-4 flex justify-end gap-3">
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
              <CheckCircle2 className="w-4 h-4" />
              Calcola & Avvia Analisi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
