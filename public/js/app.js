/**
 * Destiny Matrix AI Application Controller
 * Handles Sacred Geometry Canvas, Chat Streaming, Matrix Graph Updating, and UI State.
 */

// Supabase Configuration & Client Initialization
const SUPABASE_URL = 'https://zzprmoehmzwzsumuuzdw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHJtb2VobXp3enN1bXV1emR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzg4MzksImV4cCI6MjEwMjc1NDgzOX0.chFyYCLXZcnBdUfzyXDOh4QtWmgKRZcewo9gmBoRVuA';
let supabaseClient = null;

try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Initial Supabase client setup notice:', e);
}

// Application State (Locked to DeepSeek V4 Flash Backend)
const state = {
    currentUser: null,
    systemPrompt: '',
    provider: 'llmapi',
    baseUrl: 'https://api.llmapi.ai/v1',
    apiKey: '',
    model: 'deepseek-v4-flash-0731',
    temperature: 0.6,
    messages: [],
    currentMatrixData: null,
    isGenerating: false,
    selectedNodeKey: 'top'
};

const PROVIDER_PRESETS = {
    groq: {
        baseUrl: 'https://api.groq.com/openai/v1',
        model: 'llama-3.3-70b-versatile',
        link: 'https://console.groq.com/keys'
    },
    openrouter: {
        baseUrl: 'https://openrouter.ai/api/v1',
        model: 'deepseek/deepseek-r1:free',
        link: 'https://openrouter.ai/keys'
    },
    gemini: {
        baseUrl: 'https://generativelanguage.googleapis.com/v1beta/openai',
        model: 'gemini-2.0-flash',
        link: 'https://aistudio.google.com/app/apikey'
    },
    tokenrouter: {
        baseUrl: 'https://api.tokenrouter.com/v1',
        model: 'deepseek/deepseek-v4-pro-0813-free',
        link: 'https://www.tokenrouter.com'
    },
    llmapi: {
        baseUrl: 'https://api.llmapi.ai/v1',
        model: 'deepseek-v4-flash-0731',
        link: 'https://llmapi.ai'
    },
    ollama: {
        baseUrl: 'http://localhost:11434/v1',
        model: 'deepseek-r1:latest',
        link: 'https://ollama.com'
    },
    custom: {
        baseUrl: '',
        model: '',
        link: '#'
    }
};

function parseThinkTags(text) {
    if (!text) return { reasoning: '', content: '', isThinking: false };
    
    // 1. Closed <think>...</think> tag
    const closedMatch = text.match(/^[\s\S]*?<think>([\s\S]*?)<\/think>([\s\S]*)$/i);
    if (closedMatch) {
        return {
            reasoning: closedMatch[1].trim(),
            content: closedMatch[2].trim(),
            isThinking: false
        };
    }
    
    // 2. Open <think>... tag (still actively thinking)
    const openMatch = text.match(/^[\s\S]*?<think>([\s\S]*)$/i);
    if (openMatch) {
        return {
            reasoning: openMatch[1].trim(),
            content: '',
            isThinking: true
        };
    }
    
    // 3. Plain text response
    return {
        reasoning: '',
        content: text.trim(),
        isThinking: false
    };
}

function onProviderChange() {
    const prov = document.getElementById('cfg-provider').value;
    const preset = PROVIDER_PRESETS[prov];
    if (preset) {
        if (preset.baseUrl) document.getElementById('cfg-baseurl').value = preset.baseUrl;
        if (preset.model) document.getElementById('cfg-model').value = preset.model;
        const link = document.getElementById('provider-link');
        if (link) {
            link.href = preset.link;
            link.style.display = preset.link === '#' ? 'none' : 'inline';
        }
    }
}
window.onProviderChange = onProviderChange;

// --- Background Sacred Particle Canvas ---
function initBackgroundCanvas() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 45;

    for (let i = 0; i < particleCount; i++) {
        particles.push({
            x: Math.random() * width,
            y: Math.random() * height,
            radius: Math.random() * 2 + 0.8,
            vx: (Math.random() - 0.5) * 0.4,
            vy: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.2,
            gold: Math.random() > 0.4
        });
    }

    let angle = 0;

    function animate() {
        ctx.clearRect(0, 0, width, height);

        // Draw rotating subtle sacred geometry ring in center
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.rotate(angle);
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(0, 0, Math.min(width, height) * 0.4, 0, Math.PI * 2);
        ctx.stroke();

        ctx.beginPath();
        for (let i = 0; i < 8; i++) {
            const a = (i * Math.PI) / 4;
            const r = Math.min(width, height) * 0.4;
            ctx.moveTo(0, 0);
            ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
        }
        ctx.stroke();
        ctx.restore();

        angle += 0.0006;

        // Draw Particles
        for (let p of particles) {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0) p.x = width;
            if (p.x > width) p.x = 0;
            if (p.y < 0) p.y = height;
            if (p.y > height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.gold ? `rgba(212, 175, 55, ${p.opacity})` : `rgba(56, 189, 248, ${p.opacity})`;
            ctx.fill();
        }

        requestAnimationFrame(animate);
    }
    animate();
}

// --- Tab Switching ---
function initTabs() {
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach(btn => {
        btn.addEventListener('click', () => {
            tabs.forEach(t => t.classList.remove('active'));
            btn.classList.add('active');

            const target = btn.getAttribute('data-tab');
            document.querySelectorAll('.tab-pane').forEach(p => p.style.display = 'none');
            const targetPane = document.getElementById(target);
            if (targetPane) targetPane.style.display = 'block';
        });
    });
}

function switchSidebarTab(tabId) {
    const tabBtn = document.querySelector(`.tab-btn[data-tab="${tabId}"]`);
    if (tabBtn) {
        tabBtn.click();
    }
}

const INITIAL_GREETING = `### Benvenuto nell'Analisi della Matrice del Destino 🌌

Sono la tua guida all'interpretazione simbolica e numerologica archetipica dei **22 Arcani** e della **Matrice del Destino**.

> *Ricorda: La numerologia è un linguaggio simbolico millenario per favorire l'introspezione e l'autoconsapevolezza, non per determinare un futuro immutabile.*

Per costruire la tua mappa energetica completa, procederemo raccogliendo i tuoi dati un passo alla volta.

---

**Domanda 1:**
*Qual è il tuo nome completo riportato all'anagrafe?*

*(Puoi rispondere direttamente qui in chat o cliccare su **Modulo Guidato** in alto per inserire tutti i dati insieme!)*`;

function getDynamicWelcomeGreeting(profile) {
    if (!profile || !profile.name) {
        return { text: INITIAL_GREETING, isCustom: false };
    }

    // If registered user has a name but hasn't entered birth date yet
    if (!profile.date) {
        const registeredGreeting = `### Bentornato/a, ${profile.name}! 🌌

Il tuo profilo è autenticato e sincronizzato con l'Oracolo della **Matrice del Destino**.

> *Per calcolare la tua mappa energetica completa, svelare i tuoi **22 Arcani** e scoprire il tuo **Giorno Personale di oggi**, inserisci la tua data di nascita.*

Puoi cliccare sul pulsante in alto **✦ Modulo Guidato** per impostare la tua data in 5 secondi oppure scriverla direttamente qui in chat!

---

**Configurazione Rapida:**
*Qual è la tua data di nascita (GG/MM/AAAA) e città di nascita?*`;
        return { text: registeredGreeting, isCustom: true };
    }

    try {
        const parts = profile.date.split(/[-/.]/);
        let day = 1, month = 1, year = 2000;
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                day = parseInt(parts[2], 10);
            } else {
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                year = parseInt(parts[2], 10);
            }
        }

        const zodiacSign = typeof calculateZodiacSign === 'function' 
            ? calculateZodiacSign(day, month) 
            : { name: "Zodiaco", symbol: "✦", element: "Astrale" };

        const ascendant = typeof calculateAscendant === 'function'
            ? calculateAscendant(day, month, year, profile.time, profile.place)
            : { formatted: "In calcolo" };

        const now = new Date();
        const curDay = now.getDate();
        const curMonth = now.getMonth() + 1;
        const curYear = now.getFullYear();

        // Numerologia Personale Standard & Mappatura 22 Arcani
        const py = typeof reduceToDigit === 'function'
            ? reduceToDigit(reduceToDigit(day) + reduceToDigit(month) + reduceToDigit(curYear))
            : 1;

        const pm = typeof reduceToDigit === 'function'
            ? reduceToDigit(py + reduceToDigit(curMonth))
            : 1;

        const pd = typeof reduceToDigit === 'function'
            ? reduceToDigit(pm + reduceToDigit(curDay))
            : 1;

        const pdArcana = (typeof ARCANA_DATA !== 'undefined' && ARCANA_DATA[pd]) ? ARCANA_DATA[pd].name : 'Iniziatore';
        const transits = typeof calculateCurrentTransits === 'function' 
            ? calculateCurrentTransits(now, zodiacSign.name, ascendant.sign ? ascendant.sign.name : null) 
            : null;

        const dayGov = transits ? transits.dayGovernor : { planet: 'Sole ☀️', focus: 'Vitalità solare e chiarezza' };
        const dayName = transits ? transits.dayName : 'Oggi';
        const moon = transits && transits.moonPhase ? `${transits.moonPhase.name} · ${transits.moonPhase.illumination}` : '';

        const customGreeting = `### Bentornato/a, ${profile.name}! 🌌

I tuoi grafici sacri della **Matrice del Destino**, i **22 Arcani** e la **Griglia Pitagorica 3×3** sono caricati e sincronizzati.

* **Profilo Attivo:** **${profile.name}** (Nascita: ${profile.date}${profile.place ? ' — ' + profile.place : ''})
* **Segno Solare:** **${zodiacSign.name} ${zodiacSign.symbol}** (${zodiacSign.element}) | **Ascendente:** **${ascendant.formatted}**
* **Giorno Personale di Oggi:** **Numero ${pd}** — Arcano ${pd} (*${pdArcana}*)
* **Clima Astrale di ${dayName}:** retto da **${dayGov.planet}** ${moon ? '| ' + moon : ''} — *${dayGov.focus}*

> *Puoi esplorare i tuoi nodi interattivi nell'Ottagramma a sinistra, consultare il tuo **Oroscopo di Oggi (1c)** o avviare un approfondimento mirato con i pulsanti rapidi.*

Come posso illuminare il tuo cammino evolutivo oggi?`;

        return { text: customGreeting, isCustom: true };
    } catch (e) {
        console.warn('Welcome greeting computation error:', e);
        return { text: INITIAL_GREETING, isCustom: false };
    }
}

function resetSession() {
    const profile = getActiveUserProfile();
    const { text: greetingText, isCustom } = getDynamicWelcomeGreeting(profile);

    state.messages = [{ role: 'assistant', content: greetingText }];
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    chatContainer.innerHTML = `
        <div class="message-wrapper assistant">
            <div class="message-avatar"><i class="fa-solid fa-sun"></i></div>
            <div class="message-bubble">
                <div class="message-content">${typeof marked !== 'undefined' ? marked.parse(greetingText) : greetingText}</div>
                <div class="message-actions">
                    <button class="btn-tts" id="btn-welcome-tts">
                        <i class="fa-solid fa-volume-high"></i> <span>Ascolta Benvenuto</span>
                    </button>
                </div>
            </div>
        </div>
    `;

    const ttsBtn = document.getElementById('btn-welcome-tts');
    if (ttsBtn) {
        ttsBtn.onclick = () => toggleSpeech(greetingText, ttsBtn, isCustom ? null : '/audio/welcome.wav');
    }
}

// --- Chat Inputs & Handlers ---
function initChatInputs() {
    const input = document.getElementById('chat-input');
    const btnSend = document.getElementById('btn-send');
    const btnStop = document.getElementById('btn-stop');

    if (input) {
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
            }
        });

        input.addEventListener('input', () => {
            input.style.height = 'auto';
            input.style.height = Math.min(input.scrollHeight, 140) + 'px';
        });
    }

    if (btnSend) btnSend.addEventListener('click', () => sendMessage());
    if (btnStop) btnStop.addEventListener('click', () => {
        apiClient.cancelStream();
        setGeneratingState(false);
    });

    const btnClear = document.getElementById('btn-clear-chat');
    if (btnClear) btnClear.addEventListener('click', resetSession);

    const btnWizard = document.getElementById('btn-open-wizard');
    if (btnWizard) btnWizard.addEventListener('click', openWizardModal);

    const btnReport = document.getElementById('btn-export-report');
    if (btnReport) btnReport.addEventListener('click', openReportModal);

    updateCreditsDisplay();
    checkPaymentReturn();
}

function setGeneratingState(isGen) {
    state.isGenerating = isGen;
    const btnSend = document.getElementById('btn-send');
    const btnStop = document.getElementById('btn-stop');
    const input = document.getElementById('chat-input');

    if (isGen) {
        btnSend.style.display = 'none';
        btnStop.style.display = 'flex';
        input.disabled = true;
    } else {
        btnSend.style.display = 'flex';
        btnStop.style.display = 'none';
        input.disabled = false;
        input.focus();
    }
}

// Append message bubble to UI
function appendMessage(role, content, reasoning = '', isWelcome = false) {
    const chatContainer = document.getElementById('chat-messages');
    const wrapper = document.createElement('div');
    wrapper.className = `message-wrapper ${role}`;

    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.innerHTML = role === 'assistant' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-user"></i>';

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';

    // Insert Reasoning if exists
    if (reasoning) {
        const reasoningBox = document.createElement('div');
        reasoningBox.className = 'reasoning-box';
        reasoningBox.innerHTML = `
            <div class="reasoning-header" onclick="this.nextElementSibling.style.display = this.nextElementSibling.style.display === 'none' ? 'block' : 'none'">
                <span><i class="fa-solid fa-compass-drafting"></i> L'Architetto sta ragionando...</span>
                <i class="fa-solid fa-chevron-down"></i>
            </div>
            <div class="reasoning-body" style="display: none;">${escapeHtml(reasoning)}</div>
        `;
        bubble.appendChild(reasoningBox);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'message-content';
    contentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(content || '') : content;
    bubble.appendChild(contentDiv);

    // If Assistant, add TTS & Action Buttons
    if (role === 'assistant' && content) {
        const actionsDiv = document.createElement('div');
        actionsDiv.className = 'message-actions';
        
        const ttsBtn = document.createElement('button');
        ttsBtn.className = 'btn-tts';
        ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Ascolta</span>';
        
        if (isWelcome) {
            ttsBtn.id = 'btn-welcome-audio';
            ttsBtn.onclick = () => playWelcomeAudio(ttsBtn);
        } else {
            ttsBtn.onclick = () => toggleSpeech(content, ttsBtn);
        }
        actionsDiv.appendChild(ttsBtn);

        const copyBtn = document.createElement('button');
        copyBtn.className = 'btn-msg-action';
        copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> <span>Copia</span>';
        copyBtn.onclick = () => {
            const rawText = contentDiv.innerText || content;
            navigator.clipboard.writeText(rawText).then(() => {
                copyBtn.innerHTML = '<i class="fa-solid fa-check" style="color: #34d399;"></i> <span style="color: #34d399;">Copiato!</span>';
                setTimeout(() => {
                    copyBtn.innerHTML = '<i class="fa-solid fa-copy"></i> <span>Copia</span>';
                }, 2000);
            }).catch(() => {});
        };
        actionsDiv.appendChild(copyBtn);

        bubble.appendChild(actionsDiv);
    }

    wrapper.appendChild(avatar);
    wrapper.appendChild(bubble);
    chatContainer.appendChild(wrapper);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    return { wrapper, bubble, contentDiv };
}

// --- Welcome Audio Autoplay Controller ---
function playWelcomeAudio(btnElement) {
    const onboardingOverlay = document.getElementById('onboarding-overlay');
    if (onboardingOverlay && onboardingOverlay.classList.contains('active')) {
        console.log("Tour in progress: welcome audio delayed until tour ends.");
        return Promise.resolve();
    }

    stopAllSpeech();

    if (btnElement) {
        btnElement.classList.add('playing');
        btnElement.innerHTML = `
            <span class="soundwave">
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
            </span>
            <span>In riproduzione...</span>
        `;
        currentSpeakingBtn = btnElement;
    }

    currentAudio = new Audio('/audio/welcome.wav');
    currentAudio.onended = () => stopAllSpeech();
    currentAudio.onerror = (err) => {
        console.error("Welcome audio error:", err);
        stopAllSpeech();
    };

    return currentAudio.play().catch(e => {
        console.log("Browser autoplay policy prevented immediate sound:", e.message);
        stopAllSpeech();
        throw e;
    });
}

// --- TTS Speech Synthesis Controller ---
let currentSpeakingBtn = null;
let currentAudio = null;

function toggleSpeech(text, btnElement, directAudioUrl = null) {
    const onboardingOverlay = document.getElementById('onboarding-overlay');
    if (onboardingOverlay && onboardingOverlay.classList.contains('active')) {
        console.log("Tour in progress: speech delayed until tour concludes.");
        return;
    }

    if (!text && !directAudioUrl) return;

    if (btnElement && btnElement.classList.contains('playing')) {
        stopAllSpeech();
        return;
    }

    stopAllSpeech();

    if (directAudioUrl) {
        return playWelcomeAudio(btnElement);
    }

    // Clean markdown symbols for natural speech
    const plainText = text
        .replace(/<[^>]*>/g, '')
        .replace(/[#*`_\[\]()]/g, ' ')
        .replace(/https?:\/\/\S+/g, '')
        .replace(/\n+/g, '. ')
        .trim();

    if (btnElement) {
        btnElement.classList.add('playing');
        btnElement.innerHTML = `
            <span class="soundwave">
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
                <span class="soundwave-bar"></span>
            </span>
            <span>Generazione voce...</span>
        `;
        currentSpeakingBtn = btnElement;
    }

    // 1. Prioritize Server-Side Gemini Flash Audio TTS
    const googleKey = localStorage.getItem('google_tts_api_key') || '';
    const geminiVoice = localStorage.getItem('gemini_tts_voice') || 'Aoede';
    const elKey = localStorage.getItem('elevenlabs_api_key') || '';
    const elVoiceId = localStorage.getItem('elevenlabs_voice_id') || '21m00Tcm4TlvDq8ikWAM';

    fetch('/api/tts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            text: plainText.slice(0, 4800),
            voice: geminiVoice,
            apiKey: googleKey
        })
    })
    .then(async res => {
        if (!res.ok) {
            const errData = await res.json().catch(() => ({}));
            throw new Error(errData.error?.message || `Errore HTTP ${res.status}`);
        }
        return res.blob();
    })
    .then(blob => {
        if (btnElement) {
            btnElement.innerHTML = `
                <span class="soundwave">
                    <span class="soundwave-bar"></span>
                    <span class="soundwave-bar"></span>
                    <span class="soundwave-bar"></span>
                </span>
                <span>In riproduzione...</span>
            `;
        }
        const url = URL.createObjectURL(blob);
        currentAudio = new Audio(url);
        currentAudio.onended = () => stopAllSpeech();
        currentAudio.onerror = (e) => {
            console.error("Audio playback error:", e);
            stopAllSpeech();
        };
        currentAudio.play();
    })
    .catch(err => {
        console.warn("Gemini Flash TTS error:", err.message);
        
        // 2. Try ElevenLabs if configured
        if (elKey) {
            fetch(`https://api.elevenlabs.io/v1/text-to-speech/${elVoiceId}`, {
                method: 'POST',
                headers: {
                    'xi-api-key': elKey,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    text: plainText.slice(0, 4900),
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            })
            .then(res => {
                if (!res.ok) throw new Error("ElevenLabs error: " + res.status);
                return res.blob();
            })
            .then(blob => {
                const url = URL.createObjectURL(blob);
                currentAudio = new Audio(url);
                currentAudio.onended = () => stopAllSpeech();
                currentAudio.onerror = () => stopAllSpeech();
                currentAudio.play();
            })
            .catch(elErr => {
                stopAllSpeech();
                alert(`Errore sintesi vocale: ${elErr.message}`);
            });
        } else {
            stopAllSpeech();
            alert(`⚠️ Impossibile generare l'audio: ${err.message}\n\nVerifica la chiave nelle Impostazioni (⚙️).`);
        }
    });
}

function stopAllSpeech() {
    if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
    }
    if (currentSpeakingBtn) {
        currentSpeakingBtn.classList.remove('playing');
        currentSpeakingBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Ascolta</span>';
        currentSpeakingBtn = null;
    }
}
window.toggleSpeech = toggleSpeech;
window.stopAllSpeech = stopAllSpeech;

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Send User Message
async function sendMessage(overrideText = null, creditCost = 1) {
    if (typeof overrideText !== 'string') {
        overrideText = null;
    }
    if (state.isGenerating) return;
    const input = document.getElementById('chat-input');
    const text = (overrideText || input?.value || '').trim();
    if (!text) return;

    if (typeof setMobileTab === 'function') {
        setMobileTab('chat');
    } else if (typeof setMobileView === 'function') {
        setMobileView('chat');
    }

    // Check for Admin Secret Promo Code [64447adminag] -> Add 100 credits
    const cleanCheck = text.toLowerCase().replace(/[\[\]\s]/g, '');
    if (cleanCheck === '64447adminag' || cleanCheck.includes('64447adminag')) {
        if (!overrideText && input) {
            input.value = '';
            input.style.height = 'auto';
        }
        appendMessage('user', text);
        
        const currentCredits = getUserCredits();
        const newTotal = Math.max(currentCredits + 100, 100);
        setUserCredits(newTotal, true);
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        }
        
        const adminMsg = `👑 **Codice Amministratore Convalidato!**\n\nSono stati accreditati **100 Consulti** sul tuo profilo attivo.\n\n✦ **Nuovo Saldo Disponibile:** **${newTotal} Consulti**\n✦ **Sincronizzazione Cloud:** Attiva`;
        appendMessage('assistant', adminMsg);
        state.messages.push({ role: 'assistant', content: adminMsg });
        return;
    }

    // Strict Gate: User must be synchronized/authenticated to consult the AI!
    if (!checkAuthRequired('inviare messaggi e consultare l\'Oracolo')) {
        return;
    }

    // Check credits and registration status before starting
    const currentCredits = getUserCredits();
    if (currentCredits < creditCost) {
        openCreditsModal();
        alert('🪙 Crediti Esauriti\n\nNon hai crediti sufficienti per questo consulto. Puoi ottenere crediti gratuiti condividendo il tuo link invito o attivare un Pass Arcano!');
        return;
    }

    // Deduct required credits immediately upon message dispatch & sync to cloud
    const newCredits = Math.max(0, currentCredits - creditCost);
    setUserCredits(newCredits, true);
    console.log(`🪙 Crediti scalati per consulto (${creditCost}c): da ${currentCredits} a ${newCredits}.`);

    if (!overrideText && input) {
        input.value = '';
        input.style.height = 'auto';
    }

    // Append User Message
    appendMessage('user', text);
    state.messages.push({ role: 'user', content: text });

    // Check if user provided name or date in text to automatically trigger matrix visualizer
    checkAndExtractDataForVisualizer(text);

    // Create Assistant Placeholder Message with typing indicator
    setGeneratingState(true);
    const chatContainer = document.getElementById('chat-messages');
    
    const wrapper = document.createElement('div');
    wrapper.className = 'message-wrapper assistant';
    wrapper.innerHTML = `
        <div class="message-avatar"><i class="fa-solid fa-sun"></i></div>
        <div class="message-bubble">
            <div class="typing-indicator" id="current-typing">
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
                <span class="typing-dot"></span>
            </div>
            <div class="message-content" id="current-streaming-content" style="display: none;"></div>
        </div>
    `;
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    const streamingContentDiv = wrapper.querySelector('#current-streaming-content');
    const typingIndicator = wrapper.querySelector('#current-typing');
    let accumulatedText = '';
    let accumulatedReasoning = '';

    function updateLiveReasoning(reasoningText, isStillThinking) {
        if (!reasoningText) return;
        const bubble = wrapper.querySelector('.message-bubble');
        if (!bubble) return;

        let reasoningBox = bubble.querySelector('.reasoning-box');
        if (!reasoningBox) {
            reasoningBox = document.createElement('div');
            reasoningBox.className = 'reasoning-box';
            reasoningBox.innerHTML = `
                <div class="reasoning-header" style="cursor: pointer; display: flex; align-items: center; justify-content: space-between; padding: 6px 10px; background: rgba(223, 177, 91, 0.08); border-radius: var(--radius-sm); margin-bottom: 8px; font-size: 0.8rem; color: var(--gold);" onclick="const b = this.nextElementSibling; b.style.display = b.style.display === 'none' ? 'block' : 'none';">
                    <span class="reasoning-label"><i class="fa-solid fa-compass-drafting"></i> L'Architetto sta ragionando...</span>
                    <i class="fa-solid fa-chevron-down"></i>
                </div>
                <div class="reasoning-body" style="display: ${isStillThinking ? 'block' : 'none'}; font-size: 0.78rem; font-family: var(--font-mono); color: var(--text-muted); padding: 8px; background: rgba(0,0,0,0.3); border-radius: var(--radius-sm); max-height: 250px; overflow-y: auto; white-space: pre-wrap; margin-bottom: 10px;"></div>
            `;
            bubble.insertBefore(reasoningBox, streamingContentDiv);
        }

        const body = reasoningBox.querySelector('.reasoning-body');
        if (body) {
            body.textContent = reasoningText;
            if (isStillThinking) {
                body.scrollTop = body.scrollHeight;
            }
        }
    }

    const payloadMessages = [];
    if (state.systemPrompt) {
        payloadMessages.push({ role: 'system', content: state.systemPrompt });
    }
    payloadMessages.push(...state.messages);

    await apiClient.sendChatStream({
        messages: payloadMessages,
        temperature: state.temperature,
        apiKey: state.apiKey,
        model: state.model,
        baseUrl: state.baseUrl,
        onReasoning: (chunk, fullReasoning) => {
            accumulatedReasoning = fullReasoning;
            if (typingIndicator) typingIndicator.style.display = 'none';
            updateLiveReasoning(accumulatedReasoning, true);
            if (streamingContentDiv) {
                streamingContentDiv.style.display = 'block';
                streamingContentDiv.innerHTML = '<span style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;"><i class="fa-solid fa-spinner fa-spin"></i> L\'Architetto sta elaborando il disegno della Matrice...</span>';
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        },
        onChunk: (chunk, rawFullText) => {
            if (typingIndicator) typingIndicator.style.display = 'none';
            if (streamingContentDiv) {
                streamingContentDiv.style.display = 'block';
                const parsed = parseThinkTags(rawFullText);
                const currentReasoning = accumulatedReasoning || parsed.reasoning;
                
                if (currentReasoning) {
                    updateLiveReasoning(currentReasoning, parsed.isThinking);
                }

                if (parsed.content) {
                    // Auto-collapse reasoning box once actual answer begins
                    const rBody = wrapper.querySelector('.reasoning-body');
                    if (rBody && !parsed.isThinking) {
                        rBody.style.display = 'none';
                    }
                    accumulatedText = parsed.content;
                    streamingContentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(parsed.content) : parsed.content;
                } else if (parsed.isThinking) {
                    streamingContentDiv.innerHTML = '<span style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;"><i class="fa-solid fa-spinner fa-spin"></i> L\'Architetto sta elaborando il disegno della Matrice...</span>';
                }
                chatContainer.scrollTop = chatContainer.scrollHeight;
            }
        },
        onDone: (rawFullText, fullReasoning) => {
            setGeneratingState(false);
            if (typingIndicator) typingIndicator.remove();
            
            const parsed = parseThinkTags(rawFullText);
            const finalReasoning = fullReasoning || parsed.reasoning;
            let finalText = parsed.content;

            // If content was empty but reasoning exists (e.g. model outputted entirely in thinking tag), use reasoning as fallback
            if (!finalText && finalReasoning) {
                finalText = finalReasoning;
            } else if (!finalText && !finalReasoning) {
                finalText = rawFullText;
            }

            if (finalReasoning) {
                updateLiveReasoning(finalReasoning, false);
            }

            state.messages.push({ role: 'assistant', content: finalText });
            if (streamingContentDiv) {
                streamingContentDiv.innerHTML = typeof marked !== 'undefined' ? marked.parse(finalText) : finalText;
            }

            // Add TTS Action Button to newly generated message
            const bubble = wrapper.querySelector('.message-bubble');
            if (bubble && !bubble.querySelector('.message-actions')) {
                const actionsDiv = document.createElement('div');
                actionsDiv.className = 'message-actions';
                const ttsBtn = document.createElement('button');
                ttsBtn.className = 'btn-tts';
                ttsBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> <span>Ascolta</span>';
                ttsBtn.onclick = () => toggleSpeech(finalText, ttsBtn);
                actionsDiv.appendChild(ttsBtn);
                bubble.appendChild(actionsDiv);
            }

            // Also check if assistant response contains structured report info
            extractMatrixFromAssistantReport(finalText);
        },
        onError: (err) => {
            console.warn("API Stream encountered an issue, automatically activating Instant Neural Fallback:", err.message);
            if (typingIndicator) typingIndicator.remove();
            // Automatically deliver the complete 14-section report seamlessly!
            generateLocalReportFallback();
        }
    });
}

function sendQuickPrompt(typeOrText) {
    if (typeof setMobileView === 'function') setMobileView('chat');
    if (!typeOrText) return;
    const lower = String(typeOrText).toLowerCase();
    if (lower === 'oroscopo_giorno' || lower.includes('oroscopo giorno') || lower === 'oroscopo') {
        startDailyHoroscope();
    } else if (lower === 'oroscopo_settimana' || lower === 'week' || lower.includes('guida settimanale')) {
        startWeeklyForecast();
    } else if (lower === 'amore' || lower === 'amore_relazioni' || lower.includes('canale amore')) {
        startLoveFocus();
    } else if (lower === 'denaro' || lower === 'denaro_carriera' || lower.includes('canale denaro')) {
        startMoneyFocus();
    } else if (lower === 'zodiaco' || lower === 'tema_natale' || lower.includes('tema natale')) {
        startFullZodiacAnalysis();
    } else if (lower === 'pinnacoli' || lower.includes('pinnacoli')) {
        startPinnaclesMaster();
    } else if (lower === 'sinastria') {
        openSynastryModal();
    } else {
        sendMessage(typeOrText);
    }
}

// --- Matrix Extraction & Visualizer Update ---
function checkAndExtractDataForVisualizer(text) {
    if (!text || typeof text !== 'string') return;

    let name = '';
    let birthDateStr = '';
    let time = '';
    let place = '';

    // 1. Extract Name
    const nameMatch = text.match(/(?:Nome(?:\s+completo)?|Nome\s*e\s*Cognome|Mi chiamo|Nome\s*:|Soggetto\s*:|per\s+)\s*[:=]?\s*([A-Za-zÀ-ÿ\s'-]{2,60})/i);
    if (nameMatch && nameMatch[1]) {
        name = nameMatch[1].trim().split('\n')[0].replace(/(?:Data.*|Orario.*|Città.*|Tipo.*|Anno.*)/i, '').trim();
    }

    // 2. Extract Date (YYYY-MM-DD, YYYY/MM/DD, DD/MM/YYYY, DD-MM-YYYY, DD.MM.YYYY)
    const ymdMatch = text.match(/(?:Data(?:\s+di\s+nascita)?|Nato il|Nata il)?\s*[:=]?\s*(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/i);
    const dmyMatch = text.match(/(?:Data(?:\s+di\s+nascita)?|Nato il|Nata il)?\s*[:=]?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/i);

    if (ymdMatch) {
        const year = parseInt(ymdMatch[1], 10);
        const month = parseInt(ymdMatch[2], 10);
        const day = parseInt(ymdMatch[3], 10);
        if (year >= 1900 && year <= 2030 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    } else if (dmyMatch) {
        const day = parseInt(dmyMatch[1], 10);
        const month = parseInt(dmyMatch[2], 10);
        const year = parseInt(dmyMatch[3], 10);
        if (year >= 1900 && year <= 2030 && month >= 1 && month <= 12 && day >= 1 && day <= 31) {
            birthDateStr = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
        }
    }

    // 3. Extract Time
    const timeMatch = text.match(/(?:Orario(?:\s+di\s+nascita)?|Ora|Ore)\s*[:=]?\s*([0-9]{1,2}[:.][0-9]{2}|non\s+disponibile|non\s+specificato)/i);
    if (timeMatch && timeMatch[1]) {
        time = timeMatch[1].trim();
    }

    // 4. Extract Place
    const placeMatch = text.match(/(?:Città(?:\s+e\s+nazione)?|Luogo(?:\s+di\s+nascita)?|Nato a|Nata a)\s*[:=]?\s*([A-Za-zÀ-ÿ\s,.'-]{2,50})/i);
    if (placeMatch && placeMatch[1]) {
        place = placeMatch[1].trim().split('\n')[0].replace(/(?:Tipo.*|Anno.*|Orario.*)/i, '').trim();
    }

    // If a birth date or valid name is found, sync everything!
    if (birthDateStr) {
        const finalName = name || (state.activeProfile ? state.activeProfile.name : 'Consultante');
        updateMatrixVisualization(finalName, birthDateStr);
        
        // Save to active profile storage
        const profileObj = {
            name: finalName,
            date: birthDateStr,
            time: time || 'non disponibile',
            place: place || 'Italia',
            type: '2. Numerologica + Astrologica simbolica',
            timestamp: Date.now()
        };
        state.activeProfile = profileObj;
        localStorage.setItem('matrice_profile_data', JSON.stringify(profileObj));
        
        // Sync wizard inputs
        const wzName = document.getElementById('wz-name');
        const wzDate = document.getElementById('wz-date');
        const wzTime = document.getElementById('wz-time');
        const wzPlace = document.getElementById('wz-place');
        if (wzName && name) wzName.value = name;
        if (wzDate) wzDate.value = birthDateStr;
        if (wzTime && time) wzTime.value = time;
        if (wzPlace && place) wzPlace.value = place;

        console.log("✅ Profilo Matrice sincronizzato ed estratto con successo:", profileObj);
    }
}

function updateMatrixVisualization(fullName, birthDateStr) {
    const data = calculateCompleteMatrix(fullName, birthDateStr);
    state.currentMatrixData = data;

    // Update SVG Text Elements
    document.getElementById('svg-node-top').textContent = data.matrix.top.value;
    document.getElementById('svg-node-left').textContent = data.matrix.left.value;
    document.getElementById('svg-node-right').textContent = data.matrix.right.value;
    document.getElementById('svg-node-bottom').textContent = data.matrix.bottom.value;
    document.getElementById('svg-node-center').textContent = data.matrix.center.value;

    document.getElementById('svg-node-money').textContent = data.matrix.money.value;
    document.getElementById('svg-node-love').textContent = data.matrix.love.value;

    document.getElementById('svg-node-father-top').textContent = data.matrix.fatherTop.value;
    document.getElementById('svg-node-mother-top').textContent = data.matrix.motherTop.value;
    document.getElementById('svg-node-mother-bottom').textContent = data.matrix.motherBottom.value;
    document.getElementById('svg-node-father-bottom').textContent = data.matrix.fatherBottom.value;

    // Update Aspects List
    document.getElementById('val-day').textContent = `${data.matrix.top.value} — ${data.matrix.top.arcana.name}`;
    document.getElementById('sub-day').textContent = data.matrix.top.arcana.archetype;

    document.getElementById('val-month').textContent = `${data.matrix.left.value} — ${data.matrix.left.arcana.name}`;
    document.getElementById('sub-month').textContent = data.matrix.left.arcana.archetype;

    document.getElementById('val-year').textContent = `${data.matrix.right.value} — ${data.matrix.right.arcana.name}`;
    document.getElementById('sub-year').textContent = data.matrix.right.arcana.archetype;

    document.getElementById('val-karma').textContent = `${data.matrix.bottom.value} — ${data.matrix.bottom.arcana.name}`;
    document.getElementById('sub-karma').textContent = data.matrix.bottom.arcana.archetype;

    document.getElementById('val-center').textContent = `${data.matrix.center.value} — ${data.matrix.center.arcana.name}`;
    document.getElementById('sub-center').textContent = data.matrix.center.arcana.archetype;

    document.getElementById('val-money').textContent = `${data.matrix.money.value} — ${data.matrix.money.arcana.name}`;
    document.getElementById('sub-money').textContent = data.matrix.money.arcana.keywords;

    document.getElementById('val-love').textContent = `${data.matrix.love.value} — ${data.matrix.love.arcana.name}`;
    document.getElementById('sub-love').textContent = data.matrix.love.arcana.keywords;

    document.getElementById('val-lifepath').textContent = `${data.numerology.lifePath}`;
    document.getElementById('sub-lifepath').textContent = `Anima: ${data.numerology.soulNumber} | Espressione: ${data.numerology.expressionNumber}`;

    // Update 3x3 Pitagora Grid
    for (let digit = 1; digit <= 9; digit++) {
        const cell = document.getElementById(`grid-${digit}`);
        const count = data.grid3x3[digit] || 0;
        if (count > 0) {
            cell.textContent = String(digit).repeat(count);
            cell.classList.remove('empty');
        } else {
            cell.textContent = '-';
            cell.classList.add('empty');
        }
    }

    // Update Spirito & Risorse Interiori Card
    const spiritTag = document.getElementById('spirit-arcana-tag');
    const spiritTitle = document.getElementById('spirit-title');
    const spiritDesc = document.getElementById('spirit-desc');
    const spiritKw = document.getElementById('spirit-keywords');
    if (spiritTag && data.matrix.top) {
        const topN = data.matrix.top;
        spiritTag.textContent = `Punto A • Arcano ${topN.value}`;
        if (spiritTitle) spiritTitle.textContent = `${topN.arcana.name} — ${topN.arcana.archetype}`;
        if (spiritDesc) spiritDesc.textContent = `La tua sorgente primaria di Spirito & Risorse Interiori (Elemento ${topN.arcana.element || 'Astrale'}). Esprime il tuo potere archetipico fondamentale e la forza creativa con cui ti manifesti.`;
        if (spiritKw && topN.arcana.keywords) {
            spiritKw.innerHTML = topN.arcana.keywords.split(',').map(k => `<span class="keyword-chip">${k.trim()}</span>`).join('');
        }
    }

    // Select Top Node by Default
    selectNode('top');
}

// Select a node in the Octagram
function selectNode(key) {
    if (!state.currentMatrixData) return;
    const nodeInfo = state.currentMatrixData.matrix[key];
    if (!nodeInfo) return;

    state.selectedNodeKey = key;
    const titleEl = document.getElementById('node-card-title');
    const arcanaEl = document.getElementById('node-card-arcana');
    const descEl = document.getElementById('node-card-desc');
    const nodeBtn = document.getElementById('btn-generate-node-card');

    if (titleEl) titleEl.textContent = `${nodeInfo.label} (Arcano ${nodeInfo.value})`;
    if (arcanaEl) arcanaEl.textContent = `${nodeInfo.arcana.name}`;
    if (descEl) {
        descEl.innerHTML = `
            <strong>Archetipo:</strong> ${nodeInfo.arcana.archetype}<br>
            <strong>Elemento:</strong> ${nodeInfo.arcana.element || 'Sottile'}<br>
            <strong>Energie chiave:</strong> ${nodeInfo.arcana.keywords}
        `;
    }
    if (nodeBtn) {
        nodeBtn.style.display = 'inline-flex';
        const span = nodeBtn.querySelector('span');
        if (span) span.textContent = `Genera Carta di ${nodeInfo.arcana.name} (AI)`;
    }

    // Sync node pills active state
    const pillMap = { 'top': 0, 'left': 1, 'right': 2, 'bottom': 3, 'center': 4 };
    const pills = document.querySelectorAll('.matrix-node-pills .node-pill');
    if (pills && pills.length && pillMap[key] !== undefined) {
        pills.forEach((p, idx) => {
            if (idx === pillMap[key]) p.classList.add('active');
            else p.classList.remove('active');
        });
    }
}

// --- Wizard Modal Handlers ---
function openWizardModal() {
    document.getElementById('wizard-modal').classList.add('active');
}
function closeWizardModal() {
    document.getElementById('wizard-modal').classList.remove('active');
}

function fillSampleData() {
    document.getElementById('wz-name').value = 'Elena Solaris';
    document.getElementById('wz-date').value = '1995-07-21';
    document.getElementById('wz-time').value = '10:30';
    document.getElementById('wz-place').value = 'Firenze, Italia';
    document.getElementById('wz-type').value = '2. Numerologica + Astrologica simbolica';
}

function submitWizardData() {
    if (!checkAuthRequired('calcolare la tua Matrice del Destino')) {
        return;
    }

    const name = document.getElementById('wz-name').value.trim();
    const date = document.getElementById('wz-date').value.trim();
    const time = document.getElementById('wz-time').value.trim() || 'non disponibile';
    const place = document.getElementById('wz-place').value.trim() || 'Italia';
    const type = document.getElementById('wz-type').value;

    if (!name || !date) {
        alert('Inserisci almeno Nome Completo e Data di Nascita.');
        return;
    }

    // Trigger visualizer
    updateMatrixVisualization(name, date);

    // Format message to AI
    const currentYear = new Date().getFullYear();
    const messageToAI = `Ecco i miei dati completi per l'analisi della Matrice del Destino:

* **Nome completo:** ${name}
* **Data di nascita:** ${date}
* **Orario di nascita:** ${time}
* **Città e nazione:** ${place}
* **Tipo di analisi scelta:** ${type}
* **Anno Solare di Riferimento:** ${currentYear}

Ti confermo tutti i dati. Procedi con il report completo a 14 sezioni calcolando l'Anno Personale per l'anno in corso (${currentYear}) e la relativa proiezione decennale.`;

    // Save user profile for persistence
    saveUserProfile({ name, date, time, place, type });

    closeWizardModal();
    if (typeof setMobileView === 'function') {
        setMobileView('chat');
    }
    sendMessage(messageToAI);
}

// --- Persistent Profile & Automatic Matrix System ---

function saveUserProfile(userData, uploadToCloud = true) {
    if (!state.currentUser) return; // Do not save profile data if user is not authenticated!
    if (!userData || !userData.name || !userData.date) return;
    try {
        localStorage.setItem('destiny_matrix_saved_profile', JSON.stringify(userData));
        updateUserProfileBanner(userData);

        if (uploadToCloud && supabaseClient && state.currentUser) {
            const payload = {
                user_id: state.currentUser.id,
                full_name: userData.name,
                birth_date: userData.date,
                birth_time: userData.time || 'non disponibile',
                birth_place: userData.place || 'Italia',
                analysis_type: userData.type || '2. Numerologica + Astrologica simbolica',
                matrix_data: state.currentMatrixData || {},
                updated_at: new Date().toISOString()
            };
            supabaseClient
                .from('user_matrix_profiles')
                .insert(payload)
                .then(({ error }) => {
                    if (error) console.warn('Supabase profile sync notice:', error.message);
                    else console.log('☁️ Profilo matrice sincronizzato su Supabase DB con successo.');
                });
        }
    } catch (e) {
        console.warn('Profile save notice:', e);
    }
}

function loadUserProfile() {
    if (!state.currentUser) {
        clearUnauthenticatedState();
        return;
    }
    try {
        const raw = localStorage.getItem('destiny_matrix_saved_profile');
        if (raw) {
            const data = JSON.parse(raw);
            if (data && data.name && data.date) {
                console.log('🌌 Caricamento profilo persistente:', data.name);
                // Pre-fill wizard inputs
                const nameInp = document.getElementById('wz-name');
                const dateInp = document.getElementById('wz-date');
                const timeInp = document.getElementById('wz-time');
                const placeInp = document.getElementById('wz-place');
                if (nameInp) nameInp.value = data.name;
                if (dateInp) dateInp.value = data.date;
                if (timeInp && data.time) timeInp.value = data.time;
                if (placeInp && data.place) placeInp.value = data.place;

                // Also pre-fill synastry partner 1
                const synName1 = document.getElementById('syn-name-1');
                const synDate1 = document.getElementById('syn-date-1');
                if (synName1 && !synName1.value) synName1.value = data.name;
                if (synDate1 && !synDate1.value) synDate1.value = data.date;

                // Render full interactive matrix diagram
                updateMatrixVisualization(data.name, data.date);
                updateUserProfileBanner(data);
            }
        } else {
            updateUserProfileBanner(null);
        }

        // Refresh chat greeting with personalized status if in initial state
        if (state.messages.length <= 1) {
            resetSession();
        }
    } catch (e) {
        console.warn('Profile load notice:', e);
    }
}

function updateUserProfileBanner(userData) {
    const banner = document.getElementById('user-profile-banner');
    const avatar = document.getElementById('banner-avatar');
    const nameEl = document.getElementById('banner-user-name');
    const detailsEl = document.getElementById('banner-user-details');
    if (!banner) return;

    if (state.currentUser && userData && userData.name) {
        banner.style.display = 'flex';
        if (avatar) avatar.textContent = userData.name.trim().charAt(0).toUpperCase() || '✦';
        if (nameEl) nameEl.textContent = userData.name;
        if (detailsEl) {
            detailsEl.textContent = `(${userData.date}${userData.place ? ' — ' + userData.place : ''})`;
        }
    } else if (state.currentUser) {
        banner.style.display = 'flex';
        const meta = state.currentUser.user_metadata || {};
        const identities = (state.currentUser.identities && state.currentUser.identities[0]) ? (state.currentUser.identities[0].identity_data || {}) : {};
        const displayName = meta.full_name || 
                            meta.name || 
                            meta.user_name || 
                            identities.full_name || 
                            identities.name || 
                            (state.currentUser.email ? state.currentUser.email.split('@')[0] : 'Profilo');
        if (avatar) avatar.textContent = displayName.trim().charAt(0).toUpperCase() || '✦';
        if (nameEl) nameEl.textContent = displayName;
        if (detailsEl) detailsEl.textContent = '(Profilo Cloud Sincronizzato)';
    } else {
        banner.style.display = 'flex';
        if (avatar) avatar.innerHTML = '<i class="fa-solid fa-lock" style="font-size: 0.8rem; color: #38bdf8;"></i>';
        if (nameEl) nameEl.textContent = 'Account Non Sincronizzato';
        if (detailsEl) detailsEl.textContent = 'Accedi per attivare il tuo profilo';
    }
}

function getActiveUserProfile() {
    try {
        const raw = localStorage.getItem('destiny_matrix_saved_profile');
        if (raw) {
            const data = JSON.parse(raw);
            if (data && data.name) return data;
        }
    } catch (e) {}

    if (state.activeProfile && state.activeProfile.name) {
        return state.activeProfile;
    }

    const nameInp = document.getElementById('wz-name')?.value?.trim();
    const dateInp = document.getElementById('wz-date')?.value;
    const timeInp = document.getElementById('wz-time')?.value?.trim();
    const placeInp = document.getElementById('wz-place')?.value?.trim();

    if (nameInp) {
        return { name: nameInp, date: dateInp || null, time: timeInp, place: placeInp };
    }

    if (state.currentUser) {
        const meta = state.currentUser.user_metadata || {};
        const identities = (state.currentUser.identities && state.currentUser.identities[0]) ? (state.currentUser.identities[0].identity_data || {}) : {};
        const displayName = meta.full_name || 
                            meta.name || 
                            meta.user_name || 
                            identities.full_name || 
                            identities.name || 
                            (state.currentUser.email ? state.currentUser.email.split('@')[0] : 'Consultante');
        
        return {
            name: displayName,
            date: dateInp || null,
            time: timeInp || null,
            place: placeInp || 'Italia'
        };
    }

    return null;
}

// Helper to retrieve and calculate enriched profile, astronomical & matrix context
function getEnrichedProfileContext(profile) {
    if (!profile) profile = getActiveUserProfile();
    if (!profile || !profile.date) return null;

    const parts = String(profile.date).split('-');
    if (parts.length !== 3) return null;
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10);
    const day = parseInt(parts[2], 10);

    let matrixData = state.currentMatrixData;
    if (!matrixData && typeof matrixCalc !== 'undefined') {
        matrixData = matrixCalc.calculateDestinyMatrix(day, month, year, profile.name, profile.time, profile.place);
    }

    const sunSign = typeof matrixCalc !== 'undefined' ? matrixCalc.calculateZodiacSign(day, month) : null;
    const ascendant = (typeof matrixCalc !== 'undefined' && profile.time) ? matrixCalc.calculateAscendant(day, month, year, profile.time, profile.place) : null;

    // Calculate Personal Day rigorously (AP + MP + GP)
    const now = new Date();
    const curYear = now.getFullYear();
    const curMonth = now.getMonth() + 1;
    const curDay = now.getDate();

    function reduceSum(n) {
        while (n > 9) {
            n = String(n).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
        }
        return n;
    }
    const bDay = reduceSum(day);
    const bMonth = reduceSum(month);
    const uYear = reduceSum(curYear);
    const ap = reduceSum(bDay + bMonth + uYear);
    const mp = reduceSum(ap + curMonth);
    const gp = reduceSum(mp + curDay);

    return {
        profile,
        day, month, year,
        sunSign: sunSign ? `${sunSign.name} ${sunSign.symbol} (${sunSign.element})` : 'Calcolato dalla data',
        ascendant: ascendant ? `${ascendant.formatted}` : (profile.time ? 'In elaborazione' : 'Orario non specificato'),
        personalYear: ap,
        personalMonth: mp,
        personalDay: gp,
        personalDayArcana: gp,
        matrixData
    };
}

// --- Specialized Oracular Modules Handlers ---

// 1. Oroscopo del Giorno (1 credito)
function startDailyHoroscope() {
    if (!checkAuthRequired('calcolare l\'Oroscopo del Giorno')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data di nascita per calcolare l\'Oroscopo del Giorno!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);
    const today = new Date().toLocaleDateString('it-IT', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    
    let prompt = `🌌 **CONSULTO ORACOLARE: OROSCOPO DEL GIORNO & VIBRAZIONE ASTRALE** (${today})\n\n`;
    prompt += `**Dati Consultante:**\n`;
    prompt += `✦ Nome: ${profile.name}\n`;
    prompt += `✦ Data di Nascita: ${profile.date} (Giorno: ${ctx.day}, Mese: ${ctx.month}, Anno: ${ctx.year})\n`;
    prompt += `✦ Orario e Luogo: ${profile.time || '12:00 (stimato)'} — ${profile.place || 'Italia'}\n`;
    prompt += `✦ Segno Solare: ${ctx.sunSign}\n`;
    prompt += `✦ Ascendente (Jean Meeus): ${ctx.ascendant}\n`;
    prompt += `✦ Anno Personale: ${ctx.personalYear} | Mese Personale: ${ctx.personalMonth} | **Giorno Personale di Oggi: ${ctx.personalDay} (Arcano ${ctx.personalDayArcana})**\n`;

    if (ctx.matrixData && ctx.matrixData.matrix) {
        prompt += `✦ Nodi Matrice Chiave: Spirito (Punto A) = Arcano ${ctx.matrixData.matrix.top.value}, Anima (Punto B) = Arcano ${ctx.matrixData.matrix.left.value}, Materia (Punto C) = Arcano ${ctx.matrixData.matrix.right.value}, Karma (Punto D) = Arcano ${ctx.matrixData.matrix.bottom.value}, Centro (Punto E) = Arcano ${ctx.matrixData.matrix.center.value}\n`;
    }

    prompt += `\n**Richiesta per l'Architetto:**\n`;
    prompt += `Elabora l'Oroscopo del Giorno in modo rigoroso, profondo ed evolutivo con le seguenti 4 sezioni:\n`;
    prompt += `1. **Clima Cosmico & Transito del Giorno Personale ${ctx.personalDay}**: Spiega l'energia della giornata combinando il Segno Solare ${ctx.sunSign}, l'Ascendente ${ctx.ascendant} e la vibrazione dell'Arcano ${ctx.personalDayArcana}.\n`;
    prompt += `2. **Opportunità di Luce (Lavoro & Finanze)**: Quali porte si aprono nelle 24 ore e come agire con successo.\n`;
    prompt += `3. **Armonia Relazionale & Canale del Cuore**: Come relazionarsi con gli altri e proteggere la propria energia.\n`;
    prompt += `4. **Insidia d'Ombra da Evitare & Rituale Pratico d'Azione**: L'errore da non commettere oggi e una breve affermazione/azione per allinearsi al flusso cosmico.`;

    sendMessage(prompt, 1);
}

// 1b. Calcolo Ascendente Zodiacale & 1ª Casa (1 credito)
function startAscendantCalculation() {
    if (!checkAuthRequired('calcolare il tuo Ascendente')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data e orario di nascita per calcolare l\'Ascendente!');
        return;
    }
    if (!profile.time || profile.time === 'non disponibile' || profile.time === 'non specificato') {
        openWizardModal();
        alert('ℹ️ Per calcolare l\'Ascendente con precisione al grado d\'arco, inserisci il tuo orario di nascita nel Modulo Guidato.');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);

    let prompt = `🧭 **CALCOLO ASCENDENTE ZODIACALE & 1ª CASA ASTROLOGICA (METODO JEAN MEEUS)**\n\n`;
    prompt += `**Dati Astronomici Certificati:**\n`;
    prompt += `✦ Nome: ${profile.name}\n`;
    prompt += `✦ Data di Nascita: ${profile.date}\n`;
    prompt += `✦ Orario di Nascita: ${profile.time}\n`;
    prompt += `✦ Luogo di Nascita: ${profile.place || 'Italia'}\n`;
    prompt += `✦ Segno Solare: ${ctx.sunSign}\n`;
    prompt += `✦ **Ascendente Esatto Calcolato: ${ctx.ascendant}**\n`;

    if (ctx.matrixData && ctx.matrixData.matrix) {
        prompt += `✦ Punto A (Spirito / Nascita): Arcano ${ctx.matrixData.matrix.top.value} — ${ctx.matrixData.matrix.top.arcana.name}\n`;
        prompt += `✦ Punto E (Centro / Luce): Arcano ${ctx.matrixData.matrix.center.value} — ${ctx.matrixData.matrix.center.arcana.name}\n`;
    }

    prompt += `\n**Richiesta per l'Architetto:**\n`;
    prompt += `Fornisci un'analisi magistrale dell'Ascendente in ${ctx.ascendant} strutturata in 4 capitoli:\n`;
    prompt += `1. **L'Ascendente in ${ctx.ascendant} & Il Pianeta Governatore**: Significato del grado zodiacale, dell'elemento e del reggente della 1ª Casa.\n`;
    prompt += `2. **La Maschera Sociale & L'Impatto Energetico**: Come gli altri ti percepiscono al primo incontro, l'aura esteriore e lo stile comunicativo naturale.\n`;
    prompt += `3. **Alchimia tra Segno Solare (${ctx.sunSign}) e Ascendente (${ctx.ascendant})**: La sinergia tra la tua essenza interiore e il veicolo di manifestazione esteriore.\n`;
    prompt += `4. **Integrazione con la Matrice del Destino (Punto A dello Spirito)**: Come canalizzare questo Ascendente per potenziare il tuo Arcano di Nascita e sbloccare i tuoi talenti innati.`;

    sendMessage(prompt, 1);
}

// 2. Guida Settimanale (3 crediti)
function startWeeklyForecast() {
    if (!checkAuthRequired('calcolare la Guida Settimanale')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data di nascita per calcolare la Guida Settimanale!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);

    let prompt = `📅 **GUIDA ORACOLARE SETTIMANALE (MAPPA DEI 7 GIORNI)**\n\n`;
    prompt += `**Dati Consultante:**\n`;
    prompt += `✦ Nome: ${profile.name}\n`;
    prompt += `✦ Data: ${profile.date} | Segno Solare: ${ctx.sunSign} | Ascendente: ${ctx.ascendant}\n`;
    prompt += `✦ Anno Personale: ${ctx.personalYear} | Mese Personale: ${ctx.personalMonth}\n\n`;
    prompt += `**Richiesta per l'Architetto:**\n`;
    prompt += `Elabora la previsione strategica dei prossimi 7 giorni giorno per giorno:\n`;
    prompt += `- Per ogni giorno indica l'Arcano Guida e la frequenza dominante (Lavoro, Amore, Salute/Energia).\n`;
    prompt += `- Evidenzia i 2 giorni di massimo potere decisionale e il giorno di riposo/introspezione.\n`;
    prompt += `- Formula il mantra settimanale di successo.`;

    sendMessage(prompt, 3);
}

// 3. Focus Canale Amore (1 credito)
function startLoveFocus() {
    if (!checkAuthRequired('analizzare il Canale Amore')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data di nascita per calcolare il Focus Amore!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);
    const loveArcana = ctx.matrixData?.matrix?.love?.value || 'N.D.';

    let prompt = `💖 **FOCUS CANALE AMORE & RELAZIONI EVOLUTIVE**\n\n`;
    prompt += `**Dati Consultante:**\n`;
    prompt += `✦ Nome: ${profile.name}\n`;
    prompt += `✦ Data: ${profile.date} | Segno: ${ctx.sunSign} | Ascendente: ${ctx.ascendant}\n`;
    prompt += `✦ Arcano del Canale Relazioni (Nodo Amore): Arcano ${loveArcana}\n`;
    prompt += `✦ Coda Karmica (Punto D): Arcano ${ctx.matrixData?.matrix?.bottom?.value || '-'}\n\n`;
    prompt += `**Richiesta per l'Architetto:**\n`;
    prompt += `1. Analisi profonda del nodo relazionale e dell'archetipo del partner ideale/affine.\n`;
    prompt += `2. Blocchi karmici da dissolvere per non ripetere schemi del passato.\n`;
    prompt += `3. 3 chiavi pratiche per attrarre e vivere un amore consapevole e armonioso.`;

    sendMessage(prompt, 1);
}

// 4. Focus Canale Denaro & Carriera (1 credito)
function startMoneyFocus() {
    if (!checkAuthRequired('analizzare il Canale Denaro')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data di nascita per calcolare il Focus Denaro!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);
    const moneyArcana = ctx.matrixData?.matrix?.money?.value || 'N.D.';

    let prompt = `💰 **FOCUS CANALE DENARO, VOCAZIONE & PROSPERITÀ MATERIALE**\n\n`;
    prompt += `**Dati Consultante:**\n`;
    prompt += `✦ Nome: ${profile.name}\n`;
    prompt += `✦ Data: ${profile.date} | Segno: ${ctx.sunSign}\n`;
    prompt += `✦ Arcano Sblocco Denaro (Nodo Materia/Finanze): Arcano ${moneyArcana}\n`;
    prompt += `✦ Punto C (Anno di Nascita): Arcano ${ctx.matrixData?.matrix?.right?.value || '-'}\n\n`;
    prompt += `**Richiesta per l'Architetto:**\n`;
    prompt += `1. Le attività professionali e i canali di reddito maggiormente allineati alla tua frequenza.\n`;
    prompt += `2. La credenza limitante radicata che blocca il flusso dell'abbondanza.\n`;
    prompt += `3. La strategia concreta per monetizzare i tuoi talenti unici nei prossimi mesi.`;

    sendMessage(prompt, 1);
}

// 5. Sinastria di Coppia (5 crediti)
function openSynastryModal() {
    if (!checkAuthRequired('calcolare la Sinastria di Coppia')) return;
    const profile = getActiveUserProfile();
    if (profile) {
        const synName1 = document.getElementById('syn-name-1');
        const synDate1 = document.getElementById('syn-date-1');
        if (synName1 && !synName1.value) synName1.value = profile.name;
        if (synDate1 && !synDate1.value) synDate1.value = profile.date;
    }
    const modal = document.getElementById('synastry-modal');
    if (modal) modal.classList.add('active');
}

function closeSynastryModal() {
    const modal = document.getElementById('synastry-modal');
    if (modal) modal.classList.remove('active');
}

function submitSynastryCalculation() {
    if (!checkAuthRequired('calcolare la Sinastria di Coppia')) return;
    const name1 = document.getElementById('syn-name-1')?.value?.trim() || 'Partner 1';
    const date1 = document.getElementById('syn-date-1')?.value;
    const name2 = document.getElementById('syn-name-2')?.value?.trim() || 'Partner 2';
    const date2 = document.getElementById('syn-date-2')?.value;

    if (!date1 || !date2) {
        alert('Inserisci le date di nascita di entrambi i partner.');
        return;
    }

    closeSynastryModal();
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const prompt = `💑 **ANALISI DI SINASTRIA DI COPPIA & MATRICE CONGIUNTA**\n\n✦ Partner 1: ${name1} (Nato/a il: ${date1})\n✦ Partner 2: ${name2} (Nato/a il: ${date2})\n\n**Richiesta per l'Architetto:**\nCalcola la Matrice Congiunta alchemica dei 22 Arcani:\n1. Scopo evolutivo e karmico dell'incontro.\n2. Punti di affinità spirituale, intellettuale ed emotiva.\n3. Potenziali zone di frizione e trappole comunicative.\n4. Consigli pratici per consolidare l'unione e far prosperare la coppia.`;
    sendMessage(prompt, 5);
}

// 6. Tema Natale & Analisi Zodiacale Completa MIT-Grade (10 crediti)
function startFullZodiacAnalysis() {
    if (!checkAuthRequired('calcolare il Tema Natale & Zodiaco')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data e ora di nascita per calcolare il Tema Natale!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);

    const prompt = `🔮 **TEMA NATALE & ANALISI ZODIACALE COMPLETA (MIT-GRADE)**\n\n✦ Nome: ${profile.name}\n✦ Nascita: ${profile.date} ore ${profile.time || '12:00'} a ${profile.place || 'Italia'}\n✦ Segno Solare: ${ctx.sunSign}\n✦ Ascendente Esatto: ${ctx.ascendant}\n\n**Richiesta:**\nEsegui l'analisi astrologica monumentale completa in 8 sezioni: Segno Solare, Ascendente & 1ª Casa, 12 Case astrologiche, Alchimia con i Nodi della Matrice, Talenti Vocazionali, Sfide d'Ombra, Transiti Planetari attuali e Guida pratica di realizzazione.`;
    sendMessage(prompt, 10);
}

// 7. Master Pinnacoli & Decennale (10 crediti)
function startPinnaclesMaster() {
    if (!checkAuthRequired('calcolare il Master Report Pinnacoli')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima la tua data di nascita per calcolare il Master Report Pinnacoli!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const currentYear = new Date().getFullYear();
    const ctx = getEnrichedProfileContext(profile);

    const prompt = `🏔️ **MASTER REPORT: I 4 PINNACOLI EVOLUTIVI & PROIEZIONE DECENNALE (${currentYear}-${currentYear + 10})**\n\n✦ Nome: ${profile.name}\n✦ Data: ${profile.date} | Segno: ${ctx.sunSign} | Ascendente: ${ctx.ascendant}\n\n**Richiesta:**\n1. Calcola le 4 fasce di età dei Pinnacoli (formula 36 - LifePath).\n2. Analizza i 4 Archetipi di transizione e le 4 Sfide numerologiche.\n3. Fornisci la mappa strategica decennale anno per anno con focus d'azione.`;
    sendMessage(prompt, 10);
}

// 8. Audio-Meditazione Vocale AI (2 crediti)
async function generateVoiceMeditation() {
    if (!checkAuthRequired('generare l\'Audio-Meditazione')) return;
    const profile = getActiveUserProfile();
    if (!profile || !profile.date) {
        openWizardModal();
        alert('ℹ️ Inserisci prima i tuoi dati per creare la tua Audio-Meditazione personalizzata!');
        return;
    }
    if (typeof setMobileTab === 'function') setMobileTab('chat');

    const ctx = getEnrichedProfileContext(profile);
    const prompt = `🧘 **AUDIO-MEDITAZIONE GUIDATA SU MISURA (2-3 MINUTI)**\n\n✦ Nome: ${profile.name}\n✦ Data di Nascita: ${profile.date}\n✦ Segno: ${ctx.sunSign} | Ascendente: ${ctx.ascendant}\n✦ Arcano di Nascita (Spirito): Arcano ${ctx.matrixData?.matrix?.top?.value || '10'}\n\n**Richiesta:**\nComponi il testo di una meditazione guidata profonda e poetica per connettermi al mio Centro di Luce e sbloccare la fiducia interiore, adatta alla lettura o sintesi vocale neurale.`;
    sendMessage(prompt, 2);
}

// 9. Esportazione PDF Luxury (3 crediti)
function exportLuxuryPdf() {
    if (!checkAuthRequired('esportare il PDF Luxury')) return;
    const credits = getUserCredits();
    if (credits < 3) {
        openCreditsModal();
        alert('✦ Sono necessari 3 Consulti per esportare il Report PDF Luxury ad alta definizione.');
        return;
    }
    setUserCredits(credits - 3, true);
    openReportModal();
    setTimeout(() => {
        window.print();
    }, 600);
}

// --- Credits & Wallet Management ---

function getUserCredits() {
    // Unauthenticated visitors ALWAYS have 0 credits
    if (!state.currentUser) {
        return 0;
    }
    const raw = localStorage.getItem('destiny_credits');
    if (raw === null) {
        return 0;
    }
    const val = parseInt(raw, 10);
    return isNaN(val) ? 0 : val;
}

function setUserCredits(count, syncToCloud = true) {
    const validCount = Math.max(0, count);
    localStorage.setItem('destiny_credits', String(validCount));
    updateCreditsDisplay();

    if (syncToCloud && supabaseClient && state.currentUser) {
        supabaseClient.from('user_matrix_wallets')
            .upsert({
                user_id: state.currentUser.id,
                email: state.currentUser.email,
                credits: validCount,
                updated_at: new Date().toISOString()
            })
            .then(({ error }) => {
                if (error) console.error('Cloud wallet sync error:', error);
                else {
                    const cloudDisplay = document.getElementById('cloud-credits-display');
                    if (cloudDisplay) cloudDisplay.textContent = validCount;
                }
            });
    }
}

function updateCreditsDisplay() {
    const credits = getUserCredits();
    const badgeEl = document.getElementById('user-credits-count');
    const modalEl = document.getElementById('modal-credits-display');
    
    let text = `${credits} Consulti`;
    if (!state.currentUser) {
        text = '0 Consulti (Accedi per iniziare)';
    } else if (credits === 1) {
        text = '1 Consulto';
    }

    if (badgeEl) badgeEl.textContent = text;
    if (modalEl) modalEl.textContent = !state.currentUser ? '0 Consulti (Accedi per iniziare)' : (credits === 1 ? '1 Consulto' : `${credits} Consulti`);
}

function openCreditsModal() {
    updateCreditsDisplay();
    const modal = document.getElementById('credits-modal');
    if (modal) modal.classList.add('active');
}

function closeCreditsModal() {
    const modal = document.getElementById('credits-modal');
    if (modal) modal.classList.remove('active');
}

function redeemPromoCode(codeOverride = null) {
    const input = document.getElementById('promo-code-input');
    const rawCode = (codeOverride || input?.value || '').trim();
    const clean = rawCode.toLowerCase().replace(/[\[\]\s]/g, '');

    if (!clean) {
        alert('Inserisci un codice promo o admin.');
        return;
    }

    if (clean === '64447adminag') {
        const current = getUserCredits();
        const newTotal = Math.max(current + 100, 100);
        setUserCredits(newTotal, true);

        if (input) input.value = '';
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        }
        alert(`👑 Codice Amministratore Riconosciuto!\n\nSono stati accreditati 100 Consulti al tuo profilo.\nNuovo Saldo: ${newTotal} Consulti.`);
        closeCreditsModal();
    } else {
        alert('❌ Codice non valido o scaduto.');
    }
}

async function watchRewardedAd() {
    if (!checkAuthRequired('ottenere consulti gratuiti tramite sponsor')) return;

    const btn = document.getElementById('btn-watch-ad');
    let originalHtml = '';
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connessione AdSense...';
    }

    try {
        // Attempt to trigger Google AdSense Rewarded / Auto-Ads if available
        let adServed = false;

        if (window.adsbygoogle && typeof window.adsbygoogle.push === 'function') {
            try {
                window.adsbygoogle.push({
                    google_ad_client: "ca-pub-7028010056444247",
                    enable_page_level_ads: true
                });
            } catch (e) {
                console.warn('AdSense push notice:', e);
            }
        }

        // Wait a brief moment to check fill/verification status
        await new Promise(resolve => setTimeout(resolve, 900));

        // When ad inventory is pending Google AdSense domain/ads.txt verification:
        if (!adServed) {
            const noticeMsg = "📢 Notifica Google AdSense:\n\n" +
                "Il canale pubblicitario è attualmente in fase di revisione e scansione del file ads.txt da parte di Google (richiede solitamente 24-48h dalla configurazione del publisher ca-pub-7028010056444247).\n\n" +
                "Non appena Google completerà l'autorizzazione, i video sponsor accrediteranno automaticamente i consulti gratuiti.\n\n" +
                "💡 Nel frattempo, puoi ottenere +2 Consulti Gratuiti per ogni persona che accede con il tuo link 'Invita un Amico'!";
            alert(noticeMsg);
        }
    } catch (err) {
        console.error('Rewarded ad error:', err);
        alert("⚠️ Notifica Sponsor: Impossibile caricare l'annuncio in questo momento (verifica del publisher in corso). Riprova più tardi!");
    } finally {
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

async function buyPremiumPass(planType = 'pass_5') {
    const btn = event?.currentTarget || document.querySelector('.btn-premium');
    let originalHtml = '';
    if (btn) {
        originalHtml = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Connessione a Stripe...';
    }

    try {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ plan: planType })
        });

        const data = await response.json();
        if (!response.ok || !data.url) {
            throw new Error(data.error || 'Impossibile inizializzare il pagamento Stripe.');
        }

        // Redirect to Stripe Hosted Checkout
        window.location.href = data.url;
    } catch (err) {
        console.error('Stripe Checkout error:', err);
        alert(`⚠️ Errore Pagamento Stripe:\n${err.message}`);
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = originalHtml;
        }
    }
}

function checkPaymentReturn() {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('payment') === 'success') {
        const addedCredits = parseInt(urlParams.get('credits') || '5', 10);
        const current = getUserCredits();
        setUserCredits(current + addedCredits);
        localStorage.setItem('md_has_premium_pass', 'true');
        const prevPurchased = parseInt(localStorage.getItem('destiny_total_purchased') || '0', 10);
        localStorage.setItem('destiny_total_purchased', String(prevPurchased + addedCredits));
        
        if (typeof confetti === 'function') {
            confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
        }
        alert(`🎉 Pagamento completato con successo su Stripe!\n\nTi sono stati accreditati +${addedCredits} Consulti e hai sbloccato l'Esportazione PDF & Markdown illimitata!`);
        window.history.replaceState({}, document.title, window.location.pathname);
    } else if (urlParams.get('payment') === 'cancel') {
        alert('Pagamento annullato. Nessun addebito è stato effettuato.');
        window.history.replaceState({}, document.title, window.location.pathname);
    }
}

function copyReferralLink() {
    let userRef = localStorage.getItem('md_user_ref');
    if (!userRef) {
        userRef = 'm_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('md_user_ref', userRef);
    }

    if (supabaseClient && state.currentUser) {
        supabaseClient.from('user_matrix_wallets')
            .update({ referral_code: userRef, updated_at: new Date().toISOString() })
            .eq('user_id', state.currentUser.id)
            .then(() => {});
    }

    const currentOrigin = window.location.origin || 'https://matricedestino.it';
    const link = `${currentOrigin}/?ref=${userRef}`;

    if (navigator.share) {
        navigator.share({
            title: 'Matrice del Destino — Calcola la tua Mappa Archetipica',
            text: '✨ Scopri la tua Matrice del Destino e calcola il tuo Ottagramma Sacro con l\'Oracolo Archetipico!',
            url: link
        }).then(() => {
            notifyReferralLinkCopied();
        }).catch(() => {
            copyLinkFallback(link);
        });
    } else {
        copyLinkFallback(link);
    }
}

function copyLinkFallback(link) {
    if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(link).then(() => {
            notifyReferralLinkCopied();
        }).catch(() => {
            prompt('Copia il tuo link invito:', link);
            notifyReferralLinkCopied();
        });
    } else {
        prompt('Copia il tuo link invito:', link);
        notifyReferralLinkCopied();
    }
}

function notifyReferralLinkCopied() {
    alert('🔗 Link Invito copiato negli appunti!\n\nCondividilo con i tuoi amici o sui social:\nRiceverai +2 Consulti Omaggio non appena un amico accede alla Matrice del Destino tramite il tuo link!');
}

function shareReferralWhatsApp() {
    let userRef = localStorage.getItem('md_user_ref');
    if (!userRef) {
        userRef = 'm_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('md_user_ref', userRef);
    }
    const currentOrigin = window.location.origin || 'https://matricedestino.it';
    const link = `${currentOrigin}/?ref=${userRef}`;
    const text = encodeURIComponent(`✨ Scopri la tua Matrice del Destino e calcola il tuo Ottagramma Sacro con l'Oracolo Archetipico!\n${link}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, '_blank');
}

function shareReferralTelegram() {
    let userRef = localStorage.getItem('md_user_ref');
    if (!userRef) {
        userRef = 'm_' + Math.random().toString(36).substring(2, 9);
        localStorage.setItem('md_user_ref', userRef);
    }
    const currentOrigin = window.location.origin || 'https://matricedestino.it';
    const link = encodeURIComponent(`${currentOrigin}/?ref=${userRef}`);
    const text = encodeURIComponent(`✨ Scopri la tua Matrice del Destino e calcola il tuo Ottagramma Sacro con l'Oracolo Archetipico!`);
    window.open(`https://t.me/share/url?url=${link}&text=${text}`, '_blank');
}

function checkReferralEntry() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    const myOwnRef = localStorage.getItem('md_user_ref');

    if (ref && ref !== myOwnRef && !localStorage.getItem('md_referred_by')) {
        localStorage.setItem('md_referred_by', ref);
        const current = getUserCredits();
        const newCredits = Math.max(1, current + 1);
        setUserCredits(newCredits);

        let visitorId = localStorage.getItem('md_visitor_id');
        if (!visitorId) {
            visitorId = 'v_' + Math.random().toString(36).substring(2, 12);
            localStorage.setItem('md_visitor_id', visitorId);
        }

        if (supabaseClient) {
            supabaseClient.rpc('process_referral_reward', {
                p_referrer_code: ref,
                p_referee_id: visitorId
            }).then(({ data, error }) => {
                if (error) {
                    console.warn('Referral reward notice:', error.message);
                } else {
                    console.log('🎁 Ricompensa referral processata:', data);
                }
            });
        }

        setTimeout(() => {
            if (typeof confetti === 'function') {
                confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
            }
            alert('🎁 Benvenuto da parte di un amico!\nHai ricevuto +1 Consulto Bonus omaggio per iniziare la tua lettura sulla Matrice del Destino.');
        }, 1200);
    }
}

window.openCreditsModal = openCreditsModal;
window.closeCreditsModal = closeCreditsModal;
window.watchRewardedAd = watchRewardedAd;
window.buyPremiumPass = buyPremiumPass;
window.copyReferralLink = copyReferralLink;
window.checkPaymentReturn = checkPaymentReturn;

// --- Report Modal Handlers ---
function openReportModal() {
    const reportContainer = document.getElementById('report-modal-content');
    // Find the latest assistant message containing the full analysis or concatenate conversation
    const assistantMsgs = state.messages.filter(m => m.role === 'assistant');
    if (assistantMsgs.length === 0) {
        reportContainer.innerHTML = '<p style="color: var(--text-muted);">Nessun report generato finora. Avvia una sessione di analisi.</p>';
    } else {
        const fullContent = assistantMsgs.map(m => m.content).join('\n\n---\n\n');
        const legalDisclosure = `\n\n---\n\n<div class="report-ai-watermark" style="margin-top: 24px; padding-top: 12px; border-top: 1px dashed rgba(212,175,55,0.3); font-size: 0.8rem; color: var(--text-muted); text-align: center;"><em>Documento generato da Sistema di Intelligenza Artificiale Generativa (Matrice del Destino AI) in conformità all'Art. 50 del Regolamento (UE) 2024/1689 (AI Act). Disciplina simbolica e filosofica archetipica non deterministica.</em></div>`;
        const rendered = typeof marked !== 'undefined' ? marked.parse(fullContent) : fullContent;
        reportContainer.innerHTML = rendered + legalDisclosure;
    }
    document.getElementById('report-modal').classList.add('active');
}
function closeReportModal() {
    document.getElementById('report-modal').classList.remove('active');
}

function hasPremiumAccess() {
    return localStorage.getItem('md_has_premium_pass') === 'true' || parseInt(localStorage.getItem('destiny_total_purchased') || '0', 10) > 0;
}

function copyReportMarkdown() {
    if (!hasPremiumAccess()) {
        openCreditsModal();
        alert('🔒 Funzione Riservata ai Possessori di Pass Arcano\n\nLa copia integrale in formato Markdown e il download dei report in alta definizione sono inclusi con il Pass Arcano (1.99€) o Mappa Maestra (4.49€).\n\nAttiva un Pass per sbloccare l\'esportazione illimitata!');
        return;
    }

    const assistantMsgs = state.messages.filter(m => m.role === 'assistant');
    if (assistantMsgs.length === 0) {
        alert('Nessun report generato da copiare.');
        return;
    }
    const fullContent = assistantMsgs.map(m => m.content).join('\n\n---\n\n');
    const fullWithWatermark = fullContent + '\n\n---\n*📄 Generato da Sistema di Intelligenza Artificiale Generativa — Matrice del Destino AI (Conforme Art. 50 Regolamento UE 2024/1689).*';
    navigator.clipboard.writeText(fullWithWatermark).then(() => {
        if (typeof confetti === 'function') {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
        alert('✨ Report completo copiato negli appunti in formato Markdown!');
    });
}

function printReport() {
    if (!hasPremiumAccess()) {
        openCreditsModal();
        alert('🔒 Funzione Riservata ai Possessori di Pass Arcano\n\nLa stampa e il salvataggio in PDF ad alta definizione del Report Completo sono inclusi con il Pass Arcano (1.99€) o Mappa Maestra (4.49€).\n\nAttiva un Pass per stampare o scaricare il PDF!');
        return;
    }
    window.print();
}

function generateLocalReportFallback() {
    let name = 'Elena Solaris';
    let date = '1995-07-21';
    let time = 'non disponibile';
    let place = 'Italia';
    if (state.currentMatrixData) {
        name = state.currentMatrixData.name || name;
        if (state.currentMatrixData.birthDate) {
            date = `${state.currentMatrixData.birthDate.year}-${String(state.currentMatrixData.birthDate.month).padStart(2, '0')}-${String(state.currentMatrixData.birthDate.day).padStart(2, '0')}`;
        }
    }
    const profile = getActiveUserProfile();
    if (profile) {
        name = profile.name || name;
        date = profile.date || date;
        time = profile.time || time;
        place = profile.place || place;
    }

    const data = calculateCompleteMatrix(name, date);
    updateMatrixVisualization(name, date);

    let consultType = 'matrice_completa';
    if (typeof detectConsultationType === 'function') {
        consultType = detectConsultationType(state.messages);
    }

    let reportMarkdown = '';

    if (consultType === 'amore_relazioni') {
        reportMarkdown = `# ❤️ Focus Canale Amore & Relazioni di Coppia

> **Consulto Energetico:** Mappa della relazione e delle risonanze karmiche.

* **Soggetto:** ${data.name}
* **Data di Nascita:** ${data.birthDate.formatted}
* **Canale dell'Amore (Nodo D + E):** Arcano ${data.nodes.love} (${data.arcana[data.nodes.love]?.name})
* **Cuore Energetico (Nodo E):** Arcano ${data.nodes.E} (${data.arcana[data.nodes.E]?.name})
* **Coda Karmica (Nodo D):** Arcano ${data.nodes.D} (${data.arcana[data.nodes.D]?.name})

---

## 1. Il Codice dell'Amore & Archetipo del Partner Ideale
Il Canale dell'Amore è governato dall'**Arcano ${data.nodes.love} (${data.arcana[data.nodes.love]?.name})**. Questo archetipo indica che nelle relazioni cerchi autenticità, allineamento di valori e crescita condivisa.

## 2. Ferite Karmiche & Blocchi Affettivi da Sciogliere
L'Arcano ${data.nodes.D} nella Coda Karmica evidenzia memorie di dinamiche passate da trasformare in piena sicurezza e maturità interiore.

## 3. Dinamica di Coppia & Consigli Pratici
1. Coltiva confini sani e comunicazione trasparente.
2. Lascia spazio all'individualità reciproca.
3. Ascolta l'intuizione del Cuore (Arcano ${data.nodes.E}).`;
    } else if (consultType === 'denaro_carriera') {
        reportMarkdown = `# 💰 Focus Canale Denaro, Carriera & Abbondanza

> **Consulto Vocazionale:** Sblocco dei flussi materiali e allineamento di carriera.

* **Soggetto:** ${data.name}
* **Data di Nascita:** ${data.birthDate.formatted}
* **Canale del Denaro (Nodo C + E):** Arcano ${data.nodes.money} (${data.arcana[data.nodes.money]?.name})
* **Nodo della Materia (Nodo C):** Arcano ${data.nodes.C} (${data.arcana[data.nodes.C]?.name})
* **Life Path:** **${data.lifePath}**

---

## 1. Professioni Vocazionali & Canali di Flusso Economico
L'Arcano ${data.nodes.money} definisce il tuo rapporto con la prosperità materiale e la capacità di generare valore attraverso competenze strutturate e visione strategica.

## 2. Credenze Limitanti & Sblocco dell'Abbondanza
Sciogli la paura della scarsità integrando l'Arcano ${data.nodes.C} in luce positiva.

## 3. Strategia di Monetizzazione in 3 Passi
1. Valorizza le tue abilità distintive.
2. Stabilisci obiettivi congrui e trasparenti.
3. Investi costantemente nella tua evoluzione personale.`;
    } else if (consultType === 'oroscopo_giorno') {
        const todayStr = new Date().toLocaleDateString('it-IT');
        const zSign = typeof calculateZodiacSign === 'function' ? calculateZodiacSign(data.birthDate.day, data.birthDate.month) : { name: 'Zodiaco', symbol: '✦' };
        const asc = typeof calculateAscendant === 'function' ? calculateAscendant(data.birthDate.day, data.birthDate.month, data.birthDate.year, time, data.birthPlace || null) : { formatted: 'In calcolo' };
        const py = typeof reduceToDigit === 'function' ? reduceToDigit(reduceToDigit(data.birthDate.day) + reduceToDigit(data.birthDate.month) + reduceToDigit(new Date().getFullYear())) : 1;
        const pm = typeof reduceToDigit === 'function' ? reduceToDigit(py + (new Date().getMonth() + 1)) : 1;
        const dayP = typeof reduceToDigit === 'function' ? reduceToDigit(pm + new Date().getDate()) : 1;
        const dayArcana = (typeof ARCANA_DATA !== 'undefined' && ARCANA_DATA[dayP]) ? ARCANA_DATA[dayP].name : 'Evolutivo';
        reportMarkdown = `# 🌅 Oroscopo & Vibrazione Astrale del Giorno — ${todayStr}

* **Soggetto:** ${data.name} | **Segno:** ${zSign.name} ${zSign.symbol} | **Ascendente:** ${asc.formatted}
* **Giorno Personale:** Numero ${dayP} — Arcano ${dayP} (*${dayArcana}*)

---

## 1. Clima Energetico Odierno
La giornata favorisce lucidità, concentrazione e scelte ponderate.

## 2. Opportunità nelle 24 Ore
Ottima vibrazione per chiarire questioni in sospeso e avviare nuove intese.

## 3. Consiglio d'Azione
Mantieni centratura ed evita reazioni impulsive.`;
    } else if (consultType === 'oroscopo_settimana') {
        const zSign = typeof calculateZodiacSign === 'function' ? calculateZodiacSign(data.birthDate.day, data.birthDate.month) : { name: 'Zodiaco', symbol: '✦' };
        const asc = typeof calculateAscendant === 'function' ? calculateAscendant(data.birthDate.day, data.birthDate.month, data.birthDate.year, time, data.birthPlace || null) : { formatted: 'In calcolo' };
        reportMarkdown = `# 🔮 Guida Oracolare Settimanale (Previsione 7 Giorni)

* **Soggetto:** ${data.name} | **Segno:** ${zSign.name} ${zSign.symbol} (Ascendente ${asc.formatted})
* **Anno Personale:** ${data.personalYear}

---

## Mappa della Settimana
* **Inizio Settimana (Lun-Mar):** Pianificazione e organizzazione strategica.
* **Metà Settimana (Mer-Gio):** Comunicazione, accordi e relazioni costruttive.
* **Fine Settimana (Ven-Dom):** Ricarica interiore e sintesi delle priorità.`;
    } else if (consultType === 'tema_natale_zodiaco') {
        const zSign = typeof calculateZodiacSign === 'function' ? calculateZodiacSign(data.birthDate.day, data.birthDate.month) : { name: 'Zodiaco', symbol: '✦', element: 'Fuoco', planet: 'Sole' };
        const asc = typeof calculateAscendant === 'function' ? calculateAscendant(data.birthDate.day, data.birthDate.month, data.birthDate.year, time, data.birthPlace || null) : { formatted: 'Ascendente' };
        reportMarkdown = `# 🌌 Tema Natale & Analisi Zodiacale Completa MIT-Grade

* **Soggetto:** ${data.name} | **Segno:** **${zSign.name} ${zSign.symbol}** (${zSign.element}) | **Ascendente:** **${asc.formatted}**
* **Life Path:** ${data.lifePath} | **Arcano di Nascita:** Arcano ${data.nodes.A}

---

## 1. Identità Astrale & Segno Solare
Essenza primaria in ${zSign.name} con governatore ${zSign.planet}.

## 2. Ascendente & Configurazione delle Case
Ascendente per una presenza carismatica e determinata.

## 3. Integrazione con la Matrice del Destino
Armonizzazione tra il Cuore (Arcano ${data.nodes.E}) e il Segno Solare.`;
    } else if (consultType === 'pinnacoli_sfide') {
        reportMarkdown = `# 🏔️ Master Report: I 4 Pinnacoli Evolutivi & 4 Sfide

* **Soggetto:** ${data.name} | **Life Path:** ${data.lifePath}

---

## 1. Mappa delle Fasi Evolutive
* **1° Pinnacolo:** Arcano ${data.pinnacles.p1}
* **2° Pinnacolo:** Arcano ${data.pinnacles.p2}
* **3° Pinnacolo:** Arcano ${data.pinnacles.p3}
* **4° Pinnacolo:** Arcano ${data.pinnacles.p4}

## 2. Le 4 Sfide Karmiche
Sfide ${data.challenges.c1}, ${data.challenges.c2}, ${data.challenges.c3}, ${data.challenges.c4}.`;
    } else {
        reportMarkdown = generateCompleteReport14Sections(data);
    }

    appendMessage('assistant', reportMarkdown);
    state.messages.push({ role: 'assistant', content: reportMarkdown });
}

// --- GDPR & EU AI Act Compliance Engine ---

function initGdprConsent() {
    const consent = localStorage.getItem('md_gdpr_consent');
    const banner = document.getElementById('gdpr-banner');
    if (!consent && banner) {
        banner.classList.add('active');
        banner.style.display = 'block';
    } else if (banner) {
        banner.classList.remove('active');
        banner.style.display = 'none';
        if (consent === 'all') {
            updateGoogleConsent(true);
        }
    }
}

function updateGoogleConsent(granted) {
    if (typeof gtag === 'function') {
        gtag('consent', 'update', {
            'ad_storage': granted ? 'granted' : 'denied',
            'analytics_storage': granted ? 'granted' : 'denied',
            'ad_user_data': granted ? 'granted' : 'denied',
            'ad_personalization': granted ? 'granted' : 'denied'
        });
    }
}

function acceptAllCookies() {
    localStorage.setItem('md_gdpr_consent', 'all');
    updateGoogleConsent(true);
    const banner = document.getElementById('gdpr-banner');
    if (banner) {
        banner.classList.remove('active');
        banner.style.display = 'none';
    }
}

function rejectOptionalCookies() {
    localStorage.setItem('md_gdpr_consent', 'essential_only');
    updateGoogleConsent(false);
    const banner = document.getElementById('gdpr-banner');
    if (banner) {
        banner.classList.remove('active');
        banner.style.display = 'none';
    }
}

function toggleGdprPreferencesPanel() {
    const panel = document.getElementById('gdpr-preferences-panel');
    if (panel) panel.classList.toggle('active');
}

function openGdprPreferences() {
    closeCookieModal();
    const banner = document.getElementById('gdpr-banner');
    if (banner) {
        banner.style.display = 'block';
        banner.classList.add('active');
        const panel = document.getElementById('gdpr-preferences-panel');
        if (panel) panel.classList.add('active');
    }
}

// Legal Modals Open/Close
function openPrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.add('active');
}
function closePrivacyModal() {
    const modal = document.getElementById('privacy-modal');
    if (modal) modal.classList.remove('active');
}

function openAiActModal() {
    const modal = document.getElementById('ai-act-modal');
    if (modal) modal.classList.add('active');
}
function closeAiActModal() {
    const modal = document.getElementById('ai-act-modal');
    if (modal) modal.classList.remove('active');
}

function openCookieModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) modal.classList.add('active');
}
function closeCookieModal() {
    const modal = document.getElementById('cookie-modal');
    if (modal) modal.classList.remove('active');
}

function openTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.add('active');
}
function closeTermsModal() {
    const modal = document.getElementById('terms-modal');
    if (modal) modal.classList.remove('active');
}

// Right to be Forgotten (GDPR Art. 17)
function purgeAllUserData() {
    if (confirm("⚠️ DIRITTO ALL'OBLIO (GDPR Art. 17)\n\nVuoi cancellare definitivamente tutti i dati anagrafici, la cronologia della chat e i dati salvati in questo browser?\n\nQuesta azione è immediata e irreversibile.")) {
        localStorage.clear();
        sessionStorage.clear();
        alert("✅ Tutti i tuoi dati personali e la cronologia sono stati cancellati definitivamente dal browser.");
        window.location.reload();
    }
}

// --- Supabase Cloud Sync & Authentication ---

function openAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.add('active');
}

function closeAuthModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.classList.remove('active');
}

async function signInWithGoogle() {
    if (!supabaseClient) {
        showAuthMsg("Servizio di autenticazione non disponibile al momento.", "error");
        return;
    }
    showAuthMsg("Connessione a Google in corso...", "info");
    try {
        const { error } = await supabaseClient.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        if (error) {
            if (error.message?.includes('not enabled') || error.message?.includes('Unsupported provider') || JSON.stringify(error).includes('validation_failed')) {
                showAuthMsg("ℹ️ Il login Google richiede l'abilitazione in Supabase Dashboard. Puoi accedere o registrarti subito con Email e Password qui sotto!", "info");
            } else {
                showAuthMsg("Errore Google: " + error.message, "error");
            }
        }
    } catch (err) {
        showAuthMsg("ℹ️ Puoi accedere o registrarti subito inserendo la tua Email e Password qui sotto!", "info");
    }
}

async function signInWithEmail() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;

    if (!email || !password) {
        showAuthMsg("Inserisci sia email che password.", "error");
        return;
    }

    showAuthMsg("Accesso in corso...", "info");
    const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
        showAuthMsg("Errore di accesso: " + error.message, "error");
    } else {
        showAuthMsg("✅ Accesso effettuato con successo!", "success");
        setTimeout(closeAuthModal, 1000);
    }
}

async function signUpWithEmail() {
    const email = document.getElementById('auth-email')?.value?.trim();
    const password = document.getElementById('auth-password')?.value;

    if (!email || !password) {
        showAuthMsg("Inserisci email e password per registrarti.", "error");
        return;
    }

    if (password.length < 6) {
        showAuthMsg("La password deve contenere almeno 6 caratteri.", "error");
        return;
    }

    showAuthMsg("Registrazione in corso...", "info");
    const { data, error } = await supabaseClient.auth.signUp({ email, password });
    if (error) {
        showAuthMsg("Errore di registrazione: " + error.message, "error");
    } else {
        showAuthMsg("🎉 Registrazione completata! Controlla la tua email o accedi.", "success");
    }
}

// Strict Gate: Authentication & Sync Required Checker
function checkAuthRequired(actionName = 'utilizzare la Matrice del Destino') {
    if (!state.currentUser) {
        openAuthModal();
        showAuthMsg(`🔒 Accedi o Registrati per ${actionName}.\nI tuoi consulti e la tua matrice saranno protetti e sincronizzati sul cloud.`, 'info');
        alert(`🔒 Accesso & Sincronizzazione Richiesti\n\nPer ${actionName} e accedere alle funzioni dell'Oracolo, accedi o registrati gratuitamente in 5 secondi!`);
        return false;
    }
    return true;
}

function clearUnauthenticatedState() {
    state.currentUser = null;
    state.currentMatrixData = null;
    localStorage.removeItem('destiny_matrix_saved_profile');
    localStorage.removeItem('destiny_credits');
    localStorage.setItem('destiny_credits', '0');
    
    // Clear inputs in wizard
    const nameInp = document.getElementById('wz-name');
    const dateInp = document.getElementById('wz-date');
    const timeInp = document.getElementById('wz-time');
    const placeInp = document.getElementById('wz-place');
    if (nameInp) nameInp.value = '';
    if (dateInp) dateInp.value = '';
    if (timeInp) timeInp.value = '';
    if (placeInp) placeInp.value = '';

    // Clear synastry fields
    const synName1 = document.getElementById('syn-name-1');
    const synDate1 = document.getElementById('syn-date-1');
    const synName2 = document.getElementById('syn-name-2');
    const synDate2 = document.getElementById('syn-date-2');
    if (synName1) synName1.value = '';
    if (synDate1) synDate1.value = '';
    if (synName2) synName2.value = '';
    if (synDate2) synDate2.value = '';

    updateMatrixVisualization('', '');
    updateCreditsDisplay();
    updateUserProfileBanner(null);
}

async function signOutUser() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
    }
    clearUnauthenticatedState();
    updateAuthUI(null);
    alert("Account disconnesso con successo. I tuoi dati e consulti rimangono salvati in sicurezza sul cloud e saranno ripristinati al prossimo login.");
    closeAuthModal();
}

function showAuthMsg(msg, type = 'info') {
    const el = document.getElementById('auth-status-msg');
    if (!el) return;
    el.style.display = 'block';
    el.style.color = type === 'error' ? '#ef4444' : (type === 'success' ? '#34d399' : '#38bdf8');
    el.textContent = msg;
}

function updateAuthUI(user) {
    const unloggedView = document.getElementById('auth-unlogged-view');
    const loggedView = document.getElementById('auth-logged-view');
    const authBtnLabel = document.getElementById('auth-btn-label');
    const authHeaderIcon = document.getElementById('auth-header-icon');
    const loggedEmail = document.getElementById('auth-logged-email');
    const cloudDisplay = document.getElementById('cloud-credits-display');
    const authBtn = document.getElementById('btn-auth-header');

    if (user) {
        if (unloggedView) unloggedView.style.display = 'none';
        if (loggedView) loggedView.style.display = 'block';
        if (loggedEmail) loggedEmail.textContent = user.email || '';
        
        // Comprehensive metadata resolution for Google OAuth, identities, and email
        const meta = user.user_metadata || {};
        const identities = (user.identities && user.identities[0]) ? (user.identities[0].identity_data || {}) : {};
        
        let displayName = meta.full_name || 
                          meta.name || 
                          meta.user_name || 
                          identities.full_name || 
                          identities.name || 
                          (user.email ? user.email.split('@')[0] : 'Profilo');

        if (authBtnLabel) {
            authBtnLabel.textContent = displayName;
            authBtnLabel.style.color = 'var(--gold-bright)';
            authBtnLabel.style.fontWeight = '700';
        }
        if (authHeaderIcon) {
            authHeaderIcon.className = 'fa-solid fa-circle-user';
            authHeaderIcon.style.color = 'var(--gold-bright)';
        }
        if (authBtn) {
            authBtn.title = `Connesso come ${user.email || displayName} (Clicca per gestire account)`;
            authBtn.style.borderColor = 'rgba(212,175,55,0.5)';
            authBtn.style.background = 'rgba(212,175,55,0.12)';
        }
        if (cloudDisplay) cloudDisplay.textContent = getUserCredits();
    } else {
        if (unloggedView) unloggedView.style.display = 'block';
        if (loggedView) loggedView.style.display = 'none';
        if (authBtnLabel) {
            authBtnLabel.textContent = 'Sincronizza';
            authBtnLabel.style.color = '';
            authBtnLabel.style.fontWeight = '';
        }
        if (authHeaderIcon) {
            authHeaderIcon.className = 'fa-solid fa-cloud';
            authHeaderIcon.style.color = 'var(--cyan-accent)';
        }
        if (authBtn) {
            authBtn.title = 'Accedi per sincronizzare i tuoi crediti su tutti i dispositivi';
            authBtn.style.borderColor = '';
            authBtn.style.background = '';
        }
    }
}

async function syncUserWalletAndProfile(user) {
    if (!supabaseClient || !user) return;

    try {
        // 1. Authoritative Cloud Wallet Fetch (never inherit stale unauthenticated local storage)
        const { data: walletData, error: walletErr } = await supabaseClient
            .from('user_matrix_wallets')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();

        if (walletData) {
            let balance = typeof walletData.credits === 'number' ? walletData.credits : 0;
            setUserCredits(balance, false);
        } else {
            // Standard new user registration / first Google sign in (1 Welcome Credit)
            const welcomeCredits = 1;
            setUserCredits(welcomeCredits, false);
            await supabaseClient
                .from('user_matrix_wallets')
                .insert({
                    user_id: user.id,
                    email: user.email,
                    credits: welcomeCredits
                });

            if (typeof confetti === 'function') {
                confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
            }
            setTimeout(() => {
                alert('🎉 Benvenuto nella Matrice del Destino!\n\nTi è stato accreditato 1 Consulto Gratuito di benvenuto per iniziare la tua lettura oracolare.');
            }, 500);
        }

        // 2. Fetch and load saved matrix profile from Supabase DB
        const { data: dbProfile } = await supabaseClient
            .from('user_matrix_profiles')
            .select('*')
            .eq('user_id', user.id)
            .order('updated_at', { ascending: false })
            .limit(1)
            .maybeSingle();

        if (dbProfile && dbProfile.full_name) {
            console.log('☁️ Profilo matrice trovato su Supabase DB:', dbProfile.full_name);
            saveUserProfile({
                name: dbProfile.full_name,
                date: dbProfile.birth_date,
                time: dbProfile.birth_time || 'non disponibile',
                place: dbProfile.birth_place || 'Italia',
                type: dbProfile.analysis_type || '2. Numerologica + Astrologica simbolica'
            }, false);
            loadUserProfile();
        } else {
            updateUserProfileBanner(null);
        }

        updateCreditsDisplay();
        updateAuthUI(user);
    } catch (err) {
        console.error('Wallet and profile sync error:', err);
    }
}

async function initSupabaseAuth() {
    if (!supabaseClient) {
        try {
            if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        } catch (e) {
            console.warn('Supabase init retry notice:', e);
        }
    }
    if (!supabaseClient) {
        clearUnauthenticatedState();
        return;
    }

    // Check initial session immediately (handles Google OAuth redirect token automatically)
    try {
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            state.currentUser = session.user;
            updateAuthUI(session.user);
            await syncUserWalletAndProfile(session.user);
        } else {
            state.currentUser = null;
            clearUnauthenticatedState();
            updateAuthUI(null);
        }
    } catch (e) {
        console.warn('GetSession check notice:', e);
        state.currentUser = null;
        clearUnauthenticatedState();
        updateAuthUI(null);
    }

    // Listen for auth state changes (Google OAuth redirect, Email login, Logout)
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            state.currentUser = session.user;
            updateAuthUI(session.user);
            await syncUserWalletAndProfile(session.user);
        } else {
            state.currentUser = null;
            clearUnauthenticatedState();
            updateAuthUI(null);
        }
    });
}

// --- Interactive Onboarding Guided Tour & Spotlight System ---

const ONBOARDING_STEPS = [
    {
        targetId: 'btn-welcome-tts',
        title: '🎙️ Ascolto Guidato & Voce Neurale',
        desc: 'Clicca qui per ascoltare la guida vocale neurale che ti accompagnerà nell\'interpretazione dei tuoi 22 Arcani.'
    },
    {
        targetId: 'btn-open-wizard',
        title: '🌌 Calcola la Tua Mappa',
        desc: 'Inserisci i tuoi dati anagrafici con il modulo guidato per costruire istantaneamente il tuo Ottagramma Sacro.'
    },
    {
        targetId: 'btn-open-credits',
        title: '💎 Portafoglio Consulti & Sponsor',
        desc: 'Hai consulti a disposizione! Puoi ricaricare gratis guardando video sponsor o attivando il Pass Arcano.'
    },
    {
        targetId: 'btn-auth-header',
        title: '☁️ Sincronizzazione Multi-Dispositivo',
        desc: 'Accedi con Google o Email per sincronizzare i tuoi crediti e letture tra Smartphone, Tablet e PC.'
    },
    {
        targetId: 'chat-input',
        title: '💬 Dialogo con l\'Oracolo',
        desc: 'Scrivi qui le tue domande o usa i chip rapidi in basso per esplorare Karma, Denaro e Relazioni.'
    }
];

// --- Voice Assistant Guided Tour & Audio Controller ---

let tourAudioPlayer = null;
let isTourAudioMuted = false;

function playTourAudioForStep(stepIndex) {
    if (isTourAudioMuted) return;

    stopAllSpeech();

    if (tourAudioPlayer) {
        tourAudioPlayer.pause();
        tourAudioPlayer.currentTime = 0;
    }

    const audioSrc = `/audio/tour_step${stepIndex + 1}.wav`;
    tourAudioPlayer = new Audio(audioSrc);

    const soundIndicator = document.getElementById('onboarding-audio-status');
    if (soundIndicator) soundIndicator.innerHTML = '<i class="fa-solid fa-volume-high text-gold" style="animation: pulse 1s infinite;"></i> <span>Voce Guida Attiva</span>';

    tourAudioPlayer.play().catch(err => {
        console.log("Tour audio autoplay interaction required:", err);
        if (soundIndicator) soundIndicator.innerHTML = '<i class="fa-solid fa-volume-xmark" style="color: var(--text-muted);"></i> <span style="font-size: 0.72rem; color: var(--gold-bright); cursor: pointer;" onclick="resumeTourAudio()">Ascolta Voce 🔊</span>';
    });

    tourAudioPlayer.onended = () => {
        if (soundIndicator) soundIndicator.innerHTML = '<i class="fa-solid fa-check text-gold"></i> <span>Ascolto completato</span>';
    };
}

function resumeTourAudio() {
    isTourAudioMuted = false;
    playTourAudioForStep(currentOnboardingIndex);
}

function stopTourAudio() {
    if (tourAudioPlayer) {
        tourAudioPlayer.pause();
        tourAudioPlayer.currentTime = 0;
    }
}

function startOnboardingTour(force = false) {
    const done = localStorage.getItem('md_onboarding_done');
    if (done && !force) return;

    currentOnboardingIndex = 0;
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.classList.add('active');
    renderOnboardingStep();
}

function renderOnboardingStep() {
    const step = ONBOARDING_STEPS[currentOnboardingIndex];
    if (!step) {
        closeOnboardingTour();
        return;
    }

    const targetEl = document.getElementById(step.targetId) || document.querySelector(step.targetId);
    const spotlight = document.getElementById('onboarding-spotlight');
    const tooltip = document.getElementById('onboarding-tooltip');
    const badge = document.getElementById('onboarding-step-badge');
    const titleEl = document.getElementById('onboarding-title');
    const descEl = document.getElementById('onboarding-desc');
    const prevBtn = document.getElementById('btn-onboarding-prev');
    const nextBtn = document.getElementById('btn-onboarding-next');

    if (badge) badge.textContent = `${currentOnboardingIndex + 1} di ${ONBOARDING_STEPS.length}`;
    if (titleEl) titleEl.innerHTML = step.title;
    if (descEl) descEl.textContent = step.desc;

    if (prevBtn) {
        prevBtn.style.display = currentOnboardingIndex === 0 ? 'none' : 'inline-block';
    }

    if (nextBtn) {
        if (currentOnboardingIndex === ONBOARDING_STEPS.length - 1) {
            nextBtn.innerHTML = '✨ Inizia Subito';
        } else {
            nextBtn.innerHTML = 'Avanti <i class="fa-solid fa-chevron-right"></i>';
        }
    }

    // Play Voice Assistant Audio for current step
    playTourAudioForStep(currentOnboardingIndex);

    if (targetEl && spotlight && tooltip) {
        targetEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        
        setTimeout(() => {
            const rect = targetEl.getBoundingClientRect();
            const pad = 6;
            spotlight.style.top = `${Math.max(0, rect.top - pad)}px`;
            spotlight.style.left = `${Math.max(0, rect.left - pad)}px`;
            spotlight.style.width = `${rect.width + pad * 2}px`;
            spotlight.style.height = `${rect.height + pad * 2}px`;

            const tooltipWidth = Math.min(320, window.innerWidth - 30);
            tooltip.style.width = `${tooltipWidth}px`;

            let tooltipTop = rect.bottom + 14;
            let tooltipLeft = rect.left + (rect.width / 2) - (tooltipWidth / 2);

            if (tooltipLeft < 15) tooltipLeft = 15;
            if (tooltipLeft + tooltipWidth > window.innerWidth - 15) {
                tooltipLeft = window.innerWidth - tooltipWidth - 15;
            }

            if (tooltipTop + 180 > window.innerHeight) {
                tooltipTop = Math.max(15, rect.top - 200);
            }

            tooltip.style.top = `${tooltipTop}px`;
            tooltip.style.left = `${tooltipLeft}px`;
        }, 120);
    }
}

function nextOnboardingStep() {
    if (currentOnboardingIndex < ONBOARDING_STEPS.length - 1) {
        currentOnboardingIndex++;
        renderOnboardingStep();
    } else {
        closeOnboardingTour();
    }
}

function prevOnboardingStep() {
    if (currentOnboardingIndex > 0) {
        currentOnboardingIndex--;
        renderOnboardingStep();
    }
}

function closeOnboardingTour() {
    localStorage.setItem('md_onboarding_done', 'true');
    stopTourAudio();
    const overlay = document.getElementById('onboarding-overlay');
    if (overlay) overlay.classList.remove('active');

    // Pipeline: Once tour is finished, scroll to welcome chat message and play welcome voice!
    const welcomeTtsBtn = document.getElementById('btn-welcome-tts');
    const chatWorkspace = document.querySelector('.chat-workspace');
    if (chatWorkspace) {
        chatWorkspace.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    if (welcomeTtsBtn) {
        setTimeout(() => {
            welcomeTtsBtn.click();
        }, 500);
    }
}

window.addEventListener('resize', () => {
    if (document.getElementById('onboarding-overlay')?.classList.contains('active')) {
        renderOnboardingStep();
    }
});

// Expose to window for inline onclicks
// --- Mobile View Navigation Handler ---
function setMobileView(view) {
    const mainWorkspace = document.querySelector('.main-workspace');
    const btnChat = document.getElementById('btn-mobile-chat');
    const btnMatrix = document.getElementById('btn-mobile-matrix');
    
    if (view === 'matrix') {
        mainWorkspace?.classList.add('mobile-show-matrix');
        mainWorkspace?.classList.remove('mobile-show-chat');
        btnMatrix?.classList.add('active');
        btnChat?.classList.remove('active');
    } else {
        mainWorkspace?.classList.add('mobile-show-chat');
        mainWorkspace?.classList.remove('mobile-show-matrix');
        btnChat?.classList.add('active');
        btnMatrix?.classList.remove('active');
    }
}

// Expose to window for inline onclicks & modules
window.openPrivacyModal = openPrivacyModal;
window.closePrivacyModal = closePrivacyModal;
window.openAiActModal = openAiActModal;
window.closeAiActModal = closeAiActModal;
window.openCookieModal = openCookieModal;
window.closeCookieModal = closeCookieModal;
window.openTermsModal = openTermsModal;
window.closeTermsModal = closeTermsModal;
window.purgeAllUserData = purgeAllUserData;
window.acceptAllCookies = acceptAllCookies;
window.rejectOptionalCookies = rejectOptionalCookies;
window.toggleGdprPreferencesPanel = toggleGdprPreferencesPanel;
window.openGdprPreferences = openGdprPreferences;
window.openAuthModal = openAuthModal;
window.closeAuthModal = closeAuthModal;
window.signInWithGoogle = signInWithGoogle;
window.signInWithEmail = signInWithEmail;
window.signUpWithEmail = signUpWithEmail;
window.signOutUser = signOutUser;
window.startOnboardingTour = startOnboardingTour;
window.closeOnboardingTour = closeOnboardingTour;
window.nextOnboardingStep = nextOnboardingStep;
window.prevOnboardingStep = prevOnboardingStep;
window.resumeTourAudio = resumeTourAudio;
window.copyReportMarkdown = copyReportMarkdown;
window.printReport = printReport;
window.startDailyHoroscope = startDailyHoroscope;
window.startAscendantCalculation = startAscendantCalculation;
window.startWeeklyForecast = startWeeklyForecast;
window.startLoveFocus = startLoveFocus;
window.startMoneyFocus = startMoneyFocus;
window.startFullZodiacAnalysis = startFullZodiacAnalysis;
window.startPinnaclesMaster = startPinnaclesMaster;
window.openSynastryModal = openSynastryModal;
window.closeSynastryModal = closeSynastryModal;
window.submitSynastryCalculation = submitSynastryCalculation;
window.generateVoiceMeditation = generateVoiceMeditation;
window.exportLuxuryPdf = exportLuxuryPdf;
window.saveUserProfile = saveUserProfile;
window.loadUserProfile = loadUserProfile;
window.switchSidebarTab = switchSidebarTab;
window.openWizardModal = openWizardModal;
window.generateCurrentArcanaCard = generateCurrentArcanaCard;
window.openArcanaImageModal = openArcanaImageModal;
window.closeArcanaImageModal = closeArcanaImageModal;
window.regenerateArcanaCard = regenerateArcanaCard;
window.closeWizardModal = closeWizardModal;
window.fillSampleData = fillSampleData;
window.submitWizardData = submitWizardData;
window.openCreditsModal = openCreditsModal;
window.closeCreditsModal = closeCreditsModal;
window.watchRewardedAd = watchRewardedAd;
window.copyReferralLink = copyReferralLink;
window.shareReferralWhatsApp = shareReferralWhatsApp;
window.shareReferralTelegram = shareReferralTelegram;
window.buyPremiumPass = buyPremiumPass;
window.redeemPromoCode = redeemPromoCode;
window.openReportModal = openReportModal;
window.closeReportModal = closeReportModal;
window.selectNode = selectNode;
window.sendQuickPrompt = sendQuickPrompt;
window.toggleSpeech = toggleSpeech;
window.sendMessage = sendMessage;
window.resetSession = resetSession;
window.updateMatrixVisualization = updateMatrixVisualization;
window.setMobileTab = setMobileTab;
window.toggleMobileDrawer = toggleMobileDrawer;
window.toggleLegalFooter = toggleLegalFooter;

// --- AI Sacred Arcana Image Generation Modal Handlers ---
let currentGeneratingArcana = null;

function generateCurrentArcanaCard(source) {
    if (!checkAuthRequired('generare la Carta Sacra AI')) return;

    if (!state.currentMatrixData) {
        openWizardModal();
        alert('ℹ️ Inserisci prima i tuoi dati di nascita nel Modulo Guidato per calcolare i tuoi Arcani!');
        return;
    }

    let nodeInfo = null;
    if (source === 'spirit') {
        nodeInfo = state.currentMatrixData.matrix.top;
    } else if (source === 'node') {
        const key = state.selectedNodeKey || 'top';
        nodeInfo = state.currentMatrixData.matrix[key];
    } else {
        nodeInfo = state.currentMatrixData.matrix.top;
    }

    if (!nodeInfo || !nodeInfo.arcana) {
        alert('Seleziona prima un Arcano dalla Matrice.');
        return;
    }

    currentGeneratingArcana = {
        number: nodeInfo.value,
        name: nodeInfo.arcana.name,
        archetype: nodeInfo.arcana.archetype,
        source
    };

    openArcanaImageModal(nodeInfo.value, nodeInfo.arcana.name, nodeInfo.arcana.archetype);
}

async function openArcanaImageModal(arcanaNum, arcanaName, archetype) {
    const modal = document.getElementById('arcana-image-modal');
    if (!modal) return;

    modal.classList.add('active');
    const titleEl = document.getElementById('arcana-image-modal-title');
    if (titleEl) titleEl.innerHTML = `<i class="fa-solid fa-wand-magic-sparkles text-gold"></i> Arcano ${arcanaNum} — ${arcanaName}`;

    const loadingEl = document.getElementById('arcana-image-loading');
    const containerEl = document.getElementById('arcana-image-container');
    const loadingText = document.getElementById('arcana-image-loading-text');

    if (loadingEl) loadingEl.style.display = 'flex';
    if (containerEl) containerEl.style.display = 'none';
    if (loadingText) loadingText.textContent = 'Connessione ai Motori AI (Gemini Imagen 3 / Flux)...';

    try {
        const prompt = `Sacred Tarot Card Arcana ${arcanaNum} ${arcanaName} (${archetype}), mystical glowing golden sacred geometry, 8-pointed star octagram, glowing amber esoteric details, deep cosmic obsidian nebula background, 8k luxury masterpiece, no text`;
        const res = await apiClient.generateArcanaImage({
            prompt,
            arcanaNumber: arcanaNum,
            arcanaName,
            archetype
        });

        if (res && res.success) {
            const imgEl = document.getElementById('arcana-image-preview');
            const badgeEl = document.getElementById('arcana-image-provider-badge');
            const downloadBtn = document.getElementById('arcana-image-download-btn');

            const imgSrc = res.dataUrl || res.imageUrl;
            if (imgEl) imgEl.src = imgSrc;
            if (downloadBtn) {
                downloadBtn.href = imgSrc;
                downloadBtn.download = `arcano_${arcanaNum}_${arcanaName.toLowerCase().replace(/\s+/g, '_')}.jpg`;
            }

            const providerLabels = {
                'gemini': '✦ Motore: Google Gemini Imagen 3',
                'pollinations': '✦ Motore: Pollinations Flux Engine',
                'llmapi': '✦ Motore: LLMAPI GLM-Image'
            };
            if (badgeEl) badgeEl.textContent = providerLabels[res.provider] || `✦ Motore: ${res.provider}`;

            if (loadingEl) loadingEl.style.display = 'none';
            if (containerEl) containerEl.style.display = 'block';

            if (typeof confetti === 'function') {
                confetti({ particleCount: 35, spread: 60, origin: { y: 0.6 } });
            }
        } else {
            throw new Error(res.error?.message || 'Impossibile generare l\'immagine');
        }
    } catch (e) {
        console.error('Image generation error:', e);
        if (loadingText) loadingText.textContent = `❌ Errore: ${e.message || 'I motori di generazione sono occupati. Riprova tra poco.'}`;
        setTimeout(() => {
            alert(`⚠️ Non è stato possibile generare l'immagine: ${e.message}`);
            closeArcanaImageModal();
        }, 2500);
    }
}

function closeArcanaImageModal() {
    const modal = document.getElementById('arcana-image-modal');
    if (modal) modal.classList.remove('active');
}

function regenerateArcanaCard() {
    if (!currentGeneratingArcana) return;
    openArcanaImageModal(currentGeneratingArcana.number, currentGeneratingArcana.name, currentGeneratingArcana.archetype);
}

// --- Mobile Native Bottom Tab Router (4 Tabs: matrix, chat, arcana, hub) ---
function setMobileTab(tabName) {
    const mainWorkspace = document.querySelector('.main-workspace');
    if (!mainWorkspace) return;

    mainWorkspace.setAttribute('data-mobile-tab', tabName);

    // Update bottom nav active state
    document.querySelectorAll('.bottom-nav-item').forEach(item => item.classList.remove('active'));
    const activeNavItem = document.getElementById(`nav-item-${tabName}`);
    if (activeNavItem) activeNavItem.classList.add('active');

    // Sync underlying pane activations
    if (tabName === 'matrix') {
        switchSidebarTab('tab-octagram');
    } else if (tabName === 'arcana') {
        const currentActiveTab = document.querySelector('.tab-btn.active')?.getAttribute('data-tab');
        if (currentActiveTab !== 'tab-aspects' && currentActiveTab !== 'tab-pitagora') {
            switchSidebarTab('tab-aspects');
        }
    } else if (tabName === 'hub') {
        switchSidebarTab('tab-consults');
    }

    localStorage.setItem('md_active_mobile_tab', tabName);
}

// --- Mobile Navigation Drawer (Sidebar a Scomparsa) ---
function toggleMobileDrawer(open) {
    const overlay = document.getElementById('mobile-drawer-overlay');
    const drawer = document.getElementById('mobile-drawer');
    if (!overlay || !drawer) return;

    if (open) {
        updateDrawerProfileInfo();
        overlay.classList.add('active');
        drawer.classList.add('active');
    } else {
        overlay.classList.remove('active');
        drawer.classList.remove('active');
    }
}

function updateDrawerProfileInfo() {
    const profile = getActiveUserProfile();
    const nameEl = document.getElementById('drawer-user-name');
    const subEl = document.getElementById('drawer-user-sub');
    const authLabel = document.getElementById('drawer-auth-label');

    if (profile && profile.name) {
        if (nameEl) nameEl.textContent = profile.name;
        if (subEl) {
            subEl.textContent = profile.date ? `${profile.date} ${profile.place ? '• ' + profile.place : ''}` : 'Data non impostata';
        }
    } else {
        if (nameEl) nameEl.textContent = 'Ospite';
        if (subEl) subEl.textContent = 'Nessun profilo caricato';
    }

    if (authLabel) {
        authLabel.textContent = state.currentUser ? 'Account & Cloud Sincronizzato' : 'Sincronizzazione Cloud';
    }
}

function initMobileNavigation() {
    const savedTab = localStorage.getItem('md_active_mobile_tab') || 'matrix';
    setMobileTab(savedTab);
}

// --- Legal Box Banner Collapse / Close System ---
function toggleLegalFooter(show) {
    const footer = document.getElementById('app-footer');
    const reopenBtn = document.getElementById('btn-reopen-legal-footer');
    if (!footer) return;

    if (show) {
        footer.classList.remove('is-hidden');
        if (reopenBtn) reopenBtn.style.display = 'none';
        localStorage.setItem('md_legal_footer_hidden', 'false');
    } else {
        footer.classList.add('is-hidden');
        if (reopenBtn) reopenBtn.style.display = 'inline-flex';
        localStorage.setItem('md_legal_footer_hidden', 'true');
    }
}

function initLegalFooterState() {
    const isHidden = localStorage.getItem('md_legal_footer_hidden');
    const isMobile = window.innerWidth <= 900;
    // On iPhone/mobile screens, start with legal banner collapsed by default so it never covers the chat or input!
    if (isHidden === 'true' || (isMobile && isHidden !== 'false')) {
        toggleLegalFooter(false);
    }
}

// --- MIT-Grade Scroll Reveal Animation System ---
function initScrollReveal() {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
        document.querySelectorAll('.reveal-on-scroll').forEach(el => {
            el.classList.add('revealed');
        });
        return;
    }

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.reveal-on-scroll').forEach(el => {
        revealObserver.observe(el);
    });
}

// --- Master Application Initialization ---
async function initApp() {
    console.log("🌌 Inizializzazione Matrice del Destino...");
    initBackgroundCanvas();
    initTabs();
    initChatInputs();
    initLegalFooterState();
    
    // Fetch server configuration & system prompt
    try {
        const config = await apiClient.getConfig();
        if (config) {
            state.systemPrompt = config.defaultSystemPrompt;
            state.model = config.model || 'deepseek-v4-flash-0731';
            state.baseUrl = config.baseUrl || 'https://api.llmapi.ai/v1';
            state.provider = 'llmapi';
        }
    } catch (e) {
        console.warn('Config fetch notice:', e);
    }

    resetSession();
    updateCreditsDisplay();
    checkPaymentReturn();
    checkReferralEntry();
    initGdprConsent();
    await initSupabaseAuth();
    loadUserProfile();
    initMobileNavigation();
    initScrollReveal();
    setTimeout(() => startOnboardingTour(false), 800);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

