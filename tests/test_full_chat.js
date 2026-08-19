const fs = require('fs');
const prompt = fs.readFileSync('prompt2analisi.md', 'utf8');

async function testFullLocalChat() {
    console.log('Testing full report generation through http://127.0.0.1:3000/api/chat...');
    try {
        const res = await fetch('http://127.0.0.1:3000/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                messages: [
                    { role: 'system', content: prompt },
                    { role: 'user', content: "Ecco i miei dati:\n- Nome: Andrea Giuliano\n- Data di nascita: 28/11/1992\n- Orario: 12:45\n- Luogo: Catania, Italia\n- Tipo di analisi: 2. Numerologica + Astrologica simbolica\n\nConfermo tutti i dati inseriti. Procedi con la stesura dell'intero report a 14 sezioni in lingua italiana." }
                ],
                apiKey: 'YOUR_LLM_API_KEY',
                model: 'qwen/qwen3.6-27b',
                baseUrl: 'https://api.groq.com/openai/v1',
                stream: false
            })
        });

        console.log('HTTP Status:', res.status);
        const data = await res.json();
        if (!res.ok) {
            console.error('Error from server:', data);
            return;
        }

        const content = data.choices[0].message.content;
        console.log('\n--- REPORT DETAILS ---');
        console.log('Total characters:', content.length);
        console.log('Finish reason:', data.choices[0].finish_reason);
        console.log('\n--- PREVIEW OF FIRST 1000 CHARS ---');
        console.log(content.slice(0, 1000));
        console.log('\n--- PREVIEW OF LAST 800 CHARS ---');
        console.log(content.slice(-800));

        fs.writeFileSync('risposta.md', content, 'utf8');
        console.log('\nFull complete report written to risposta.md!');
    } catch(e) {
        console.error('Exception:', e);
    }
}

// Wait 10s for clean rate limit window
console.log('Waiting 10s before calling /api/chat...');
setTimeout(testFullLocalChat, 10000);
