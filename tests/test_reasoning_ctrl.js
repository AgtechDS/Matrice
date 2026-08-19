async function testReasoningControls() {
    const payloads = [
        { name: 'reasoning_effort: low', body: { model: 'qwen/qwen3.6-27b', messages: [{role:'user', content:'Rispondi: Ciao'}], reasoning_effort: 'low', max_tokens: 100 } },
        { name: 'reasoning_effort: none', body: { model: 'qwen/qwen3.6-27b', messages: [{role:'user', content:'Rispondi: Ciao'}], reasoning_effort: 'none', max_tokens: 100 } },
        { name: 'reasoning_format: hidden', body: { model: 'qwen/qwen3.6-27b', messages: [{role:'user', content:'Rispondi: Ciao'}], reasoning_format: 'hidden', max_tokens: 100 } },
    ];

    for (const p of payloads) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_LLM_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(p.body)
            });
            const text = await res.text();
            console.log(`${p.name} -> Status ${res.status}`);
            if (res.ok) {
                const d = JSON.parse(text);
                console.log('  Usage:', d.usage);
                console.log('  Content:', d.choices[0].message.content);
            } else {
                console.log('  Error:', text);
            }
        } catch(e) {
            console.error(p.name, 'exception:', e.message);
        }
    }
}

testReasoningControls();
