const https = require('https');
const crypto = require('crypto');
const fs = require('fs');

function synthesizeEdgeTTS(text, voice = 'it-IT-DiegoNeural', outputPath = 'audio_test.mp3') {
    return new Promise((resolve, reject) => {
        const connectionId = crypto.randomUUID().replace(/-/g, '');
        const secWebSocketKey = crypto.randomBytes(16).toString('base64');

        const options = {
            hostname: 'speech.platform.bing.com',
            port: 443,
            path: `/consumer/speech/synthesize/readaloud/edge/v1?TrustedClientToken=6A5AA1D4EAFF4E9FB37E23D68491D6F4&ConnectionId=${connectionId}`,
            method: 'GET',
            headers: {
                'Pragma': 'no-cache',
                'Cache-Control': 'no-cache',
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36 Edg/130.0.0.0',
                'Origin': 'chrome-extension://jdiccldimpdaibmpdkjnbmckianbfold',
                'Upgrade': 'websocket',
                'Connection': 'Upgrade',
                'Sec-WebSocket-Key': secWebSocketKey,
                'Sec-WebSocket-Version': '13'
            }
        };

        const req = https.request(options);

        req.on('response', (res) => {
            console.log('HTTP Handshake response status:', res.statusCode, res.statusMessage);
        });

        req.on('upgrade', (res, socket, upgradeHead) => {
            console.log('Connected to Microsoft Edge TTS WebSocket! Status:', res.statusCode);
            const audioChunks = [];

            // Helper to send a masked websocket text frame
            function sendFrame(dataStr) {
                const payload = Buffer.from(dataStr, 'utf8');
                const len = payload.length;
                let header;
                const maskKey = crypto.randomBytes(4);

                if (len < 126) {
                    header = Buffer.from([0x81, 0x80 | len]);
                } else if (len < 65536) {
                    header = Buffer.alloc(4);
                    header[0] = 0x81;
                    header[1] = 0x80 | 126;
                    header.writeUInt16BE(len, 2);
                } else {
                    header = Buffer.alloc(10);
                    header[0] = 0x81;
                    header[1] = 0x80 | 127;
                    header.writeBigUInt64BE(BigInt(len), 2);
                }

                // Mask payload
                const maskedPayload = Buffer.alloc(len);
                for (let i = 0; i < len; i++) {
                    maskedPayload[i] = payload[i] ^ maskKey[i % 4];
                }

                socket.write(Buffer.concat([header, maskKey, maskedPayload]));
            }

            // 1. Send speech.config
            const configMsg = `X-Timestamp:${new Date().toISOString()}\r\nContent-Type:application/json; charset=utf-8\r\nPath:speech.config\r\n\r\n{"context":{"synthesis":{"audio":{"metadataoptions":{"sentenceBoundaryEnabled":"false","wordBoundaryEnabled":"false"},"outputFormat":"audio-24khz-48kbitrate-mono-mp3"}}}}`;
            sendFrame(configMsg);

            // 2. Send SSML
            const reqId = crypto.randomUUID().replace(/-/g, '');
            const ssml = `<speak version='1.0' xmlns='http://www.w3.org/2001/10/synthesis' xml:lang='it-IT'><voice name='${voice}'><prosody pitch='+0Hz' rate='+0%'>${text}</prosody></voice></speak>`;
            const ssmlMsg = `X-RequestId:${reqId}\r\nContent-Type:application/ssml+xml\r\nX-Timestamp:${new Date().toISOString()}\r\nPath:ssml\r\n\r\n${ssml}`;
            sendFrame(ssmlMsg);

            // Buffer processing
            let buffer = Buffer.alloc(0);

            socket.on('data', (chunk) => {
                buffer = Buffer.concat([buffer, chunk]);

                while (buffer.length >= 2) {
                    const firstByte = buffer[0];
                    const opcode = firstByte & 0x0f;
                    const secondByte = buffer[1];
                    const masked = (secondByte & 0x80) !== 0;
                    let payloadLen = secondByte & 0x7f;
                    let offset = 2;

                    if (payloadLen === 126) {
                        if (buffer.length < offset + 2) break;
                        payloadLen = buffer.readUInt16BE(offset);
                        offset += 2;
                    } else if (payloadLen === 127) {
                        if (buffer.length < offset + 8) break;
                        payloadLen = Number(buffer.readBigUInt64BE(offset));
                        offset += 8;
                    }

                    if (masked) {
                        if (buffer.length < offset + 4) break;
                        offset += 4;
                    }

                    if (buffer.length < offset + payloadLen) break; // Incomplete frame

                    let framePayload = buffer.subarray(offset, offset + payloadLen);
                    buffer = buffer.subarray(offset + payloadLen);

                    if (opcode === 0x01) {
                        // Text frame
                        const textContent = framePayload.toString('utf8');
                        if (textContent.includes('Path:turn.end')) {
                            socket.end();
                            const finalMp3 = Buffer.concat(audioChunks);
                            if (outputPath) fs.writeFileSync(outputPath, finalMp3);
                            return resolve(finalMp3);
                        }
                    } else if (opcode === 0x02) {
                        // Binary audio frame
                        // The frame starts with 2 bytes header length (BigEndian)
                        if (framePayload.length > 2) {
                            const headerLength = framePayload.readUInt16BE(0);
                            const audioData = framePayload.subarray(2 + headerLength);
                            if (audioData.length > 0) {
                                audioChunks.push(audioData);
                            }
                        }
                    } else if (opcode === 0x08) {
                        // Close frame
                        socket.end();
                        const finalMp3 = Buffer.concat(audioChunks);
                        if (outputPath) fs.writeFileSync(outputPath, finalMp3);
                        return resolve(finalMp3);
                    }
                }
            });

            socket.on('error', (err) => reject(err));
            socket.on('end', () => {
                if (audioChunks.length > 0) {
                    const finalMp3 = Buffer.concat(audioChunks);
                    if (outputPath) fs.writeFileSync(outputPath, finalMp3);
                    resolve(finalMp3);
                }
            });
        });

        req.on('error', (err) => reject(err));
        req.end();
    });
}

async function run() {
    const text = "Andrea, il tuo profilo rivela la forza di un Pioniere e la saggezza di una Guida. Guidato dal Percorso 6 con radice maestra 33, hai una naturale vocazione a creare armonia e lasciare un impatto positivo. L'Espressione 5 ti dona rapido intuito e versatilità, mentre l'Anima 8 spinge verso traguardi concreti e autorevoli. La tua sfida evolutiva è bilanciare la sete di libertà con la responsabilità, trasformando la scintilla delle tue idee in progetti solidi al servizio della comunità.";
    console.log('Generating audio with Microsoft Edge Neural TTS (it-IT-DiegoNeural)...');
    try {
        const mp3Buffer = await synthesizeEdgeTTS(text, 'it-IT-DiegoNeural', 'public/audio_diego.mp3');
        console.log(`SUCCESS! Generated ${mp3Buffer.length} bytes of pristine audio in public/audio_diego.mp3!`);
    } catch (e) {
        console.error('Error synthesizing:', e);
    }
}

run();
