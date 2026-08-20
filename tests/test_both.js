const fs = require('fs');
const prompt = fs.readFileSync('prompt2analisi.md', 'utf8');

async function testBoth() {
    const models = ['openai/gpt-oss-120b', 'qwen/qwen3.6-27b'];
    for (const m of models) {
        console.log(`\n========================================\nTESTING MODEL: ${m}\n========================================`);
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer YOUR_LLM_API_KEY',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: m,
                    messages: [
                        {
                            role: 'system',
                            content: prompt + "\n\nREGOLE MANDATORIE:\n1. Rispondi rigorosamente in lingua ITALIANA.\n2. Non dilungarti in pensieri interni in inglese.\n3. Genera tutte le 14 sezioni strutturate numerate da ## 1 a ## 14."
                        },
                        {
                            role: 'user',
                            content: "Ecco i miei dati confermati:\n- Nome: Elena Solaris\n- Data: 21/07/1995\n- Ora: 10:30\n- Luogo: Firenze\n- Tipo: 2. Numerologica + Astrologica simbolica\nGenera il report completo delle 14 sezioni in italiano."
                        }
                    ],
                    temperature: 0.5,
                    max_tokens: 5000
                })
            });
            console.log('HTTP Status:', res.status);
            const text = await res.text();
            if (!res.ok) {
                console.log('Error Body:', text);
                continue;
            }
            const data = JSON.parse(text);
            const content = data.choices[0].message.content;
            console.log('Finish Reason:', data.choices[0].finish_reason);
            console.log('Response Length (chars):', content.length);
            console.log('Usage:', data.usage);
            console.log('First 600 chars of output:\n', content.slice(0, 600));
            fs.writeFileSync(`report_${m.replace(/[^a-zA-Z0-9]/g, '_')}.md`, content, 'utf8');
        } catch(e) {
            console.error('Exception:', e);
        }
    }
}

testBoth();
