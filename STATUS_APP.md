# 🌌 Matrice del Destino AI — Stato Applicazione (STATUS_APP)

> **Ultimo Aggiornamento**: 2026-08-19  
> **Versione**: 2.0.0 (Production Ready)  
> **Stato Globale**: 🟢 **OPERATIVO & VERIFICATO (100%)**

---

## 📊 Panoramica del Sistema

| Proprietà | Dettaglio / Valore |
| :--- | :--- |
| **Applicazione** | Matrice del Destino AI & Analisi Numerologica Pitagorica |
| **Ambiente Locale** | `http://localhost:3000` (Node.js Native HTTP Server / Next.js) |
| **Target Cloud** | Vercel Serverless (`api/*.js` + Next.js App Router) |
| **Fornitore LLM** | **LLMAPI.ai** (`deepseek-v4-flash-0731`) — Gestito lato server |
| **Costo LLM** | ~$0.028 per 1M token (Estremamente economico: ~0.00007$ per lettura completa) |
| **Sintesi Vocale TTS** | Google Gemini 3.1 Flash Neural Audio (100% Free senza carta) |
| **Configurazione Utente** | Modello bloccato e centralizzato (Pulsante Impostazioni rimosso dalla UI) |

---

## 📡 Mappa degli Endpoint API

| Endpoint | Metodo | Descrizione | Runtime |
| :--- | :---: | :--- | :---: |
| `/` | `GET` | Dashboard Web (Geometria Sacra, Griglia 3×3, Chat Markdown) | Static |
| `/api/chat` | `POST` | Streaming Server-Sent Events (SSE) con `qwen/qwen3.6-27b` | Server / Serverless |
| `/api/tts` | `POST` | Sintesi neurale Gemini Flash + conversione buffer PCM $\rightarrow$ WAV 24kHz | Server / Serverless |
| `/api/config` | `GET` | Recupero prompt di sistema (`prompt2analisi.md`) e chiavi predefinite | Server / Serverless |
| `/api/test-connection` | `POST` | Test di connettività e latenza per provider AI | Server / Serverless |
| `/audio/welcome.wav` | `GET` | Audio vocale di benvenuto ad alta fedeltà (1.47 MB) | Static |

---

## 🎙️ Architettura Vocale (TTS)

```
[Testo Risposta AI]
        │
        ▼
[Pulizia Markdown & Caratteri Speciali]
        │
        ▼
[POST /api/tts] ──► Google Gemini Flash TTS Preview (Audio API)
                          │
                          ▼
            [Raw PCM Buffer 24000Hz 16-bit Mono]
                          │
                          ▼
            [Generazione Header RIFF/WAVE a 44 Byte]
                          │
                          ▼
            [Audio Blob WAV Standard] ──► Web Audio Player + Equalizzatore Soundwave
```

### Voci Disponibili (Google Gemini Audio)
1. **`Aoede`** *(Predefinita)*: Voce femminile spirituale, calda ed armoniosa.
2. **`Puck`**: Voce maschile brillante e dinamica.
3. **`Charon`**: Voce maschile profonda, saggia e autorevole.
4. **`Kore`**: Voce femminile dolce e rilassante.
5. **`Fenrir`**: Voce maschile decisa e diretta.

---

## 🔯 Motore di Calcolo Archetipico (22 Arcani)

1. **Giorno di Nascita (Punto Superiore - Spirito)**: Risorse interiori, talenti e manifestazione del sé.
2. **Mese di Nascita (Punto Sinistro - Anima)**: Connessione spirituale, intuito e sfera emotiva.
3. **Anno di Nascita (Punto Destro - Materia)**: Realizzazione materiale, finanze e rapporto con il lavoro.
4. **Coda Karmica (Punto Inferiore - Karma)**: Debiti e memorie karmiche da integrare e trasmutare.
5. **Centro della Matrice (Comfort Zone)**: Punto di equilibrio energetico della personalità.
6. **Canale del Denaro ($)**: Punti di sblocco dell'abbondanza finanziaria e vocazione professionale.
7. **Canale delle Relazioni (❤️)**: Partner ideale, armonia di coppia e superamento dei blocchi relazionali.
8. **Griglia Pitagorica 3×3**: Mappa della frequenza delle cifre 1-9 con i piani Mentale (3-6-9), Emotivo (2-5-8) e Fisico (1-4-7).

---

## 📁 Struttura Directory del Progetto

```
Matrice/
├── api/                     # Handler Serverless per deploy Vercel
│   ├── chat.js              # Streaming SSE per chat
│   ├── config.js            # Servizio configurazione e prompt
│   ├── test-connection.js   # Test diagnostico provider
│   └── tts.js               # Google Gemini Flash TTS PCM->WAV
├── docs/                    # Documentazione & report archetipici
│   ├── promptanalise.md
│   ├── report_*.md
│   └── riassunto_matrice.md
├── public/                  # Asset statici e client web
│   ├── audio/
│   │   └── welcome.wav      # Audio iniziale pre-renderizzato
│   ├── css/
│   │   └── style.css        # Design system Geometria Sacra & Glassmorphism
│   ├── js/
│   │   ├── api-client.js    # Client streaming ed errori quota
│   │   ├── app.js           # Controller interfaccia e canvas particelle
│   │   ├── matrix-calc.js   # Motore matematico dei 22 Arcani
│   │   ├── marked.min.js    # Parser Markdown locale offline
│   │   └── confetti.browser.min.js # Animazioni particelle
│   └── index.html           # Dashboard principale
├── src/                     # Codice sorgente TypeScript (Next.js / Vite)
│   ├── app/                 # Layout, stili globali e pagine
│   ├── components/          # Componenti React (Canvas, Chat, Ottagramma, Modali)
│   └── lib/                 # Motore di calcolo tipizzato e definizioni
├── tests/                   # Script diagnostici e suite di test
│   ├── test_both.js
│   ├── test_gemini_tts.js
│   ├── test_groq_report.js
│   └── ...
├── prompt2analisi.md        # Protocollo di consulenza in 14 Fasi
├── server.js                # Server HTTP nativo Node.js (Zero external dependencies)
├── vercel.json              # Configurazione Vercel
├── STATUS_APP.md            # Stato operativo dell'applicazione
└── README.md                # Guida completa e documentazione
```

---

## 🚀 Istruzioni di Avvio e Manutenzione

### Avvio Server Locale:
```bash
node server.js
```
Accedere a: `http://localhost:3000`

### Verifica Diagnostica Completa:
```bash
node tests/test_both.js
```

### Deploy su Vercel:
```bash
vercel --prod
```
