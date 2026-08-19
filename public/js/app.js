/**
 * Destiny Matrix AI Application Controller
 * Handles Sacred Geometry Canvas, Chat Streaming, Matrix Graph Updating, and UI State.
 */

// Application State (Locked to DeepSeek V4 Flash Backend)
const state = {
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

// --- Initialization ---
document.addEventListener('DOMContentLoaded', async () => {
    initBackgroundCanvas();
    initTabs();
    initChatInputs();
    
    // Fetch server configuration & system prompt
    const config = await apiClient.getConfig();
    if (config) {
        state.systemPrompt = config.defaultSystemPrompt;
        state.model = config.model || 'deepseek-v4-flash-0731';
        state.baseUrl = config.baseUrl || 'https://api.llmapi.ai/v1';
        state.provider = 'llmapi';
    }

    // Default starting message and autoplay welcome voice
    resetSession();
    setupWelcomeAutoplay();
});

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

const INITIAL_GREETING = `### Benvenuto nell'Analisi della Matrice del Destino 🌌

Sono la tua guida all'interpretazione simbolica e numerologica archetipica dei **22 Arcani** e della **Matrice del Destino**.

> *Ricorda: La numerologia è un linguaggio simbolico millenario per favorire l'introspezione e l'autoconsapevolezza, non per determinare un futuro immutabile.*

Per costruire la tua mappa energetica completa, procederemo raccogliendo i tuoi dati un passo alla volta.

---

**Domanda 1:**
*Qual è il tuo nome completo riportato all'anagrafe?*

*(Puoi rispondere direttamente qui in chat o cliccare su **Modulo Guidato** in alto per inserire tutti i dati insieme!)*`;

function resetSession() {
    state.messages = [{ role: 'assistant', content: INITIAL_GREETING }];
    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;

    chatContainer.innerHTML = `
        <div class="message-wrapper assistant">
            <div class="message-avatar"><i class="fa-solid fa-sun"></i></div>
            <div class="message-bubble">
                <div class="message-content">${typeof marked !== 'undefined' ? marked.parse(INITIAL_GREETING) : INITIAL_GREETING}</div>
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
        ttsBtn.onclick = () => toggleSpeech(INITIAL_GREETING, ttsBtn, '/audio/welcome.wav');
    }
}

function setupWelcomeAutoplay() {
    const welcomeAudio = new Audio('/audio/welcome.wav');
    welcomeAudio.volume = 0.85;

    const playWelcome = () => {
        welcomeAudio.play().catch(() => {});
        document.removeEventListener('click', playWelcome);
        document.removeEventListener('keydown', playWelcome);
    };

    welcomeAudio.play().catch(() => {
        document.addEventListener('click', playWelcome, { once: true });
        document.addEventListener('keydown', playWelcome, { once: true });
    });
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

    if (btnSend) btnSend.addEventListener('click', sendMessage);
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

// Reset Session
function resetSession() {
    stopAllSpeech();
    state.messages = [
        { role: 'system', content: state.systemPrompt || "Sei un consulente di numerologia simbolica." }
    ];
    const chatContainer = document.getElementById('chat-messages');
    chatContainer.innerHTML = '';

    // Welcome Greeting from Assistant
    const initialGreeting = `### Benvenuto nell'Analisi della Matrice del Destino 🌌

Sono la tua guida all'interpretazione simbolica e numerologica archetipica dei **22 Arcani** e della **Matrice del Destino**.

> *Ricorda: La numerologia è un linguaggio simbolico millenario per favorire l'introspezione e l'autoconsapevolezza, non per determinare un futuro immutabile.*

Per costruire la tua mappa energetica completa, procederemo raccogliendo i tuoi dati un passo alla volta.

---

**Domanda 1:**
*Qual è il tuo nome completo riportato all'anagrafe?*

*(Puoi rispondere direttamente qui in chat o cliccare su **Modulo Guidato** in alto per inserire tutti i dati insieme!)*`;

    appendMessage('assistant', initialGreeting, '', true);
    state.messages.push({ role: 'assistant', content: initialGreeting });
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
                <span><i class="fa-solid fa-brain"></i> Ragionamento DeepSeek</span>
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

    // If Assistant, add TTS Action Button
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
    if (btnElement && btnElement.classList.contains('playing')) {
        stopAllSpeech();
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

function setupWelcomeAutoplay() {
    const welcomeBtn = document.getElementById('btn-welcome-audio');
    
    // Try instant play on load
    playWelcomeAudio(welcomeBtn).catch(() => {
        // If blocked by browser autoplay policy, start on first click/touch/keypress anywhere
        const onFirstUserAction = () => {
            const btn = document.getElementById('btn-welcome-audio');
            if (!currentAudio) {
                playWelcomeAudio(btn).catch(() => {});
            }
            document.removeEventListener('click', onFirstUserAction);
            document.removeEventListener('touchstart', onFirstUserAction);
            document.removeEventListener('keydown', onFirstUserAction);
        };
        document.addEventListener('click', onFirstUserAction, { once: true });
        document.addEventListener('touchstart', onFirstUserAction, { once: true });
        document.addEventListener('keydown', onFirstUserAction, { once: true });
    });
}

// --- TTS Speech Synthesis Controller ---
let currentSpeakingBtn = null;
let currentAudio = null;

function toggleSpeech(text, btnElement) {
    if (!text) return;

    if (btnElement && btnElement.classList.contains('playing')) {
        stopAllSpeech();
        return;
    }

    stopAllSpeech();

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
async function sendMessage(overrideText = null) {
    if (state.isGenerating) return;
    const input = document.getElementById('chat-input');
    const text = (overrideText || input.value).trim();
    if (!text) return;

    // Check credits
    const credits = getUserCredits();
    if (credits <= 0) {
        openCreditsModal();
        alert('✦ Hai esaurito i consulti disponibili.\nRicarica gratuitamente guardando un breve video sponsor oppure attiva il Pass Arcano!');
        return;
    }

    // Decrement 1 credit for the reading
    setUserCredits(credits - 1);

    if (!overrideText) {
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
                    <span class="reasoning-label"><i class="fa-solid fa-brain"></i> Ragionamento AI (${state.model})</span>
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
                streamingContentDiv.innerHTML = '<span style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;"><i class="fa-solid fa-spinner fa-spin"></i> Elaborazione del ragionamento archetipico...</span>';
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
                    streamingContentDiv.innerHTML = '<span style="color: var(--text-muted); font-style: italic; font-size: 0.85rem;"><i class="fa-solid fa-spinner fa-spin"></i> Elaborazione del ragionamento archetipico in corso...</span>';
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
            setGeneratingState(false);
            if (typingIndicator) typingIndicator.remove();
            if (streamingContentDiv) {
                streamingContentDiv.style.display = 'block';
                const isQuota = err.message.includes('Quota') || err.message.includes('insufficient_user_quota') || err.message.includes('credito');
                
                streamingContentDiv.innerHTML = `
                    <div style="background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.3); border-radius: var(--radius-md); padding: 14px; margin-top: 6px;">
                        <div style="font-weight: 700; color: #fca5a5; margin-bottom: 6px; display: flex; align-items: center; gap: 8px;">
                            <i class="fa-solid fa-triangle-exclamation"></i> Connessione TokenRouter
                        </div>
                        <div style="font-size: 0.88rem; line-height: 1.5; color: #e2e8f0; margin-bottom: 12px;">
                            ${typeof marked !== 'undefined' ? marked.parse(err.message) : err.message}
                        </div>
                        <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                            <button class="btn-header" onclick="openSettingsModal()" style="font-size: 0.8rem; padding: 6px 12px;">
                                <i class="fa-solid fa-key"></i> Aggiorna Chiave API
                            </button>
                            <button class="btn-header primary" onclick="generateLocalReportFallback()" style="font-size: 0.8rem; padding: 6px 12px;">
                                <i class="fa-solid fa-wand-magic-sparkles"></i> Genera Report Istantaneo (Offline Engine)
                            </button>
                        </div>
                    </div>
                `;
            }
        }
    });
}

function sendQuickPrompt(text) {
    sendMessage(text);
}

// --- Matrix Extraction & Visualizer Update ---
function checkAndExtractDataForVisualizer(text) {
    // Check if birthdate is present (e.g. 28/11/1992, 28-11-1992, 1992-11-28, o novembre 28, 1992)
    const dateMatch = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
    if (dateMatch) {
        const day = parseInt(dateMatch[1], 10);
        const month = parseInt(dateMatch[2], 10);
        const year = parseInt(dateMatch[3], 10);
        updateMatrixVisualization(text, `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`);
    }
}

function extractMatrixFromAssistantReport(reportText) {
    // If report contains calculated values, ensure visualizer is updated
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

    // Select Top Node by Default
    selectNode('top');
}

// Select a node in the Octagram
function selectNode(key) {
    if (!state.currentMatrixData) return;
    const nodeInfo = state.currentMatrixData.matrix[key];
    if (!nodeInfo) return;

    state.selectedNodeKey = key;
    document.getElementById('node-card-title').textContent = `${nodeInfo.label} (Arcano ${nodeInfo.value})`;
    document.getElementById('node-card-arcana').textContent = `${nodeInfo.arcana.name}`;
    document.getElementById('node-card-desc').innerHTML = `
        <strong>Archetipo:</strong> ${nodeInfo.arcana.archetype}<br>
        <strong>Elemento:</strong> ${nodeInfo.arcana.element}<br>
        <strong>Energie chiave:</strong> ${nodeInfo.arcana.keywords}
    `;
}

// --- Wizard Modal Handlers ---
function openWizardModal() {
    document.getElementById('wizard-modal').classList.add('active');
}
function closeWizardModal() {
    document.getElementById('wizard-modal').classList.remove('active');
}

function fillSampleData() {
    document.getElementById('wz-name').value = 'Andrea Giuliano';
    document.getElementById('wz-date').value = '1992-11-28';
    document.getElementById('wz-time').value = 'non disponibile';
    document.getElementById('wz-place').value = 'Roma, Italia';
    document.getElementById('wz-type').value = '2. Numerologica + Astrologica simbolica';
}

function submitWizardData() {
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
    const messageToAI = `Ecco i miei dati completi per l'analisi della Matrice del Destino:

* **Nome completo:** ${name}
* **Data di nascita:** ${date}
* **Orario di nascita:** ${time}
* **Città e nazione:** ${place}
* **Tipo di analisi scelta:** ${type}

Ti confermo tutti i dati. Puoi procedere con il report strutturato a 14 sezioni come previsto dal protocollo.`;

    closeWizardModal();
    sendMessage(messageToAI);
}

// --- Credit System & Monetization Engine ---
function getUserCredits() {
    const raw = localStorage.getItem('destiny_credits');
    if (raw === null) {
        localStorage.setItem('destiny_credits', '1');
        return 1;
    }
    const val = parseInt(raw, 10);
    return isNaN(val) ? 1 : val;
}

function setUserCredits(count) {
    localStorage.setItem('destiny_credits', String(Math.max(0, count)));
    updateCreditsDisplay();
}

function updateCreditsDisplay() {
    const credits = getUserCredits();
    const badgeEl = document.getElementById('user-credits-count');
    const modalEl = document.getElementById('modal-credits-display');
    const text = credits === 1 ? '1 Consulto' : `${credits} Consulti`;

    if (badgeEl) badgeEl.textContent = text;
    if (modalEl) modalEl.textContent = text;
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

function watchRewardedAd() {
    const btn = document.getElementById('btn-watch-ad');
    if (btn) {
        btn.disabled = true;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Visualizzazione Sponsor (15s)...';
    }

    setTimeout(() => {
        const current = getUserCredits();
        setUserCredits(current + 1);
        if (typeof confetti === 'function') {
            confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
        }
        if (btn) {
            btn.disabled = false;
            btn.innerHTML = '<i class="fa-solid fa-check"></i> +1 Consulto Accreditato!';
            setTimeout(() => {
                btn.innerHTML = '<i class="fa-solid fa-clapperboard"></i> Guarda Video (+1)';
            }, 3000);
        }
        alert('✨ Complimenti! Hai ricaricato +1 Consulto Gratuito grazie allo sponsor.');
    }, 2500);
}

function buyPremiumPass() {
    const confirmed = confirm('Procedere con lo sblocco del Pass Arcano (5 Consulti + Download PDF HD) a 1.99€?');
    if (confirmed) {
        const current = getUserCredits();
        setUserCredits(current + 5);
        if (typeof confetti === 'function') {
            confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
        }
        closeCreditsModal();
        alert('🔮 Pass Arcano Attivato! Hai ricevuto +5 Consulti e accesso prioritario.');
    }
}

function copyReferralLink() {
    const link = `https://matrice-agtechds.vercel.app/?ref=${Math.random().toString(36).substring(7)}`;
    navigator.clipboard.writeText(link).then(() => {
        const current = getUserCredits();
        setUserCredits(current + 2);
        if (typeof confetti === 'function') {
            confetti({ particleCount: 60, spread: 60, origin: { y: 0.6 } });
        }
        alert('🎉 Link Invito copiato negli appunti!\nTi sono stati accreditati +2 Consulti Omaggio.');
    });
}

window.openCreditsModal = openCreditsModal;
window.closeCreditsModal = closeCreditsModal;
window.watchRewardedAd = watchRewardedAd;
window.buyPremiumPass = buyPremiumPass;
window.copyReferralLink = copyReferralLink;

// --- Report Modal Handlers ---
function openReportModal() {
    const reportContainer = document.getElementById('report-modal-content');
    // Find the latest assistant message containing the full analysis or concatenate conversation
    const assistantMsgs = state.messages.filter(m => m.role === 'assistant');
    if (assistantMsgs.length === 0) {
        reportContainer.innerHTML = '<p style="color: var(--text-muted);">Nessun report generato finora. Avvia una sessione di analisi.</p>';
    } else {
        const fullContent = assistantMsgs.map(m => m.content).join('\n\n---\n\n');
        reportContainer.innerHTML = typeof marked !== 'undefined' ? marked.parse(fullContent) : fullContent;
    }
    document.getElementById('report-modal').classList.add('active');
}
function closeReportModal() {
    document.getElementById('report-modal').classList.remove('active');
}

function copyReportMarkdown() {
    const assistantMsgs = state.messages.filter(m => m.role === 'assistant');
    const fullContent = assistantMsgs.map(m => m.content).join('\n\n---\n\n');
    navigator.clipboard.writeText(fullContent).then(() => {
        alert('Report copiato negli appunti in formato Markdown!');
    });
}

function generateLocalReportFallback() {
    let name = 'Andrea Giuliano';
    let date = '1992-11-28';
    if (state.currentMatrixData) {
        name = state.currentMatrixData.name;
        date = `${state.currentMatrixData.birthDate.year}-${String(state.currentMatrixData.birthDate.month).padStart(2, '0')}-${String(state.currentMatrixData.birthDate.day).padStart(2, '0')}`;
    }
    const data = calculateCompleteMatrix(name, date);
    updateMatrixVisualization(name, date);
    const reportMarkdown = generateCompleteReport14Sections(data);
    appendMessage('assistant', reportMarkdown);
    state.messages.push({ role: 'assistant', content: reportMarkdown });
}

