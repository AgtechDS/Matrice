const fs = require('fs');
const prompt = fs.readFileSync('prompt2analisi.md', 'utf8');

async function test() {
    const payload = {
        model: 'qwen/qwen3.6-27b',
        messages: [
            {
                role: 'system',
                content: prompt + "\n\nREGOLE FONDAMENTALI DI OUTPUT:\n1. Lingua: Rigorosamente ed ESCLUSIVAMENTE in ITALIANO (anche per qualsiasi pensiero o riflessione interna).\n2. Ragionamento: Estremamente sintetico ed essenziale.\n3. Output finale: Genera TUTTE e 14 le sezioni complete (da ## 1 a ## 14) in un unico testo dettagliato, includendo la Sezione 12 (Metadata), Sezione 13 (Archetipi) e Sezione 14 (Sintesi e Disclaimer Finale)."
            },
            {
                role: 'user',
                content: "Ecco i miei dati:\n- Nome: Elena Solaris\n- Data di nascita: 21/07/1995\n- Orario: 10:30\n- Luogo: Firenze, Italia\n- Tipo di analisi: 2. Numerologica + Astrologica simbolica\n\nConfermo tutti i dati inseriti. Procedi con la stesura dell'intero report a 14 sezioni in italiano."
            }
        ],
        temperature: 0.5,
        max_tokens: 8192
    };

    console.log('Sending request to Groq with concise Italian reasoning instruction...');
    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer YOUR_LLM_API_KEY',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        const status = response.status;
        const text = await response.text();
        console.log('Status Code:', status);

        if (!response.ok) {
            console.error('Groq Error Body:', text);
            return;
        }

        const data = JSON.parse(text);
        let rawContent = data.choices[0].message.content;
        
        let cleanItalianReport = rawContent;
        if (cleanItalianReport.includes('</think>')) {
            cleanItalianReport = cleanItalianReport.split('</think>')[1].trim();
        }

        console.log('\n--- REPORT DETAILS ---');
        console.log('Finish reason:', data.choices[0].finish_reason);
        console.log('Total characters:', cleanItalianReport.length);
        
        // Save cleaned report
        fs.writeFileSync('risposta_strutturata_ita.md', cleanItalianReport, 'utf8');
        fs.writeFileSync('risposta.md', cleanItalianReport, 'utf8');
        console.log('\nReport saved to risposta_strutturata_ita.md and risposta.md');
    } catch (e) {
        console.error('Fetch Exception:', e);
    }
}

test();
