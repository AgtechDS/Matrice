const fs = require('fs');

const API_KEY = 'YOUR_GEMINI_TTS_API_KEY';
const sampleText = "Andrea, il tuo profilo rivela la forza di un Pioniere e la saggezza di una Guida. Guidato dal Percorso 6 con radice maestra 33, hai una naturale vocazione a creare armonia e lasciare un impatto positivo. L'Espressione 5 ti dona rapido intuito e versatilità, mentre l'Anima 8 spinge verso traguardi concreti e autorevoli. La tua sfida evolutiva è bilanciare la sete di libertà con la responsabilità, trasformando la scintilla delle tue idee in progetti solidi al servizio della comunità.";

async function testGoogleTTS() {
    console.log("1. Testing Google Cloud Text-to-Speech endpoint...");
    try {
        const res = await fetch(`https://texttospeech.googleapis.com/v1/text:synthesize?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                input: { text: sampleText },
                voice: {
                    languageCode: 'it-IT',
                    name: 'it-IT-Neural2-C',
                    ssmlGender: 'MALE'
                },
                audioConfig: {
                    audioEncoding: 'MP3',
                    speakingRate: 1.0,
                    pitch: 0.0
                }
            })
        });

        console.log("Cloud TTS Status:", res.status);
        const text = await res.text();
        if (res.ok) {
            const data = JSON.parse(text);
            const audioBuffer = Buffer.from(data.audioContent, 'base64');
            fs.writeFileSync('public/test_google_neural.mp3', audioBuffer);
            console.log("SUCCESS! Saved public/test_google_neural.mp3 with size:", audioBuffer.length, "bytes!");
            return true;
        } else {
            console.log("Cloud TTS response:", text);
        }
    } catch(e) {
        console.error("Cloud TTS error:", e);
    }
    return false;
}

async function testGeminiAudio() {
    console.log("\n2. Testing Gemini 2.0 Flash Audio Modality endpoint...");
    try {
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: `Leggi con voce calda, chiara, naturale, accattivante ed espressiva in lingua italiana il seguente testo, senza aggiungere commenti o introduzioni:\n\n${sampleText}` }
                    ]
                }
            ],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: "Aoede" // Female / Puck / Charon / Fenrir / Kore
                        }
                    }
                }
            }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Gemini Audio Status:", res.status);
        const text = await res.text();
        if (res.ok) {
            const data = JSON.parse(text);
            console.log("Candidates received:", data.candidates?.length);
            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                console.log("MIME Type:", part.inlineData.mimeType);
                const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
                console.log("Audio buffer size (PCM):", pcmBuffer.length, "bytes!");
                
                // Convert PCM 24000Hz 16-bit mono to WAV
                const wavHeader = createWavHeader(pcmBuffer.length, 24000, 1, 16);
                const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
                fs.writeFileSync('public/test_gemini_audio.wav', wavBuffer);
                console.log("SUCCESS! Saved public/test_gemini_audio.wav!");
                return true;
            } else {
                console.log("No inlineData audio part:", JSON.stringify(part));
            }
        } else {
            console.log("Gemini response:", text);
        }
    } catch(e) {
        console.error("Gemini Audio error:", e);
    }
    return false;
}

function createWavHeader(dataLength, sampleRate, numChannels, bitsPerSample) {
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16); // Subchunk1Size
    header.writeUInt16LE(1, 20);  // PCM format
    header.writeUInt16LE(numChannels, 22);
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * numChannels * (bitsPerSample / 8), 28); // ByteRate
    header.writeUInt16LE(numChannels * (bitsPerSample / 8), 32); // BlockAlign
    header.writeUInt16LE(bitsPerSample, 34);
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return header;
}

async function main() {
    const ok1 = await testGoogleTTS();
    if (!ok1) {
        await testGeminiAudio();
    }
}

main();
