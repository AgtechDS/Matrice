const fs = require('fs');
const prompt = fs.readFileSync('prompt2analisi.md', 'utf8');

async function testNoReasoning() {
    console.log('Testing with reasoning_effort: "none"...');
    try {
        const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_LLM_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'qwen/qwen3.6-27b',
                reasoning_effort: 'none',
                messages: [
                    {
                        role: 'system',
                        content: prompt + "\n\nIMPORTANTE:\n- Rispondi ESCLUSIVAMENTE in lingua ITALIANA.\n- Genera integralmente e senza omissioni tutte e 14 le sezioni numerate da ## 1 a ## 14."
                    },
                    {
                        role: 'user',
                        content: "Ecco i miei dati:\n- Nome: Andrea Giuliano\n- Data: 28/11/1992\n- Ora: 12:45\n- Luogo: Catania, Italia\n- Tipo: 2. Numerologica + Astrologica simbolica\n\nConfermo tutti i dati inseriti. Genera ora il report completo strutturato a 14 sezioni in lingua italiana."
                    }
                ],
                temperature: 0.5,
                max_tokens: 3500
            })
        });

        console.log('HTTP Status:', res.status);
        const text = await res.text();
        if (!res.ok) {
            console.log('Error Body:', text);
            return;
        }
        const data = JSON.parse(text);
        const content = data.choices?.[0]?.message?.content || '';
        console.log('Finish Reason:', data.choices?.[0]?.finish_reason);
        console.log('Usage:', data.usage);
        console.log('Total Output Characters:', content.length);
        console.log('\n--- FIRST 1000 CHARACTERS ---');
        console.log(content.slice(0, 1000));
        console.log('\n--- LAST 1000 CHARACTERS ---');
        console.log(content.slice(-1000));

        fs.writeFileSync('risposta.md', content, 'utf8');
        console.log('\nSaved full report to risposta.md!');
    } catch(e) {
        console.error('Exception:', e);
    }
}

// Wait 10 seconds for rate limit window to clear then test
console.log('Waiting 12 seconds for Groq rate limit window...');
setTimeout(testNoReasoning, 12000);
