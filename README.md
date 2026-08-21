# 🌌 Matrice del Destino AI & Portale Numerologico

[![License: MIT](https://img.shields.io/badge/License-MIT-gold.svg)](https://opensource.org/licenses/MIT)
[![Node.js](https://img.shields.io/badge/Node.js-v22+-green.svg)](https://nodejs.org/)
[![LLM: DeepSeek V4 Flash](https://img.shields.io/badge/LLM-DeepSeek%20V4%20Flash-blueviolet.svg)](https://llmapi.ai/)
[![TTS: Google Gemini Flash](https://img.shields.io/badge/TTS-Google%20Gemini%20Flash-blue.svg)](https://aistudio.google.com/)
[![Production Domain](https://img.shields.io/badge/Live-matricedestino.it-gold.svg)](https://www.matricedestino.it/)
[![Hosting: Vercel](https://img.shields.io/badge/Deploy-Vercel-black.svg)](https://vercel.com/)

Piattaforma avanzata di **Consulenza Numerologica Simbolica**, **Geometria Sacra** e **Matrice del Destino** basata sull'interpretazione archetipica dei **22 Arcani Maggiori**, della **Griglia Pitagorica 3×3** e dell'**Astrologia Archetipica**, potenziata da intelligenza artificiale generativa in streaming, sintesi vocale neurale Google Gemini HD, Cloud Wallet Supabase e monetizzazione integrata Stripe & Google AdSense.

🔗 **Sito Ufficiale Live**: [https://www.matricedestino.it](https://www.matricedestino.it)

---

## ✨ Caratteristiche Principali

- 🔯 **Ottagramma della Geometria Sacra Interattivo**: Visualizzatore SVG vettoriale reattivo con nodi pulsanti e calcolo in tempo reale delle energie di Spirito, Anima, Materia, Coda Karmica, Canale del Denaro e Canale Relazioni.
- 📐 **Griglia Pitagorica 3×3**: Mappatura automatica delle cifre della data di nascita con analisi di frequenza sui piani Mentale (3-6-9), Emotivo (2-5-8) e Fisico (1-4-7).
- ♈ **Modulo Oroscopo & Astrologia Simbolica**: Calcolo istantaneo del Segno Solare (con date precise al giorno), Ascendente esatto con coordinate temporali e analisi personalizzata.
- 🎙️ **Sintesi Vocale Neurale HD (Google Gemini Flash TTS)**: Riproduzione vocale fluida in italiano a 24000Hz 16-bit Mono (`models/gemini-3.1-flash-tts-preview`) con profili vocali spirituali.
- ⚡ **Chat Streaming & Consulti Dedicati (DeepSeek V4 Flash)**: Risposte istantanee senza troncamenti con prompt specializzati per:
  - Oroscopo del Giorno & della Settimana
  - Focus Canale Amore & Relazioni
  - Focus Canale Denaro, Carriera & Prosperità
  - Master Report dei 4 Pinnacoli & 4 Sfide
  - Sinastria di Coppia & Matrice Congiunta
  - Report Completo a 14 Sezioni
- ☁️ **Cloud Sync & Supabase Database**: Sincronizzazione persistente in tempo reale del profilo utente e del wallet crediti su tutti i dispositivi con supporto Google OAuth e login Email/Password.
- 💳 **Monetizzazione & Sponsor**:
  - **Stripe Hosted Checkout**: Acquisto sicuro di Pass Consulti (1.99€ Pass 5 / 4.49€ Mappa Maestra 15).
  - **Google AdSense Rewarded Ads**: Ottieni consulti gratuiti guardando annunci sponsorizzati con `ads.txt` ufficiale (`ca-pub-7028010056444247`).
  - **Programma Invita un Amico**: Link referral con ricompense automatiche (+2 consulti ad ogni nuovo accesso).
- 🔒 **Conformità Legale & Privacy**: **GDPR (Reg. UE 2016/679)**, **EU AI Act 2026 (Reg. UE 2024/1689 Art. 50)**, Google Consent Mode v2 e Diritto all'Oblio (GDPR Art. 17).

---

## 🛠️ Architettura e Tecnologie

- **Dominio di Produzione**: `https://www.matricedestino.it` (gestito su Register.it DNS + Vercel Edge Anycast CDN).
- **Frontend**: HTML5 Semantico, CSS3 Moderno (Neumorfismo 2.0, Deep Obsidian Dark Mode, Soundwave Equalizer), Canvas 2D per particelle sacre, JavaScript ES6+.
- **Backend / API**: Node.js HTTP Server nativo (`server.js`) con supporto Server-Sent Events (SSE) e convertitore binario PCM-to-WAV.
- **Serverless Runtime**: Directory `/api` per Vercel Edge / Node Functions:
  - `/api/chat.js` — Streaming SSE LLM
  - `/api/tts.js` — Google Gemini Neural TTS
  - `/api/config.js` — Parametri di sistema e prompt
  - `/api/create-checkout-session.js` — Stripe Checkout
  - `/api/ads-txt.js` — Google AdSense publisher record
  - `/api/robots.js` & `/api/sitemap.js` — SEO ed indicizzazione Googlebot
- **Database & Auth**: Supabase Postgres con Row Level Security (RLS) e Google OAuth 2.0.

---

## 📁 Struttura del Progetto

```
Matrice/
├── api/                     # Serverless Functions per deploy su Vercel
│   ├── ads-txt.js           # Serverless route per /ads.txt
│   ├── chat.js              # Endpoint streaming SSE per chat LLM
│   ├── config.js            # Configurazione e caricamento prompt di sistema
│   ├── create-checkout-session.js # Stripe Checkout integration
│   ├── robots.js            # Serverless route per /robots.txt
│   ├── sitemap.js           # Serverless route per /sitemap.xml
│   ├── test-connection.js   # Endpoint diagnostico per API Key
│   └── tts.js               # Sintesi vocale Gemini Flash PCM->WAV
├── favicon_io/              # Suite ufficiale di icone e favicon ad alta risoluzione
├── public/                  # Asset web statici serviti al client
│   ├── ads.txt              # Record Google AdSense publisher
│   ├── robots.txt           # File robots per Googlebot e AdSense
│   ├── sitemap.xml          # Sitemap XML per indicizzazione
│   ├── site.webmanifest     # Manifest per PWA / installazione Web App
│   ├── audio/
│   │   └── welcome.wav      # Messaggio vocale di benvenuto
│   ├── css/
│   │   └── style.css        # Design System Geometria Sacra & Glassmorphism
│   ├── js/
│   │   ├── api-client.js    # Client streaming e gestione errori
│   │   ├── app.js           # Controller UI, Supabase Auth, Canvas e Audio
│   │   ├── matrix-calc.js   # Motore matematico dei 22 Arcani e Astrologia
│   │   ├── marked.min.js    # Parser Markdown locale
│   │   └── confetti.browser.min.js # Effetti grafici particelle
│   └── index.html           # Dashboard principale
├── dns_zone_matricedestino.it.csv # Configurazione DNS ufficiale per Register.it
├── server.js                # Server HTTP nativo Node.js locale
├── vercel.json              # Configurazione edge e rewrites per Vercel
├── STATUS_APP.md            # Documento riassuntivo dello stato dell'app
└── README.md                # Questo file
```

---

## 🚀 Avvio Rapido Locale

### 1. Prerequisiti
- **Node.js** v18 o superiore installato sul computer.

### 2. Configurazione Chiavi (`.env`)
```env
# Backend LLM API (LLMAPI.ai o Groq)
LLMAPI_KEY=your_llmapi_or_groq_key_here
TOKENROUTER_BASE_URL=https://api.llmapi.ai/v1
TOKENROUTER_MODEL=deepseek-v4-flash-0731

# Chiave Google AI Studio per Sintesi Vocale
GEMINI_TTS_API_KEY=your_google_ai_studio_api_key_here

# Stripe Payments Configuration
STRIPE_SECRET_KEY=rk_live_...
STRIPE_PUBLIC_KEY=pk_live_...

# Supabase Cloud Database & Authentication
SUPABASE_PROJECT_ID=zzprmoehmzwzsumuuzdw
SUPABASE_URL=https://zzprmoehmzwzsumuuzdw.supabase.co
SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

### 3. Avvio del Server
```bash
node server.js
```
Apri il browser su **[http://localhost:3000](http://localhost:3000)** o sul dominio live **[https://www.matricedestino.it](https://www.matricedestino.it)**.

---

## 📜 Licenza
Questo progetto è distribuito sotto licenza **MIT**.
