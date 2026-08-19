'use client';

import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Square, Sparkles, Brain, ChevronDown, User, Bot, Volume2 } from 'lucide-react';
import { ChatMessage } from '@/lib/types';
import VoiceMessage, { stopCurrentAudio } from './VoiceMessage';

interface ChatContainerProps {
  messages: ChatMessage[];
  isGenerating: boolean;
  onSendMessage: (text: string) => void;
  onStopGeneration: () => void;
}

export default function ChatContainer({
  messages,
  isGenerating,
  onSendMessage,
  onStopGeneration
}: ChatContainerProps) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isGenerating) return;
    onSendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="flex flex-col h-full glass-panel rounded-2xl border border-gold/15 overflow-hidden shadow-2xl">
      {/* Chat Messages List */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((msg, idx) => {
          const isUser = msg.role === 'user';
          const isWelcome = idx === 0 && !isUser;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 sm:gap-4 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 border ${
                  isUser
                    ? 'bg-cyan-accent/20 text-cyan-accent border-cyan-accent/40'
                    : 'bg-gold/20 text-gold border-gold/40 shadow-[0_0_12px_rgba(223,177,91,0.25)]'
                }`}
              >
                {isUser ? <User className="w-4 h-4" /> : <Sparkles className="w-4 h-4" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`max-w-[85%] rounded-2xl p-4 sm:p-5 border transition-all ${
                  isUser
                    ? 'bg-cyan-accent/10 border-cyan-accent/25 text-slate-100 rounded-tr-none'
                    : 'glass-card border-gold/20 text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Optional Reasoning Block */}
                {msg.reasoning && (
                  <details className="mb-3 bg-black/40 border border-white/10 rounded-lg p-2.5 text-xs text-slate-400">
                    <summary className="cursor-pointer font-mono flex items-center gap-1.5 text-gold hover:text-gold-light select-none">
                      <Brain className="w-3.5 h-3.5" />
                      <span>Ragionamento Archetipico AI</span>
                      <ChevronDown className="w-3 h-3 ml-auto" />
                    </summary>
                    <div className="mt-2 pt-2 border-t border-white/5 whitespace-pre-wrap font-mono text-[0.75rem] text-slate-400 leading-relaxed">
                      {msg.reasoning}
                    </div>
                  </details>
                )}

                {/* Markdown Content */}
                <div className="prose-sacred">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>

                {/* Voice Play Button for Assistant Messages */}
                {!isUser && msg.content && (
                  <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between">
                    <VoiceMessage text={msg.content} isWelcome={isWelcome} />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar */}
      <div className="p-3 sm:p-4 bg-black/40 border-t border-gold/15">
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isGenerating}
            placeholder="Scrivi la tua risposta o domanda sulla Matrice..."
            rows={1}
            className="flex-1 bg-white/5 border border-gold/20 rounded-xl px-4 py-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-gold/60 focus:ring-1 focus:ring-gold/60 resize-none max-h-32 transition-all"
          />

          {isGenerating ? (
            <button
              type="button"
              onClick={onStopGeneration}
              className="bg-crimson-karma/20 text-crimson-karma border border-crimson-karma/40 hover:bg-crimson-karma/30 px-4 py-3 rounded-xl flex items-center justify-center shrink-0 transition-all"
              title="Ferma generazione"
            >
              <Square className="w-4 h-4 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              className="bg-gold text-black hover:bg-gold-light disabled:opacity-30 disabled:hover:bg-gold px-4 py-3 rounded-xl flex items-center justify-center shrink-0 font-bold transition-all shadow-[0_0_15px_rgba(223,177,91,0.35)]"
              title="Invia messaggio"
            >
              <Send className="w-4 h-4" />
            </button>
          )}
        </form>
      </div>
    </div>
  );
}
