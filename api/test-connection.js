export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method not allowed' } });
    }

    const { apiKey = process.env.TOKENROUTER_API_KEY, model = process.env.TOKENROUTER_MODEL || 'qwen/qwen3.6-27b' } = req.body || {};
    let baseUrl = req.body?.baseUrl || process.env.TOKENROUTER_BASE_URL || 'https://api.groq.com/openai/v1';
    baseUrl = baseUrl.replace(/\/+$/, '');

    if (!apiKey) {
        return res.status(400).json({ success: false, error: { message: 'Chiave API non inserita.' } });
    }

    try {
        const response = await fetch(`${baseUrl}/chat/completions`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://matrice.vercel.app',
                'X-Title': 'Destiny Matrix AI'
            },
            body: JSON.stringify({
                model: model,
                messages: [{ role: 'user', content: 'Ping' }],
                max_tokens: 15
            })
        });

        const respText = await response.text();
        let parsed;
        try {
            parsed = JSON.parse(respText);
        } catch (e) {
            parsed = { message: respText };
        }

        if (!response.ok) {
            return res.status(response.status).json({ success: false, error: parsed });
        }

        const content = parsed.choices?.[0]?.message?.content || 'Connessione attiva e funzionante!';
        return res.json({ success: true, message: content, model: model });
    } catch (err) {
        return res.status(500).json({ success: false, error: { message: err.message } });
    }
}
