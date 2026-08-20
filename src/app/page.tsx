'use client';

import React, { useState, useEffect } from 'react';
import SacredParticles from '@/components/canvas/SacredParticles';
import Header from '@/components/layout/Header';
import MatrixOctagram from '@/components/matrix/MatrixOctagram';
import PythagoreanGrid from '@/components/matrix/PythagoreanGrid';
import ChatContainer from '@/components/chat/ChatContainer';
import WizardModal from '@/components/modals/WizardModal';
import SettingsModal from '@/components/modals/SettingsModal';
import ReportModal from '@/components/modals/ReportModal';
import { calculateCompleteMatrix, getArcana } from '@/lib/matrix-engine';
import { MatrixData, MatrixNode, ChatMessage } from '@/lib/types';
import { Sparkles, Compass, Grid3X3, BookOpen, User, Calendar, Moon, Sun, Heart, Coins } from 'lucide-react';

const INITIAL_GREETING = `### Benvenuto nell'Analisi della Matrice del Destino 🌌

Sono la tua guida all'interpretazione simbolica e numerologica archetipica dei **22 Arcani** e della **Matrice del Destino**.

> *Ricorda: La numerologia è un linguaggio simbolico millenario per favorire l'introspezione e l'autoconsapevolezza, non per determinare un futuro immutabile.*

Per costruire la tua mappa energetica completa, procederemo raccogliendo i tuoi dati un passo alla volta.

---

**Domanda 1:**
*Qual è il tuo nome completo riportato all'anagrafe?*

*(Puoi rispondere direttamente qui in chat o cliccare su **Modulo Guidato** in alto per inserire tutti i dati insieme!)*`;

export default function Home() {
  const [activeTab, setActiveTab] = useState<'matrix' | 'grid' | 'aspects'>('matrix');
  const [matrixData, setMatrixData] = useState<MatrixData>(() =>
    calculateCompleteMatrix('Elena Solaris', '1995-07-21')
  );
  const [selectedNode, setSelectedNode] = useState<MatrixNode>(() => matrixData.matrix.top);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [abortController, setAbortController] = useState<AbortController | null>(null);

  // Modals state
  const [isWizardOpen, setIsWizardOpen] = useState(false);
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [fullReportMarkdown, setFullReportMarkdown] = useState('');

  // Initial welcome message setup
  useEffect(() => {
    resetChatSession();

    // Autoplay Welcome Audio
    const welcomeAudio = new Audio('/audio/welcome.wav');
    welcomeAudio.play().catch(() => {
      const onFirstInteraction = () => {
        welcomeAudio.play().catch(() => {});
        document.removeEventListener('click', onFirstInteraction);
        document.removeEventListener('touchstart', onFirstInteraction);
      };
      document.addEventListener('click', onFirstInteraction, { once: true });
      document.addEventListener('touchstart', onFirstInteraction, { once: true });
    });
  }, []);

  const resetChatSession = () => {
    setMessages([
      {
        id: 'msg-welcome',
        role: 'assistant',
        content: INITIAL_GREETING,
        createdAt: Date.now()
      }
    ]);
  };

  const handleSelectNode = (node: MatrixNode) => {
    setSelectedNode(node);
  };

  const handleWizardSubmit = (wizardData: {
    name: string;
    birthDate: string;
    birthTime: string;
    birthPlace: string;
    analysisType: string;
  }) => {
    const newMatrix = calculateCompleteMatrix(wizardData.name, wizardData.birthDate);
    setMatrixData(newMatrix);
    setSelectedNode(newMatrix.matrix.top);

    const typeDesc =
      wizardData.analysisType === '1'
        ? 'Solo Numerologica'
        : wizardData.analysisType === '2'
        ? 'Numerologica + Astrologica Simbolica'
        : 'Analisi Completa Focus Professionale & Relazionale';

    const promptMessage = `Ecco i miei dati completi per l'analisi:
- **Nome Completo:** ${wizardData.name}
- **Data di Nascita:** ${newMatrix.birthDate.str}
- **Ora di Nascita:** ${wizardData.birthTime || 'Non specificata'}
- **Luogo di Nascita:** ${wizardData.birthPlace || 'Non specificato'}
- **Tipologia di Analisi:** ${typeDesc}

Ti confermo tutti i dati. Puoi procedere con il report strutturato a 14 sezioni come previsto dal protocollo.`;

    handleSendMessage(promptMessage);
  };

  // Send AI message with streaming
  const handleSendMessage = async (text: string) => {
    if (isGenerating || !text.trim()) return;

    // Check if birthdate is present in user text to automatically update visualizer
    const dateMatch = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dateMatch) {
      const day = parseInt(dateMatch[1], 10);
      const month = parseInt(dateMatch[2], 10);
      const year = parseInt(dateMatch[3], 10);
      const newM = calculateCompleteMatrix(matrixData.name, `${year}-${month}-${day}`);
      setMatrixData(newM);
    }

    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      role: 'user',
      content: text,
      createdAt: Date.now()
    };

    const assistantMsgId = `ast-${Date.now()}`;
    const newMessages = [...messages, userMsg];
    setMessages([...newMessages, { id: assistantMsgId, role: 'assistant', content: '', createdAt: Date.now() }]);
    setIsGenerating(true);

    const controller = new AbortController();
    setAbortController(controller);

    try {
      const apiKey = localStorage.getItem('ai_api_key') || '';
      const baseUrl = localStorage.getItem('ai_base_url') || 'https://api.groq.com/openai/v1';
      const model = localStorage.getItem('ai_model') || 'qwen/qwen3.6-27b';

      const payloadMessages = [
        {
          role: 'system',
          content:
            "Sei un consulente esperto di Numerologia Archetipica e Matrice del Destino basata sui 22 Arcani. Rispondi SEMPRE in italiano, in modo strutturato, empatico, profondo ed esaustivo."
        },
        ...newMessages.map((m) => ({ role: m.role, content: m.content }))
      ];

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: payloadMessages,
          stream: true,
          apiKey,
          baseUrl,
          model
        }),
        signal: controller.signal
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error?.message || `Errore HTTP ${res.status}`);
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder('utf-8');
      let accumulatedText = '';

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            const trimmed = line.trim();
            if (trimmed.startsWith('data: ') && trimmed !== 'data: [DONE]') {
              try {
                const parsed = JSON.parse(trimmed.slice(6));
                const token = parsed.choices?.[0]?.delta?.content || '';
                accumulatedText += token;

                // Strip <think> tags for clean presentation
                let cleanContent = accumulatedText;
                let reasoningText = '';
                const thinkMatch = accumulatedText.match(/<think>([\s\S]*?)(?:<\/think>|$)/i);
                if (thinkMatch) {
                  reasoningText = thinkMatch[1].trim();
                  cleanContent = accumulatedText.replace(/<think>[\s\S]*?(?:<\/think>|$)/i, '').trim();
                }

                setMessages((prev) =>
                  prev.map((msg) =>
                    msg.id === assistantMsgId
                      ? { ...msg, content: cleanContent, reasoning: reasoningText }
                      : msg
                  )
                );
              } catch (e) {
                // partial chunk, continue
              }
            }
          }
        }
      }

      setFullReportMarkdown(accumulatedText);
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? { ...msg, content: `❌ Si è verificato un errore: ${err.message}` }
              : msg
          )
        );
      }
    } finally {
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  const handleStopGeneration = () => {
    if (abortController) {
      abortController.abort();
      setIsGenerating(false);
      setAbortController(null);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col z-10">
      <SacredParticles />

      <Header
        onOpenWizard={() => setIsWizardOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
        onResetSession={resetChatSession}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto p-3 sm:p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Sacred Geometry & Matrix Data (7 Cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Visualizer Card */}
          <div className="glass-panel rounded-2xl p-4 sm:p-6 border border-gold/20 shadow-2xl">
            {/* Tabs Header */}
            <div className="flex items-center justify-between border-b border-gold/15 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('matrix')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'matrix'
                      ? 'bg-gold text-black shadow-[0_0_12px_rgba(223,177,91,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <Compass className="w-3.5 h-3.5" />
                  Ottagramma
                </button>
                <button
                  onClick={() => setActiveTab('grid')}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    activeTab === 'grid'
                      ? 'bg-gold text-black shadow-[0_0_12px_rgba(223,177,91,0.4)]'
                      : 'bg-white/5 hover:bg-white/10 text-slate-300'
                  }`}
                >
                  <Grid3X3 className="w-3.5 h-3.5" />
                  Griglia 3x3
                </button>
              </div>

              {/* User Bio Badge */}
              <div className="text-right">
                <span className="text-xs font-serif font-bold text-gold block">{matrixData.name}</span>
                <span className="text-[0.7rem] text-slate-400">
                  {matrixData.birthDate.str} • {matrixData.astrology.sunSign}
                </span>
              </div>
            </div>

            {/* Tab 1: Matrix Octagram */}
            {activeTab === 'matrix' && (
              <div className="flex flex-col items-center">
                <MatrixOctagram
                  data={matrixData}
                  selectedNodeKey={selectedNode.key}
                  onSelectNode={handleSelectNode}
                />
                <p className="text-[0.7rem] text-slate-400 mt-2 text-center">
                  💡 Clicca su qualsiasi nodo dell'ottagramma per visualizzarne l'Arcano e l'archetipo
                </p>
              </div>
            )}

            {/* Tab 2: Pythagorean Grid */}
            {activeTab === 'grid' && <PythagoreanGrid data={matrixData} />}
          </div>

          {/* Selected Node Arcana Inspector Card */}
          <div className="glass-card rounded-2xl p-5 border border-gold/25 shadow-lg">
            <div className="flex items-start justify-between gap-4">
              <div>
                <span className="text-[0.68rem] uppercase tracking-wider text-slate-400 font-semibold block mb-1">
                  {selectedNode.label}
                </span>
                <h3 className="text-lg font-serif font-bold text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-gold to-yellow-500">
                  Arcano {selectedNode.value} • {selectedNode.arcana.name}
                </h3>
                <p className="text-xs text-cyan-accent font-medium mt-0.5">
                  {selectedNode.arcana.archetype}
                </p>
              </div>
              <div className="w-12 h-12 rounded-2xl bg-gold/10 border border-gold/40 flex items-center justify-center text-xl font-serif font-black text-gold shadow-[0_0_15px_rgba(223,177,91,0.25)] shrink-0">
                {selectedNode.value}
              </div>
            </div>

            <p className="text-xs text-slate-300 mt-3 leading-relaxed">
              {selectedNode.description}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 pt-3 border-t border-white/5 text-xs">
              <div className="p-3 rounded-xl bg-cyan-accent/5 border border-cyan-accent/15">
                <span className="text-cyan-accent font-bold block mb-1">✨ In Luce:</span>
                <p className="text-slate-300">{selectedNode.arcana.light}</p>
              </div>
              <div className="p-3 rounded-xl bg-crimson-karma/5 border border-crimson-karma/15">
                <span className="text-crimson-karma font-bold block mb-1">🌑 In Ombra:</span>
                <p className="text-slate-300">{selectedNode.arcana.shadow}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: AI Chat & Audio Guide (5 Cols) */}
        <div className="lg:col-span-5 h-[calc(100vh-120px)] sticky top-20">
          <ChatContainer
            messages={messages}
            isGenerating={isGenerating}
            onSendMessage={handleSendMessage}
            onStopGeneration={handleStopGeneration}
          />
        </div>
      </main>

      {/* Modals */}
      <WizardModal
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
        onSubmitData={handleWizardSubmit}
      />

      <ReportModal
        isOpen={isReportOpen}
        onClose={() => setIsReportOpen(false)}
        reportMarkdown={fullReportMarkdown || messages.filter((m) => m.role === 'assistant').map((m) => m.content).join('\n\n---\n\n')}
      />
    </div>
  );
}
