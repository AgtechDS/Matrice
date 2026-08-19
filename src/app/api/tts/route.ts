import { NextRequest, NextResponse } from 'next/server';

function createWavBuffer(pcmBuffer: Buffer, sampleRate = 24000): Buffer {
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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    const { text, voice = 'Aoede' } = body;
    const apiKey = body.apiKey || process.env.GEMINI_TTS_API_KEY;

    if (!text) {
      return NextResponse.json({ error: { message: 'Il testo è obbligatorio' } }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json(
        { error: { message: 'Chiave API Google AI Studio non configurata.' }, needsKey: true },
        { status: 400 }
      );
    }

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

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      }
    );

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      return NextResponse.json({ error: err }, { status: response.status });
    }

    const data = await response.json();
    const part = data.candidates?.[0]?.content?.parts?.[0];

    if (!part?.inlineData?.data) {
      return NextResponse.json({ error: { message: 'Nessun flusso audio generato da Gemini.' } }, { status: 500 });
    }

    const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
    const wavAudioBuffer = createWavBuffer(pcmBuffer, 24000);

    return new NextResponse(wavAudioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/wav',
        'Cache-Control': 'public, max-age=86400, s-maxage=86400'
      }
    });
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
