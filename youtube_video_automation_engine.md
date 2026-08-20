# 🎬 YouTube Video Automation Engine — Blueprint & Architettura
> **Da Tour Guidato a Fabbrica di Video Automatizzati (Shorts & Long-Form) a Costo Zero**  
> *Documento Ufficiale di Inizializzazione per il Progetto Standalone `YouTube-AI-Studio`*

---

## 💡 1. Il Concetto: "Poca Spesa, Massima Resa"

La tecnologia che abbiamo sviluppato per il **Tour Guidato della Matrice** (coordinate di spotlight dinamiche + narrazione vocale sincronizzata + transizioni animate) possiede già il 90% degli elementi necessari per una **pipeline di Video Automation da milioni di visualizzazioni**:

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│                     PIPELINE AUTOMATIZZATA YOUTUBE STUDIO                             │
│                                                                                       │
│  ┌──────────────────┐    ┌────────────────────┐    ┌──────────────────────────────┐   │
│  │ 1. LLM SCRIPT    │ ➔ │ 2. KOKORO-82M TTS  │ ➔ │ 3. PLAYWRIGHT UI RECORDER    │   │
│  │ Topic + Timings  │    │ Voce Neurale Locale│    │ Zoom, Spotlight, Sacred Geom │   │
│  └──────────────────┘    └────────────────────┘    └──────────────────────────────┘   │
│                                                                   │                   │
│                                                                   ▼                   │
│  ┌──────────────────┐    ┌────────────────────┐    ┌──────────────────────────────┐   │
│  │ 6. YOUTUBE API   │ ◄ │ 5. FFMPEG MIXER    │ ◄ │ 4. SOTTOTITOLI ANIMATI       │   │
│  │ Auto-Upload / Sched│   │ Voce + Video + Lofi│    │ Word-Level Timestamps (Oro)  │   │
│  └──────────────────┘    └────────────────────┘    └──────────────────────────────┘   │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

### Perché questo approccio è rivoluzionario:
1. **Costo di Produzione = 0,00 €**:
   * Usando il modello TTS locale **Kokoro-82M** (~86MB in Python/ONNX), la sintesi vocale non consuma crediti API ed è fulminea.
   * Il rendering visivo usa **Playwright Headless Chrome** che cattura il DOM animato a 60 fps (1080x1920 per Shorts, 1920x1080 per YouTube standard).
2. **Scalabilità Infinita**:
   * Uno script Python/Node può generare **30-50 video al giorno** in modalità batch non presidiata.
3. **Funnel Perfetto verso la Web App**:
   * Ogni video YouTube termina con una Call To Action visiva: *"Calcola la tua mappa gratuita su matrice-jade.vercel.app"*, portando traffico organico costante e monetizzazione con Stripe e AdSense.

---

## 🔍 2. Decostruzione della Logica Tour & Audio

### A. Calcolo Coordinate & Spotlight Fluido
Nel nostro tour, ogni passaggio identifica l'elemento target sul DOM, calcola la posizione assoluta nel viewport e vi centra lo spotlight dorato:

```javascript
// Calcolo bounding box con margine di respiro (pad)
const rect = targetEl.getBoundingClientRect();
const pad = 8;

spotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
spotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
spotlight.style.width = `${rect.width + pad * 2}px`;
spotlight.style.height = `${rect.height + pad * 2}px`;
```

Nel generatore video, questo meccanismo viene esteso con **Camera Zoom & Pan Virtuale**:
* Invece di muovere solo il cerchio di luce, la "telecamera" ingrandisce (CSS `transform: scale(1.35) translate(...)`) il nodo dell'Ottagramma o la card di cui la voce sta parlando in quel secondo esatto.

### B. State Machine di Sincronizzazione Audio-Visiva
La transizione da una scena alla successiva è guidata dalla durata fisica dell'audio:

```javascript
const audio = new Audio(`/audio/scene_${sceneIndex}.wav`);
audio.play();

// La scena successiva scatta ESATTAMENTE al millisecondo in cui la voce finisce la frase
audio.onended = () => {
    transitionToNextScene(sceneIndex + 1);
};
```

---

## 🛠️ 3. Architettura del Nuovo Progetto Standalone (`YouTube-AI-Studio`)

### Struttura Directory Consigliata:
```
E:\Agtechdesigne\Progetti\YouTube-AI-Studio\
├── engine/
│   ├── script_generator.py      # Genera prompt e copioni con DeepSeek / Groq
│   ├── tts_kokoro.py            # Generatore vocale locale Kokoro-82M (o Gemini TTS)
│   ├── recorder.js              # Playwright Headless Browser video recorder (60 FPS)
│   └── video_mixer.py           # FFmpeg: unisce video + audio + musica sacra + sottotitoli
├── assets/
│   ├── music/                   # Tracce audio di sottofondo royalty-free (ambient/lofi 432Hz)
│   ├── fonts/                   # Font per sottotitoli (Cinzel / Outfit / Montserrat)
│   └── templates/               # Pagine HTML/CSS animate per le scene dei video
├── output/
│   ├── audio/                   # WAV temporanei
│   ├── raw_video/               # Registrazioni WebM Playwright
│   └── final_shorts/            # Video MP4 1080x1920 pronti per la pubblicazione
└── run_studio.py                # Master orchestrator a 1 clic
```

---

## 🎙️ 4. Il Motore Vocale Locale: Kokoro-82M (86MB)

**Kokoro-82M** è il modello open-weight più efficiente al mondo per Text-To-Speech in altissima qualità naturale. Pesa solo 86MB, gira su qualsiasi CPU/GPU locale e supporta l'italiano con voce fluida.

### Script Python di Esempio (`engine/tts_kokoro.py`):
```python
import os
from kokoro import KPipeline
import soundfile as sf

# Inizializza la pipeline con lingua italiana ('i' per italiano o 'e' per inglese)
pipeline = KPipeline(lang_code='i')

def generate_voiceover(text: str, output_path: str, voice: str = 'if_sara'):
    """
    Genera il file audio WAV a partire dal testo con Kokoro-82M
    """
    print(f"🎙️ Generazione voce neurale per: {text[:40]}...")
    generator = pipeline(text, voice=voice, speed=1.05)
    
    for i, (gs, ps, audio) in enumerate(generator):
        sf.write(output_path, audio, 24000)
        print(f"✅ Audio salvato in: {output_path}")
        break

if __name__ == "__main__":
    test_text = "Scopri il tuo Arcano di nascita. Se sei nato il ventuno di luglio, la tua energia dominante è il Mondo, l'Arcano ventuno della realizzazione assoluta!"
    generate_voiceover(test_text, "test_voice.wav")
```

---

## 🎥 5. Il Registratore Video Playwright (`engine/recorder.js`)

Playwright apre una pagina HTML creata con il nostro stile **Neumorfismo 2.0 & Sacred Geometry**, avvia l'animazione e la registra direttamente in formato video MP4 a **60 FPS** in risoluzione verticale **1080x1920 (9:16 Shorts)**.

### Script Recorder Node.js:
```javascript
const { chromium } = require('playwright');
const path = require('path');

async function recordScene(htmlPath, durationSec, outputPath) {
    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
        viewport: { width: 1080, height: 1920 }, // Formato 9:16 Verticale YouTube Shorts
        recordVideo: {
            dir: path.dirname(outputPath),
            size: { width: 1080, height: 1920 }
        }
    });

    const page = await context.newPage();
    await page.goto(`file://${htmlPath}`);
    
    // Attendi la durata esatta dell'audio doppiato
    await page.waitForTimeout(durationSec * 1000);
    
    await page.close();
    await context.close();
    await browser.close();
    console.log(`🎬 Scena registrata con successo: ${outputPath}`);
}
```

---

## 🎵 6. Compositing Finale con FFmpeg (`engine/video_mixer.py`)

Unisce in un unico comando:
1. Traccia Video registrata da Playwright.
2. Traccia Vocale doppiata da Kokoro-82M.
3. Musica Sacra / Frequenza 432Hz a volume soffuso (-18 dB).
4. Sottotitoli animati in tempo reale (Word-by-word highlight).

### Comando FFmpeg Automatizzato:
```bash
ffmpeg -y -i raw_video.webm -i voiceover.wav -i ambient_music.mp3 \
-filter_complex "[1:a]volume=1.0[vocal]; [2:a]volume=0.12[bgmusic]; [vocal][bgmusic]amix=inputs=2:duration=first[aout]" \
-map 0:v -map "[aout]" \
-c:v libx264 -preset fast -crf 18 -pix_fmt yuv420p \
-c:a aac -b:a 192k \
output_short.mp4
```

---

## 📈 7. I 3 Formati di Contenuto a più Alto Rendimento

| Formato Video | Durata | Struttura Narrativa | Call To Action |
| :--- | :---: | :--- | :--- |
| **"Il tuo Arcano di Nascita"** | 35-45s | *Hook (0-3s)*: "Sei nato a Luglio? Ascolta bene." ➔ *Analisi (4-30s)*: Spiegazione geometrica del nodo ➔ *Consiglio pratico*. | *"Calcola tutta la tua mappa sul sito nel link."* |
| **"Karma del Denaro & Debiti"** | 50s | *Hook*: "Perché i soldi ti scivolano via?" ➔ *Spiegazione dei 3 nodi inferiori (Coda Karmica)* ➔ *Soluzione*. | *"Fai il test gratuito sulla Matrice del Destino."* |
| **"Sinastria di Coppia Segreta"** | 55s | *Hook*: "La combinazione tra i vostri due giorni di nascita rivela questo..." ➔ *Ottagramma di coppia incrociato*. | *"Condividi questo video con la persona a cui pensi."* |

---

## 🚀 8. Come Avviare la Nuova Cartella del Progetto

Quando vuoi iniziare a sviluppare questo progetto standalone:

1. **Crea la nuova cartella sul disco `E:\`**:
   ```bash
   mkdir E:\Agtechdesigne\Progetti\YouTube-AI-Studio
   cd E:\Agtechdesigne\Progetti\YouTube-AI-Studio
   ```
2. **Inizializza l'ambiente Python & Node.js**:
   ```bash
   python -m venv venv
   .\venv\Scripts\activate
   pip install kokoro soundfile numpy
   npm init -y
   npm install playwright
   npx playwright install chromium
   ```
3. **Usa questo documento (`youtube_video_automation_engine.md`) come piano esecutivo guida!**

---
*Progetto ideato per l'ecosistema AgTechDesigne — Scalabilità Video 100% Automatica.*
