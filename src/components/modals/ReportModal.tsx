'use client';

import React from 'react';
import { X, FileText, Copy, Printer, Volume2, Sparkles } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import VoiceMessage from '../chat/VoiceMessage';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportMarkdown: string;
}

export default function ReportModal({ isOpen, onClose, reportMarkdown }: ReportModalProps) {
  if (!isOpen) return null;

  const copyMarkdown = () => {
    navigator.clipboard.writeText(reportMarkdown).then(() => {
      alert('Report copiato negli appunti in formato Markdown!');
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-4xl glass-panel rounded-2xl border border-gold/30 shadow-2xl flex flex-col max-h-[90vh] overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-gold/15 flex items-center justify-between bg-black/40">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gold/10 border border-gold/30 text-gold">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-serif font-bold text-slate-100">Report Completo Matrice del Destino</h3>
              <p className="text-xs text-slate-400">Analisi Archetipica e Numerologica a 14 Sezioni</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body Content */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-black/50 prose-sacred">
          {reportMarkdown ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {reportMarkdown}
            </ReactMarkdown>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-40 text-gold" />
              <p>Nessun report generato finora. Avvia una sessione di analisi con la guida AI.</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gold/15 bg-black/40 flex flex-wrap items-center justify-between gap-3">
          {reportMarkdown && (
            <VoiceMessage text={reportMarkdown} />
          )}
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={copyMarkdown}
              disabled={!reportMarkdown}
              className="px-4 py-2 rounded-xl border border-white/10 text-slate-300 hover:bg-white/5 disabled:opacity-30 text-xs font-medium transition-colors flex items-center gap-1.5"
            >
              <Copy className="w-3.5 h-3.5" />
              Copia Markdown
            </button>
            <button
              onClick={() => window.print()}
              disabled={!reportMarkdown}
              className="px-5 py-2 rounded-xl bg-gold text-black hover:bg-gold-light disabled:opacity-30 font-bold text-xs transition-all shadow-[0_0_12px_rgba(223,177,91,0.3)] flex items-center gap-1.5"
            >
              <Printer className="w-3.5 h-3.5" />
              Stampa / Salva PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
