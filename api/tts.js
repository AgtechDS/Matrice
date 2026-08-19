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

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method not allowed' } });
    }

    const { text, voice = 'Aoede' } = req.body || {};
    const apiKey = req.body?.apiKey || process.env.GEMINI_TTS_API_KEY;

    if (!text) {
        return res.status(400).json({ error: { message: 'Il testo è obbligatorio' } });
    }

    if (!apiKey) {
        return res.status(400).json({ error: { message: 'Chiave API Google AI Studio non configurata.' }, needsKey: true });
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
                            voiceName: voice // Aoede, Puck, Charon, Fenrir, Kore
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
            return res.status(response.status).json({ error: err });
        }

        const data = await response.json();
        const part = data.candidates?.[0]?.content?.parts?.[0];

        if (!part?.inlineData?.data) {
            return res.status(500).json({ error: { message: 'Nessun flusso audio generato da Gemini.' } });
        }

        const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
        const wavAudioBuffer = createWavBuffer(pcmBuffer, 24000);

        res.setHeader('Content-Type', 'audio/wav');
        res.setHeader('Cache-Control', 'public, max-age=86400');
        res.send(wavAudioBuffer);
    } catch (e) {
        console.error('Vercel TTS Error:', e);
        res.status(500).json({ error: { message: e.message } });
    }
}
