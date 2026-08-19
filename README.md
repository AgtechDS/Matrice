# 🌌 Matrice del Destino AI & Portale Numerologico

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![LLM: Groq Qwen 3.6](https://img.shields.io/badge/LLM-Groq%20Qwen%203.6--27B-orange.svg)](https://groq.com/)
[![TTS: Google Gemini Flash](https://img.shields.io/badge/TTS-Google%20Gemini%20Flash-blue.svg)](https://aistudio.google.com/)
[![Hosting: Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

Piattaforma avanzata di **Consulenza Numerologica Simbolica**, **Geometria Sacra** e **Matrice del Destino** basata sull'interpretazione archetipica dei **22 Arcani Maggiori** e della **Griglia Pitagorica 3×3**, potenziata da intelligenza artificiale generativa in streaming e sintesi vocale neurale ad alta fedeltà.

---

## ✨ Caratteristiche Principali

- 🔯 **Ottagramma della Geometria Sacra Interattivo**: Visualizzatore SVG vettoriale con nodi pulsanti e calcolo in tempo reale delle energie di Spirito, Anima, Materia, Coda Karmica, Canale del Denaro e Canale Relazioni.
- 📐 **Griglia Pitagorica 3×3**: Mappatura automatica delle cifre della data di nascita con analisi di frequenza sui piani Mentale (3-6-9), Emotivo (2-5-8) e Fisico (1-4-7).
- 🎙️ **Sintesi Vocale Neurale Gratuita (Google Gemini Flash TTS)**: Riproduzione vocale fluida in italiano a 24000Hz 16-bit Mono (`models/gemini-3.1-flash-tts-preview`) con 5 profili vocali (`Aoede`, `Puck`, `Charon`, `Kore`, `Fenrir`).
- ⚡ **Chat Streaming ad Alta Velocità (Groq Cloud)**: Risposte istantanee con il modello `qwen/qwen3.6-27b` senza troncamenti e con protocollo di consulenza a 14 fasi (`prompt2analisi.md`).
- 📝 **Modulo Guidato & Report Completo**: Compilazione assistita dei dati anagrafici con animazione a coriandoli ed esportazione del report completo in Markdown e PDF.
- 🔒 **Privacy & Zero Setup Obbligatorio**: Funziona out-of-the-box localmente con server HTTP nativo (zero dipendenze esterne bloccanti) e include handler serverless pronti per **Vercel**.

---

## 🛠️ Architettura e Tecnologie

- **Frontend**: HTML5 Semantico, CSS3 Moderno (Glassmorphism, Dark Mode, Animazioni Soundwave Equalizer), Canvas 2D per particelle sacre, JavaScript ES6+.
- **Backend / API**: Node.js HTTP Server nativo (`server.js`) con supporto completo Server-Sent Events (SSE) e convertitore binario PCM-to-WAV.
- **Serverless Runtime**: Directory `/api` predisposta per Vercel Edge / Node Functions (`/api/chat`, `/api/tts`, `/api/config`, `/api/test-connection`).
- **AI & TTS Providers**:
  - **Groq Cloud**: Modello `qwen/qwen3.6-27b` (Latenza media < 400ms).
  - **Google AI Studio**: Modello `gemini-3.1-flash-tts-preview` (Nessuna carta di credito richiesta).

---

## 📁 Struttura del Progetto

```
Matrice/
├── api/                     # Serverless Functions per deploy su Vercel
│   ├── chat.js              # Endpoint streaming SSE per chat LLM
│   ├── config.js            # Configurazione e caricamento prompt di sistema
│   ├── test-connection.js   # Endpoint diagnostico per testare le API Key
│   └── tts.js               # Sintesi vocale Gemini Flash con conversioni PCM->WAV
├── docs/                    # Guide, documentazione e report di riferimento
│   ├── promptanalise.md
│   ├── report_*.md
│   └── riassunto_matrice.md
├── public/                  # Asset web statici serviti al client
│   ├── audio/
│   │   └── welcome.wav      # Messaggio audio di benvenuto (1.47 MB)
│   ├── css/
│   │   └── style.css        # Stili, variabili colore e animazioni
│   ├── js/
│   │   ├── api-client.js    # Client streaming e gestione errori
│   │   ├── app.js           # Controller UI, canvas e audio player
│   │   ├── matrix-calc.js   # Motore matematico dei 22 Arcani
│   │   ├── marked.min.js    # Parser Markdown locale offline
│   │   └── confetti.browser.min.js # Animazioni particelle
│   └── index.html           # Dashboard e interfaccia utente
├── src/                     # Codice sorgente TypeScript (Next.js / Vite)
│   ├── app/                 # Layout, stili globali e pagine
│   ├── components/          # Componenti React (Canvas, Chat, Ottagramma, Modali)
│   └── lib/                 # Motore di calcolo tipizzato e definizioni
├── tests/                   # Suite di script per test e diagnostica
│   ├── test_both.js
│   ├── test_gemini_tts.js
│   ├── test_groq_report.js
│   └── ...
├── prompt2analisi.md        # Protocollo di consulenza archetipica in 14 Fasi
├── server.js                # Server HTTP nativo Node.js locale
├── vercel.json              # Configurazione per hosting su Vercel
├── STATUS_APP.md            # Documento riassuntivo dello stato dell'app
└── README.md                # Questo file
```

---

## 🚀 Avvio Rapido

### 1. Prerequisiti
- **Node.js** v18 o superiore installato sul computer.

### 2. Configurazione Chiavi (`.env`)
Crea un file `.env` nella cartella principale (o configuralo direttamente dal pannello **Impostazioni ⚙️** nell'app web):

```env
# Backend LLM API (LLMAPI.ai o Groq o OpenRouter)
LLMAPI_KEY=your_llmapi_or_groq_key_here
TOKENROUTER_BASE_URL=https://api.llmapi.ai/v1
TOKENROUTER_MODEL=deepseek-v4-flash-0731

# Chiave Google AI Studio per Sintesi Vocale (Gratuita su https://aistudio.google.com)
GEMINI_TTS_API_KEY=your_google_ai_studio_api_key_here
```

### 3. Avvio del Server
Esegui da terminale:
```bash
node server.js
```
Apri il browser su **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Esecuzione dei Test Diagnostici

Per verificare rapidamente il funzionamento di tutti i componenti (Chat, Groq, Google Gemini TTS e WAV converter):
```bash
node tests/test_both.js
```

---

## ☁️ Deploy su Vercel

1. Installa Vercel CLI (se non già installato):
   ```bash
   npm i -g vercel
   ```
2. Esegui il deploy:
   ```bash
   vercel --prod
   ```
3. Imposta le variabili di ambiente `TOKENROUTER_API_KEY` e `GEMINI_TTS_API_KEY` nella dashboard del progetto su Vercel.

---

## 📜 Licenza
Questo progetto è distribuito sotto licenza **MIT**.
