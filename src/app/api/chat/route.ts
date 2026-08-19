import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      messages,
      stream = true,
      temperature = 0.6,
      apiKey = process.env.TOKENROUTER_API_KEY,
      model = process.env.TOKENROUTER_MODEL || 'qwen/qwen3.6-27b'
    } = body;

    let baseUrl = body.baseUrl || process.env.TOKENROUTER_BASE_URL || 'https://api.groq.com/openai/v1';
    baseUrl = baseUrl.replace(/\/+$/, '');

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json({ error: { message: 'Array di messaggi obbligatorio' } }, { status: 400 });
    }

    if (!apiKey) {
      return NextResponse.json({ error: { message: 'Nessuna API Key configurata.' } }, { status: 401 });
    }

    const payload: any = {
      model,
      messages,
      temperature,
      stream,
      max_tokens: 3800
    };

    if (baseUrl.includes('groq.com') || model.includes('qwen') || model.includes('gpt-oss')) {
      payload.reasoning_effort = 'none';
    }

    const upstreamRes = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://matrice.vercel.app',
        'X-Title': 'Destiny Matrix AI'
      },
      body: JSON.stringify(payload)
    });

    if (!upstreamRes.ok) {
      const errText = await upstreamRes.text();
      return new NextResponse(errText, {
        status: upstreamRes.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (stream) {
      return new NextResponse(upstreamRes.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/event-stream; charset=utf-8',
          'Cache-Control': 'no-cache, no-transform',
          'Connection': 'keep-alive'
        }
      });
    } else {
      const data = await upstreamRes.json();
      return NextResponse.json(data);
    }
  } catch (err: any) {
    return NextResponse.json({ error: { message: err.message } }, { status: 500 });
  }
}
