'use client';

import React from 'react';
import { MatrixData } from '@/lib/types';
import { Sparkles, Brain, Heart, Activity } from 'lucide-react';

interface PythagoreanGridProps {
  data: MatrixData;
}

export default function PythagoreanGrid({ data }: PythagoreanGridProps) {
  const counts = data.grid3x3.counts;
  const lines = data.grid3x3.lines;

  const renderCell = (num: number, label: string) => {
    const count = counts[num] || 0;
    const str = count > 0 ? String(num).repeat(count) : '—';

    return (
      <div className="glass-card p-3 rounded-lg flex flex-col items-center justify-center border border-gold/15 hover:border-gold/40 transition-all">
        <span className="text-[0.7rem] uppercase tracking-wider text-slate-400 mb-1">{label}</span>
        <span className={`text-lg font-bold font-serif ${count > 0 ? 'text-gold' : 'text-slate-600'}`}>
          {str}
        </span>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-sm font-serif font-bold text-gold flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-cyan-accent" />
          Griglia Pitagorica dei Talenti (3x3)
        </h4>
        <div className="grid grid-cols-3 gap-2.5">
          {renderCell(1, '1 • Carattere')}
          {renderCell(4, '4 • Salute')}
          {renderCell(7, '7 • Fortuna')}

          {renderCell(2, '2 • Energia')}
          {renderCell(5, '5 • Logica')}
          {renderCell(8, '8 • Senso Dovere')}

          {renderCell(3, '3 • Interesse')}
          {renderCell(6, '6 • Lavoro/Materia')}
          {renderCell(9, '9 • Memoria')}
        </div>
      </div>

      {/* Planes and Lines Analysis */}
      <div>
        <h4 className="text-sm font-serif font-bold text-gold flex items-center gap-2 mb-3">
          <Activity className="w-4 h-4 text-cyan-accent" />
          Piani Energetici & Vettori
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Piano Mentale (1-2-3):</span>
            <span className="font-bold font-serif text-gold">{lines.mental} cifre</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Piano Emotivo (4-5-6):</span>
            <span className="font-bold font-serif text-gold">{lines.emotional} cifre</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Piano Pratico (7-8-9):</span>
            <span className="font-bold font-serif text-gold">{lines.practical} cifre</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Vettore Volontà (2-5-8):</span>
            <span className="font-bold font-serif text-gold">{lines.will} cifre</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Linea Determinazione (1-5-9):</span>
            <span className="font-bold font-serif text-gold">{lines.determination} cifre</span>
          </div>
          <div className="glass-panel p-3 rounded-lg border border-white/5 flex justify-between items-center">
            <span className="text-slate-300">Linea Spiritualità (3-5-7):</span>
            <span className="font-bold font-serif text-gold">{lines.spirituality} cifre</span>
          </div>
        </div>
      </div>
    </div>
  );
}
