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
    let name = 'Consultante';
    let date = '';
    let time = 'non disponibile';
    let place = 'Italia';
    let type = '2. Numerologica + Astrologica simbolica';

    if (!Array.isArray(messages)) return { name, date, time, place, type };

    const fullText = messages.map(m => m.content || '').join('\n');

    const nameMatch = fullText.match(/(?:Nome(?:\s+completo)?|Nome\s*e\s*Cognome|Mi chiamo|Nome\s*:|Soggetto\s*:|per\s+)\s*[:=]?\s*([A-Za-zÀ-ÿ\s'-]{2,60})/i);
    if (nameMatch && nameMatch[1]) {
        name = nameMatch[1].trim().split('\n')[0].replace(/(?:Data.*|Orario.*|Città.*|Tipo.*|Anno.*)/i, '').trim();
    }

    const ymdMatch = fullText.match(/(?:Data(?:\s+di\s+nascita)?|Nato il|Nata il)?\s*[:=]?\s*(\d{4})[\/\-\.](\d{1,2})[\/\-\.](\d{1,2})/i);
    const dmyMatch = fullText.match(/(?:Data(?:\s+di\s+nascita)?|Nato il|Nata il)?\s*[:=]?\s*(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/i);

    if (ymdMatch) {
        date = `${ymdMatch[1]}-${String(ymdMatch[2]).padStart(2, '0')}-${String(ymdMatch[3]).padStart(2, '0')}`;
    } else if (dmyMatch) {
        date = `${dmyMatch[3]}-${String(dmyMatch[2]).padStart(2, '0')}-${String(dmyMatch[1]).padStart(2, '0')}`;
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

function detectConsultationType(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return 'matrice_completa';
    const lastUserMsg = [...messages].reverse().find(m => m.role === 'user')?.content || '';
    const fullText = messages.map(m => m.content || '').join('\n').toLowerCase();
    const query = (lastUserMsg + ' ' + fullText).toLowerCase();

    if (query.includes('oroscopo del giorno') || query.includes('oroscopo di oggi') || query.includes('vibrazione energetica per la giornata di oggi') || query.includes('giorno personale')) {
        return 'oroscopo_giorno';
    }
    if (query.includes('guida oracolare settimanale') || query.includes('previsione 7 giorni') || query.includes('settimana corrente giorno per giorno')) {
        return 'oroscopo_settimana';
    }
    if (query.includes('focus canale amore') || query.includes('relazioni di coppia') || query.includes('partner karmico') || query.includes('nodo d + e')) {
        return 'amore_relazioni';
    }
    if (query.includes('focus canale denaro') || query.includes('carriera & abbondanza') || query.includes('sblocco denaro') || query.includes('nodo c + e')) {
        return 'denaro_carriera';
    }
    if (query.includes('master report') || query.includes('4 pinnacoli') || query.includes('sfide evolutive') || query.includes('pinnacoli evolutivi')) {
        return 'pinnacoli_sfide';
    }
    if (query.includes('sinastria') || query.includes('matrice congiunta') || query.includes('partner 1') || query.includes('partner 2')) {
        return 'sinastria';
    }
    if (query.includes('meditazione guidata') || query.includes('audio-meditazione')) {
        return 'meditazione';
    }
    if (query.includes('14 sezioni') || query.includes('report completo') || query.includes('modulo guidato') || query.includes('ecco i miei dati completi')) {
        return 'matrice_completa';
    }
    return 'dialogo_libero';
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

    let day = 1, month = 1, year = 2000;
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

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentYearDigitsSum = String(currentYear).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const personalYear = reduceToDigit(dayReduced + monthReduced + reduceToDigit(currentYearDigitsSum, false), false);
    const currentMonthNum = now.getMonth() + 1;
    const currentDayNum = now.getDate();
    const personalDay = reduceToDigit(personalYear + currentMonthNum + currentDayNum, false);

    const p1 = reduceToDigit(dayReduced + monthReduced, false);
    const p2 = reduceToDigit(dayReduced + yearReduced, false);
    const p3 = reduceToDigit(p1 + p2, false);
    const p4 = reduceToDigit(monthReduced + yearReduced, false);

    const c1 = Math.abs(dayReduced - monthReduced);
    const c2 = Math.abs(dayReduced - yearReduced);
    const c3 = Math.abs(c1 - c2);
    const c4 = Math.abs(monthReduced - yearReduced);

    const baseAge = typeof lifePath === 'number' && lifePath <= 9 ? lifePath : reduceToDigit(lifePath, false);
    const trans1 = 36 - baseAge;
    const trans2 = trans1 + 9;
    const trans3 = trans2 + 9;

    return {
        name: fullName,
        day, month, year,
        formatted: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        lifePath,
        soulNumber,
        personalityNumber,
        expressionNumber,
        maturityNumber: reduceToDigit((typeof lifePath === 'number' ? lifePath : 9) + (typeof expressionNumber === 'number' ? expressionNumber : 9), true),
        nodeA, nodeB, nodeC, nodeD, nodeE, nodeMoney, nodeLove,
        arcA: ARCANA_DATA[nodeA] || ARCANA_DATA[1],
        arcB: ARCANA_DATA[nodeB] || ARCANA_DATA[1],
        arcC: ARCANA_DATA[nodeC] || ARCANA_DATA[1],
        arcD: ARCANA_DATA[nodeD] || ARCANA_DATA[1],
        arcE: ARCANA_DATA[nodeE] || ARCANA_DATA[1],
        arcMoney: ARCANA_DATA[nodeMoney] || ARCANA_DATA[1],
        arcLove: ARCANA_DATA[nodeLove] || ARCANA_DATA[1],
        personalYear,
        personalDay,
        arcPersonalDay: ARCANA_DATA[personalDay] || ARCANA_DATA[1],
        arcPersonalYear: ARCANA_DATA[personalYear] || ARCANA_DATA[1],
        p1, p2, p3, p4,
        c1, c2, c3, c4,
        trans1, trans2, trans3,
        letterCounts
    };
}

function generateDynamicReport(userData, consultType, messages) {
    const calc = calculateCompleteMatrixData(userData.name, userData.date);
    const currentYear = new Date().getFullYear();
    const currentDateStr = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

    if (consultType === 'oroscopo_giorno') {
        return `# 🌅 Oroscopo & Vibrazione del Giorno — ${currentDateStr}

> **Disclaimer Etico (Art. 50 EU AI Act):** Analisi energetica simbolica calcolata sulla base dei cicli numerologici del Giorno Personale e degli Arcani Maggiori.

* **Soggetto:** ${calc.name}
* **Data di Nascita:** ${calc.formatted}
* **Anno Personale (${currentYear}):** **${calc.personalYear}** (${calc.arcPersonalYear.name})
* **Giorno Personale di Oggi:** **Numero ${calc.personalDay}** — Arcano ${calc.personalDay} (${calc.arcPersonalDay.name})
* **Frequenza Chiave:** ${calc.arcPersonalDay.keywords}

---

## 1. Clima Energetico & Archetipo Dominante
Oggi vibri sotto l'egida dell'**Arcano ${calc.personalDay} (${calc.arcPersonalDay.name})**. Questa frequenza interagisce direttamente con il tuo Arcano di Nascita (${calc.nodeA} - ${calc.arcA.name}) e il tuo Centro Emozionale (${calc.nodeE} - ${calc.arcE.name}). È una giornata caratterizzata da ${calc.arcPersonalDay.keywords.toLowerCase()}, ideale per canalizzare chiarezza e determinazione.

---

## 2. Le 3 Grandi Opportunità di Oggi
1. **Chiarezza Decisionale:** Ottimo momento per mettere a fuoco priorità strategiche senza disperdere energie.
2. **Sblocco Relazionale & Comunicativo:** L'allineamento con il tuo Cuore (${calc.arcE.name}) favorisce dialoghi franchi ed empatici.
3. **Manifestazione Materiale:** Possibilità di compiere passi concreti nei progetti professionali e finanziari.

---

## 3. Ombre & Insidie da Evitare
* **Impulsività o rigidità:** Evita di forzare situazioni non ancora mature.
* **Dubbio sterile:** Non mettere in discussione il valore delle tue intuizioni profonde.

---

## 4. Rituale & Consiglio Pratico d'Azione
*Prenditi 3 minuti di raccoglimento al mattino o durante una pausa:* visualizza la luce dorata dell'Arcano ${calc.arcPersonalDay.name} che illumina le tue azioni odierne. Agisci con presenza consapevole.`;
    }

    if (consultType === 'oroscopo_settimana') {
        return `# 🔮 Guida Oracolare Settimanale (Previsione 7 Giorni)

* **Soggetto:** ${calc.name} (Nato/a il: ${calc.formatted})
* **Ciclo Numerologico:** Anno Personale ${calc.personalYear} (${calc.arcPersonalYear.name})
* **Settimana di Riferimento:** Giornata odierna (${currentDateStr}) e proiezione dei prossimi 7 giorni

---

## 1. Mappa dei 7 Giorni — Clima Archetipico Quotidiano
* **Giorno 1:** Arcano Guida ${calc.personalDay} (${calc.arcPersonalDay.name}) — Focus su avvio, centratura e chiarezza.
* **Giorno 2:** Arcano Guida ${reduceToDigit(calc.personalDay + 1, false)} — Dialogo, ascolto interiore e relazioni.
* **Giorno 3:** Arcano Guida ${reduceToDigit(calc.personalDay + 2, false)} — Creatività, espressione e contatti sociali.
* **Giorno 4:** Arcano Guida ${reduceToDigit(calc.personalDay + 3, false)} — Struttura, organizzazione e metodo operativo.
* **Giorno 5:** Arcano Guida ${reduceToDigit(calc.personalDay + 4, false)} — Movimento, dinamismo e flessibilità.
* **Giorno 6:** Arcano Guida ${reduceToDigit(calc.personalDay + 5, false)} — Armonia domestica, legami affettivi e cura.
* **Giorno 7:** Arcano Guida ${reduceToDigit(calc.personalDay + 6, false)} — Introspezione, studio e ricarica energetica.

---

## 2. Giorni di Massima Favorevolezza
I giorni centrali della settimana presentano il massimo potenziale per chiudere accordi o prendere decisioni importanti.`;
    }

    if (consultType === 'amore_relazioni') {
        return `# ❤️ Canale dell'Amore & Compatibilità nella Matrice del Destino

* **Soggetto:** ${calc.name} (Data: ${calc.formatted})
* **Arcano dell'Amore (Nodo D+E):** **Arcano ${calc.nodeLove} (${calc.arcLove.name})**
* **Nodo del Cuore (Centro):** **Arcano ${calc.nodeE} (${calc.arcE.name})**
* **Coda Karmica:** **Arcano ${calc.nodeD} (${calc.arcD.name})**

---

## 1. Il Tuo Codice dell'Amore & Archetipo di Partner
Il tuo Canale Relazionale è retto dall'**Arcano ${calc.nodeLove} (${calc.arcLove.name})**: sei attratto/a da persone che incarnano ${calc.arcLove.keywords.toLowerCase()}. Cerchi una connessione profonda che sappia fondere passione spirituale e stabilità.

---

## 2. Blocchi Karmici da Sciogliere
Il legame con la Coda Karmica (${calc.arcD.name}) indica la necessità di superare la paura del giudizio e l'autosvalutazione, aprendoti alla vulnerabilità senza timore.

---

## 3. Consiglio per le Relazioni
Comunica sempre con la trasparenza del tuo Arcano Centrale (${calc.arcE.name}), stabilendo confini sani e amorevoli.`;
    }

    if (consultType === 'denaro_carriera') {
        return `# 💰 Canale del Denaro, Carriera & Vocazione Materiale

* **Soggetto:** ${calc.name} (Data: ${calc.formatted})
* **Arcano del Denaro (Nodo C+E):** **Arcano ${calc.nodeMoney} (${calc.arcMoney.name})**
* **Nodo della Materia (Anno):** **Arcano ${calc.nodeC} (${calc.arcC.name})**
* **Numero dell'Espressione:** **${calc.expressionNumber}**

---

## 1. Vocazione Professionale & Canali di Flusso
Il tuo Canale della Prosperità è presieduto dall'**Arcano ${calc.nodeMoney} (${calc.arcMoney.name})**. I tuoi talenti naturali fioriscono in ambiti legati a ${calc.arcMoney.keywords.toLowerCase()}.

---

## 2. Credenze Limitanti da Sbloccare
Il passaggio dall'Arcano ${calc.nodeC} (${calc.arcC.name}) all'Abbondanza richiede di superare il senso di scarsità e valorizzare economicamente le tue competenze uniche.

---

## 3. Strategia di Monetizzazione
Punta su progetti a lungo termine che rispecchiano la tua etica e le tue capacità direttive.`;
    }

    if (consultType === 'pinnacoli_sfide') {
        return `# 🏔️ Master Report: I 4 Pinnacoli Evolutivi & le 4 Sfide

* **Soggetto:** ${calc.name} | Life Path: **${calc.lifePath}**
* **Età di Transizione:**
  * **1° Pinnacolo:** Da 0 a **${calc.trans1} anni**
  * **2° Pinnacolo:** Da **${calc.trans1 + 1}** a **${calc.trans2} anni**
  * **3° Pinnacolo:** Da **${calc.trans2 + 1}** a **${calc.trans3} anni**
  * **4° Pinnacolo:** Dai **${calc.trans3 + 1} anni** in poi

---

## 1. I 4 Grandi Pinnacoli (Apici di Realizzazione)
* **1° Pinnacolo (Arcano ${calc.p1}):** Costruzione delle basi interiori e affermazione personale.
* **2° Pinnacolo (Arcano ${calc.p2}):** Espansione relazionale e professionale.
* **3° Pinnacolo (Arcano ${calc.p3}):** Maturità, autorevolezza e maestria.
* **4° Pinnacolo (Arcano ${calc.p4}):** Saggezza, lascito spirituale e piena libertà.

---

## 2. Le 4 Sfide Karmiche di Vita
* **Sfida 1 (Grado ${calc.c1}):** Armonizzazione dell'ego e indipendenza.
* **Sfida 2 (Grado ${calc.c2}):** Fiducia nelle proprie capacità materiali.
* **Sfida 3 (Grado ${calc.c3}):** Integrazione emotiva profonda.
* **Sfida 4 (Grado ${calc.c4}):** Realizzazione spirituale autentica.`;
    }

    return `# Report Completo di Analisi Numerologica & Matrice del Destino (14 Sezioni)

> **Disclaimer Etico (Art. 50 EU AI Act):** Questa analisi si basa sui principi simbolici dei 22 Arcani Maggiori e della numerologia pitagorica.

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
        let { messages, stream = true, temperature = 0.6, apiKey = DEFAULT_API_KEY, model = DEFAULT_MODEL } = body;
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
        const consultType = detectConsultationType(messages);
        const calc = calculateCompleteMatrixData(userData.name, userData.date);

        let maxTokens = 6000;

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentDateStr = now.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

        try {
            let finalMessages = [...messages];
            if (!finalMessages.some(m => m.role === 'system')) {
                const dateInfo = userData.date ? `Data di Nascita: ${userData.date} (${calc.formatted})` : 'Data: indicata nel messaggio';
                
                let specificInstruction = '';
                switch (consultType) {
                    case 'oroscopo_giorno':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: OROSCOPO DEL GIORNO (${currentDateStr}).
DEVI GENERARE ESCLUSIVAMENTE L'OROSCOPO DEL GIORNO PER OGGI. NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Dati chiave: Giorno Personale di oggi = Numero ${calc.personalDay} (Arcano ${calc.personalDay} - ${calc.arcPersonalDay.name}), Anno Personale = ${calc.personalYear} (${calc.arcPersonalYear.name}), Arcano di Nascita = ${calc.nodeA} (${calc.arcA.name}), Cuore = ${calc.nodeE} (${calc.arcE.name}).
Struttura la risposta con:
# 🌅 Oroscopo & Vibrazione del Giorno — ${currentDateStr}
* **Soggetto:** ${userData.name} | Giorno Personale: **${calc.personalDay}** | Arcano Guida: **${calc.arcPersonalDay.name}**
## 1. Clima Energetico & Archetipo Dominante di Oggi
## 2. Le 3 Grandi Opportunità Odierne (Professione, Relazioni, Spirito)
## 3. Ombre & Insidie da Evitare
## 4. Rituale / Consiglio Pratico d'Azione`;
                        break;

                    case 'oroscopo_settimana':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: GUIDA ORACOLARE SETTIMANALE (7 GIORNI).
DEVI GENERARE LA PREVISIONE DEI 7 GIORNI DELLA SETTIMANA GIORNO PER GIORNO. NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Dati chiave: Anno Personale = ${calc.personalYear} (${calc.arcPersonalYear.name}), Life Path = ${calc.lifePath}.
Struttura con tema della settimana, mappa dei 7 giorni con Arcano quotidiano e focus, giorni più favorevoli e consiglio di sintesi.`;
                        break;

                    case 'amore_relazioni':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: FOCUS CANALE AMORE & RELAZIONI.
DEVI ANALIZZARE APPROFONDITAMENTE IL CANALE AMORE (Nodo D+E: Arcano ${calc.nodeLove} - ${calc.arcLove.name}, Nodo Cuore: Arcano ${calc.nodeE} - ${calc.arcE.name}, Coda Karmica: Arcano ${calc.nodeD} - ${calc.arcD.name}). NON GENERARE IL REPORT A 14 SEZIONI.
Fornisci: 1. Il Codice dell'Amore e Partner Karmico ideale, 2. Ferite karmiche e blocchi emotivi da sciogliere, 3. Dinamica di coppia / per single, 4. 3 Chiavi pratiche di armonizzazione.`;
                        break;

                    case 'denaro_carriera':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: FOCUS CANALE DENARO, CARRIERA & PROSPERITÀ.
DEVI ANALIZZARE IL CANALE DENARO (Nodo C+E: Arcano ${calc.nodeMoney} - ${calc.arcMoney.name}, Nodo Materia: Arcano ${calc.nodeC} - ${calc.arcC.name}, Numero Espressione: ${calc.expressionNumber}). NON GENERARE IL REPORT A 14 SEZIONI.
Fornisci: 1. Professioni vocazionali e canali di flusso economico, 2. Credenze limitanti e karma del denaro da sbloccare, 3. Strategia concreta di monetizzazione, 4. Piano in 3 passi per attrarre abbondanza.`;
                        break;

                    case 'pinnacoli_sfide':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: MASTER REPORT DEI 4 PINNACOLI & 4 SFIDE con Proiezione Decennale.
NON GENERARE IL REPORT A 14 SEZIONI.
Dati esatti:
- 1° Pinnacolo (Età 0-${calc.trans1}): Arcano ${calc.p1}
- 2° Pinnacolo (Età ${calc.trans1 + 1}-${calc.trans2}): Arcano ${calc.p2}
- 3° Pinnacolo (Età ${calc.trans2 + 1}-${calc.trans3}): Arcano ${calc.p3}
- 4° Pinnacolo (Età ${calc.trans3 + 1}+): Arcano ${calc.p4}
- Sfide: Sfida 1 = ${calc.c1}, Sfida 2 = ${calc.c2}, Sfida 3 = ${calc.c3}, Sfida 4 = ${calc.c4}
- Proiezione Decennale ${currentYear}-${currentYear + 10} con Anno Personale per ciascun anno.`;
                        break;

                    case 'sinastria':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: SINASTRIA DI COPPIA & MATRICE CONGIUNTA.
DEVI CALCOLARE E ANALIZZARE LA MATRICE CONGIUNTA TRA I DUE PARTNER INDICATI NEL MESSAGGIO.
Struttura con: Scopo Spirituale dell'Incontro, Punti di Affinità, Zone di Frizione e Consigli di Coppia.`;
                        break;

                    case 'matrice_completa':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: REPORT COMPLETO A 14 SEZIONI.
DEVI GENERARE L'INTERO REPORT A 14 SEZIONI PER ${userData.name} IN MODO COMPLETO, PROFONDO E SENZA TRONCATURE.`;
                        break;

                    default:
                        specificInstruction = `🔴 RICHIESTA LIBERA IN CHAT: Rispondi in modo diretto, esauriente e approfondito alla domanda specifica dell'utente, integrando la saggezza dei suoi archetipi della Matrice (Nodo A: ${calc.nodeA}, Nodo E: ${calc.nodeE}, Life Path: ${calc.lifePath}).`;
                }

                const sysPrompt = `Sei l'Oracolo Supremo della Matrice del Destino e degli Archetipi Numerologici (metodo Ladini dei 22 Arcani e Numerologia Pitagorica). 
Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA con tono profondo, autorevole, analitico, nobile e solenne.
🔴 DATI DEL SOGGETTO: Nome: ${userData.name}, ${dateInfo}, Ora: ${userData.time}, Luogo: ${userData.place}.
🔴 CALCOLI NUMEROLOGICI PRE-ELABORATI:
- Arcano di Nascita (Nodo A): Arcano ${calc.nodeA} (${calc.arcA.name})
- Arcano dello Spirito (Nodo B): Arcano ${calc.nodeB} (${calc.arcB.name})
- Arcano della Materia (Nodo C): Arcano ${calc.nodeC} (${calc.arcC.name})
- Coda Karmica (Nodo D): Arcano ${calc.nodeD} (${calc.arcD.name})
- Centro / Comfort Zone (Nodo E): Arcano ${calc.nodeE} (${calc.arcE.name})
- Canale Denaro (C+E): Arcano ${calc.nodeMoney} (${calc.arcMoney.name})
- Canale Amore (D+E): Arcano ${calc.nodeLove} (${calc.arcLove.name})
- Life Path: ${calc.lifePath}, Espressione: ${calc.expressionNumber}, Anima: ${calc.soulNumber}, Personalità: ${calc.personalityNumber}
- Anno Personale ${currentYear}: ${calc.personalYear} (${calc.arcPersonalYear.name})
- Giorno Personale oggi (${currentDateStr}): ${calc.personalDay} (${calc.arcPersonalDay.name})

${specificInstruction}`;

                finalMessages.unshift({ role: 'system', content: sysPrompt });
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
                    'Content-Type': 'application/json',
                    'HTTP-Referer': 'https://matrice.vercel.app',
                    'X-Title': 'Destiny Matrix AI'
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
            const personalizedReport = generateDynamicReport(userData, consultType, messages);

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
            const consultType = detectConsultationType(messages);
            const personalizedReport = generateDynamicReport(userData, consultType, messages);
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
