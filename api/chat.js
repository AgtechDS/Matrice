export const config = {
    runtime: 'edge'
};

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405 });
    }

    try {
        const body = await req.json();
        const { messages, stream = true, temperature = 0.6, apiKey = process.env.LLMAPI_KEY || process.env.TOKENROUTER_API_KEY, model = process.env.LLM_MODEL || process.env.TOKENROUTER_MODEL || 'deepseek-v4-flash-0731' } = body;
        let baseUrl = body.baseUrl || process.env.LLM_BASE_URL || process.env.TOKENROUTER_BASE_URL || 'https://api.llmapi.ai/v1';
        baseUrl = baseUrl.replace(/\/+$/, '');

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: { message: 'Messages array is required' } }), { status: 400 });
        }

        if (!apiKey) {
            return new Response(JSON.stringify({ error: { message: 'Nessuna API Key configurata.' } }), { status: 401 });
        }

        let maxTokens = 3800;
        if (baseUrl.includes('openrouter.ai') || baseUrl.includes('tokenrouter.com') || baseUrl.includes('llmapi.ai')) {
            maxTokens = 6000;
        }

        let finalMessages = [...messages];
        if (!finalMessages.some(m => m.role === 'system')) {
            const sysPrompt = `Sei un consulente esperto e rigoroso in numerologia simbolica e archetipica. Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA. NON mostrare MAI passaggi di calcolo aperti, conteggi di lettere o bozze. Genera DIRETTAMENTE il report strutturato a 14 sezioni partendo da "## 1. Sintesi iniziale" fino a "## 14. Sintesi Finale".`;
            finalMessages.unshift({ role: 'system', content: sysPrompt });
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
            return new Response(errText, { status: upstreamRes.status, headers: { 'Content-Type': 'application/json' } });
        }

        if (stream) {
            return new Response(upstreamRes.body, {
                status: 200,
                headers: {
                    'Content-Type': 'text/event-stream; charset=utf-8',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive'
                }
            });
        } else {
            const data = await upstreamRes.json();
            return new Response(JSON.stringify(data), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (e) {
        return new Response(JSON.stringify({ error: { message: e.message } }), { status: 500 });
    }
}
