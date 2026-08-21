export const config = {
    runtime: 'edge'
};

function formatSSE(content) {
    const chunk = {
        id: 'chatcmpl-' + Math.random().toString(36).substring(2),
        object: 'chat.completion.chunk',
        created: Date.now(),
        model: 'deepseek-v4-flash',
        choices: [{
            index: 0,
            delta: { content: content },
            finish_reason: null
        }]
    };
    return `data: ${JSON.stringify(chunk)}\n\n`;
}

const ARCANA_DATA = {
    1: { name: "Il Mago", archetype: "L'Iniziatore / Creatore", keywords: "Forza di volontà, potenziale, leadership, azione" },
    2: { name: "La Papessa", archetype: "La Guida Intuitiva / Custode dei Misteri", keywords: "Intuizione profonda, saggezza silenziosa, diplomazia" },
    3: { name: "L'Imperatrice", archetype: "La Madre / Bellezza e Abbondanza", keywords: "Fecondità, creatività, prosperità materiale" },
    4: { name: "L'Imperatore", archetype: "Il Sovrano / Ordine e Struttura", keywords: "Autorità, disciplina, leadership solida, stabilità" },
    5: { name: "Il Papa / Lo Ierofante", archetype: "Il Maestro / Tradizione e Conoscenza", keywords: "Insegnamento, etica, valori spirituali, verità" },
    6: { name: "Gli Amanti", archetype: "Il Connettore / Scelta del Cuore", keywords: "Amore, relazioni, empatia, senso estetico, armonia" },
    7: { name: "Il Carro", archetype: "Il Conquistatore / Determinazione", keywords: "Vittoria, direzione chiara, superamento ostacoli" },
    8: { name: "La Giustizia", archetype: "L'Equilibratore / Causa-Effetto", keywords: "Equilibrio karmico, verità, onestà, chiarezza" },
    9: { name: "L'Eremita", archetype: "Il Saggio Solitario / Ricerca Interiore", keywords: "Introspezione, profondità, saggezza maturata" },
    10: { name: "La Ruota della Fortuna", archetype: "Il Flusso del Destino / Sincronicità", keywords: "Fortuna, ciclicità, opportunità inattese" },
    11: { name: "La Forza", archetype: "Il Guerriero Gentile / Energia Vitale", keywords: "Resistenza, padronanza istintiva, vigore interiore" },
    12: { name: "L'Appeso", archetype: "Il Mistico Servitore / Visione Alternativa", keywords: "Prospettiva ribaltata, altruismo, compassione" },
    13: { name: "La Trasformazione (Morte)", archetype: "Il Rinnovatore / Rinascita", keywords: "Chiusura cicli, rinnovamento radicale, metamorfosi" },
    14: { name: "La Temperanza", archetype: "L'Alchimista / Guarigione e Misura", keywords: "Armonia, moderazione, arte della sintesi, pazienza" },
    15: { name: "Il Diavolo", archetype: "Il Magnetico / Potere e Ombra", keywords: "Carisma, energia materiale, liberazione dai condizionamenti" },
    16: { name: "La Torre", archetype: "Il Risvegliatore / Crollo dei Dogmi", keywords: "Rivelazione improvvisa, abbattimento illusioni" },
    17: { name: "La Stella", archetype: "La Musa Ispiratrice / Speranza e Talento", keywords: "Fama, ispirazione artistica, fede nel futuro, purezza" },
    18: { name: "La Luna", archetype: "Il Sognatore / Inconscio e Immaginazione", keywords: "Mistero, chiaroveggenza, sensibilità profonda" },
    19: { name: "Il Sole", archetype: "L'Illuminatore / Gioia e Successo", keywords: "Vitalità, generosità, abbondanza, radiazione positiva" },
    20: { name: "Il Giudizio", archetype: "La Voce Ancestrale / Chiamata di Vocazione", keywords: "Risveglio karmico, legami ancestrali, rinascita" },
    21: { name: "Il Mondo", archetype: "Il Cosmopolita / Realizzazione Totale", keywords: "Completezza, confini aperti, successo globale, pace" },
    22: { name: "Il Matto", archetype: "Il Viaggiatore Libero / Fiducia Assoluta", keywords: "Libertà, spontaneità, inizio del viaggio, gioia pura" }
};

const LETTER_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
    'À': 1, 'È': 5, 'É': 5, 'Ì': 9, 'Ò': 6, 'Ù': 3
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y', 'À', 'È', 'É', 'Ì', 'Ò', 'Ù']);

function reduceTo22(n) {
    if (n <= 0) return 22;
    while (n > 22) {
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
}

function reduceToDigit(n, keepMaster = true) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
    while (n > 9) {
        if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
}

function extractUserDataFromMessages(messages) {
    let name = 'Elena Solaris';
    let date = '1995-07-21';
    let time = 'non specificato';
    let place = 'Italia';
    let type = '2. Numerologica + Astrologica simbolica';

    if (!Array.isArray(messages)) return { name, date, time, place, type };

    const fullText = messages.map(m => m.content || '').join('\n');

    const nameMatch = fullText.match(/(?:Nome(?:\s+completo)?|Nome\s*e\s*Cognome|Mi chiamo|Nome\s*:)\s*[:=]?\s*([A-Za-zÀ-ÿ\s'-]{2,60})/i);
    if (nameMatch && nameMatch[1]) {
        name = nameMatch[1].trim().split('\n')[0].replace(/(?:Data.*|Orario.*|Città.*|Tipo.*|Anno.*)/i, '').trim();
    }

    const dateMatch = fullText.match(/(?:Data(?:\s+di\s+nascita)?|Nato il|Nata il)\s*[:=]?\s*(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/i) 
                   || fullText.match(/(\d{4}[-/.]\d{1,2}[-/.]\d{1,2}|\d{1,2}[-/.]\d{1,2}[-/.]\d{4})/);
    if (dateMatch && dateMatch[1]) {
        date = dateMatch[1].trim();
    }

    const timeMatch = fullText.match(/(?:Orario(?:\s+di\s+nascita)?|Ora|Ore)\s*[:=]?\s*([0-9]{1,2}[:.][0-9]{2}|non\s+disponibile|non\s+specificato)/i);
    if (timeMatch && timeMatch[1]) {
        time = timeMatch[1].trim();
    }

    const placeMatch = fullText.match(/(?:Città(?:\s+e\s+nazione)?|Luogo(?:\s+di\s+nascita)?|Nato a|Nata a)\s*[:=]?\s*([A-Za-zÀ-ÿ\s,.'-]{2,50})/i);
    if (placeMatch && placeMatch[1]) {
        place = placeMatch[1].trim().split('\n')[0].replace(/(?:Tipo.*|Anno.*|Orario.*)/i, '').trim();
    }

    const typeMatch = fullText.match(/(?:Tipo(?:\s+di\s+analisi(?:\s+scelta)?)?)\s*[:=]?\s*([^\n]+)/i);
    if (typeMatch && typeMatch[1]) {
        type = typeMatch[1].trim();
    }

    return { name, date, time, place, type };
}

function calculateCompleteMatrixData(fullName, birthDateStr) {
    const cleanName = (fullName || 'Utente').toUpperCase().trim();
    
    let totalNameSum = 0;
    let vowelSum = 0;
    let consonantSum = 0;
    const letterCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    
    for (const ch of cleanName.replace(/[^A-ZÀÈÉÌÒÙ]/g, '')) {
        const val = LETTER_VALUES[ch] || 0;
        if (val > 0) {
            letterCounts[val] = (letterCounts[val] || 0) + 1;
            totalNameSum += val;
            if (VOWELS.has(ch)) {
                vowelSum += val;
            } else {
                consonantSum += val;
            }
        }
    }

    const soulNumber = reduceToDigit(vowelSum || 11, true);
    const personalityNumber = reduceToDigit(consonantSum || 7, true);
    const expressionNumber = reduceToDigit(totalNameSum || 9, true);

    let day = 17, month = 8, year = 1986;
    if (birthDateStr) {
        const parts = birthDateStr.split(/[-/.]/);
        if (parts.length === 3) {
            if (parts[0].length === 4) {
                year = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                day = parseInt(parts[2], 10);
            } else {
                day = parseInt(parts[0], 10);
                month = parseInt(parts[1], 10);
                year = parseInt(parts[2], 10);
            }
        }
    }

    const dayReduced = reduceToDigit(day, false);
    const monthReduced = reduceToDigit(month, false);
    const yearDigitsSum = String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const yearReduced = reduceToDigit(yearDigitsSum, false);
    const lifePath = reduceToDigit(dayReduced + monthReduced + yearReduced, true);

    const nodeA = reduceTo22(day);
    const nodeB = reduceTo22(month);
    const nodeC = reduceTo22(yearDigitsSum);
    const nodeD = reduceTo22(nodeA + nodeB + nodeC);
    const nodeE = reduceTo22(nodeA + nodeB + nodeC + nodeD);

    const nodeMoney = reduceTo22(nodeC + nodeE);
    const nodeLove = reduceTo22(nodeD + nodeE);

    const dateDigits = `${day}${month}${year}`.split('');
    const grid3x3 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (const d of dateDigits) {
        const val = parseInt(d, 10);
        if (val >= 1 && val <= 9) grid3x3[val] = (grid3x3[val] || 0) + 1;
    }

    return {
        name: fullName,
        day, month, year,
        formatted: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        lifePath,
        soulNumber,
        personalityNumber,
        expressionNumber,
        maturityNumber: reduceToDigit(lifePath + expressionNumber, true),
        nodeA, nodeB, nodeC, nodeD, nodeE, nodeMoney, nodeLove,
        arcA: ARCANA_DATA[nodeA] || ARCANA_DATA[1],
        arcB: ARCANA_DATA[nodeB] || ARCANA_DATA[1],
        arcC: ARCANA_DATA[nodeC] || ARCANA_DATA[1],
        arcD: ARCANA_DATA[nodeD] || ARCANA_DATA[1],
        arcE: ARCANA_DATA[nodeE] || ARCANA_DATA[1],
        arcMoney: ARCANA_DATA[nodeMoney] || ARCANA_DATA[1],
        arcLove: ARCANA_DATA[nodeLove] || ARCANA_DATA[1],
        letterCounts,
        grid3x3
    };
}

function generateDynamicReport(userData) {
    const calc = calculateCompleteMatrixData(userData.name, userData.date);
    const currentYear = new Date().getFullYear();
    
    let personalYearsList = '';
    for (let i = 0; i < 11; i++) {
        const y = currentYear + i;
        const yearSum = String(y).split('').reduce((s, d) => s + parseInt(d, 10), 0);
        const pYear = reduceToDigit(reduceToDigit(calc.day, false) + reduceToDigit(calc.month, false) + reduceToDigit(yearSum, false), false);
        const arc = ARCANA_DATA[pYear] || ARCANA_DATA[1];
        personalYearsList += `* **Anno ${y} (Anno Personale ${pYear}):** Arcano ${pYear} (${arc.name}) — ${arc.keywords}.\n`;
    }

    const domLetters = Object.entries(calc.letterCounts).filter(([_, c]) => c >= 2).map(([n, c]) => `Numero ${n} (${c} presenze)`).join(', ') || 'Distribuzione armonica';
    const missingLetters = Object.entries(calc.letterCounts).filter(([_, c]) => c === 0).map(([n]) => `Numero ${n}`).join(', ') || 'Nessuna carenza karmica marcata';

    return `# Report Completo di Analisi Numerologica & Matrice del Destino

> **Disclaimer Etico (Art. 50 EU AI Act):** Questa analisi si basa sui principi simbolici dei 22 Arcani Maggiori e della numerologia pitagorica. Rappresenta uno strumento di riflessione e autoconsapevolezza e non ha natura deterministica o diagnostica.

---

## 1. Sintesi Iniziale
* **Soggetto:** ${calc.name}
* **Data di Nascita:** ${calc.formatted} (Ore: ${userData.time}, Luogo: ${userData.place})
* **Tipo di Analisi:** ${userData.type}
* **Anno Solare di Riferimento:** ${currentYear}
* **Configurazione Energetica:** Potente allineamento tra la frequenza spirituale (Arcano ${calc.nodeA} - ${calc.arcA.name}) e la manifestazione materiale (Arcano ${calc.nodeC} - ${calc.arcC.name}).
* **Archetipi Fondamentali:** Arcano ${calc.nodeE} (${calc.arcE.name} - Centro/Cuore) e Arcano ${calc.nodeA} (${calc.arcA.name} - Spirito/Risorse).

---

## 2. Analisi del Nome & Frequenze Lettere
* **Nome Completo:** ${calc.name}
* **Numero dell'Espressività (Destino):** **${calc.expressionNumber}** — Sintesi delle abilità innate e della modalità di realizzazione nel mondo.
* **Numero dell'Anima (Vocali):** **${calc.soulNumber}** — I desideri intimi del cuore, le spinte motivazionali e i valori spirituali interiori.
* **Numero della Personalità (Consonanti):** **${calc.personalityNumber}** — L'immagine esteriore, la reputazione e il modo di relazionarsi in società.
* **Numero della Maturità:** **${calc.maturityNumber}** — L'archetipo di piena fioritura che si consolida nella seconda metà della vita.
* **Numero dell'Equilibrio:** **${reduceToDigit(calc.day, false)}** — La risorsa centrale per ristabilire stabilità emotiva e chiarezza nei momenti di sfida.

---

## 3. Frequenza delle Lettere & Lezioni Karmiche
* **Numeri Dominanti nel Nome:** ${domLetters}.
* **Lezioni Karmiche (Numeri da integrare):** ${missingLetters}.
* **Frequenza Cifre (1-9):**
${Object.entries(calc.letterCounts).map(([num, count]) => `  - Cifra ${num}: ${count} ${count === 1 ? 'lettera' : 'lettere'}`).join('\n')}

---

## 4. Analisi della Data di Nascita & Percorso di Vita
* **Percorso di Vita (Life Path):** **${calc.lifePath}** — Il cammino evolutivo primario che struttura le esperienze dell'esistenza.
* **Giorno di Nascita (Risorse Interiori):** ${calc.day} ➔ Arcano **${calc.nodeA} (${calc.arcA.name})** — ${calc.arcA.keywords}.
* **Mese di Nascita (Intuizione & Anima):** ${calc.month} ➔ Arcano **${calc.nodeB} (${calc.arcB.name})** — ${calc.arcB.keywords}.
* **Anno di Nascita (Materia & Risultati):** ${calc.year} ➔ Arcano **${calc.nodeC} (${calc.arcC.name})** — ${calc.arcC.keywords}.
* **Coda Karmica (Punto Basso - Sfide Radicate):** Arcano **${calc.nodeD} (${calc.arcD.name})** — ${calc.arcD.keywords}.

---

## 5. Matrice Numerologica (Griglia 3×3 Pitagorica)
* **Piano Mentale (3-6-9):** Presenze [3: ${calc.grid3x3[3] || 0}, 6: ${calc.grid3x3[6] || 0}, 9: ${calc.grid3x3[9] || 0}] — Capacità di elaborazione analitica, creatività e sintesi concettuale.
* **Piano Emotivo (2-5-8):** Presenze [2: ${calc.grid3x3[2] || 0}, 5: ${calc.grid3x3[5] || 0}, 8: ${calc.grid3x3[8] || 0}] — Empatia, intelligenza relazionale profonda e discernimento.
* **Piano Fisico / Pratico (1-4-7):** Presenze [1: ${calc.grid3x3[1] || 0}, 4: ${calc.grid3x3[4] || 0}, 7: ${calc.grid3x3[7] || 0}] — Radicamento, determinazione operativa e concretizzazione dei progetti.

---

## 6. Cicli della Vita
* **Primo Ciclo (Formazione, 0-28 anni):** Retto dall'energia dell'Arcano **${calc.nodeB} (${calc.arcB.name})** — Periodo di scoperta del sé interiore e assimilazione degli insegnamenti familiari.
* **Secondo Ciclo (Maturità, 29-56 anni):** Retto dall'energia dell'Arcano **${calc.nodeA} (${calc.arcA.name})** — Periodo di massima espansione professionale, autonomia e autorevolezza.
* **Terzo Ciclo (Saggezza, 57+ anni):** Retto dall'energia dell'Arcano **${calc.nodeC} (${calc.arcC.name})** — Periodo di sintesi, maestria e trasmissione della conoscenza.

---

## 7. I Quattro Pinnacoli
1. **Primo Pinnacolo (Fondamenta):** Numero **${reduceToDigit(calc.day + calc.month, false)}** — Consolidamento dell'autonomia personale e prime scelte di vita.
2. **Secondo Pinnacolo (Espansione):** Numero **${reduceToDigit(calc.day + calc.year, false)}** — Assunzione di responsabilità e fioritura delle capacità pratiche.
3. **Terzo Pinnacolo (Maturità):** Numero **${reduceToDigit(reduceToDigit(calc.day + calc.month, false) + reduceToDigit(calc.day + calc.year, false), false)}** — Consolidamento del proprio ruolo sociale ed equilibrio.
4. **Quarto Pinnacolo (Maestria):** Numero **${reduceToDigit(calc.month + calc.year, false)}** — Realizzazione spirituale, serenità interiore e guida per gli altri.

---

## 8. Le Sfide Evolutive
* **Sfida Primaria:** Superare l'auto-esigenza severa, valorizzando il flusso naturale degli eventi senza rigidità.
* **Sfida Secondaria:** Armonizzare l'ambizione materiale con la cura e l'ascolto dei bisogni interiori autentici.
* **Sfida Principale di Sintesi:** Mantenere salda la fede nelle proprie capacità uniche anche nei momenti di transizione.

---

## 9. Anni Personali (${currentYear} - ${currentYear + 10})
${personalYearsList}

---

## 10. Mesi Personali & 11. Giorni Personali
* **Quadro dei Mesi per il ${currentYear}:** L'anno in corso ti invita a pianificare con fermezza nella prima parte dell'anno, raccogliendo i risultati concreti del tuo impegno nei mesi autunnali.
* **Guida ai Giorni Personali:** Sfrutta i giorni a vibrazione ${calc.nodeA} e ${calc.nodeE} per decisioni strategiche, accordi finanziari e chiarimenti relazionali.

---

## 12. Metadata Simbolici & Profilo di Sistema
* **Core Energetico:** Arcano **${calc.nodeE} (${calc.arcE.name})** — Il punto di massimo equilibrio e comfort zone.
* **Driver Primario:** Arcano **${calc.nodeA} (${calc.arcA.name})** — La spinta motivazionale che orienta le tue scelte.
* **Canale Finanziario & Sblocco:** Arcano **${calc.nodeMoney} (${calc.arcMoney.name})** — ${calc.arcMoney.keywords}.
* **Canale Relazionale & Amore:** Arcano **${calc.nodeLove} (${calc.arcLove.name})** — ${calc.arcLove.keywords}.

---

## 13. Archetipi Dominanti
* **Archetipo Guida:** *${calc.arcE.archetype} (Arcano ${calc.nodeE})* — Il fulcro della tua saggezza naturale.
* **Archetipo Operativo:** *${calc.arcA.archetype} (Arcano ${calc.nodeA})* — La capacità trasformativa di incidere sulla realtà.

---

## 14. Sintesi Finale & Disclaimer di Consapevolezza
Gentile **${calc.name}**, la tua Matrice del Destino evidenzia un potenziale eccezionale di leadership etica, chiarezza intuitiva e realizzazione concreta. Riconosci il valore del tuo cammino unico, accogli ogni sfida come un'opportunità di crescita e ricorda che ogni archetipo è una bussola per illuminare la tua libera volontà.`;
}

export default async function handler(req) {
    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: { message: 'Method not allowed' } }), { status: 405 });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const PRIMARY_LLMAPI_KEY = 'llmapi_17acd03b348ba3984473006be0ab0ccac001b934f826ade8b26edbc23125cdf5';
        let activeApiKey = PRIMARY_LLMAPI_KEY;
        if (body.apiKey && body.apiKey.trim()) {
            activeApiKey = body.apiKey.trim();
        } else if (process.env.LLMAPI_KEY && !process.env.LLMAPI_KEY.startsWith('gsk_')) {
            activeApiKey = process.env.LLMAPI_KEY;
        }

        if (activeApiKey.startsWith('llmllmapi_')) {
            activeApiKey = activeApiKey.replace('llmllmapi_', 'llmapi_');
        }

        let activeBaseUrl = 'https://api.llmapi.ai/v1';
        let activeModel = 'deepseek-v4-flash-0731';

        const userData = extractUserDataFromMessages(messages);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentDateStr = now.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

        let finalMessages = Array.isArray(messages) ? [...messages] : [{ role: 'user', content: 'Calcola la mia mappa.' }];
        if (!finalMessages.some(m => m.role === 'system')) {
            const sysPrompt = `Sei l'Oracolo Supremo della Matrice del Destino e degli Archetipi Numerologici. 
Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA con tono profondo, solenne e rigoroso.
🔴 DATI REALI SOGGETTO: Nome: ${userData.name}, Data di Nascita: ${userData.date}, Ora: ${userData.time}, Luogo: ${userData.place}.
🔴 ANNO E DATA CORRENTE: Oggi è il ${currentDateStr} e l'anno solare di riferimento è il ${currentYear}.
DEVI GENERARE L'INTERO REPORT COMPLETO A 14 SEZIONI PER ${userData.name} SENZA INTERROMPERTI O TRONCARE IL TESTO.
Procedi punto per punto da "## 1. Sintesi iniziale" fino a "## 14. Sintesi Finale & Disclaimer di Consapevolezza" con dovizia di dettagli.`;
            finalMessages.unshift({ role: 'system', content: sysPrompt });
        }

        const payload = {
            model: activeModel,
            messages: finalMessages,
            temperature: temperature,
            stream: stream,
            max_tokens: 6000
        };

        if (activeApiKey) {
            try {
                let upstreamRes = await fetch(`${activeBaseUrl}/chat/completions`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${activeApiKey}`,
                        'Content-Type': 'application/json',
                        'HTTP-Referer': 'https://matrice.vercel.app',
                        'X-Title': 'Destiny Matrix AI'
                    },
                    body: JSON.stringify(payload)
                });

                if (upstreamRes.ok) {
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
                } else {
                    console.warn(`Upstream AI error (${upstreamRes.status}):`, await upstreamRes.text());
                }
            } catch (fetchErr) {
                console.warn("Upstream fetch error:", fetchErr.message);
            }
        }

        const personalizedReport = generateDynamicReport(userData);

        if (stream) {
            const encoder = new TextEncoder();
            const customStream = new ReadableStream({
                start(controller) {
                    const chunks = personalizedReport.match(/.{1,50}/gs) || [personalizedReport];
                    let i = 0;
                    const interval = setInterval(() => {
                        if (i < chunks.length) {
                            controller.enqueue(encoder.encode(formatSSE(chunks[i])));
                            i++;
                        } else {
                            controller.enqueue(encoder.encode('data: [DONE]\n\n'));
                            clearInterval(interval);
                            controller.close();
                        }
                    }, 15);
                }
            });

            return new Response(customStream, {
                status: 200,
                headers: {
                    'Content-Type': 'text/event-stream; charset=utf-8',
                    'Cache-Control': 'no-cache, no-transform',
                    'Connection': 'keep-alive'
                }
            });
        } else {
            return new Response(JSON.stringify({
                choices: [{ message: { role: 'assistant', content: personalizedReport } }]
            }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
    } catch (err) {
        return new Response(JSON.stringify({ error: { message: err.message } }), { status: 500 });
    }
}
