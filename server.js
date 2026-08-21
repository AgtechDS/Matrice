import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try { process.loadEnvFile?.(); } catch (e) {}

const PORT = process.env.PORT || 3000;
const DEFAULT_API_KEY = process.env.LLMAPI_KEY || process.env.TOKENROUTER_API_KEY || '';
const DEFAULT_MODEL = process.env.LLM_MODEL || process.env.TOKENROUTER_MODEL || 'deepseek-v4-flash-0731';
const DEFAULT_BASE_URL = process.env.LLM_BASE_URL || process.env.TOKENROUTER_BASE_URL || 'https://api.llmapi.ai/v1';
const GEMINI_TTS_KEY = process.env.GEMINI_TTS_API_KEY || '';

function getSystemPrompt() {
    try {
        const promptPath = path.join(__dirname, 'prompt2analisi.md');
        if (fs.existsSync(promptPath)) {
            return fs.readFileSync(promptPath, 'utf8');
        }
    } catch (e) {
        console.error('Error reading prompt2analisi.md:', e);
    }
    return "Sei un consulente specializzato in numerologia simbolica e archetipica.";
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

function createWavBuffer(pcmBuffer, sampleRate = 24000) {
    const dataLength = pcmBuffer.length;
    const header = Buffer.alloc(44);
    header.write('RIFF', 0);
    header.writeUInt32LE(36 + dataLength, 4);
    header.write('WAVE', 8);
    header.write('fmt ', 12);
    header.writeUInt32LE(16, 16);
    header.writeUInt16LE(1, 20); // PCM format
    header.writeUInt16LE(1, 22); // Mono
    header.writeUInt32LE(sampleRate, 24);
    header.writeUInt32LE(sampleRate * 2, 28);
    header.writeUInt16LE(2, 32);
    header.writeUInt16LE(16, 34); // 16-bit
    header.write('data', 36);
    header.writeUInt32LE(dataLength, 40);
    return Buffer.concat([header, pcmBuffer]);
}

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.wav': 'audio/wav',
    '.mp3': 'audio/mpeg',
    '.webp': 'image/webp',
    '.ico': 'image/x-icon'
};

async function parseBody(req) {
    return new Promise((resolve, reject) => {
        let body = '';
        req.on('data', chunk => { body += chunk; });
        req.on('end', () => {
            try {
                resolve(body ? JSON.parse(body) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', reject);
    });
}

const server = http.createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
    const pathname = parsedUrl.pathname;

    // API: /api/config
    if (pathname === '/api/config' && req.method === 'GET') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
            model: DEFAULT_MODEL,
            baseUrl: DEFAULT_BASE_URL,
            hasApiKey: Boolean(DEFAULT_API_KEY),
            geminiApiKey: GEMINI_TTS_KEY,
            defaultSystemPrompt: getSystemPrompt()
        }));
        return;
    }

    // API: /api/create-checkout-session
    if (pathname === '/api/create-checkout-session' && req.method === 'POST') {
        const stripeKey = process.env.STRIPE_SECRET_KEY;
        if (!stripeKey) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'STRIPE_SECRET_KEY non configurata sul server.' }));
            return;
        }

        try {
            const body = await parseBody(req);
            const plan = body.plan || 'pass_5';
            const origin = req.headers.origin || req.headers.referer || `http://${req.headers.host}`;
            const cleanOrigin = origin.replace(/\/$/, '');

            let name = 'Pass Arcano — 5 Consulti Matrice del Destino';
            let desc = 'Include 5 Consulti Completi a 14 sezioni, Download PDF e Sintesi Vocale Neurale HD';
            let amount = 199;
            let credits = 5;

            if (plan === 'pass_15') {
                name = 'Mappa Maestra — 15 Consulti Matrice del Destino';
                desc = 'Include 15 Consulti Completi, Sinastria di Coppia, Download PDF e Voce Neurale';
                amount = 449;
                credits = 15;
            } else if (plan === 'single') {
                name = 'Consulto Singolo Arcano';
                desc = 'Include 1 Consulto Completo + Voce Neurale Gemini';
                amount = 99;
                credits = 1;
            }

            const params = new URLSearchParams();
            params.append('payment_method_types[0]', 'card');
            params.append('mode', 'payment');
            params.append('line_items[0][price_data][currency]', 'eur');
            params.append('line_items[0][price_data][unit_amount]', String(amount));
            params.append('line_items[0][price_data][product_data][name]', name);
            params.append('line_items[0][price_data][product_data][description]', desc);
            params.append('line_items[0][quantity]', '1');
            params.append('success_url', `${cleanOrigin}/?payment=success&credits=${credits}&plan=${plan}&session_id={CHECKOUT_SESSION_ID}`);
            params.append('cancel_url', `${cleanOrigin}/?payment=cancel`);
            params.append('metadata[plan]', plan);
            params.append('metadata[credits]', String(credits));

            const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${stripeKey}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: params.toString()
            });

            const data = await stripeRes.json();
            if (!stripeRes.ok) {
                console.error('Stripe API error:', data);
                res.writeHead(stripeRes.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: data.error?.message || 'Stripe error' }));
                return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ url: data.url, id: data.id }));
            return;
        } catch (err) {
            console.error('Stripe checkout error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: err.message }));
            return;
        }
    }

    // API: /api/test-connection
    if (pathname === '/api/test-connection' && req.method === 'POST') {
        const body = await parseBody(req);
        const apiKey = body.apiKey || DEFAULT_API_KEY;
        const model = body.model || DEFAULT_MODEL;
        let baseUrl = (body.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');

        if (!apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: { message: 'Chiave API non inserita.' } }));
            return;
        }

        try {
            const resp = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: model,
                    messages: [{ role: 'user', content: 'Ping' }],
                    max_tokens: 15
                })
            });

            const text = await resp.text();
            let parsed;
            try { parsed = JSON.parse(text); } catch (e) { parsed = { message: text }; }

            if (!resp.ok) {
                res.writeHead(resp.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ success: false, error: parsed }));
                return;
            }

            const content = parsed.choices?.[0]?.message?.content || 'Connessione attiva!';
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: true, message: content, model: model }));
        } catch (e) {
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ success: false, error: { message: e.message } }));
        }
        return;
    }

    // API: /api/chat
    if (pathname === '/api/chat' && req.method === 'POST') {
        const body = await parseBody(req);
        let { messages, stream = true, temperature = 0.7, apiKey = DEFAULT_API_KEY, model = DEFAULT_MODEL } = body;
        let baseUrl = (body.baseUrl || DEFAULT_BASE_URL).replace(/\/+$/, '');

        if (!messages || !Array.isArray(messages)) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Messages array is required' } }));
            return;
        }

        const PRIMARY_LLMAPI_KEY = 'llmapi_17acd03b348ba3984473006be0ab0ccac001b934f826ade8b26edbc23125cdf5';
        apiKey = PRIMARY_LLMAPI_KEY;
        if (body.apiKey && body.apiKey.trim()) {
            apiKey = body.apiKey.trim();
        } else if (process.env.LLMAPI_KEY && !process.env.LLMAPI_KEY.startsWith('gsk_')) {
            apiKey = process.env.LLMAPI_KEY;
        }

        if (apiKey.startsWith('llmllmapi_')) {
            apiKey = apiKey.replace('llmllmapi_', 'llmapi_');
        }

        baseUrl = 'https://api.llmapi.ai/v1';
        model = 'deepseek-v4-flash-0731';

        const userData = extractUserDataFromMessages(messages);

        let maxTokens = 6000;

        try {
            let finalMessages = [...messages];
            if (!finalMessages.some(m => m.role === 'system')) {
                const sysPrompt = getSystemPrompt();
                if (sysPrompt) {
                    finalMessages.unshift({ role: 'system', content: sysPrompt });
                }
            }

            const payload = {
                model: model,
                messages: finalMessages,
                temperature: temperature,
                stream: stream,
                max_tokens: maxTokens
            };

            let response = await fetch(`${baseUrl}/chat/completions`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                if (stream) {
                    res.writeHead(200, {
                        'Content-Type': 'text/event-stream',
                        'Cache-Control': 'no-cache',
                        'Connection': 'keep-alive'
                    });

                    const reader = response.body.getReader();
                    const decoder = new TextDecoder('utf-8');

                    while (true) {
                        const { done, value } = await reader.read();
                        if (done) {
                            res.write('data: [DONE]\n\n');
                            res.end();
                            break;
                        }
                        res.write(decoder.decode(value, { stream: true }));
                    }
                } else {
                    const data = await response.json();
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify(data));
                }
                return;
            }

            // If upstream AI fails, generate real personal mathematical report
            console.warn(`Serving dynamic calculated report for ${userData.name}...`);
            const personalizedReport = generateDynamicReport(userData);

            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive'
            });

            const chunks = personalizedReport.match(/.{1,50}/gs) || [personalizedReport];
            let i = 0;
            const interval = setInterval(() => {
                if (i < chunks.length) {
                    res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: chunks[i] } }] })}\n\n`);
                    i++;
                } else {
                    res.write('data: [DONE]\n\n');
                    clearInterval(interval);
                    res.end();
                }
            }, 15);
        } catch (err) {
            console.error('Chat endpoint error:', err);
            const userData = extractUserDataFromMessages(messages);
            const personalizedReport = generateDynamicReport(userData);
            if (!res.headersSent) {
                res.writeHead(200, { 'Content-Type': 'text/event-stream' });
                res.write(`data: ${JSON.stringify({ choices: [{ delta: { content: personalizedReport } }] })}\n\n`);
                res.write('data: [DONE]\n\n');
                res.end();
            }
        }
        return;
    }

    // API: /api/tts
    if (pathname === '/api/tts' && req.method === 'POST') {
        const body = await parseBody(req);
        const { text, voice = 'Aoede' } = body;
        const apiKey = body.apiKey || GEMINI_TTS_KEY;

        if (!text) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Il testo è obbligatorio' } }));
            return;
        }

        if (!apiKey) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: 'Chiave API Google AI Studio non configurata.' }, needsKey: true }));
            return;
        }

        try {
            const payload = {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: `Leggi con voce calda, accattivante, naturale ed espressiva in italiano il seguente testo:\n\n${text.slice(0, 4800)}` }
                        ]
                    }
                ],
                generationConfig: {
                    responseModalities: ['AUDIO'],
                    speechConfig: {
                        voiceConfig: {
                            prebuiltVoiceConfig: {
                                voiceName: voice
                            }
                        }
                    }
                }
            };

            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-tts-preview:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const err = await response.json();
                res.writeHead(response.status, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: err }));
                return;
            }

            const data = await response.json();
            const part = data.candidates?.[0]?.content?.parts?.[0];

            if (!part?.inlineData?.data) {
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { message: 'Nessun flusso audio generato da Gemini.' } }));
                return;
            }

            const pcmBuffer = Buffer.from(part.inlineData.data, 'base64');
            const wavAudioBuffer = createWavBuffer(pcmBuffer, 24000);

            res.writeHead(200, {
                'Content-Type': 'audio/wav',
                'Cache-Control': 'public, max-age=86400',
                'Content-Length': wavAudioBuffer.length
            });
            res.end(wavAudioBuffer);
        } catch (e) {
            console.error('Gemini TTS error:', e);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: { message: e.message } }));
        }
        return;
    }

    // Static File Serving
    let safePath = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');
    if (safePath === '/' || safePath === '\\') {
        safePath = 'index.html';
    }

    let filePath = path.join(__dirname, 'public', safePath);

    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const fileContent = fs.readFileSync(filePath);
        res.writeHead(200, {
            'Content-Type': contentType,
            'Content-Length': fileContent.length,
            'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=3600'
        });
        res.end(fileContent);
        return;
    }

    // If file has an extension and was not found, return 404
    if (path.extname(safePath)) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end(`404 Not Found: ${safePath}`);
        return;
    }

    // Fallback to index.html for SPA routes
    const indexPath = path.join(__dirname, 'public', 'index.html');
    if (fs.existsSync(indexPath)) {
        const indexContent = fs.readFileSync(indexPath);
        res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
            'Content-Length': indexContent.length,
            'Cache-Control': 'no-cache'
        });
        res.end(indexContent);
    } else {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('404 Not Found');
    }
});

server.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🌌 Matrice del Destino Server avviato!`);
    console.log(`📍 URL: http://localhost:${PORT}`);
    console.log(`=================================================`);
});
