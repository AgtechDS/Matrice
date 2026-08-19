const fs = require('fs');

const API_KEY = 'YOUR_GEMINI_TTS_API_KEY';
const sampleText = "Andrea, il tuo profilo rivela la forza di un Pioniere e la saggezza di una Guida. Guidato dal Percorso 6 con radice maestra 33, hai una naturale vocazione a creare armonia e lasciare un impatto positivo. L'Espressione 5 ti dona rapido intuito e versatilità, mentre l'Anima 8 spinge verso traguardi concreti e autorevoli. La tua sfida evolutiva è bilanciare la sete di libertà con la responsabilità, trasformando la scintilla delle tue idee in progetti solidi al servizio della comunità.";

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

async function testGeminiTTS(modelName) {
    console.log(`\nTesting model: ${modelName}...`);
    try {
        const payload = {
            contents: [
                {
                    role: "user",
                    parts: [
                        { text: sampleText }
                    ]
                }
            ],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: {
                            voiceName: "Aoede" // Aoede, Puck, Charon, Fenrir, Kore
                        }
                    }
                }
            }
        };

        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/${modelName}:generateContent?key=${API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        console.log("Status:", res.status);
        const text = await res.text();
        if (res.ok) {
            const data = JSON.parse(text);
            const part = data.candidates?.[0]?.content?.parts?.[0];
            if (part?.inlineData) {
                console.log("MIME Type:", part.inlineData.mimeType);
                const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
                console.log("PCM Audio buffer size:", pcmBuffer.length, "bytes");
                
                const sampleRate = 24000;
                const wavHeader = createWavHeader(pcmBuffer.length, sampleRate, 1, 16);
                const wavBuffer = Buffer.concat([wavHeader, pcmBuffer]);
                const outFile = `public/audio_gemini_${modelName.split('/').pop()}.wav`;
                fs.writeFileSync(outFile, wavBuffer);
                console.log(`SUCCESS! Saved audio file to ${outFile}!`);
                return true;
            } else {
                console.log("Part content:", JSON.stringify(part));
            }
        } else {
            console.log("Error response:", text);
        }
    } catch(e) {
        console.error("Exception:", e);
    }
    return false;
}

async function main() {
    await testGeminiTTS("models/gemini-3.1-flash-tts-preview");
    await testGeminiTTS("models/gemini-2.5-flash-preview-tts");
}

main();
