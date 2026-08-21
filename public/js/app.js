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
async function sendMessage(overrideText = null) {
    if (typeof overrideText !== 'string') {
        overrideText = null;
    }
    if (state.isGenerating) return;
    const input = document.getElementById('chat-input');
    const text = (overrideText || input?.value || '').trim();
    if (!text) return;

    // Check credits and registration status before starting
    const currentCredits = getUserCredits();
    if (currentCredits <= 0) {
        if (!state.currentUser) {
            openAuthModal();
            alert('✨ Registrati per Ricevere 1 Consulto Gratuito!\n\nPer calcolare la tua Matrice del Destino e ricevere l\'analisi oracolare completa, registrati o accedi con Google/Email in 5 secondi!');
        } else {
            openCreditsModal();
            alert('✦ Hai esaurito i consulti disponibili.\nRicarica gratuitamente condividendo il tuo link Invita un Amico (+2 Consulti) o attiva il Pass Arcano!');
        }
        return;
    }

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

            // Deduct 1 credit strictly upon valid response reception!
            const currentCredits = getUserCredits();
            if (currentCredits > 0) {
                setUserCredits(currentCredits - 1);
                console.log(`✦ Consulto completato: crediti scalati da ${currentCredits} a ${currentCredits - 1}.`);
            }
        },
        onError: (err) => {
            console.warn("API Stream encountered an issue, automatically activating Instant Neural Fallback:", err.message);
            if (typingIndicator) typingIndicator.remove();
            // Automatically deliver the complete 14-section report seamlessly!
            generateLocalReportFallback();
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
    document.getElementById('wz-name').value = 'Elena Solaris';
    document.getElementById('wz-date').value = '1995-07-21';
    document.getElementById('wz-time').value = '10:30';
    document.getElementById('wz-place').value = 'Firenze, Italia';
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
    const currentYear = new Date().getFullYear();
    const messageToAI = `Ecco i miei dati completi per l'analisi della Matrice del Destino:

* **Nome completo:** ${name}
* **Data di nascita:** ${date}
* **Orario di nascita:** ${time}
* **Città e nazione:** ${place}
* **Tipo di analisi scelta:** ${type}
* **Anno Solare di Riferimento:** ${currentYear}

Ti confermo tutti i dati. Procedi con il report completo a 14 sezioni calcolando l'Anno Personale per l'anno in corso (${currentYear}) e la relativa proiezione decennale.`;

    closeWizardModal();
    sendMessage(messageToAI);
}

// --- Supabase Cloud Sync & Authentication Setup ---
const SUPABASE_URL = 'https://zzprmoehmzwzsumuuzdw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp6cHJtb2VobXp3enN1bXV1emR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxNzg4MzksImV4cCI6MjEwMjc1NDgzOX0.chFyYCLXZcnBdUfzyXDOh4QtWmgKRZcewo9gmBoRVuA';

let supabaseClient = null;
try {
    if (window.supabase && typeof window.supabase.createClient === 'function') {
        supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
    }
} catch (e) {
    console.warn('Supabase initialization warning:', e);
}

// --- Credits & Wallet Management ---

function getUserCredits() {
    const raw = localStorage.getItem('destiny_credits');
    if (raw === null) {
        // If user is not logged in, they start with 0 credits until registration!
        if (!state.currentUser) {
            localStorage.setItem('destiny_credits', '0');
            return 0;
        }
        localStorage.setItem('destiny_credits', '1');
        return 1;
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
    if (!state.currentUser && credits === 0) {
        text = '0 Consulti (Accedi per +1)';
    } else if (credits === 1) {
        text = '1 Consulto';
    }

    if (badgeEl) badgeEl.textContent = text;
    if (modalEl) modalEl.textContent = credits === 1 ? '1 Consulto' : `${credits} Consulti`;
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
    alert("⏳ Video Sponsor in Fase di Attivazione Google\n\nGoogle AdSense sta completando la revisione di conformità del canale (stato: 'Getting ready').\n\nI video sponsor saranno operativi non appena Google terminerà l'approvazione (24-48h).\n\nNel frattempo, puoi ottenere +2 Consulti Gratuiti condividendo il tuo link 'Invita un Amico' o attivare un Pass!");
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
    const currentOrigin = window.location.origin || 'https://matrice-jade.vercel.app';
    const link = `${currentOrigin}/?ref=${userRef}`;

    if (navigator.share) {
        navigator.share({
            title: 'Matrice del Destino — Calcola la tua Mappa Archetipica',
            text: '✨ Scopri la tua Matrice del Destino e calcola il tuo Ottagramma Sacro con l\'Oracolo Archetipico!',
            url: link
        }).then(() => {
            awardReferralBonus();
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
            awardReferralBonus();
        }).catch(() => {
            prompt('Copia il tuo link invito:', link);
            awardReferralBonus();
        });
    } else {
        prompt('Copia il tuo link invito:', link);
        awardReferralBonus();
    }
}

function awardReferralBonus() {
    const current = getUserCredits();
    setUserCredits(current + 2);
    if (typeof confetti === 'function') {
        confetti({ particleCount: 75, spread: 80, origin: { y: 0.6 } });
    }
    alert('🎉 Link Invito pronto & condiviso!\n\nTi sono stati accreditati +2 Consulti Gratuiti sulla Matrice del Destino.');
}

function checkReferralEntry() {
    const params = new URLSearchParams(window.location.search);
    const ref = params.get('ref');
    if (ref && !localStorage.getItem('md_referred_by')) {
        localStorage.setItem('md_referred_by', ref);
        const current = getUserCredits();
        setUserCredits(Math.max(2, current + 1));
        setTimeout(() => {
            alert('🎁 Benvenuto da parte di un amico!\nHai ricevuto +1 Consulto Bonus omaggio per iniziare la tua lettura.');
        }, 1500);
    }
}

window.openCreditsModal = openCreditsModal;
window.closeCreditsModal = closeCreditsModal;
window.watchRewardedAd = watchRewardedAd;
window.buyPremiumPass = buyPremiumPass;
window.copyReferralLink = copyReferralLink;
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

// --- GDPR & EU AI Act Compliance Engine ---

function initGdprConsent() {
    const consent = localStorage.getItem('md_gdpr_consent');
    const banner = document.getElementById('gdpr-banner');
    if (!consent && banner) {
        banner.classList.add('active');
    } else if (consent === 'all') {
        updateGoogleConsent(true);
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
    if (banner) banner.classList.remove('active');
}

function rejectOptionalCookies() {
    localStorage.setItem('md_gdpr_consent', 'essential_only');
    updateGoogleConsent(false);
    const banner = document.getElementById('gdpr-banner');
    if (banner) banner.classList.remove('active');
}

function toggleGdprPreferencesPanel() {
    const panel = document.getElementById('gdpr-preferences-panel');
    if (panel) panel.classList.toggle('active');
}

function openGdprPreferences() {
    closeCookieModal();
    const banner = document.getElementById('gdpr-banner');
    if (banner) {
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

async function signOutUser() {
    if (supabaseClient) {
        await supabaseClient.auth.signOut();
        state.currentUser = null;
        updateAuthUI(null);
        alert("Account disconnesso. I crediti rimangono salvati sul cloud e accessibili al prossimo login.");
        closeAuthModal();
    }
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

    if (user) {
        if (unloggedView) unloggedView.style.display = 'none';
        if (loggedView) loggedView.style.display = 'block';
        if (loggedEmail) loggedEmail.textContent = user.email;
        if (authBtnLabel) authBtnLabel.textContent = user.email.split('@')[0];
        if (authHeaderIcon) {
            authHeaderIcon.className = 'fa-solid fa-cloud-check';
            authHeaderIcon.style.color = 'var(--gold-bright)';
        }
        if (cloudDisplay) cloudDisplay.textContent = getUserCredits();
    } else {
        if (unloggedView) unloggedView.style.display = 'block';
        if (loggedView) loggedView.style.display = 'none';
        if (authBtnLabel) authBtnLabel.textContent = 'Sincronizza';
        if (authHeaderIcon) {
            authHeaderIcon.className = 'fa-solid fa-cloud';
            authHeaderIcon.style.color = 'var(--cyan-accent)';
        }
    }
}

async function initSupabaseAuth() {
    if (!supabaseClient) return;

    // Listen for auth state changes
    supabaseClient.auth.onAuthStateChange(async (event, session) => {
        if (session && session.user) {
            state.currentUser = session.user;
            updateAuthUI(session.user);

            // Fetch and merge cloud wallet
            try {
                const { data, error } = await supabaseClient
                    .from('user_matrix_wallets')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .maybeSingle();

                const localCredits = getUserCredits();

                if (data) {
                    // Existing registered user: sync credits from database
                    const merged = Math.max(data.credits, localCredits);
                    setUserCredits(merged, false);
                    if (merged !== data.credits) {
                        await supabaseClient
                            .from('user_matrix_wallets')
                            .update({ credits: merged, updated_at: new Date().toISOString() })
                            .eq('user_id', session.user.id);
                    }
                } else {
                    // Brand new user registration: award 1 free welcome credit!
                    const welcomeCredits = Math.max(1, localCredits);
                    setUserCredits(welcomeCredits, false);
                    await supabaseClient
                        .from('user_matrix_wallets')
                        .insert({
                            user_id: session.user.id,
                            email: session.user.email,
                            credits: welcomeCredits
                        });

                    if (typeof confetti === 'function') {
                        confetti({ particleCount: 100, spread: 80, origin: { y: 0.5 } });
                    }
                    setTimeout(() => {
                        alert('🎉 Benvenuto nella Matrice del Destino!\n\nTi è stato accreditato 1 Consulto Gratuito per completare la tua analisi archetipica.');
                    }, 500);
                }
                updateCreditsDisplay();
            } catch (err) {
                console.error('Wallet sync initialization error:', err);
            }
        } else {
            state.currentUser = null;
            updateAuthUI(null);
        }
    });

    // Check initial session
    try {
        const { data: { session } } = await supabaseClient.auth.getSession();
        if (session && session.user) {
            state.currentUser = session.user;
            updateAuthUI(session.user);
        }
    } catch (e) {
        console.warn('GetSession check notice:', e);
    }
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

// --- Master Application Initialization ---
function initApp() {
    console.log("🌌 Inizializzazione Matrice del Destino...");
    initBackgroundCanvas();
    initTabs();
    initChatInputs();
    updateCreditsDisplay();
    checkPaymentReturn();
    checkReferralEntry();
    initGdprConsent();
    initSupabaseAuth();
    setTimeout(() => startOnboardingTour(false), 800);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
} else {
    initApp();
}

