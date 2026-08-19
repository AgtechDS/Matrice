async function checkModels() {
    const models = ['qwen/qwen3.6-27b', 'openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'groq/compound', 'groq/compound-mini', 'allam-2-7b'];
    for (const m of models) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_LLM_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: m,
                    messages: [{role: 'user', content: 'Rispondi: OK.'}],
                    max_tokens: 20
                })
            });
            const text = await res.text();
            console.log(`Model: ${m} -> Status: ${res.status}`);
            if (!res.ok) console.log('  Error:', text.slice(0, 120));
        } catch(e) {
            console.log(`Model: ${m} -> Exception:`, e.message);
        }
    }
}
checkModels();
