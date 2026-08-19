import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try { process.loadEnvFile?.(); } catch (e) {}

const PORT = process.env.PORT || 3000;
const DEFAULT_API_KEY = process.env.LLMAPI_KEY || process.env.TOKENROUTER_API_KEY || '';
const DEFAULT_MODEL = process.env.LLM_MODEL || process.env.TOKENROUTER_MODEL || 'deepseek-v4-flash-0731';
const DEFAULT_BASE_URL = process.env.LLM_BASE_URL || process.env.TOKENROUTER_BASE_URL || 'https://api.llmapi.ai/v1';
const GEMINI_TTS_KEY = process.env.GEMINI_TTS_API_KEY || '';

function getSystemPrompt() {
    try {
        const promptPath = path.join(__dirname, 'prompt2analisi.md');
        if (fs.existsSync(promptPath)) {
            return fs.readFileSync(promptPath, 'utf8');
        }
    } catch (e) {
        console.error('Error reading prompt2analisi.md:', e);
    }
    return "Sei un consulente specializzato in numerologia simbolica e archetipica.";
}

function createWavBuffer(pcmBuffer, sampleRate = 24000) {
    const dataLength = pcmBuffer.length;
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(1, 22); // Mono
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34); // 16-bit
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return Buffer.concat([header, pcmBuffer]);
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // API: /api/config
    if (pathname === '/api/config' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            model: DEFAULT_MODEL,
            baseUrl: DEFAULT_BASE_URL,
            hasApiKey: Boolean(DEFAULT_API_KEY),
            geminiApiKey: GEMINI_TTS_KEY,
            defaultSystemPrompt: getSystemPrompt()
        }));
        return;
    }

    // API: /api/test-connection
    if (pathname === '/api/test-connection' && req.method === 'POST') {
        const body = await parseBody(req);
        const apiKey = body.apiKey || DEFAULT_API_KEY;
        const model = body.model || DEFAULT_MODEL;
        let baseUrl = (body.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');

        if (!apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: { message: 'Chiave API non inserita.' } }));
            return;
        }

        try {
            const resp = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Ping' }],
                    max_tokens: 15
                })
            });

            const text = await resp.text();
            let parsed;
            try { parsed = JSON.parse(text); } catch (e) { parsed = { message: text }; }

            if (!resp.ok) {
                res.writeHead(resp.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: parsed }));
                return;
            }

            const content = parsed.choices?.[0]?.message?.content || 'Connessione attiva!';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: content, model: model }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: { message: e.message } }));
        }
        return;
    }

    // API: /api/chat
    if (pathname === '/api/chat' && req.method === 'POST') {
        const body = await parseBody(req);
        const { messages, stream = true, temperature = 0.7, apiKey = DEFAULT_API_KEY, model = DEFAULT_MODEL } = body;
        let baseUrl = (body.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');

        if (!messages || !Array.isArray(messages)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Messages array is required' } }));
            return;
        }

        if (!apiKey) {
            res.writeHead(401, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Nessuna API Key configurata.' } }));
            return;
        }

        try {
            let maxTokens = 3800;
            if (baseUrl.includes('openrouter.ai') || baseUrl.includes('tokenrouter.com') || baseUrl.includes('llmapi.ai')) {
                maxTokens = 6000;
            }

            let finalMessages = [...messages];
            if (!finalMessages.some(m => m.role === 'system')) {
                const sysPrompt = getSystemPrompt();
                if (sysPrompt) {
                    finalMessages.unshift({ role: 'system', content: sysPrompt });
                }
            }

            const payload = {
                model: model,
                messages: finalMessages,
                temperature: temperature,
                stream: stream,
                max_tokens: maxTokens
            };

            if (baseUrl.includes('groq.com') || model.includes('qwen') || model.includes('gpt-oss')) {
                payload.reasoning_effort = 'none';
            }

            const response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errText = await response.text();
                res.writeHead(response.status, { 'Content-Type': 'application/json' });
                res.end(errText);
                return;
            }

            if (stream) {
                res.writeHead(200, {
                    'Content-Type': 'text/event-stream',
                    'Cache-Control': 'no-cache',
                    'Connection': 'keep-alive'
                });

                const reader = response.body.getReader();
                const decoder = new TextDecoder('utf-8');

                while (true) {
                    const { done, value } = await reader.read();
                    if (done) {
                        res.write('data: [DONE]\n\n');
                        res.end();
                        break;
                    }
                    res.write(decoder.decode(value, { stream: true }));
                }
            } else {
                const data = await response.json();
                res.writeHead(200, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify(data));
            }
        } catch (err) {
            console.error('Chat endpoint error:', err);
            if (!res.headersSent) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: err.message } }));
            }
        }
        return;
    }

    // API: /api/tts
    if (pathname === '/api/tts' && req.method === 'POST') {
        const body = await parseBody(req);
        const { text, voice = 'Aoede' } = body;
        const apiKey = body.apiKey || GEMINI_TTS_KEY;

        if (!text) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Il testo è obbligatorio' } }));
            return;
        }

        if (!apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Chiave API Google AI Studio non configurata.' }, needsKey: true }));
            return;
        }

        try {
            const payload = {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: `Leggi con voce calda, accattivante, naturale ed espressiva in italiano il seguente testo:\n\n${text.slice(0, 4800)}` }
                        ]
                    }
                ],
                generationConfig: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: voice
                            }
                        }
                    }
                }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                res.writeHead(response.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err }));
                return;
            }

            const data = await response.json();
            const part = data.candidates?.[0]?.content?.parts?.[0];

            if (!part?.inlineData?.data) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: 'Nessun flusso audio generato da Gemini.' } }));
                return;
            }

            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            const wavAudioBuffer = createWavBuffer(pcmBuffer, 24000);

            res.writeHead(200, {
                'Content-Type': 'audio/wav',
                'Cache-Control': 'public, max-age=86400',
                'Content-Length': wavAudioBuffer.length
            });
            res.end(wavAudioBuffer);
        } catch (e) {
            console.error('Gemini TTS error:', e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: e.message } }));
        }
        return;
    }

    // Static File Serving
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
        safePath = 'index.html';
    }

    let filePath = path.join(__dirname, 'public', safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileContent = fs.readFileSync(filePath);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': fileContent.length,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
        });
        res.end(fileContent);
        return;
    }

    // If file has an extension and was not found, return 404
    if (path.extname(safePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${safePath}`);
        return;
    }

    // Fallback to index.html for SPA routes
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': indexContent.length,
            'Cache-Control': 'no-cache'
        });
        res.end(indexContent);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🌌 Matrice del Destino Server avviato!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
