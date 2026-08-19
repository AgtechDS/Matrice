const fs = require('fs');
const path = require('path');

const API_KEY = 'YOUR_GEMINI_TTS_API_KEY';
const welcomeSpeechText = "Benvenuto nell'Analisi della Matrice del Destino. Sono la tua guida all'interpretazione simbolica e numerologica archetipica dei 22 Arcani. Per costruire la tua mappa energetica completa, raccoglieremo i tuoi dati un passo alla volta. Qual è il tuo nome completo? Puoi scriverlo qui in chat, oppure cliccare su Modulo Guidato in alto per inserire subito tutti i dati.";

function createWavHeader(dataLength, sampleRate = 24000, numChannels = 1, bitsPerSample = 16) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28);
    header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32);
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return header;
}

async function generateWelcomeAudio() {
    console.log("Generating welcome audio with Gemini Flash TTS...");
    const payload = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: `Leggi con voce calda, accogliente, armoniosa, spirituale e chiara in italiano il seguente messaggio di benvenuto:\n\n${welcomeSpeechText}` }
                ]
            }
        ],
        generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: {
                        voiceName: "Aoede"
                    }
                }
            }
        }
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        console.error("Error generating welcome audio:", await res.text());
        return;
    }

    const data = await res.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];
    if (part?.inlineData?.data) {
        const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
        const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
        const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);

        const audioDir = path.join(__dirname, 'public', 'audio');
        if (!fs.existsSync(audioDir)) fs.mkdirSync(audioDir, { recursive: true });

        const filePath = path.join(audioDir, 'welcome.wav');
        fs.writeFileSync(filePath, wavBuffer);
        console.log("SUCCESS! Saved welcome audio to:", filePath, `(${wavBuffer.length} bytes)`);
    } else {
        console.error("No audio data returned");
    }
}

generateWelcomeAudio();
