const fs = require('fs');
const crypto = require('crypto');

// Microsoft Edge Neural TTS Client (Zero Dependencies, uses native WebSocket in Node 22)
class EdgeTTS {
    constructor() {
        this.endpoint = "wss://speech.platform.bing.com/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4";
    }

    async synthesize(text, voice = "it-IT-DiegoNeural", rate = "+0%", pitch = "+0Hz") {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(this.endpoint, {
                headers: {
                    "Pragma": "no-cache",
                    "Cache-Control": "no-cache",
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0",
                    "Origin": "chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold",
                    "Accept-Encoding": "gzip, deflate, br",
                    "Accept-Language": "it-IT,it;q=0.9,en-US;q=0.8,en;q=0.7"
                }
            });

            const audioChunks = [];
            const reqId = crypto.randomUUID().replace(/-/g, "");

            ws.onopen = () => {
                // 1. Send speech.config
                const configMsg = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
                ws.send(configMsg);

                // 2. Send SSML
                const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='it-IT'><voice name='${voice}'><prosody pitch='${pitch}' rate='${rate}'>${text}</prosody></voice></speak>`;
                const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${ssml}`;
                ws.send(ssmlMsg);
            };

            ws.onmessage = async (event) => {
                if (typeof event.data === 'string') {
                    if (event.data.includes("Path:turn.end")) {
                        ws.close();
                        const fullBuffer = Buffer.concat(audioChunks);
                        resolve(fullBuffer);
                    }
                } else {
                    // Binary audio payload
                    const buffer = Buffer.from(await event.data.arrayBuffer());
                    // Find header separator \r\n\r\n (Path:audio\r\n\r\n)
                    const headerEnd = buffer.indexOf(Buffer.from([0x00, 0x00])); // header length is in first 2 bytes
                    if (buffer.length > 2) {
                        const headerLength = buffer.readUInt16BE(0);
                        const audioData = buffer.subarray(2 + headerLength);
                        if (audioData.length > 0) {
                            audioChunks.push(audioData);
                        }
                    }
                }
            };

            ws.onerror = (err) => {
                reject(err);
            };

            ws.onclose = () => {
                if (audioChunks.length > 0) {
                    resolve(Buffer.concat(audioChunks));
                }
            };
        });
    }
}

async function test() {
    console.log("Testing Edge Neural TTS for Italian voice...");
    const tts = new EdgeTTS();
    const script = "Andrea, il tuo profilo rivela la forza di un Pioniere e la saggezza di una Guida. Guidato dal Percorso 6 con radice maestra 33, hai una naturale vocazione a creare armonia e lasciare un impatto positivo. L'Espressione 5 ti dona rapido intuito e versatilità, mentre l'Anima 8 spinge verso traguardi concreti e autorevoli. La tua sfida evolutiva è bilanciare la sete di libertà con la responsabilità, trasformando la scintilla delle tue idee in progetti solidi al servizio della comunità.";

    try {
        const audioBuffer = await tts.synthesize(script, "it-IT-DiegoNeural");
        console.log("Generated audio buffer size:", audioBuffer.length, "bytes");
        fs.writeFileSync("test_tts_diego.mp3", audioBuffer);
        console.log("Successfully saved test_tts_diego.mp3!");
    } catch(e) {
        console.error("TTS generation error:", e);
    }
}

test();
