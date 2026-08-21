/**
 * Motore di Calcolo Numerologico & Matrice del Destino (22 Arcani Maggiori)
 * Calcoli fedeli alla tradizione numerologica pitagorica e al metodo della Matrice del Destino (Ladini).
 */

const ARCANA_DATA = {
    1: { name: "Il Mago", archetype: "L'Iniziatore / Creatore", keywords: "Forza di volontà, iniziativa, potenziale, leadership, azione", element: "Etere / Aria" },
    2: { name: "La Papessa", archetype: "La Guida Intuitiva / Custode dei Misteri", keywords: "Intuizione, saggezza segreta, diplomazia, calma, osservazione", element: "Acqua" },
    3: { name: "L'Imperatrice", archetype: "La Madre / Bellezza e Abbondanza", keywords: "Fecondità, creatività, prosperità materiale, cura, armonia", element: "Terra" },
    4: { name: "L'Imperatore", archetype: "Il Sovrano / Ordine e Struttura", keywords: "Autorità, disciplina, leadership solida, stabilità, protezione", element: "Fuoco" },
    5: { name: "Il Papa / Lo Ierofante", archetype: "Il Maestro / Tradizione e Conoscenza", keywords: "Insegnamento, etica, valori spirituali, regole, verità", element: "Terra / Etere" },
    6: { name: "Gli Amanti", archetype: "Il Connettore / Scelta del Cuore", keywords: "Amore, relazioni, empatia, senso estetico, armonia sociale", element: "Aria" },
    7: { name: "Il Carro", archetype: "Il Conquistatore / Determinazione", keywords: "Vittoria, direzione chiara, superamento ostacoli, dinamismo", element: "Fuoco / Acqua" },
    8: { name: "La Giustizia", archetype: "L'Equilibratore / Legge di Causa-Effetto", keywords: "Equilibrio karmico, verità, onestà, oggettività, causa ed effetto", element: "Aria" },
    9: { name: "L'Eremita", archetype: "Il Saggio Solitario / Ricerca Interiore", keywords: "Introspezione, profondità, saggezza maturata, luce interiore", element: "Terra" },
    10: { name: "La Ruota della Fortuna", archetype: "Il Flusso del Destino / Sincronicità", keywords: "Fortuna, ciclicità, fiducia nel flusso, opportunità inattese", element: "Fuoco / Etere" },
    11: { name: "La Forza", archetype: "Il Guerriero Gentile / Energia Vitale", keywords: "Resistenza, padronanza istintiva, passione controllata, vigore", element: "Fuoco" },
    12: { name: "L'Appeso", archetype: "Il Mistico Servitore / Visione Alternativa", keywords: "Prospettiva ribaltata, altruismo, sacrificio consapevole, compassione", element: "Acqua" },
    13: { name: "La Trasformazione (Morte)", archetype: "Il Rinnovatore / Rinascita", keywords: "Chiusura cicli, rinnovamento radicale, metamorfosi, evoluzione", element: "Acqua / Fuoco" },
    14: { name: "La Temperanza", archetype: "L'Alchimista / Guarigione e Misura", keywords: "Armonia, moderazione, arte della sintesi, pazienza, flusso calmo", element: "Aria / Acqua" },
    15: { name: "Il Diavolo", archetype: "Il Magnetico / Potere e Ombra", keywords: "Carisma, desideri materiali, liberazione dai condizionamenti, energia sessuale", element: "Fuoco / Terra" },
    16: { name: "La Torre", archetype: "Il Risvegliatore / Crollo dei Dogmi", keywords: "Rivelazione improvvisa, abbattimento illusioni, ricostruzione autentica", element: "Fuoco" },
    17: { name: "La Stella", archetype: "La Musa Ispiratrice / Speranza e Talento", keywords: "Fama, ispirazione artistica, fede nel futuro, purezza, autenticità", element: "Aria" },
    18: { name: "La Luna", archetype: "Il Sognatore / Inconscio e Immaginazione", keywords: "Mistero, chiaroveggenza, superamento delle paure, immaginazione vivida", element: "Acqua" },
    19: { name: "Il Sole", archetype: "L'Illuminatore / Gioia e Successo", keywords: "Vitalità, generosità, abbondanza, chiarezza mentale, radiazione positiva", element: "Fuoco" },
    20: { name: "Il Giudizio", archetype: "La Voce Ancestrale / Chiamata di Vocazione", keywords: "Risveglio karmico, legami ancestrali, rinascita spirituale, vocazione", element: "Fuoco / Aria" },
    21: { name: "Il Mondo", archetype: "Il Cosmopolita / Realizzazione Totale", keywords: "Completezza, confini aperti, integrazione globale, pace interiore", element: "Terra / Etere" },
    22: { name: "Il Matto", archetype: "Il Viaggiatore Libero / Fiducia Assoluta", keywords: "Libertà, spontaneità, inizio del viaggio, assenza di vincoli, gioia pura", element: "Aria" }
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
    return ZODIAC_SIGNS[11];
}

function isItalianDST(y, m, d) {
    if (m < 3 || m > 10) return false;
    if (m > 3 && m < 10) return true;
    const lastSunMarch = 31 - (new Date(Date.UTC(y, 2, 31)).getUTCDay());
    if (m === 3) return d >= lastSunMarch;
    const lastSunOct = 31 - (new Date(Date.UTC(y, 9, 31)).getUTCDay());
    if (m === 10) return d < lastSunOct;
    return false;
}

function resolveCoordinates(placeStr) {
    if (!placeStr || typeof placeStr !== 'string') return { lat: 37.50, lon: 15.08 };
    const p = placeStr.toLowerCase();
    if (p.includes('catania') || p.includes('misterbianco') || p.includes('siracusa') || p.includes('ragusa') || p.includes('enna') || p.includes('messina') || p.includes('caltanissetta')) {
        return { lat: 37.50, lon: 15.08 };
    }
    if (p.includes('palermo') || p.includes('trapani') || p.includes('agrigento')) {
        return { lat: 38.12, lon: 13.36 };
    }
    if (p.includes('roma') || p.includes('lazio')) {
        return { lat: 41.90, lon: 12.50 };
    }
    if (p.includes('milano') || p.includes('lombardia') || p.includes('monza') || p.includes('bergamo') || p.includes('brescia')) {
        return { lat: 45.46, lon: 9.19 };
    }
    if (p.includes('napoli') || p.includes('campania') || p.includes('salerno') || p.includes('caserta')) {
        return { lat: 40.85, lon: 14.27 };
    }
    if (p.includes('torino') || p.includes('piemonte')) {
        return { lat: 45.07, lon: 7.68 };
    }
    if (p.includes('firenze') || p.includes('toscana') || p.includes('pisa')) {
        return { lat: 43.77, lon: 11.25 };
    }
    if (p.includes('bologna') || p.includes('emilia') || p.includes('modena') || p.includes('parma')) {
        return { lat: 44.49, lon: 11.34 };
    }
    if (p.includes('bari') || p.includes('puglia') || p.includes('lecce') || p.includes('taranto')) {
        return { lat: 41.12, lon: 16.87 };
    }
    if (p.includes('venezia') || p.includes('veneto') || p.includes('verona') || p.includes('padova')) {
        return { lat: 45.44, lon: 12.33 };
    }
    if (p.includes('genova') || p.includes('liguria')) {
        return { lat: 44.41, lon: 8.93 };
    }
    if (p.includes('cagliari') || p.includes('sardegna') || p.includes('sassari')) {
        return { lat: 39.22, lon: 9.12 };
    }
    return { lat: 41.90, lon: 12.50 };
}

function calculateAscendant(day, month, year, timeStr, placeStr = null) {
    let hours = 12, minutes = 0;
    let hasExactTime = false;
    if (timeStr && timeStr !== 'non disponibile' && timeStr !== 'non specificato') {
        const timeParts = String(timeStr).match(/(\d{1,2})[:.](\d{2})/);
        if (timeParts) {
            hours = parseInt(timeParts[1], 10);
            minutes = parseInt(timeParts[2], 10);
            hasExactTime = true;
        }
    }

    const coords = resolveCoordinates(placeStr);
    const latitude = coords.lat;
    const longitude = coords.lon;

    const tzOffset = isItalianDST(year, month, day) ? 2 : 1;
    const utcHours = hours + minutes / 60 - tzOffset;

    let y = year;
    let m = month;
    if (m <= 2) {
        y -= 1;
        m += 12;
    }
    const A = Math.floor(y / 100);
    const B = 2 - A + Math.floor(A / 4);
    const dayFraction = utcHours / 24;
    const JD = Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5 + dayFraction;

    const T = (JD - 2451545.0) / 36525.0;

    let GMST = 280.46061837 + 360.98564736629 * (JD - 2451545.0) + 0.000387933 * T * T - (T * T * T) / 38710000.0;
    GMST = ((GMST % 360) + 360) % 360;

    let RAMC = ((GMST + longitude) % 360 + 360) % 360;
    const ramcRad = RAMC * Math.PI / 180;

    const eps = (23.4392911 - 0.0130042 * T) * Math.PI / 180;
    const latRad = latitude * Math.PI / 180;

    const yEcl = Math.cos(ramcRad);
    const xEcl = -Math.sin(ramcRad) * Math.cos(eps) - Math.tan(latRad) * Math.sin(eps);

    let ascDeg = Math.atan2(yEcl, xEcl) * 180 / Math.PI;
    ascDeg = ((ascDeg % 360) + 360) % 360;

    const zodiac = [
        { name: "Ariete", symbol: "♈", element: "Fuoco" },
        { name: "Toro", symbol: "♉", element: "Terra" },
        { name: "Gemelli", symbol: "♊", element: "Aria" },
        { name: "Cancro", symbol: "♋", element: "Acqua" },
        { name: "Leone", symbol: "♌", element: "Fuoco" },
        { name: "Vergine", symbol: "♍", element: "Terra" },
        { name: "Bilancia", symbol: "♎", element: "Aria" },
        { name: "Scorpione", symbol: "♏", element: "Acqua" },
        { name: "Sagittario", symbol: "♐", element: "Fuoco" },
        { name: "Capricorno", symbol: "♑", element: "Terra" },
        { name: "Acquario", symbol: "♒", element: "Aria" },
        { name: "Pesci", symbol: "♓", element: "Acqua" }
    ];

    const signIndex = Math.floor(ascDeg / 30) % 12;
    const degreeInSign = Math.floor(ascDeg % 30);
    const minutesInSign = Math.floor(((ascDeg % 30) - degreeInSign) * 60);
    const ascendantSign = zodiac[signIndex];

    return {
        sign: ascendantSign,
        degree: degreeInSign,
        minutes: minutesInSign,
        totalDegrees: ascDeg,
        hasExactTime,
        formatted: `${ascendantSign.name} ${ascendantSign.symbol} (~${degreeInSign}°)`
    };
}

const LETTER_VALUES = {
    'A': 1, 'B': 2, 'C': 3, 'D': 4, 'E': 5, 'F': 6, 'G': 7, 'H': 8, 'I': 9,
    'J': 1, 'K': 2, 'L': 3, 'M': 4, 'N': 5, 'O': 6, 'P': 7, 'Q': 8, 'R': 9,
    'S': 1, 'T': 2, 'U': 3, 'V': 4, 'W': 5, 'X': 6, 'Y': 7, 'Z': 8,
    'À': 1, 'È': 5, 'É': 5, 'Ì': 9, 'Ò': 6, 'Ù': 3
};

const VOWELS = new Set(['A', 'E', 'I', 'O', 'U', 'Y', 'À', 'È', 'É', 'Ì', 'Ò', 'Ù']);

// Riduzione a 22 (Metodo Matrice del Destino)
function reduceTo22(n) {
    if (n <= 0) return 22;
    while (n > 22) {
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
}

// Riduzione a singola cifra (1-9 con preservazione Master Numbers se specificato)
function reduceToDigit(n, keepMaster = false) {
    if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
    while (n > 9) {
        if (keepMaster && (n === 11 || n === 22 || n === 33)) return n;
        n = String(n).split('').reduce((sum, d) => sum + parseInt(d, 10), 0);
    }
    return n;
}

// Calcolo completo Matrice del Destino e Numerologia
function calculateCompleteMatrix(fullName, birthDateStr, birthTimeStr = 'non disponibile') {
    const cleanName = (fullName || 'Utente').toUpperCase().trim();
    
    // 1. Analisi del Nome
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

    const soulNumber = reduceToDigit(vowelSum || 11, true); // Numero dell'Anima (Vocali)
    const personalityNumber = reduceToDigit(consonantSum || 7, true); // Numero della Personalità (Consonanti)
    const expressionNumber = reduceToDigit(totalNameSum || 9, true); // Numero dell'Espressione

    // 2. Analisi della Data di Nascita
    const dateObj = new Date(birthDateStr);
    let day = 28, month = 11, year = 1992;
    if (!isNaN(dateObj.getTime())) {
        day = dateObj.getUTCDate();
        month = dateObj.getUTCMonth() + 1;
        year = dateObj.getUTCFullYear();
    } else {
        const match = (birthDateStr || '').match(/(\d{1,2})[^\d](\d{1,2})[^\d](\d{4})/);
        if (match) {
            day = parseInt(match[1], 10);
            month = parseInt(match[2], 10);
            year = parseInt(match[3], 10);
        }
    }

    // Life Path (Percorso di Vita)
    const dayReduced = reduceToDigit(day);
    const monthReduced = reduceToDigit(month);
    const yearDigitsSum = String(year).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const yearReduced = reduceToDigit(yearDigitsSum);
    const lifePath = reduceToDigit(dayReduced + monthReduced + yearReduced, true);

    // 3. Nodi Matrice del Destino (Sistema Ladini a 22 Arcani)
    const nodeA = reduceTo22(day); // Punto Alto (Giorno / Risorse personali)
    const nodeB = reduceTo22(month); // Punto Sinistro (Mese / Intuizione, linea spirituale)
    const nodeC = reduceTo22(yearDigitsSum); // Punto Destro (Anno / Materia, finanze)
    const nodeD = reduceTo22(nodeA + nodeB + nodeC); // Punto Basso (Coda karmica / Lezioni)
    const nodeE = reduceTo22(nodeA + nodeB + nodeC + nodeD); // Centro (Cuore / Comfort Zone)

    // Punti intermedi assi spirituali/materiali
    const nodeFatherTop = reduceTo22(nodeA + nodeB);
    const nodeMotherTop = reduceTo22(nodeB + nodeC);
    const nodeMotherBottom = reduceTo22(nodeB + nodeD);
    const nodeFatherBottom = reduceTo22(nodeC + nodeD);

    // Linea Denaro e Amore
    const nodeMoney = reduceTo22(nodeC + nodeE);
    const nodeLove = reduceTo22(nodeD + nodeE);

    // 4. Griglia Numerologica 3x3 Pitagorica
    const dateDigits = `${day}${month}${year}`.split('');
    const grid3x3 = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
    for (const d of dateDigits) {
        const val = parseInt(d, 10);
        if (val >= 1 && val <= 9) grid3x3[val] = (grid3x3[val] || 0) + 1;
    }

    const zodiacSign = calculateZodiacSign(day, month);
    const ascendant = calculateAscendant(day, month, year, birthTimeStr);

    return {
        name: fullName || 'Elena Solaris',
        birthDate: { day, month, year, formatted: `${day}/${month}/${year}` },
        zodiacSign,
        ascendant,
        numerology: {
            lifePath,
            soulNumber,
            personalityNumber,
            expressionNumber,
            maturityNumber: reduceToDigit(lifePath + expressionNumber)
        },
        matrix: {
            top: { code: 'A', value: nodeA, label: 'Spirito / Risorse Interiori (Giorno)', arcana: ARCANA_DATA[nodeA] },
            left: { code: 'B', value: nodeB, label: 'Anima / Intuizione & Connessione (Mese)', arcana: ARCANA_DATA[nodeB] },
            right: { code: 'C', value: nodeC, label: 'Materia / Risultati & Finanze (Anno)', arcana: ARCANA_DATA[nodeC] },
            bottom: { code: 'D', value: nodeD, label: 'Coda Karmica / Lezione Principale', arcana: ARCANA_DATA[nodeD] },
            center: { code: 'E', value: nodeE, label: 'Nucleo / Comfort Zone & Armonia', arcana: ARCANA_DATA[nodeE] },
            money: { code: 'M', value: nodeMoney, label: 'Punto di Sblocco Finanziario', arcana: ARCANA_DATA[nodeMoney] },
            love: { code: 'L', value: nodeLove, label: 'Canale Relazioni & Amore', arcana: ARCANA_DATA[nodeLove] },
            fatherTop: { code: 'F1', value: nodeFatherTop, label: 'Linea Ancestrale Paterna', arcana: ARCANA_DATA[nodeFatherTop] },
            fatherBottom: { code: 'F2', value: nodeFatherBottom, label: 'Karma Paterno', arcana: ARCANA_DATA[nodeFatherBottom] },
            motherTop: { code: 'M1', value: nodeMotherTop, label: 'Linea Ancestrale Materna', arcana: ARCANA_DATA[nodeMotherTop] },
            motherBottom: { code: 'M2', value: nodeMotherBottom, label: 'Karma Materno', arcana: ARCANA_DATA[nodeMotherBottom] }
        },
        letterCounts,
        grid3x3
    };
}

function yearDigits(year) {
    return String(year).split('').reduce((s, d) => s + parseInt(d, 10), 0);
}

function generatePersonalYears(day, month) {
    const currentYear = new Date().getFullYear();
    let res = '';
    for (let i = 0; i < 5; i++) {
        const y = currentYear + i;
        const pYear = reduceToDigit(reduceToDigit(day) + reduceToDigit(month) + reduceToDigit(yearDigits(y)));
        res += `* **Anno ${y} (Anno Personale ${pYear}):** Energia evolutiva associata all'Arcano/Numero ${pYear}.\n`;
    }
    return res;
}

function generateCompleteReport14Sections(calcData, analysisType = "2. Numerologica + Astrologica simbolica") {
    const { name, birthDate, numerology, matrix, letterCounts, grid3x3 } = calcData;
    const { lifePath, soulNumber, personalityNumber, expressionNumber, maturityNumber } = numerology;
    const { day, month, year, formatted } = birthDate;

    return `# Report Completo di Analisi Numerologica & Matrice del Destino

> **Disclaimer Etico:** Questa analisi si basa sui principi simbolici dei 22 Arcani Maggiori. Non costituisce una verità scientifica o una previsione deterministica del futuro, ma uno strumento per favorire autoconsapevolezza ed evoluzione personale.

---

## 1. Sintesi Iniziale
* **Soggetto:** ${name}
* **Data di Nascita:** ${formatted}
* **Tipo di Analisi:** ${analysisType}
* **Livello di Complessità:** Elevata integrazione tra asse spirituale (${matrix.top.value} - ${matrix.top.arcana.name}) e asse materiale (${matrix.right.value} - ${matrix.right.arcana.name}).
* **Numeri Dominanti:** Arcano ${matrix.center.value} (${matrix.center.arcana.name}), Arcano ${matrix.top.value} (${matrix.top.arcana.name}), Percorso di Vita ${lifePath}.
* **Pattern Evidenti:** Ricerca di equilibrio armonico tra l'energia interiore dell'anima (${soulNumber}) e la proiezione nel mondo materiale (${expressionNumber}).

---

## 2. Analisi del Nome
* **Nome Completo:** ${name}
* **Numero dell'Espressività (Destino):** **${expressionNumber}** — I talenti globali e la modalità di impatto nel mondo.
* **Numero dell'Anima (Vocali):** **${soulNumber}** — I desideri autentici del cuore, le motivazioni profonde e i valori spirituali.
* **Numero della Personalità (Consonanti):** **${personalityNumber}** — L'immagine sociale e la presenza relazionale.
* **Numero del Desiderio Interiore:** **${soulNumber}** — La motivazione essenziale.
* **Numero della Maturità:** **${maturityNumber}** — La sintesi evolutiva che si sviluppa nella seconda metà della vita.
* **Numero dell'Equilibrio:** **${reduceToDigit(day)}** — Il punto di stabilità emotiva e decisionale.

---

## 3. Frequenza delle Lettere
* **Distribuzione Cifre (1-9):**
${Object.entries(letterCounts).map(([num, count]) => `  - Numero ${num}: ${count} ${count === 1 ? 'presenza' : 'presenze'}`).join('\n')}
* **Numeri Dominanti:** ${Object.entries(letterCounts).filter(([_, c]) => c >= 3).map(([n]) => n).join(', ') || 'Distribuzione bilanciata'}
* **Numeri Mancanti (Lezioni Karmiche):** ${Object.entries(letterCounts).filter(([_, c]) => c === 0).map(([n]) => n).join(', ') || 'Nessun numero completamente assente'}

---

## 4. Analisi della Data di Nascita
* **Percorso di Vita (Life Path):** **${lifePath}** — Il sentiero principale dell'esistenza.
* **Giorno di Nascita (Spirito):** ${day} (Arcano **${matrix.top.value}** - ${matrix.top.arcana.name})
* **Mese di Nascita (Anima):** ${month} (Arcano **${matrix.left.value}** - ${matrix.left.arcana.name})
* **Anno di Nascita (Materia):** ${year} (Arcano **${matrix.right.value}** - ${matrix.right.arcana.name})
* **Coda Karmica (Terra / Vite Passate):** Arcano **${matrix.bottom.value}** - ${matrix.bottom.arcana.name}
* **Talenti:** Resilienza, leadership naturale, intuizione archetipica.

---

## 5. Matrice Numerologica (Griglia 3×3 Pitagorica)
* **Piano Mentale (3-6-9):** Presenze [3: ${grid3x3[3] || 0}, 6: ${grid3x3[6] || 0}, 9: ${grid3x3[9] || 0}] — Capacità di elaborazione strategica e concettuale.
* **Piano Emotivo (2-5-8):** Presenze [2: ${grid3x3[2] || 0}, 5: ${grid3x3[5] || 0}, 8: ${grid3x3[8] || 0}] — Sensibilità empatica e intelligenza relazionale.
* **Piano Fisico / Pratico (1-4-7):** Presenze [1: ${grid3x3[1] || 0}, 4: ${grid3x3[4] || 0}, 7: ${grid3x3[7] || 0}] — Concretizzazione dei progetti nella materia.

---

## 6. Cicli della Vita
* **Primo Ciclo (Formazione, 0-28 anni):** Arcano ${matrix.left.value} (${matrix.left.arcana.name}) — Ricerca dell'identità.
* **Secondo Ciclo (Maturità, 29-56 anni):** Arcano ${matrix.top.value} (${matrix.top.arcana.name}) — Espansione e realizzazione.
* **Terzo Ciclo (Saggezza, 57+ anni):** Arcano ${matrix.right.value} (${matrix.right.arcana.name}) — Maestria e trasmissione.

---

## 7. I Quattro Pinnacoli
1. **Primo Pinnacolo:** Numero ${reduceToDigit(day + month)} — Fondamenta individuali.
2. **Secondo Pinnacolo:** Numero ${reduceToDigit(day + yearDigits(year))} — Responsabilità ed espansione.
3. **Terzo Pinnacolo:** Numero ${reduceToDigit(reduceToDigit(day + month) + reduceToDigit(day + yearDigits(year)))} — Consolidamento.
4. **Quarto Pinnacolo:** Numero ${reduceToDigit(month + yearDigits(year))} — Realizzazione spirituale.

---

## 8. Le Sfide Evolutive
* **Prima Sfida:** ${Math.abs(reduceToDigit(day) - reduceToDigit(month))}
* **Seconda Sfida:** ${Math.abs(reduceToDigit(day) - reduceToDigit(yearDigits(year)))}
* **Sfida Principale:** ${Math.abs(Math.abs(reduceToDigit(day) - reduceToDigit(month)) - Math.abs(reduceToDigit(day) - reduceToDigit(yearDigits(year))))}

---

## 9. Anni Personali
${generatePersonalYears(day, month)}

---

## 10. Mesi Personali & 11. Giorni Personali
* **Mese Corrente:** Calcolato sommando l'Anno Personale in corso al mese di calendario.
* **Giorno Personale:** Scandisce le micro-scelte quotidiane.

---

## 12. Metadata Simbolici (Profilo di Sistema)
* **Core:** Arcano ${matrix.center.value} (${matrix.center.arcana.name}) — Il centro energetico.
* **Driver:** Arcano ${matrix.top.value} (${matrix.top.arcana.name}) — La forza motrice d'azione.
* **Canale Finanziario & Risorse:** Arcano ${matrix.money.value} (${matrix.money.arcana.name}) — ${matrix.money.arcana.keywords}.
* **Canale Relazioni & Amore:** Arcano ${matrix.love.value} (${matrix.love.arcana.name}) — ${matrix.love.arcana.keywords}.
* **Punti di Forza:** Resilienza, intuizione, profondità d'analisi.
* **Rischi:** Perfezionismo eccessivo, tendenza al sovraccarico mentale.

---

## 13. Archetipi Dominanti
* **Archetipo Primario:** *${matrix.center.arcana.name} (${matrix.center.arcana.archetype})*
* **Archetipo Secondario:** *${matrix.top.arcana.name} (${matrix.top.arcana.archetype})*

---

## 14. Sintesi Finale & Riflessione di Consapevolezza
La tua configurazione rivela una naturale inclinazione alla leadership etica e alla trasformazione creativa. La chiave evolutiva risiede nell'integrare la profondità intuitiva con azioni strutturate e costanti.`;
}

function calculateDailyHoroscope(birthDateStr, targetDate = new Date()) {
    const parts = birthDateStr.split(/[-/.]/);
    let day = 17, month = 8, year = 1986;
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

    const tDay = targetDate.getDate();
    const tMonth = targetDate.getMonth() + 1;
    const tYear = targetDate.getFullYear();

    const tYearSum = String(tYear).split('').reduce((s, d) => s + parseInt(d, 10), 0);
    const personalYear = reduceToDigit(reduceToDigit(day) + reduceToDigit(month) + reduceToDigit(tYearSum));
    const personalMonth = reduceToDigit(personalYear + reduceToDigit(tMonth));
    const personalDay = reduceToDigit(personalMonth + reduceToDigit(tDay));

    const arcDaily = ARCANA_DATA[reduceTo22(personalDay)] || ARCANA_DATA[1];
    const arcUniversal = ARCANA_DATA[reduceTo22(reduceToDigit(tDay) + reduceToDigit(tMonth) + reduceToDigit(tYearSum))] || ARCANA_DATA[1];

    return {
        dateFormatted: `${String(tDay).padStart(2, '0')}/${String(tMonth).padStart(2, '0')}/${tYear}`,
        personalYear,
        personalMonth,
        personalDay,
        arcDaily,
        arcUniversal,
        title: `Oroscopo del Giorno — ${String(tDay).padStart(2, '0')}/${String(tMonth).padStart(2, '0')}/${tYear}`,
        focus: `Vibrazione Personale: Arcano ${personalDay} (${arcDaily.name}) | Clima Universale: Arcano ${arcUniversal.name}`,
        keywords: arcDaily.keywords
    };
}

function calculateWeeklyForecast(birthDateStr, startDate = new Date()) {
    const weekDays = [];
    const dayNames = ['Domenica', 'Lunedì', 'Martedì', 'Mercoledì', 'Giovedì', 'Venerdì', 'Sabato'];
    
    for (let i = 0; i < 7; i++) {
        const curr = new Date(startDate);
        curr.setDate(startDate.getDate() + i);
        const horo = calculateDailyHoroscope(birthDateStr, curr);
        weekDays.push({
            dayName: dayNames[curr.getDay()],
            ...horo
        });
    }

    return weekDays;
}

function calculateSynastryMatrix(birthDate1, birthDate2, name1 = 'Partner 1', name2 = 'Partner 2') {
    const mat1 = calculateCompleteMatrix(birthDate1, name1);
    const mat2 = calculateCompleteMatrix(birthDate2, name2);

    const synTop = reduceTo22(mat1.matrix.top.value + mat2.matrix.top.value);
    const synLeft = reduceTo22(mat1.matrix.left.value + mat2.matrix.left.value);
    const synRight = reduceTo22(mat1.matrix.right.value + mat2.matrix.right.value);
    const synBottom = reduceTo22(mat1.matrix.bottom.value + mat2.matrix.bottom.value);
    const synCenter = reduceTo22(synTop + synLeft + synRight + synBottom);

    const synLove = reduceTo22(synBottom + synCenter);
    const synMoney = reduceTo22(synRight + synCenter);

    return {
        partner1: { name: name1, date: birthDate1, matrix: mat1 },
        partner2: { name: name2, date: birthDate2, matrix: mat2 },
        synastry: {
            top: { value: synTop, arcana: ARCANA_DATA[synTop] || ARCANA_DATA[1] },
            left: { value: synLeft, arcana: ARCANA_DATA[synLeft] || ARCANA_DATA[1] },
            right: { value: synRight, arcana: ARCANA_DATA[synRight] || ARCANA_DATA[1] },
            bottom: { value: synBottom, arcana: ARCANA_DATA[synBottom] || ARCANA_DATA[1] },
            center: { value: synCenter, arcana: ARCANA_DATA[synCenter] || ARCANA_DATA[1] },
            love: { value: synLove, arcana: ARCANA_DATA[synLove] || ARCANA_DATA[1] },
            money: { value: synMoney, arcana: ARCANA_DATA[synMoney] || ARCANA_DATA[1] }
        }
    };
}

function calculateAdvancedPinnacles(birthDateStr) {
    const parts = birthDateStr.split(/[-/.]/);
    let day = 17, month = 8, year = 1986;
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

    const dayD = reduceToDigit(day);
    const monthD = reduceToDigit(month);
    const yearD = reduceToDigit(yearDigits(year));
    const lifePath = reduceToDigit(dayD + monthD + yearD);

    const p1Age = 36 - lifePath;
    const p2Age = p1Age + 9;
    const p3Age = p2Age + 9;

    const p1 = reduceToDigit(dayD + monthD);
    const p2 = reduceToDigit(dayD + yearD);
    const p3 = reduceToDigit(p1 + p2);
    const p4 = reduceToDigit(monthD + yearD);

    const ch1 = Math.abs(dayD - monthD);
    const ch2 = Math.abs(dayD - yearD);
    const ch3 = Math.abs(ch1 - ch2);
    const ch4 = Math.abs(monthD - yearD);

    return {
        lifePath,
        pinnacles: [
            { num: 1, value: p1, ageRange: `0 - ${p1Age} anni`, arcana: ARCANA_DATA[reduceTo22(p1)] || ARCANA_DATA[1] },
            { num: 2, value: p2, ageRange: `${p1Age + 1} - ${p2Age} anni`, arcana: ARCANA_DATA[reduceTo22(p2)] || ARCANA_DATA[1] },
            { num: 3, value: p3, ageRange: `${p2Age + 1} - ${p3Age} anni`, arcana: ARCANA_DATA[reduceTo22(p3)] || ARCANA_DATA[1] },
            { num: 4, value: p4, ageRange: `${p3Age + 1}+ anni (Maestria)`, arcana: ARCANA_DATA[reduceTo22(p4)] || ARCANA_DATA[1] }
        ],
        challenges: [
            { num: 1, value: ch1, desc: "Sfida relazionale ed espressione delle emozioni" },
            { num: 2, value: ch2, desc: "Sfida dell'autonomia e della fiducia nelle proprie forze" },
            { num: 3, value: ch3, desc: "Sfida cardine di sintesi e allineamento di vita" },
            { num: 4, value: ch4, desc: "Sfida spirituale e superamento dei dogmi interiori" }
        ]
    };
}

function detectConsultationType(messages) {
    if (!Array.isArray(messages) || messages.length === 0) return 'matrice_completa';
    const lastUserMsg = ([...messages].reverse().find(m => m.role === 'user')?.content || '').toLowerCase();

    if (lastUserMsg.includes('tema natale') || lastUserMsg.includes('calcolo zodiacale') || lastUserMsg.includes('analisi zodiacale') || lastUserMsg.includes('zodiaco mit') || lastUserMsg.includes('zodiacale')) {
        return 'tema_natale_zodiaco';
    }
    if (lastUserMsg.includes('oroscopo del giorno') || lastUserMsg.includes('oroscopo di oggi') || lastUserMsg.includes('oroscopo giorno') || lastUserMsg.includes('vibrazione astrale') || (lastUserMsg.includes('oroscopo') && !lastUserMsg.includes('settiman'))) {
        return 'oroscopo_giorno';
    }
    if (lastUserMsg.includes('guida oracolare settimanale') || lastUserMsg.includes('previsione 7 giorni') || lastUserMsg.includes('settimana corrente') || lastUserMsg.includes('settimanale') || lastUserMsg.includes('week')) {
        return 'oroscopo_settimana';
    }
    if (lastUserMsg.includes('focus canale amore') || lastUserMsg.includes('canale dell\'amore') || lastUserMsg.includes('relazioni di coppia') || lastUserMsg.includes('partner karmico') || lastUserMsg.includes('canale amore') || lastUserMsg.includes('nodo d + e') || lastUserMsg.includes('amore')) {
        return 'amore_relazioni';
    }
    if (lastUserMsg.includes('focus canale denaro') || lastUserMsg.includes('canale del denaro') || lastUserMsg.includes('carriera & abbondanza') || lastUserMsg.includes('abbondanza') || lastUserMsg.includes('monetizzare') || lastUserMsg.includes('canale denaro') || lastUserMsg.includes('nodo c + e') || lastUserMsg.includes('denaro')) {
        return 'denaro_carriera';
    }
    if (lastUserMsg.includes('master report') || lastUserMsg.includes('4 pinnacoli') || lastUserMsg.includes('pinnacoli evolutivi') || lastUserMsg.includes('sfide evolutive') || lastUserMsg.includes('pinnacoli')) {
        return 'pinnacoli_sfide';
    }
    if (lastUserMsg.includes('sinastria') || lastUserMsg.includes('matrice congiunta') || lastUserMsg.includes('partner 1') || lastUserMsg.includes('partner 2')) {
        return 'sinastria';
    }
    if (lastUserMsg.includes('meditazione guidata') || lastUserMsg.includes('audio-meditazione') || lastUserMsg.includes('meditazione')) {
        return 'meditazione';
    }
    if (lastUserMsg.includes('14 sezioni') || lastUserMsg.includes('report completo') || lastUserMsg.includes('modulo guidato') || lastUserMsg.includes('ecco i miei dati completi')) {
        return 'matrice_completa';
    }
    return 'dialogo_libero';
}

function getZodiacDetailsFromLongitude(longitude) {
    const norm = (longitude % 360 + 360) % 360;
    const signIndex = Math.floor(norm / 30);
    const degree = Math.floor(norm % 30);
    const minutes = Math.floor((norm % 1) * 60);
    const signsOrdered = [
        { name: "Ariete", symbol: "♈", element: "Fuoco", modality: "Cardinale", planet: "Marte", arcana: 4 },
        { name: "Toro", symbol: "♉", element: "Terra", modality: "Fisso", planet: "Venere", arcana: 5 },
        { name: "Gemelli", symbol: "♊", element: "Aria", modality: "Mobile", planet: "Mercurio", arcana: 6 },
        { name: "Cancro", symbol: "♋", element: "Acqua", modality: "Cardinale", planet: "Luna", arcana: 7 },
        { name: "Leone", symbol: "♌", element: "Fuoco", modality: "Fisso", planet: "Sole", arcana: 19 },
        { name: "Vergine", symbol: "♍", element: "Terra", modality: "Mobile", planet: "Mercurio", arcana: 9 },
        { name: "Bilancia", symbol: "♎", element: "Aria", modality: "Cardinale", planet: "Venere", arcana: 8 },
        { name: "Scorpione", symbol: "♏", element: "Acqua", modality: "Fisso", planet: "Plutone / Marte", arcana: 13 },
        { name: "Sagittario", symbol: "♐", element: "Fuoco", modality: "Mobile", planet: "Giove", arcana: 14 },
        { name: "Capricorno", symbol: "♑", element: "Terra", modality: "Cardinale", planet: "Saturno", arcana: 15 },
        { name: "Acquario", symbol: "♒", element: "Aria", modality: "Fisso", planet: "Urano / Saturno", arcana: 17 },
        { name: "Pesci", symbol: "♓", element: "Acqua", modality: "Mobile", planet: "Nettuno / Giove", arcana: 18 }
    ];
    const sign = signsOrdered[signIndex] || signsOrdered[0];
    const decan = degree < 10 ? 1 : (degree < 20 ? 2 : 3);
    return {
        longitude: norm,
        signIndex,
        sign: sign.name,
        symbol: sign.symbol,
        degree,
        minutes,
        formatted: `${sign.name} ${sign.symbol} a ${degree}°${minutes}' (Decano ${decan})`,
        element: sign.element,
        planet: sign.planet,
        decan
    };
}

function calculateCurrentTransits(date = new Date(), natalSignName = null, natalAscSignName = null) {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const dayOfWeek = date.getDay();

    const dayGovernors = [
        { name: "Domenica", planet: "Sole ☀️", focus: "Vitalità solare, leadership, espressione del sé, chiarezza d'intenti" },
        { name: "Lunedì", planet: "Luna 🌙", focus: "Intuizione emotiva, ascolto interiore, cura di sé, memoria archetipica" },
        { name: "Martedì", planet: "Marte ♂️", focus: "Azione decisa, coraggio, superamento ostacoli, intraprendenza dinamica" },
        { name: "Mercoledì", planet: "Mercurio ☿", focus: "Comunicazione brillante, accordi, commercio, chiarezza mentale" },
        { name: "Giovedì", planet: "Giove ♃", focus: "Espansione spirituale, fortuna karmica, generosità, visione strategica" },
        { name: "Venerdì", planet: "Venere ♀", focus: "Amore autentico, relazioni armoniose, senso estetico, bellezza e grazia" },
        { name: "Sabato", planet: "Saturno ♄", focus: "Disciplina costruttiva, consolidamento, chiusura cicli, stabilità" }
    ];

    const currentGovernor = dayGovernors[dayOfWeek];

    const d = (date.getTime() - Date.UTC(2000, 0, 1, 12, 0, 0)) / (1000 * 60 * 60 * 24);

    const sunLon = (280.460 + 0.9856474 * d) % 360;
    const moonLon = (218.316 + 13.176396 * d) % 360;
    const mercuryLon = (252.25 + 4.09233 * d) % 360;
    const venusLon = (181.98 + 1.60213 * d) % 360;
    const marsLon = (355.43 + 0.52403 * d) % 360;
    const jupiterLon = (34.35 + 0.08308 * d) % 360;
    const saturnLon = (50.08 + 0.03346 * d) % 360;
    const uranusLon = (314.05 + 0.01173 * d) % 360;
    const neptuneLon = (304.35 + 0.00598 * d) % 360;
    const plutoLon = (238.93 + 0.00396 * d) % 360;

    const sun = getZodiacDetailsFromLongitude(sunLon);
    const moon = getZodiacDetailsFromLongitude(moonLon);
    const mercury = getZodiacDetailsFromLongitude(mercuryLon);
    const venus = getZodiacDetailsFromLongitude(venusLon);
    const mars = getZodiacDetailsFromLongitude(marsLon);
    const jupiter = getZodiacDetailsFromLongitude(jupiterLon);
    const saturn = getZodiacDetailsFromLongitude(saturnLon);
    const uranus = getZodiacDetailsFromLongitude(uranusLon);
    const neptune = getZodiacDetailsFromLongitude(neptuneLon);
    const pluto = getZodiacDetailsFromLongitude(plutoLon);

    const baseNewMoon = new Date(Date.UTC(2000, 0, 6, 18, 14, 0));
    const daysSinceBase = (date.getTime() - baseNewMoon.getTime()) / (1000 * 60 * 60 * 24);
    const cyclePosition = (daysSinceBase % 29.53058867 + 29.53058867) % 29.53058867;
    const illumination = Math.round((1 - Math.cos((cyclePosition / 29.53058867) * 2 * Math.PI)) / 2 * 100);

    let moonPhaseName = "Luna Nuova 🌑";
    if (cyclePosition >= 1.84 && cyclePosition < 7.38) moonPhaseName = "Luna Crescente 🌒";
    else if (cyclePosition >= 7.38 && cyclePosition < 9.22) moonPhaseName = "Primo Quarto 🌓";
    else if (cyclePosition >= 9.22 && cyclePosition < 14.77) moonPhaseName = "Gibbosa Crescente 🌔";
    else if (cyclePosition >= 14.77 && cyclePosition < 16.61) moonPhaseName = "Luna Piena 🌕";
    else if (cyclePosition >= 16.61 && cyclePosition < 22.15) moonPhaseName = "Gibbosa Calante 🌖";
    else if (cyclePosition >= 22.15 && cyclePosition < 23.99) moonPhaseName = "Ultimo Quarto 🌗";
    else if (cyclePosition >= 23.99 && cyclePosition < 27.69) moonPhaseName = "Luna Calante 🌘";

    const aspects = [];
    const signsOrdered = [
        { name: "Ariete" }, { name: "Toro" }, { name: "Gemelli" }, { name: "Cancro" },
        { name: "Leone" }, { name: "Vergine" }, { name: "Bilancia" }, { name: "Scorpione" },
        { name: "Sagittario" }, { name: "Capricorno" }, { name: "Acquario" }, { name: "Pesci" }
    ];
    const natalSign = signsOrdered.find(s => s.name.toLowerCase() === (natalSignName || '').toLowerCase());
    if (natalSign) {
        const natalLon = signsOrdered.indexOf(natalSign) * 30 + 15;
        const transitsList = [
            { name: "Sole ☀️", lon: sun.longitude, desc: "Espressione vitale e centratura", transit: sun.formatted },
            { name: "Luna 🌙", lon: moon.longitude, desc: "Flusso emotivo e intuizione", transit: moon.formatted },
            { name: "Mercurio ☿", lon: mercury.longitude, desc: "Comunicazione e lucidità mentale", transit: mercury.formatted },
            { name: "Venere ♀", lon: venus.longitude, desc: "Relazioni, affetto e bellezza", transit: venus.formatted },
            { name: "Marte ♂️", lon: mars.longitude, desc: "Energia di spinta e determinazione", transit: mars.formatted },
            { name: "Giove ♃", lon: jupiter.longitude, desc: "Crescita, espansione e fortuna", transit: jupiter.formatted },
            { name: "Saturno ♄", lon: saturn.longitude, desc: "Struttura, disciplina e maturità", transit: saturn.formatted }
        ];

        for (const tr of transitsList) {
            let diff = Math.abs(tr.lon - natalLon) % 360;
            if (diff > 180) diff = 360 - diff;

            if (diff <= 8) {
                aspects.push({ planet: tr.name, type: "Congiunzione (0°)", quality: "Potenziante", transit: tr.transit, effect: `Allineamento e fusione tra il tuo Segno Solare e ${tr.name} (${tr.desc}).` });
            } else if (Math.abs(diff - 60) <= 6) {
                aspects.push({ planet: tr.name, type: "Sestile (60°)", quality: "Armonico / Stimolante", transit: tr.transit, effect: `Opportunità dinamiche e fluidità operativa con ${tr.name}.` });
            } else if (Math.abs(diff - 90) <= 7) {
                aspects.push({ planet: tr.name, type: "Quadratura (90°)", quality: "Sfida Evolutiva", transit: tr.transit, effect: `Tensione costruttiva con ${tr.name}: richiede disciplina e pazienza.` });
            } else if (Math.abs(diff - 120) <= 8) {
                aspects.push({ planet: tr.name, type: "Trigone (120°)", quality: "Massima Armonia", transit: tr.transit, effect: `Massima benedizione e facilità di realizzazione con ${tr.name}.` });
            } else if (Math.abs(diff - 180) <= 8) {
                aspects.push({ planet: tr.name, type: "Opposizione (180°)", quality: "Polarità / Confronto", transit: tr.transit, effect: `Momento di confronto costruttivo e polarità con ${tr.name}.` });
            }
        }
    }

    return {
        dateStr: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`,
        dayName: currentGovernor.name,
        dayGovernor: currentGovernor,
        sunTransit: sun,
        moonTransit: moon,
        mercuryTransit: mercury,
        venusTransit: venus,
        marsTransit: mars,
        jupiterTransit: jupiter,
        saturnTransit: saturn,
        uranusTransit: uranus,
        neptuneTransit: neptune,
        plutoTransit: pluto,
        moonPhase: {
            name: moonPhaseName,
            illumination: `${illumination}%`,
            ageDays: cyclePosition.toFixed(1)
        },
        aspects
    };
}

if (typeof window !== 'undefined') {
    window.calculateCompleteMatrix = calculateCompleteMatrix;
    window.generateCompleteReport14Sections = generateCompleteReport14Sections;
    window.calculateDailyHoroscope = calculateDailyHoroscope;
    window.calculateWeeklyForecast = calculateWeeklyForecast;
    window.calculateSynastryMatrix = calculateSynastryMatrix;
    window.calculateAdvancedPinnacles = calculateAdvancedPinnacles;
    window.calculateZodiacSign = calculateZodiacSign;
    window.calculateAscendant = calculateAscendant;
    window.calculateCurrentTransits = calculateCurrentTransits;
    window.getZodiacDetailsFromLongitude = getZodiacDetailsFromLongitude;
    window.detectConsultationType = detectConsultationType;
    window.ZODIAC_SIGNS = ZODIAC_SIGNS;
    window.ARCANA_DATA = ARCANA_DATA;
    window.reduceTo22 = reduceTo22;
    window.reduceToDigit = reduceToDigit;
}
if (typeof globalThis !== 'undefined') {
    globalThis.calculateCompleteMatrix = calculateCompleteMatrix;
    globalThis.generateCompleteReport14Sections = generateCompleteReport14Sections;
    globalThis.calculateDailyHoroscope = calculateDailyHoroscope;
    globalThis.calculateWeeklyForecast = calculateWeeklyForecast;
    globalThis.calculateSynastryMatrix = calculateSynastryMatrix;
    globalThis.calculateAdvancedPinnacles = calculateAdvancedPinnacles;
    globalThis.calculateZodiacSign = calculateZodiacSign;
    globalThis.calculateAscendant = calculateAscendant;
    globalThis.calculateCurrentTransits = calculateCurrentTransits;
    globalThis.getZodiacDetailsFromLongitude = getZodiacDetailsFromLongitude;
    globalThis.detectConsultationType = detectConsultationType;
    globalThis.ZODIAC_SIGNS = ZODIAC_SIGNS;
    globalThis.ARCANA_DATA = ARCANA_DATA;
    globalThis.reduceTo22 = reduceTo22;
    globalThis.reduceToDigit = reduceToDigit;
}
