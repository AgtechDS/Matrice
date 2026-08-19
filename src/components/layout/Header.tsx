'use client';

import React from 'react';
import { Sparkles, Wand2, FileText, RotateCcw } from 'lucide-react';

interface HeaderProps {
  onOpenWizard: () => void;
  onOpenReport: () => void;
  onResetSession: () => void;
}

export default function Header({
  onOpenWizard,
  onOpenReport,
  onResetSession
}: HeaderProps) {
  return (
    <header className="relative z-20 border-b border-gold/15 bg-black/40 backdrop-blur-lg px-4 sm:px-8 py-3.5 flex items-center justify-between">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-xl bg-gold/10 border border-gold/40 flex items-center justify-center text-gold shadow-[0_0_15px_rgba(223,177,91,0.3)]">
          <Sparkles className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-base sm:text-lg font-serif font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-600">
            MATRICE DEL DESTINO <span className="text-[0.65rem] px-2 py-0.5 rounded-full bg-gold/20 text-gold border border-gold/40 font-sans tracking-wider ml-1">SACRED ORACLE</span>
          </h1>
          <p className="text-[0.65rem] tracking-wider uppercase text-slate-400">
            Guida Archetipica & Voce Neurale Attiva
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          onClick={onOpenWizard}
          className="px-3 sm:px-4 py-2 rounded-xl bg-gold/10 hover:bg-gold/20 text-gold border border-gold/30 hover:border-gold/60 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-[0_0_12px_rgba(223,177,91,0.15)]"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Modulo Guidato</span>
        </button>

        <button
          onClick={onOpenReport}
          className="px-3 sm:px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-200 border border-white/10 hover:border-gold/30 text-xs font-medium transition-all flex items-center gap-1.5"
        >
          <FileText className="w-3.5 h-3.5 text-cyan-accent" />
          <span className="hidden sm:inline">Report</span>
        </button>

        <button
          onClick={onResetSession}
          title="Nuova Sessione"
          className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 text-xs transition-all"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}
