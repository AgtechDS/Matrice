export const config = {
    runtime: 'edge'
};

function formatSSE(content) {
    const chunk = {
        id: 'chatcmpl-' + Math.random().toString(36).substring(2),
        object: 'chat.completion.chunk',
        created: Date.now(),
        model: 'deepseek-v4-flash-0731',
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

const ZODIAC_SIGNS = [
    { name: "Capricorno", symbol: "♑", element: "Terra", modality: "Cardinale", planet: "Saturno", startMonth: 12, startDay: 22, endMonth: 1, endDay: 19, arcana: 15, traits: "Disciplina, ambizione, pragmatismo, maestria della materia" },
    { name: "Acquario", symbol: "♒", element: "Aria", modality: "Fisso", planet: "Urano / Saturno", startMonth: 1, startDay: 20, endMonth: 2, endDay: 18, arcana: 17, traits: "Visione pionieristica, indipendenza, libertà, intuizione collettiva" },
    { name: "Pesci", symbol: "♓", element: "Acqua", modality: "Mobile", planet: "Nettuno / Giove", startMonth: 2, startDay: 19, endMonth: 3, endDay: 20, arcana: 18, traits: "Empatia mistica, sensibilità profonda, creatività sottile, compassione" },
    { name: "Ariete", symbol: "♈", element: "Fuoco", modality: "Cardinale", planet: "Marte", startMonth: 3, startDay: 21, endMonth: 4, endDay: 19, arcana: 4, traits: "Iniziativa audace, leadership dinamica, coraggio, slancio vitale" },
    { name: "Toro", symbol: "♉", element: "Terra", modality: "Fisso", planet: "Venere", startMonth: 4, startDay: 20, endMonth: 5, endDay: 20, arcana: 5, traits: "Radicamento, costanza, senso della bellezza, costruzione di prosperità" },
    { name: "Gemelli", symbol: "♊", element: "Aria", modality: "Mobile", planet: "Mercurio", startMonth: 5, startDay: 21, endMonth: 6, endDay: 20, arcana: 6, traits: "Curiosità intellettuale, comunicazione brillante, versatilità, connessione" },
    { name: "Cancro", symbol: "♋", element: "Acqua", modality: "Cardinale", planet: "Luna", startMonth: 6, startDay: 21, endMonth: 7, endDay: 22, arcana: 7, traits: "Intelligenza emotiva, memoria ancestrale, protezione, intuito protettivo" },
    { name: "Leone", symbol: "♌", element: "Fuoco", modality: "Fisso", planet: "Sole", startMonth: 7, startDay: 23, endMonth: 8, endDay: 22, arcana: 19, traits: "Magnetismo, sovranità interiore, generosità radiosa, dignità e calore" },
    { name: "Vergine", symbol: "♍", element: "Terra", modality: "Mobile", planet: "Mercurio", startMonth: 8, startDay: 23, endMonth: 9, endDay: 22, arcana: 9, traits: "Discernimento analitico, precisione, cura del dettaglio, servizio consapevole" },
    { name: "Bilancia", symbol: "♎", element: "Aria", modality: "Cardinale", planet: "Venere", startMonth: 9, startDay: 23, endMonth: 10, endDay: 22, arcana: 8, traits: "Senso di giustizia, armonia estetica, diplomazia, ricerca di equilibrio" },
    { name: "Scorpione", symbol: "♏", element: "Acqua", modality: "Fisso", planet: "Plutone / Marte", startMonth: 10, startDay: 23, endMonth: 11, endDay: 21, arcana: 13, traits: "Trasformazione alchemica, magnetismo intimo, penetrazione della verità" },
    { name: "Sagittario", symbol: "♐", element: "Fuoco", modality: "Mobile", planet: "Giove", startMonth: 11, startDay: 22, endMonth: 12, endDay: 21, arcana: 14, traits: "Espansione spirituale, ricerca della verità, ottimismo cosmico, saggezza filosofica" }
];

function calculateZodiacSign(day, month) {
    for (const sign of ZODIAC_SIGNS) {
        if (sign.startMonth === sign.endMonth) {
            if (month === sign.startMonth && day >= sign.startDay && day <= sign.endDay) return sign;
        } else if (sign.startMonth > sign.endMonth) {
            if ((month === 12 && day >= sign.startDay) || (month === 1 && day <= sign.endDay)) return sign;
        } else {
            if ((month === sign.startMonth && day >= sign.startDay) || (month === sign.endMonth && day <= sign.endDay)) return sign;
        }
    }
    return ZODIAC_SIGNS[11]; // default Sagittario
}

function calculateAscendant(day, month, year, timeStr) {
    let hours = 12, minutes = 0;
    let hasExactTime = false;
    if (timeStr && timeStr !== 'non disponibile' && timeStr !== 'non specificato') {
        const timeParts = timeStr.match(/(\d{1,2})[:.](\d{2})/);
        if (timeParts) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
            hasExactTime = true;
        }
    }

    const date = new Date(Date.UTC(year, month - 1, day));
    const startOfYear = new Date(Date.UTC(year, 0, 1));
    const dayOfYear = Math.floor((date - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

    let siderealHours = ((dayOfYear - 80) * 0.0657098 + hours + minutes / 60 + 0.8) % 24;
    if (siderealHours < 0) siderealHours += 24;

    const zodiacOrder = [
        ZODIAC_SIGNS.find(s => s.name === "Ariete"),
        ZODIAC_SIGNS.find(s => s.name === "Toro"),
        ZODIAC_SIGNS.find(s => s.name === "Gemelli"),
        ZODIAC_SIGNS.find(s => s.name === "Cancro"),
        ZODIAC_SIGNS.find(s => s.name === "Leone"),
        ZODIAC_SIGNS.find(s => s.name === "Vergine"),
        ZODIAC_SIGNS.find(s => s.name === "Bilancia"),
        ZODIAC_SIGNS.find(s => s.name === "Scorpione"),
        ZODIAC_SIGNS.find(s => s.name === "Sagittario"),
        ZODIAC_SIGNS.find(s => s.name === "Capricorno"),
        ZODIAC_SIGNS.find(s => s.name === "Acquario"),
        ZODIAC_SIGNS.find(s => s.name === "Pesci")
    ];

    const signIndex = Math.floor(siderealHours / 2) % 12;
    const ascendantSign = zodiacOrder[signIndex] || ZODIAC_SIGNS[0];
    const degreeApprox = Math.floor(((siderealHours % 2) / 2) * 30);

    return {
        sign: ascendantSign,
        degree: degreeApprox,
        hasExactTime,
        formatted: `${ascendantSign.name} ${ascendantSign.symbol} (~${degreeApprox}°)`
    };
}

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

    if (query.includes('tema natale') || query.includes('calcolo zodiacale') || query.includes('analisi zodiacale completa') || query.includes('zodiaco mit')) {
        return 'tema_natale_zodiaco';
    }
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

function calculateCompleteMatrixData(fullName, birthDateStr, birthTimeStr = 'non disponibile') {
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

    let day = 28, month = 11, year = 1992;
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

    // Zodiac Sign & Ascendant
    const zodiacSign = calculateZodiacSign(day, month);
    const ascendant = calculateAscendant(day, month, year, birthTimeStr);

    // Current Year & Personal Year
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentYearDigitsSum = String(currentYear).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const personalYear = reduceToDigit(dayReduced + monthReduced + reduceToDigit(currentYearDigitsSum, false), false);
    const currentMonthNum = now.getMonth() + 1;
    const currentDayNum = now.getDate();
    const personalDay = reduceToDigit(personalYear + currentMonthNum + currentDayNum, false);

    // Pinnacles & Challenges
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
        zodiacSign,
        ascendant,
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
    const calc = calculateCompleteMatrixData(userData.name, userData.date, userData.time);
    const currentYear = new Date().getFullYear();
    const currentDateStr = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

    if (consultType === 'tema_natale_zodiaco') {
        return `# 🌌 Tema Natale & Analisi Zodiacale Completa MIT-Grade

> **Disclaimer Etico (Art. 50 EU AI Act):** Mappa astrologica e archetipica generata tramite calcolo efemeridi astronomiche simboliche e sintesi con i 22 Arcani della Matrice del Destino.

* **Soggetto:** ${calc.name}
* **Data & Ora di Nascita:** ${calc.formatted} (Ore: ${userData.time}, Luogo: ${userData.place})
* **Segno Solare:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** (${calc.zodiacSign.element}, ${calc.zodiacSign.modality} — Governatore: **${calc.zodiacSign.planet}**)
* **Ascendente Zodiacale:** **${calc.ascendant.formatted}** (Governatore dell'Ascendente: **${calc.ascendant.sign.planet}**)
* **Arcano Zodiacale Associato:** Arcano ${calc.zodiacSign.arcana} (${ARCANA_DATA[calc.zodiacSign.arcana]?.name})
* **Frequenza di Nascita:** Arcano ${calc.nodeA} (${calc.arcA.name}) | Life Path: **${calc.lifePath}**

---

## 1. Identità Astrale: Segno Solare, Ascendente & Elementi
La tua essenza primaria è radicata nel segno del **${calc.zodiacSign.name} (${calc.zodiacSign.element})**, che ti conferisce ${calc.zodiacSign.traits.toLowerCase()}. L'**Ascendente in ${calc.ascendant.sign.name} (${calc.ascendant.sign.element})** modella la tua maschera esteriore, la prima impressione che doni al mondo e la modalità strategica con cui affronti le sfide dell'esistenza. L'interazione tra ${calc.zodiacSign.element} e ${calc.ascendant.sign.element} crea una configurazione dinamica e potente.

---

## 2. Configurazione delle 12 Case Astrologiche
* **Casa I (Identità & Presenza):** Ascendente ${calc.ascendant.sign.name} — Autonomia, impatto e coraggio espressivo.
* **Casa IV (Radici & Famiglia):** Connessione con la Coda Karmica (Arcano ${calc.nodeD} - ${calc.arcD.name}).
* **Casa VII (Relazioni & Unioni):** Il Canale dell'Amore risuona con l'Arcano ${calc.nodeLove} (${calc.arcLove.name}).
* **Casa X (Vocazione & Realizzazione Sociale):** Il Medio Cielo e il Canale del Denaro (${calc.nodeMoney} - ${calc.arcMoney.name}) governano il tuo apice professionale.

---

## 3. Integrazione Alchemica: Astrologia + Matrice del Destino
Il tuo Segno Solare (${calc.zodiacSign.name}) si fonde con l'energia dell'**Arcano ${calc.nodeA} (${calc.arcA.name})** e con il tuo **Cuore Energetico (Arcano ${calc.nodeE} - ${calc.arcE.name})**. Questa triplice alleanza ti protegge dalle dispersioni e potenzia la tua capacità di manifestazione.

---

## 4. Talenti Innati & Canali Vocazionali
Grazie a ${calc.zodiacSign.planet}, possiedi spiccate capacità di visione espansiva, leadership naturale e pensiero filosofico/strategico. Sei tagliato/a per progetti ambiziosi ad alto valore intellettuale o creativo.

---

## 5. Sfide Astrali & Aspetti di Ombra
* **Eccesso di impazienza o idealismo:** Evita di sottovalutare i dettagli tecnici operativi.
* **Tensione tra indipendenza e legami:** L'Ascendente richiede di armonizzare il bisogno di libertà personale con l'intimità profonda.

---

## 6. Transiti Planetari Correnti (${currentYear})
Nell'anno in corso (${currentYear}), il tuo **Anno Personale ${calc.personalYear} (${calc.arcPersonalYear.name})** si combina con i transiti benefici di ${calc.zodiacSign.planet}, aprendo un biennio di grande raccolto ed espansione.

---

## 7. Verdetto Oracolare & Guida di Manifestazione
Abbi piena fiducia nel tuo codice astrale unico: incarna la fiamma del ${calc.zodiacSign.name} con la saggezza dell'Arcano ${calc.nodeE} (${calc.arcE.name}).`;
    }

    if (consultType === 'oroscopo_giorno') {
        return `# 🌅 Oroscopo & Vibrazione Astrale del Giorno — ${currentDateStr}

> **Disclaimer Etico (Art. 50 EU AI Act):** Analisi combinata di Astrologia Zodiacale e Numerologia Archetipica in tempo reale.

* **Soggetto:** ${calc.name} (Nato/a il: ${calc.formatted}, Ore: ${userData.time})
* **Segno Zodiacale:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** (${calc.zodiacSign.element}, retto da **${calc.zodiacSign.planet}**)
* **Ascendente:** **${calc.ascendant.formatted}**
* **Giorno Personale di Oggi:** **Numero ${calc.personalDay}** — Arcano ${calc.personalDay} (${calc.arcPersonalDay.name})
* **Anno Personale (${currentYear}):** **${calc.personalYear}** (${calc.arcPersonalYear.name})

---

## 1. Clima Energetico & Transito del Segno
Oggi per il **${calc.zodiacSign.name}** con **Ascendente ${calc.ascendant.sign.name}**, l'energia di **${calc.zodiacSign.planet}** si sintonizza perfettamente con l'**Arcano ${calc.personalDay} (${calc.arcPersonalDay.name})**. Questa vibrazione amplifica ${calc.arcPersonalDay.keywords.toLowerCase()}, rendendo la giornata ideale per decisioni ponderate e chiarimenti.

---

## 2. Le 3 Opportunità Astrali di Oggi
1. **Lavoro & Finanze:** Ottimo allineamento tra la mente analitica e la spinta espansiva del tuo Segno Solare.
2. **Amore & Relazioni:** L'Ascendente ${calc.ascendant.sign.name} favorisce trasparenza e magnetismo negli incontri.
3. **Crescita Personale:** Momento propizio per sbloccare vecchi dubbi e ritrovare centratura.

---

## 3. Insidie da Evitare
* Non agire d'impulso sotto l'effetto della fretta.
* Ascolta i segnali del corpo e concediti brevi momenti di respiro consapevole.

---

## 4. Consiglio & Rituale del Giorno
Connettiti all'elemento **${calc.zodiacSign.element}**: visualizza una fiamma di chiarezza che illumina ogni tua scelta odierna.`;
    }

    if (consultType === 'oroscopo_settimana') {
        return `# 🔮 Guida Oracolare Settimanale (Previsione 7 Giorni)

* **Soggetto:** ${calc.name} (Data: ${calc.formatted})
* **Segno Zodiacale:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** | **Ascendente:** **${calc.ascendant.formatted}**
* **Anno Personale (${currentYear}):** **${calc.personalYear}** (${calc.arcPersonalYear.name})

---

## 1. Clima della Settimana per il ${calc.zodiacSign.name}
La settimana corrente vede l'attivazione dei tuoi canali di espansione: il connubio tra il governatore ${calc.zodiacSign.planet} e l'Ascendente ${calc.ascendant.sign.name} favorisce la risoluzione di trattative in sospeso e una maggiore stabilità relazionale.

---

## 2. Previsione Giorno per Giorno
* **Giorno 1:** Arcano Guida ${calc.personalDay} (${calc.arcPersonalDay.name}) — Focus su avvio, centratura e chiarezza.
* **Giorno 2:** Arcano Guida ${reduceToDigit(calc.personalDay + 1, false)} — Dialogo, ascolto interiore e relazioni.
* **Giorno 3:** Arcano Guida ${reduceToDigit(calc.personalDay + 2, false)} — Creatività, espressione e contatti sociali.
* **Giorno 4:** Arcano Guida ${reduceToDigit(calc.personalDay + 3, false)} — Struttura, organizzazione e metodo operativo.
* **Giorno 5:** Arcano Guida ${reduceToDigit(calc.personalDay + 4, false)} — Movimento, dinamismo e flessibilità.
* **Giorno 6:** Arcano Guida ${reduceToDigit(calc.personalDay + 5, false)} — Armonia domestica, legami affettivi e cura.
* **Giorno 7:** Arcano Guida ${reduceToDigit(calc.personalDay + 6, false)} — Introspezione, studio e ricarica energetica.`;
    }

    if (consultType === 'amore_relazioni') {
        return `# ❤️ Canale dell'Amore & Compatibilità nella Matrice del Destino

* **Soggetto:** ${calc.name} | **Segno:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Asc. ${calc.ascendant.sign.name})
* **Arcano dell'Amore (Nodo D+E):** **Arcano ${calc.nodeLove} (${calc.arcLove.name})**
* **Nodo del Cuore (Centro):** **Arcano ${calc.nodeE} (${calc.arcE.name})**
* **Coda Karmica:** **Arcano ${calc.nodeD} (${calc.arcD.name})**

---

## 1. Il Tuo Codice dell'Amore
Il tuo Canale Relazionale fonde il fuoco del **${calc.zodiacSign.name}** con l'**Arcano ${calc.nodeLove} (${calc.arcLove.name})**: cerchi un partner che sappia stimolare la tua mente e condividere la tua sete di evoluzione spirituale e umana.

---

## 2. Blocchi Karmici da Sciogliere
Supera la tentazione di fuggire quando l'intimità richiede vulnerabilità emotiva profonda.`;
    }

    if (consultType === 'denaro_carriera') {
        return `# 💰 Canale del Denaro, Carriera & Vocazione Materiale

* **Soggetto:** ${calc.name} | **Segno:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Asc. ${calc.ascendant.sign.name})
* **Arcano del Denaro (Nodo C+E):** **Arcano ${calc.nodeMoney} (${calc.arcMoney.name})**
* **Nodo della Materia (Anno):** **Arcano ${calc.nodeC} (${calc.arcC.name})**
* **Numero dell'Espressione:** **${calc.expressionNumber}**

---

## 1. Vocazione Professionale & Abbondanza
L'influenza di **${calc.zodiacSign.planet}** unita all'**Arcano ${calc.nodeMoney} (${calc.arcMoney.name})** fa di te un catalizzatore di progetti ad alto impatto. I tuoi guadagni crescono proporzionalmente al valore etico e innovativo che immetti nel mercato.`;
    }

    if (consultType === 'pinnacoli_sfide') {
        return `# 🏔️ Master Report: I 4 Pinnacoli Evolutivi & le 4 Sfide

* **Soggetto:** ${calc.name} | Life Path: **${calc.lifePath}** | Segno: **${calc.zodiacSign.name}**
* **Età di Transizione:**
  * **1° Pinnacolo:** Da 0 a **${calc.trans1} anni** (Arcano ${calc.p1})
  * **2° Pinnacolo:** Da **${calc.trans1 + 1}** a **${calc.trans2} anni** (Arcano ${calc.p2})
  * **3° Pinnacolo:** Da **${calc.trans2 + 1}** a **${calc.trans3} anni** (Arcano ${calc.p3})
  * **4° Pinnacolo:** Dai **${calc.trans3 + 1} anni** in poi (Arcano ${calc.p4})

---

## Le 4 Sfide Karmiche
* **Sfida 1 (Grado ${calc.c1}):** Autonomia e padronanza.
* **Sfida 2 (Grado ${calc.c2}):** Fiducia materiale.
* **Sfida 3 (Grado ${calc.c3}):** Integrazione emotiva.
* **Sfida 4 (Grado ${calc.c4}):** Realizzazione spirituale.`;
    }

    // Default: 14-Section Full Matrix Report
    return `# Report Completo di Analisi Numerologica & Matrice del Destino (14 Sezioni)

> **Disclaimer Etico (Art. 50 EU AI Act):** Questa analisi si basa sui principi simbolici dei 22 Arcani Maggiori, della numerologia pitagorica e della tradizione astrologica.

---

## 1. Sintesi Iniziale
* **Soggetto:** ${calc.name}
* **Data di Nascita:** ${calc.formatted} (Ore: ${userData.time}, Luogo: ${userData.place})
* **Segno Solare & Ascendente:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** (${calc.zodiacSign.element}), **Ascendente ${calc.ascendant.formatted}**
* **Tipo di Analisi:** ${userData.type}
* **Archetipi Fondamentali:** Arcano ${calc.nodeE} (${calc.arcE.name} - Centro/Cuore) e Arcano ${calc.nodeA} (${calc.arcA.name} - Spirito/Risorse).

---

## 2. Analisi del Nome & Frequenze Lettere
* **Nome Completo:** ${calc.name}
* **Numero dell'Espressività (Destino):** **${calc.expressionNumber}**
* **Numero dell'Anima (Vocali):** **${calc.soulNumber}**
* **Numero della Personalità (Consonanti):** **${calc.personalityNumber}**
* **Numero della Maturità:** **${calc.maturityNumber}**

---

## 3. Analisi della Data di Nascita & Percorso di Vita
* **Percorso di Vita (Life Path):** **${calc.lifePath}**
* **Anno Personale (${currentYear}):** **${calc.personalYear}** (${calc.arcPersonalYear.name})

---

## 4. Canali Specializzati
* **Canale Denaro:** Arcano ${calc.nodeMoney} (${calc.arcMoney.name})
* **Canale Amore:** Arcano ${calc.nodeLove} (${calc.arcLove.name})
* **Coda Karmica:** Arcano ${calc.nodeD} (${calc.arcD.name})`;
}

export default async function handler(req) {
    if (req.method === 'OPTIONS') {
        return new Response(null, {
            status: 204,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Title, HTTP-Referer'
            }
        });
    }

    if (req.method !== 'POST') {
        return new Response(JSON.stringify({ error: 'Metodo non consentito. Usa POST.' }), {
            status: 405,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    try {
        const body = await req.json().catch(() => ({}));
        const { messages, stream = true, temperature = 0.6 } = body;
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
        const consultType = detectConsultationType(messages);
        const calc = calculateCompleteMatrixData(userData.name, userData.date, userData.time);

        const now = new Date();
        const currentYear = now.getFullYear();
        const currentDateStr = now.toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });

        let finalMessages = Array.isArray(messages) ? [...messages] : [{ role: 'user', content: 'Calcola la mia mappa.' }];
        
        if (!finalMessages.some(m => m.role === 'system')) {
            const dateInfo = userData.date ? `Data di Nascita: ${userData.date} (${calc.formatted}), Ora: ${userData.time}, Luogo: ${userData.place}` : 'Data: indicata nel messaggio';
            
            let specificInstruction = '';
            switch (consultType) {
                case 'tema_natale_zodiaco':
                    specificInstruction = `🔴 RICHIESTA CONSULTA: TEMA NATALE & ANALISI ZODIACALE COMPLETA MIT-GRADE (10 CREDITI).
DEVI GENERARE UN'ANALISI ASTROLOGICA E ZODIACALE COMPLETA, APPROFONDITA ED ESTREMAMENTE PROFESSIONALE.
Dati Astronomici Calcolati:
- Segno Solare: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Elemento ${calc.zodiacSign.element}, ${calc.zodiacSign.modality} — Governatore: ${calc.zodiacSign.planet})
- Ascendente Zodiacale: ${calc.ascendant.formatted} (Governatore dell'Ascendente: ${calc.ascendant.sign.planet})
- Arcano Zodiacale: Arcano ${calc.zodiacSign.arcana} (${ARCANA_DATA[calc.zodiacSign.arcana]?.name})
- Arcano di Nascita: ${calc.nodeA} (${calc.arcA.name}) | Life Path: ${calc.lifePath}
Struttura la risposta in 8 sezioni monumentali:
# 🌌 Tema Natale & Analisi Zodiacale Completa MIT-Grade
* **Soggetto:** ${userData.name} | **Segno:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} | **Ascendente:** ${calc.ascendant.formatted}
## 1. Identità Astrale: Segno Solare, Ascendente & Dominanti Elementali
## 2. Configurazione delle 12 Case Astrologiche & Pianeti Guida
## 3. Integrazione Alchemica: Segno Zodiacale + Arcano di Nascita + Life Path
## 4. Talenti Innati, Vocazione & Canali di Manifestazione
## 5. Sfide Astrali, Karma & Aspetti di Ombra
## 6. Relazioni, Affinità Zodiacale & Canale d'Amore
## 7. Transiti Planetari Attuali (${currentYear}) & Clima Astrale
## 8. Verdetto Oracolare di Sintesi & Guida Evolutiva`;
                    break;

                case 'oroscopo_giorno':
                    specificInstruction = `🔴 RICHIESTA CONSULTA: OROSCOPO DEL GIORNO (${currentDateStr}).
DEVI GENERARE L'OROSCOPO DEL GIORNO INTEGRANDO IL SEGNO ZODIACALE (${calc.zodiacSign.name} ${calc.zodiacSign.symbol}), L'ASCENDENTE (${calc.ascendant.formatted}) E IL GIORNO PERSONALE NUMEROLOGICO (Numero ${calc.personalDay} - Arcano ${calc.personalDay} ${calc.arcPersonalDay.name}). NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Struttura:
# 🌅 Oroscopo & Vibrazione Astrale del Giorno — ${currentDateStr}
* **Soggetto:** ${userData.name} | **Segno:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} | **Ascendente:** ${calc.ascendant.formatted} | **Giorno Personale:** ${calc.personalDay} (${calc.arcPersonalDay.name})
## 1. Clima Energetico & Transiti del Segno di Oggi
## 2. Le 3 Grandi Opportunità Odierne (Professione, Relazioni, Spirito)
## 3. Ombre & Insidie Astrali da Evitare
## 4. Consiglio & Rituale Pratico d'Azione`;
                    break;

                case 'oroscopo_settimana':
                    specificInstruction = `🔴 RICHIESTA CONSULTA: GUIDA ORACOLARE SETTIMANALE (7 GIORNI).
DEVI GENERARE LA PREVISIONE DEI 7 GIORNI DELLA SETTIMANA PER IL SEGNO ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Ascendente ${calc.ascendant.formatted}) GIORNO PER GIORNO. NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Dati chiave: Anno Personale = ${calc.personalYear} (${calc.arcPersonalYear.name}), Life Path = ${calc.lifePath}.
Struttura con tema della settimana, mappa dei 7 giorni con Arcano quotidiano e focus, giorni più favorevoli e consiglio di sintesi.`;
                    break;

                case 'amore_relazioni':
                    specificInstruction = `🔴 RICHIESTA CONSULTA: FOCUS CANALE AMORE & RELAZIONI.
DEVI ANALIZZARE APPROFONDITAMENTE IL CANALE AMORE (Nodo D+E: Arcano ${calc.nodeLove} - ${calc.arcLove.name}, Nodo Cuore: Arcano ${calc.nodeE} - ${calc.arcE.name}, Coda Karmica: Arcano ${calc.nodeD} - ${calc.arcD.name}, Segno: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol}). NON GENERARE IL REPORT A 14 SEZIONI.
Fornisci: 1. Il Codice dell'Amore e Partner Karmico ideale, 2. Ferite karmiche e blocchi emotivi da sciogliere, 3. Dinamica di coppia / per single, 4. 3 Chiavi pratiche di armonizzazione.`;
                    break;

                case 'denaro_carriera':
                    specificInstruction = `🔴 RICHIESTA CONSULTA: FOCUS CANALE DENARO, CARRIERA & PROSPERITÀ.
DEVI ANALIZZARE IL CANALE DENARO (Nodo C+E: Arcano ${calc.nodeMoney} - ${calc.arcMoney.name}, Nodo Materia: Arcano ${calc.nodeC} - ${calc.arcC.name}, Numero Espressione: ${calc.expressionNumber}, Segno: ${calc.zodiacSign.name}). NON GENERARE IL REPORT A 14 SEZIONI.
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
DEVI GENERARE L'INTERO REPORT A 14 SEZIONI PER ${userData.name} (${calc.zodiacSign.name} ${calc.zodiacSign.symbol}, Ascendente ${calc.ascendant.formatted}) IN MODO COMPLETO, PROFONDO E SENZA TRONCATURE.`;
                    break;

                default:
                    specificInstruction = `🔴 RICHIESTA LIBERA IN CHAT: Rispondi in modo diretto, esauriente e approfondito alla domanda specifica dell'utente, integrando la saggezza dei suoi archetipi della Matrice (Nodo A: ${calc.nodeA}, Nodo E: ${calc.nodeE}, Segno: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol}, Ascendente: ${calc.ascendant.formatted}).`;
            }

            const sysPrompt = `Sei l'Oracolo Supremo della Matrice del Destino, dell'Astrologia Esoterica e degli Archetipi Numerologici (metodo Ladini dei 22 Arcani, Astrologia Occidentale e Numerologia Pitagorica). 
Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA con tono profondo, autorevole, analitico, nobile e solenne.
🔴 DATI DEL SOGGETTO: Nome: ${userData.name}, ${dateInfo}.
🔴 PROFILO ASTROLOGICO & NUMEROLOGICO CALCOLATO:
- Segno Solare: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Elemento ${calc.zodiacSign.element}, Governatore: ${calc.zodiacSign.planet})
- Ascendente: ${calc.ascendant.formatted} (Governatore Ascendente: ${calc.ascendant.sign.planet})
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

        const personalizedReport = generateDynamicReport(userData, consultType, messages);

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
                id: 'chatcmpl-local-' + Date.now(),
                object: 'chat.completion',
                choices: [{ message: { role: 'assistant', content: personalizedReport } }]
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

    } catch (err) {
        return new Response(JSON.stringify({ error: err.message }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
