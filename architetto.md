# 🏛️ Blueprint Architetturale & UX Framework (architetto.md)
> **Standard Aziendale AgTechDesigne — Architettura SaaS, Neumorfismo 2.0 & AI Pipeline**  
> *Versione Blueprint: 3.0.0 (MIT-Grade Architecture & Reusable UX Framework)*

---

## 🧭 1. Visione del Framework

Questo documento costituisce il **Blueprint Architetturale Ufficiale** per replicare l'esperienza utente (UX), il design system e l'infrastruttura full-stack in qualsiasi applicazione web, SaaS o piattaforma AI futura.

Il sistema garantisce:
1. **Impatto Visivo "WOW"**: Dark Mode profonda in *Deep Obsidian*, rifiniture dorate e Neumorfismo 2.0.
2. **Onboarding Immersivo a Zero Attrito**: Guida interattiva con Spotlight luminoso animato sincronizzato con sintesi vocale neurale.
3. **Monetizzazione Ibrida**: Wallet crediti isolato su `localStorage`, ricarica con annunci video sponsor (AdSense) e checkout istantaneo con Stripe.
4. **Cloud Sync Multi-Dispositivo**: Database Supabase Postgres con Row Level Security (RLS) e autenticazione Google OAuth + Email.
5. **Conformità Legale Totale**: GDPR (Reg. UE 2016/679), European AI Act (Reg. UE 2024/1689 Art. 50) e Google Consent Mode v2 nativi.

```
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             ARCHITETTURA FRONTEND                                │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │   Neumorfismo 2.0 UI    │  │ Onboarding Guided Tour   │  │ Web Audio / TTS │  │
│  │ Deep Obsidian + Oro     │  │ Spotlight + Audio Step   │  │ Equalizer Wave  │  │
│  └─────────────────────────┘  └──────────────────────────┘  └─────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ HTTPS / SSE Streaming / REST
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                        SERVERLESS BACKEND LAYER (Vercel)                         │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │   /api/chat (SSE)       │  │   /api/tts (PCM -> WAV)  │  │ /api/stripe     │  │
│  │ DeepSeek / Groq Stream  │  │ Google Gemini Flash TTS  │  │ Checkout Webhook│  │
│  └─────────────────────────┘  └──────────────────────────┘  └─────────────────┘  │
└────────────────────────────────────────┬─────────────────────────────────────────┘
                                         │ Database RLS / Payments / Auth
┌────────────────────────────────────────▼─────────────────────────────────────────┐
│                       CLOUD SERVICES & COMPLIANCE STACK                          │
│  ┌─────────────────────────┐  ┌──────────────────────────┐  ┌─────────────────┐  │
│  │   Supabase Postgres     │  │      Stripe Payments     │  │ Google Consent  │  │
│  │ RLS + Realtime Wallets  │  │ Checkout + Webhooks      │  │ Mode v2 + AdSense│ │
│  └─────────────────────────┘  └──────────────────────────┘  └─────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎨 2. Design System & Neumorfismo 2.0 (Token Architetturali)

### A. Palette Colori Standard (CSS Custom Properties)
```css
:root {
    /* Superfici & Sfondo Obsidian */
    --bg-main: #07090e;              /* Sfondo globale dell'applicazione */
    --bg-card: rgba(12, 17, 28, 0.94); /* Superficie card neumorfica */
    --bg-surface: #0f1422;          /* Elementi interni e input */
    --bg-highlight: #151c2e;        /* Hover e stati attivi */

    /* Palette Accenti Dorati Sacri */
    --gold-primary: #dfb15b;        /* Oro nobile principale */
    --gold-bright: #f5cf7a;         /* Riflessi di luce e testi chiave */
    --gold-light: #fef3c7;          /* Highlights e bagliori */
    --gold-glow: rgba(223, 177, 91, 0.35); /* Alone luminoso soffuso */

    /* Testo e Contrasto */
    --text-primary: #f8fafc;        /* Testo principale ad alto contrasto */
    --text-secondary: #94a3b8;      /* Testo descrittivo e sottotitoli */
    --text-muted: #64748b;          /* Testo disattivato / note legali */

    /* Bordi Neumorfici */
    --border-subtle: rgba(223, 177, 91, 0.12);
    --border-bright: rgba(223, 177, 91, 0.35);

    /* Raggi di Curvatura */
    --radius-sm: 8px;
    --radius-md: 14px;
    --radius-lg: 20px;
    --radius-full: 9999px;
}
```

### B. Effetto Neumorfico Profondo (Ombre e Luce Direzionale)
Per ottenere il look tridimensionale *Neumorfismo 2.0*:
```css
/* Card Neumorfica con Backdrop Blur */
.card-neumorphic {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    box-shadow: 
        10px 10px 25px rgba(0, 0, 0, 0.65),       /* Ombra scura inferiore */
        -5px -5px 15px rgba(255, 255, 255, 0.02),  /* Luce sottile superiore */
        inset 0 1px 1px rgba(255, 255, 255, 0.08); /* Bordo interno illuminato */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.card-neumorphic:hover {
    border-color: var(--border-bright);
    box-shadow: 
        12px 12px 30px rgba(0, 0, 0, 0.8),
        0 0 20px var(--gold-glow);
    transform: translateY(-2px);
}
```

---

## 🌟 3. Motore Onboarding Guidato & Spotlight Pipeline

Il sistema guida l'utente appena approda sull'app evidenziando uno alla volta gli elementi UI chiave e narrando con la voce dell'assistente.

### A. Componenti Visivi dello Spotlight (CSS)
```css
/* Overlay Globale Oscurante */
.onboarding-overlay {
    position: fixed;
    inset: 0;
    z-index: 10000;
    display: none;
    pointer-events: auto;
}
.onboarding-overlay.active { display: block; }

/* Riquadro di Luce Pulsante (Spotlight) */
.onboarding-spotlight {
    position: fixed;
    border-radius: 12px;
    box-shadow: 0 0 0 9999px rgba(3, 6, 12, 0.82), 0 0 30px rgba(212, 175, 55, 0.8);
    border: 2px solid var(--gold-bright);
    pointer-events: none;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
    z-index: 10001;
    animation: spotlightPulse 2s infinite ease-in-out;
}

@keyframes spotlightPulse {
    0%, 100% {
        box-shadow: 0 0 0 9999px rgba(3, 6, 12, 0.82), 0 0 25px rgba(212, 175, 55, 0.6);
        border-color: var(--gold-primary);
    }
    50% {
        box-shadow: 0 0 0 9999px rgba(3, 6, 12, 0.82), 0 0 40px rgba(212, 175, 55, 0.95);
        border-color: #fff;
    }
}

/* Tooltip Informativo Dinamico Glassmorphism */
.onboarding-tooltip {
    position: fixed;
    z-index: 10002;
    width: 320px;
    max-width: 90vw;
    background: rgba(12, 17, 28, 0.98);
    border: 1px solid var(--border-bright);
    border-radius: var(--radius-lg);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.85), 0 0 25px rgba(212, 175, 55, 0.3);
    backdrop-filter: blur(20px);
    padding: 18px 20px;
    transition: all 0.35s cubic-bezier(0.16, 1, 0.3, 1);
}
```

### B. Pipeline Sequenziale Audio (The Anti-Overlap Engine)
```javascript
// Pipeline Definita: Tour Step 1..N -> Voce Dedicata -> Conclusione -> Welcome Chat Audio
let tourAudioPlayer = null;
let isTourAudioMuted = false;

function playTourAudioForStep(stepIndex) {
    if (isTourAudioMuted) return;
    
    // Stop immediato di qualsiasi audio precedente per evitare sovrapposizioni
    stopAllSpeech();

    if (tourAudioPlayer) {
        tourAudioPlayer.pause();
        tourAudioPlayer.currentTime = 0;
    }

    tourAudioPlayer = new Audio(`/audio/tour_step${stepIndex + 1}.wav`);
    tourAudioPlayer.play().catch(() => {
        // Gestione policy autoplay del browser: mostra tasto "Ascolta Voce 🔊"
    });
}

function closeOnboardingTour() {
    localStorage.setItem('app_onboarding_done', 'true');
    stopTourAudio();
    document.getElementById('onboarding-overlay')?.classList.remove('active');

    // Chiusura fluida -> Focus su chat e avvio messaggio vocale di benvenuto
    const welcomeTtsBtn = document.getElementById('btn-welcome-tts');
    if (welcomeTtsBtn) {
        setTimeout(() => welcomeTtsBtn.click(), 450);
    }
}
```

---

## 🎙️ 4. Sintesi Vocale Neurale (Google Gemini Flash Audio TTS)

Il backend riceve il testo, contatta l'endpoint di generazione audio Gemini Flash e restituisce un flusso buffer **RIFF/WAVE a 24.000 Hz 16-bit Mono**.

### Endpoint Serverless (`api/tts.js`):
```javascript
function createWavBuffer(pcmBuffer, sampleRate = 24000) {
    const dataLength = pcmBuffer.length;
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM
    header.writeUInt16LE(1, 22); // Mono
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34); // 16-bit
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return Buffer.concat([header, pcmBuffer]);
}

export default async function handler(req, res) {
    const { text, voice = 'Aoede' } = req.body || {};
    const apiKey = process.env.GEMINI_TTS_API_KEY;

    const payload = {
        contents: [{ role: 'user', parts: [{ text: `Leggi in italiano con voce calda ed espressiva:\n\n${text}` }] }],
        generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: voice } } }
        }
    };

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    const data = await response.json();
    const pcmBase64 = data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    const pcmBuffer = Buffer.from(pcmBase64, 'base64');
    const wavBuffer = createWavBuffer(pcmBuffer, 24000);

    res.setHeader('Content-Type', 'audio/wav');
    res.setHeader('Cache-Control', 'public, max-age=86400');
    res.send(wavBuffer);
}
```

---

## ☁️ 5. Database & Cloud Sync Multi-Dispositivo (Supabase)

Il portafoglio crediti opera in modalità **ibrida**:
* **Utente Anonimo**: Crediti salvati in `localStorage.getItem('destiny_credits')`.
* **Utente Autenticato**: Sincronizzazione automatica bidirezionale con Postgres Supabase tramite **Row Level Security (RLS)**.

### Schema Tabella SQL:
```sql
create table if not exists public.user_matrix_wallets (
    user_id uuid primary key references auth.users(id) on delete cascade,
    email text,
    credits integer default 1 not null,
    total_purchased integer default 0 not null,
    created_at timestamptz default now() not null,
    updated_at timestamptz default now() not null
);

-- Abilitazione Row Level Security (RLS)
alter table public.user_matrix_wallets enable row level security;

-- Policy di Accesso Isolato per Singolo Utente
create policy "Users can read own matrix wallet"
    on public.user_matrix_wallets for select
    using (auth.uid() = user_id);

create policy "Users can update own matrix wallet"
    on public.user_matrix_wallets for update
    using (auth.uid() = user_id);

create policy "Users can insert own matrix wallet"
    on public.user_matrix_wallets for insert
    with check (auth.uid() = user_id);
```

---

## ⚖️ 6. Conformità Legale Globale (GDPR + EU AI Act 2026)

Tutte le future app derivate da questo blueprint implementano l'infrastruttura di conformità obbligatoria:

1. **Google Consent Mode v2**:
   Blocco preventivo dei cookie prima del consenso esplicito dell'utente (`default: 'denied'`).
2. **Banner GDPR Neumorfico Flottante**:
   Pannello di consenso granulare (Necessari, Analitici, Pubblicitari).
3. **Diritto all'Oblio (Art. 17 GDPR)**:
   Funzione `purgeAllUserData()` a 1 clic per azzerare localStorage, cookie, chat e stato applicativo.
4. **Trasparenza EU AI Act (Art. 50 Reg. UE 2024/1689)**:
   * Badge permanente di notifica interazione con intelligenza artificiale.
   * Watermarking automatico su report esportati, stampe cartacee e appunti:
     `📄 Generato da Sistema di Intelligenza Artificiale Generativa (Conforme Art. 50 Reg. UE 2024/1689)`.
5. **Diritto di Recesso Contenuti Digitali (Art. 59 Codice del Consumo)**:
   Avviso legale esplicito all'acquisto di crediti o consulti digitali con esecuzione immediata.

---

## 📋 7. Guida di Bootstrap per Nuovi Progetti

Per avviare un nuovo progetto clonando questa UX in **meno di 1 ora**:

1. **Setup File Statici**:
   * Copia `public/css/style.css` come fondamento Neumorfismo 2.0.
   * Copia i modali legali e l'overlay `#onboarding-overlay` in `public/index.html`.
2. **Generazione Audio Onboarding**:
   * Esegui lo script TTS per generare i 5 file audio `/audio/tour_step1.wav` ... `tour_step5.wav` con il testo specifico del nuovo dominio.
3. **Collegamento Supabase**:
   * Esegui lo script SQL sopra riportato nel nuovo database Supabase.
   * Inserisci `SUPABASE_URL` e `SUPABASE_ANON_KEY` in `app.js`.
4. **Deploy Serverless**:
   * Carica su GitHub e collega a **Vercel**; imposta le chiavi d'ambiente (`LLMAPI_KEY`, `GEMINI_TTS_API_KEY`, `STRIPE_SECRET_KEY`).

---
*Blueprint redatto e verificato secondo le linee guida AGOS & MIT-Grade Architecture.*
