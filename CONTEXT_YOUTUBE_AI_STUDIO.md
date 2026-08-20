# 🧠 CONTEXT.md — YouTube-AI-Studio Master Context & Bootstrap Guide
> **Progetto**: YouTube-AI-Studio (Automated Video & Shorts Generator)  
> **Azienda**: AgTechDesigne  
> **Stato**: Scaffolding Inizializzato — Pronto per lo Sviluppo  
> **Data Creazione**: 2026-08-20  

---

## 🎯 1. Missione del Progetto

**YouTube-AI-Studio** è una pipeline autonoma e scalabile di **Video Automation (YouTube Shorts 9:16 & Long-Form 16:9)** a costo zero di generazione.

Il sistema adotta la tecnologia derivata dal *Tour Guidato & Assistente Vocale* di **Matrice del Destino** (`https://matrice-jade.vercel.app`), trasformando coordinate di spotlight, geometria sacra, animazioni Neumorfismo 2.0 e sintesi vocale neurale in **video MP4 a 60 FPS con sottotitoli dinamici e musica lofi 432Hz**.

---

## 🏗️ 2. Architettura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                   PIPELINE END-TO-END                                           │
│                                                                                                 │
│  ┌──────────────────────┐   ┌──────────────────────────┐   ┌────────────────────────────────┐   │
│  │ 1. SCRIPT GENERATOR  │ ➔│ 2. VOICE SYNTHESIS       │ ➔│ 3. VISUAL RECORDER             │   │
│  │ DeepSeek / Groq LLM  │   │ Kokoro-82M (Locale 86MB) │   │ Playwright Headless (60 FPS)   │   │
│  │ Hook + Body + CTA    │   │ File WAV a 24.000 Hz     │   │ 1080x1920 Canvas & Spotlight   │   │
│  └──────────────────────┘   └──────────────────────────┘   └────────────────────────────────┘   │
│                                                                            │                    │
│                                                                            ▼                    │
│  ┌──────────────────────┐   ┌──────────────────────────┐   ┌────────────────────────────────┐   │
│  │ 6. YOUTUBE UPLOADER  │ ◄│ 5. FINAL COMPOSITOR      │ ◄│ 4. SUBTITLE ENGINE             │   │
│  │ YouTube Data API v3  │   │ FFmpeg Audio/Video Merge │   │ Word-by-Word Highlight (Oro)   │   │
│  │ Tag, Titolo, Schede  │   │ Musica Sacra a -18dB     │   │ File ASS / SRT Dinamici        │   │
│  └──────────────────────┘   └──────────────────────────┘   └────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 📂 3. Albero delle Directory

```
E:\Agtechdesigne\Progetti\YouTube-AI-Studio\
├── CONTEXT.md                          # Questo file (memoria di contesto globale)
├── youtube_video_automation_engine.md   # Blueprint e specifiche architetturali dettagliate
├── requirements.txt                    # Dipendenze Python (kokoro, soundfile, onnxruntime)
├── package.json                        # Dipendenze Node.js (playwright)
├── .env.example                        # Template per chiavi d'ambiente
├── run_studio.py                       # Master CLI per lanciare la generazione a 1 clic
├── engine/
│   ├── script_generator.py             # Generazione copioni con LLMAPI / Groq
│   ├── tts_kokoro.py                   # Sintesi vocale locale Kokoro-82M (italiano)
│   ├── recorder.js                     # Registratore video Playwright (1080x1920 a 60fps)
│   ├── subtitle_generator.py           # Generatore sottotitoli Word-by-Word (.ass)
│   └── video_mixer.py                  # Compositor FFmpeg
├── assets/
│   ├── templates/                      # Template HTML/CSS per le scene grafiche
│   │   ├── scene_arcana.html           # Animazione Ottagramma e Arcani
│   │   └── scene_karma.html            # Animazione nodi karmici e denaro
│   ├── music/                          # Tracce audio royalty-free (ambient / 432Hz)
│   └── fonts/                          # Font Cinzel, Outfit, Montserrat
└── output/
    ├── audio/                          # Tracce vocali WAV temporanee
    ├── raw_video/                      # Registrazioni video WebM Playwright
    └── final_shorts/                   # Video MP4 1080x1920 pronti per la pubblicazione
```

---

## 🛠️ 4. Stack Tecnologico & Componenti Chiave

| Componente | Tecnologia | Ruolo & Vantaggio |
| :--- | :--- | :--- |
| **Sintesi Vocale (TTS)** | **Kokoro-82M** (ONNX / PyTorch) | Modello open-source da 86MB; genera audio naturale italiano offline a **0€ di costo**. |
| **Visual Animation** | **HTML5 + CSS Neumorfismo 2.0** | Geometria sacra, particelle canvas, rifiniture dorate e spotlight dinamico. |
| **Screen Recording** | **Playwright Headless Chrome** | Registrazione a risoluzione 1080x1920 (9:16) a 60 FPS stabili. |
| **Audio/Video Merge** | **FFmpeg** | Mix traccia vocale (1.0x) + musica lofi (0.12x) + video + sottotitoli animati. |
| **Generazione Script** | **LLMAPI.ai / Groq (Qwen 3.6)** | Scrittura automatica di hook psicologici, descrizioni e CTA. |

---

## 🎬 5. I 3 Formati di Contenuto Prioritari

1. **"Il tuo Arcano di Nascita" (Durata: 40s)**:
   - *Hook (0-3s)*: "Sei nato a Maggio? C'è un'energia sacra che governa il tuo destino..."
   - *Core (4-30s)*: Spiegazione visuale del nodo numerologico con animazione geometrica.
   - *CTA (31-40s)*: "Calcola la tua Matrice del Destino completa su `matrice-jade.vercel.app`".
2. **"Debiti Karmici & Soldi Bloccati" (Durata: 50s)**:
   - *Hook*: "Perché i soldi sembrano scivolarti via dalle mani?"
   - *Core*: Analisi dei 3 nodi inferiori (Coda Karmica).
   - *CTA*: "Scopri il tuo Karma nel link in bio."
3. **"Sinastria di Coppia & Affinità" (Durata: 55s)**:
   - *Hook*: "La connessione tra le vostre due date di nascita rivela questo segreto..."
   - *Core*: Incrocio visivo dei due Ottagrammi.
   - *CTA*: "Condividi questo video con il tuo partner."

---

## 🚀 6. Checklist per il Nuovo Agente Antigravity

Appena apri il nuovo brain in `E:\Agtechdesigne\Progetti\YouTube-AI-Studio\`:

1. **Verifica Ambiente**:
   - Assicurati che Python e Node.js siano attivi.
   - Installa i pacchetti da `requirements.txt` e `package.json`.
2. **Implementa i 4 Moduli Engine**:
   - `engine/tts_kokoro.py` (scarica i pesi del modello 86MB da Hugging Face).
   - `engine/recorder.js` (script Playwright con viewport 1080x1920).
   - `assets/templates/scene_arcana.html` (scena visiva animata).
   - `engine/video_mixer.py` (script FFmpeg per generare il primo Short pilota).
3. **Lancia il Primo Video Test**:
   - Esegui `python run_studio.py --topic "Arcano 21 Il Mondo"` e verifica l'output in `output/final_shorts/`.

---
*Documento pronto per il passaggio al nuovo Brain di sviluppo.*
