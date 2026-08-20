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
        let activeApiKey = apiKey || process.env.LLMAPI_KEY || process.env.TOKENROUTER_API_KEY || '';
        let activeModel = model;
        let activeBaseUrl = baseUrl;

        if (activeApiKey.startsWith('gsk_')) {
            activeBaseUrl = 'https://api.groq.com/openai/v1';
            if (activeModel === 'deepseek-v4-flash-0731') {
                activeModel = 'qwen/qwen3.6-27b';
            }
        }

        if (!messages || !Array.isArray(messages)) {
            return new Response(JSON.stringify({ error: { message: 'Messages array is required' } }), { status: 400 });
        }

        if (!activeApiKey) {
            return new Response(JSON.stringify({ error: { message: 'Nessuna API Key configurata.' } }), { status: 401 });
        }

        // Generous token budget to guarantee all 14 sections are generated completely without truncation
        let maxTokens = 8192;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentDateStr = now.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

        let finalMessages = [...messages];
        if (!finalMessages.some(m => m.role === 'system')) {
            const sysPrompt = `Sei l'Oracolo Supremo della Matrice del Destino e degli Archetipi Numerologici. 
Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA. 
🔴 ANNO E DATA CORRENTE: Oggi è il ${currentDateStr} e l'ANNO SOLARE CORRENTE È IL ${currentYear} (riduzione numerologica: 2+0+2+6 = 10 -> 1).
Per la Sezione 9 (Anni Personali), Sezione 10 (Mesi Personali) e Sezione 11 (Giorni Personali), DEVI TASSATIVAMENTE calcolare l'Anno Personale per l'anno corrente ${currentYear} (e la proiezione a 10 anni dal ${currentYear} al ${currentYear + 10}). 
NON usare MAI anni obsoleti passati come 2024 o 2023.
DEVI GENERARE L'INTERO REPORT COMPLETO A 14 SEZIONI SENZA INTERROMPERTI O TRONCARE IL TESTO.
Procedi sequenzialmente punto per punto da "## 1. Sintesi iniziale" fino a "## 14. Sintesi Finale & Disclaimer di Consapevolezza".
Sii esaustivo, profondo ed eloquente in ciascuna sezione, mantenendo uno stile archetipico solenne e trasformativo.`;
            finalMessages.unshift({ role: 'system', content: sysPrompt });
        }

        const payload = {
            model: activeModel,
            messages: finalMessages,
            temperature: temperature,
            stream: stream,
            max_tokens: maxTokens
        };

        if (activeBaseUrl.includes('groq.com') || activeModel.includes('qwen') || activeModel.includes('gpt-oss') || activeModel.includes('deepseek')) {
            payload.reasoning_effort = 'none';
        }

        const upstreamRes = await fetch(`${activeBaseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${activeApiKey}`,
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
