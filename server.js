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
    const lastUserMsg = ([...messages].reverse().find(m => m.role === 'user')?.content || '').toLowerCase();

    if (lastUserMsg.includes('tema natale') || lastUserMsg.includes('calcolo zodiacale') || lastUserMsg.includes('analisi zodiacale') || lastUserMsg.includes('zodiaco mit') || lastUserMsg.includes('zodiacale')) {
        return 'tema_natale_zodiaco';
    }
    if (lastUserMsg.includes('calcolo ascendente') || lastUserMsg.includes('calcola ascendente') || lastUserMsg.includes('ascendente zodiacale') || lastUserMsg.includes('il mio ascendente') || lastUserMsg.includes('1ª casa')) {
        return 'calcolo_ascendente';
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

const ZODIAC_SIGNS_ORDERED = [
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

function getZodiacDetailsFromLongitude(longitude) {
    const norm = (longitude % 360 + 360) % 360;
    const signIndex = Math.floor(norm / 30);
    const degree = Math.floor(norm % 30);
    const minutes = Math.floor((norm % 1) * 60);
    const sign = ZODIAC_SIGNS_ORDERED[signIndex] || ZODIAC_SIGNS_ORDERED[0];
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
    const natalSign = ZODIAC_SIGNS_ORDERED.find(s => s.name.toLowerCase() === (natalSignName || '').toLowerCase());
    if (natalSign) {
        const natalLon = ZODIAC_SIGNS_ORDERED.indexOf(natalSign) * 30 + 15;
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

    const zodiacSign = calculateZodiacSign(day, month);
    const ascendant = calculateAscendant(day, month, year, birthTimeStr);

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentYearDigitsSum = String(currentYear).split('').reduce((acc, d) => acc + parseInt(d, 10), 0);
    const personalYear = reduceToDigit(dayReduced + monthReduced + reduceToDigit(currentYearDigitsSum, false), false);
    const currentMonthNum = now.getMonth() + 1;
    const currentDayNum = now.getDate();
    const personalDay = reduceToDigit(personalYear + currentMonthNum + currentDayNum, false);

    const currentTransits = calculateCurrentTransits(now, zodiacSign.name, ascendant.sign.name);

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
        letterCounts,
        currentTransits
    };
}

function generateDynamicReport(userData, consultType, messages) {
    const calc = calculateCompleteMatrixData(userData.name, userData.date, userData.time);
    const currentYear = new Date().getFullYear();
    const currentDateStr = new Date().toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' });
    const tr = calc.currentTransits;

    const aspectsSummary = tr.aspects.length > 0 
        ? tr.aspects.map(a => `* **${a.planet} (${a.type}):** ${a.quality} — ${a.effect}`).join('\n')
        : `* Transiti neutrali stabili in corso: nessun aspetto conflittuale rilevato sul Segno Solare.`;

    if (consultType === 'tema_natale_zodiaco') {
        return `# 🌌 Tema Natale & Analisi Zodiacale Completa MIT-Grade

> **Disclaimer Etico (Art. 50 EU AI Act):** Mappa astrologica e archetipica calcolata in tempo reale con efemeridi astronomiche e coordinate dei 22 Arcani della Matrice del Destino.

* **Soggetto:** ${calc.name}
* **Data & Ora:** ${calc.formatted} (Ore: ${userData.time}, Luogo: ${userData.place})
* **Segno Solare:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** (${calc.zodiacSign.element}, ${calc.zodiacSign.modality} — Governatore: **${calc.zodiacSign.planet}**)
* **Ascendente:** **${calc.ascendant.formatted}** (Governatore: **${calc.ascendant.sign.planet}**)
* **Arcano Zodiacale:** Arcano ${calc.zodiacSign.arcana} (${ARCANA_DATA[calc.zodiacSign.arcana]?.name})
* **Frequenza di Nascita:** Arcano ${calc.nodeA} (${calc.arcA.name}) | Life Path: **${calc.lifePath}**

---

## 1. Identità Astrale: Segno Solare, Ascendente & Elementi
La combinazione tra il Sole in **${calc.zodiacSign.name} (${calc.zodiacSign.element})** e l'Ascendente in **${calc.ascendant.sign.name} (${calc.ascendant.sign.element})** definisce la tua impronta cosciente e il tuo stile di interazione nel mondo.

---

## 2. Effemeridi Astronomiche e Transiti Attuali (${currentDateStr})
* **Sole in Transito:** ${tr.sunTransit.formatted}
* **Luna in Transito:** ${tr.moonTransit.formatted} | **Fase:** ${tr.moonPhase.name} (${tr.moonPhase.illumination})
* **Mercurio:** ${tr.mercuryTransit.formatted}
* **Venere:** ${tr.venusTransit.formatted}
* **Marte:** ${tr.marsTransit.formatted}
* **Giove:** ${tr.jupiterTransit.formatted}
* **Saturno:** ${tr.saturnTransit.formatted}
* **Urano:** ${tr.uranusTransit.formatted} | **Nettuno:** ${tr.neptuneTransit.formatted} | **Plutone:** ${tr.plutoTransit.formatted}

---

## 3. Aspetti Planetari Attivi sul Tuo Segno (${calc.zodiacSign.name})
${aspectsSummary}

---

## 4. Integrazione Alchemica: Astrologia + Matrice del Destino
* **Nodo A (Nascita):** Arcano ${calc.nodeA} (${calc.arcA.name})
* **Nodo E (Cuore):** Arcano ${calc.nodeE} (${calc.arcE.name})
* **Canale Denaro (C+E):** Arcano ${calc.nodeMoney} (${calc.arcMoney.name})
* **Canale Amore (D+E):** Arcano ${calc.nodeLove} (${calc.arcLove.name})`;
    }

    if (consultType === 'calcolo_ascendente') {
        return `# 🧭 Calcolo Ascendente Zodiacale & Maschera Energetica

* **Soggetto:** ${calc.name} (Nascita: ${calc.formatted}, Ora: ${userData.time}, Luogo: ${userData.place})
* **Segno Solare:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** (${calc.zodiacSign.element} — Governatore: ${calc.zodiacSign.planet})
* **Ascendente Esatto:** **${calc.ascendant.formatted}** (Elemento: ${calc.ascendant.sign.element} — Governatore: ${calc.ascendant.sign.planet})
* **Arcano dell'Ascendente:** **Arcano ${calc.ascendant.sign.arcana}** (${ARCANA_DATA[calc.ascendant.sign.arcana]?.name})

---

## 1. Natura dell'Ascendente, Gradi & Elemento
L'Ascendente rappresenta la cuspide della **1ª Casa Astrologica**, il punto esatto dell'orizzonte orientale al momento della tua nascita. Con l'Ascendente in **${calc.ascendant.sign.name} ${calc.ascendant.sign.symbol}**, la tua energia esteriore è plasmata dall'elemento **${calc.ascendant.sign.element}** e dal pianeta governatore **${calc.ascendant.sign.planet}**.

---

## 2. La Maschera Sociale & Stile Relazionale
L'Ascendente in ${calc.ascendant.sign.name} descrive il filtro attraverso cui il mondo ti percepisce e come affronti i nuovi inizi. È strettamente collegato all'archetipo dell'**Arcano ${calc.ascendant.sign.arcana} (${ARCANA_DATA[calc.ascendant.sign.arcana]?.name})**: leadership naturale, presenza carismatica e approccio distintivo.

---

## 3. Alchimia tra Segno Solare (${calc.zodiacSign.name}) e Ascendente (${calc.ascendant.sign.name})
* **Il Sole (${calc.zodiacSign.name} - ${calc.zodiacSign.element}):** Il tuo nucleo interiore e motivazione d'anima.
* **L'Ascendente (${calc.ascendant.sign.name} - ${calc.ascendant.sign.element}):** Il veicolo di azione e la frequenza con cui ti muovi nella realtà materiale.

---

## 4. Guida Evolutiva & Integrazione con la Matrice
* **Pianeta Guida:** Canalizza l'archetipo di **${calc.ascendant.sign.planet}** per consolidare determinazione e sicurezza.
* **Arcano di Nascita:** Integra la vibrazione dell'Arcano ${calc.nodeA} (${calc.arcA.name}) per allineare l'immagine esteriore allo scopo della tua vita.`;
    }

    if (consultType === 'oroscopo_giorno') {
        return `# 🌅 Oroscopo & Vibrazione Astrale del Giorno — ${currentDateStr}

* **Soggetto:** ${calc.name} | **Segno:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** | **Ascendente:** **${calc.ascendant.formatted}**
* **Cielo Astronomico di Oggi:** Sole in ${tr.sunTransit.name} | ${tr.moonPhase.name} (${tr.moonPhase.illumination}) | Governatore del Giorno: **${tr.dayGovernor.planet}** (${tr.dayName})
* **Giorno Personale:** **Numero ${calc.personalDay}** — Arcano ${calc.personalDay} (${calc.arcPersonalDay.name})

---

## 1. Clima Energetico & Transiti Astrali di Oggi
Oggi il giorno è governato da **${tr.dayGovernor.planet}**, che indirizza l'energia verso: *${tr.dayGovernor.focus}*. La Luna in **${tr.moonTransit.formatted}** determina il ritmo emotivo della giornata.

---

## 2. Aspetti Planetari Attivi sul ${calc.zodiacSign.name}
${aspectsSummary}

---

## 3. Le 3 Grandi Opportunità Odierne
1. **Lavoro & Finanze:** Risoluzione concreta sostenuta dal Giorno Personale ${calc.personalDay} (${calc.arcPersonalDay.name}).
2. **Amore & Relazioni:** Chiarezza espressiva armonizzata dall'Ascendente ${calc.ascendant.sign.name}.
3. **Evoluzione Personale:** Momento favorevole per integrare l'energia di ${tr.sunTransit.name}.

---

## 4. Ombre & Insidie da Evitare
* Evitare reazioni impulsive di fronte a imprevisti temporanei.
* Preservare la lucidità mentale nei momenti di sovraccarico.

---

## 5. Consiglio & Rituale Pratico d'Azione
Dedica 5 minuti all'ascolto consapevole dell'elemento **${calc.zodiacSign.element}**: allinea le tue azioni con l'Arcano ${calc.personalDay} (${calc.arcPersonalDay.name}).`;
    }

    if (consultType === 'oroscopo_settimana') {
        return `# 🔮 Guida Oracolare Settimanale (Previsione 7 Giorni)

* **Soggetto:** ${calc.name} (Data: ${calc.formatted})
* **Segno Zodiacale:** **${calc.zodiacSign.name} ${calc.zodiacSign.symbol}** | **Ascendente:** **${calc.ascendant.formatted}**
* **Anno Personale (${currentYear}):** **${calc.personalYear}** (${calc.arcPersonalYear.name})

---

## 1. Clima della Settimana per il ${calc.zodiacSign.name}
La settimana corrente vede l'attivazione dei tuoi canali di espansione con il governatore ${calc.zodiacSign.planet}.

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
Il tuo Canale Relazionale fonde il fuoco del **${calc.zodiacSign.name}** con l'**Arcano ${calc.nodeLove} (${calc.arcLove.name})**.

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
L'influenza di **${calc.zodiacSign.planet}** unita all'**Arcano ${calc.nodeMoney} (${calc.arcMoney.name})** fa di te un catalizzatore di progetti ad alto impatto.`;
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

    return `# Report Completo di Analisi Numerologica & Matrice del Destino (14 Sezioni)

> **Disclaimer Etico (Art. 50 EU AI Act):** Questa analisi si basa sui principi simbolici dei 22 Arcani Maggiori e della tradizione astrologica.

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
    '.ico': 'image/x-icon',
    '.txt': 'text/plain; charset=utf-8',
    '.xml': 'application/xml; charset=utf-8',
    '.webmanifest': 'application/manifest+json; charset=utf-8'
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

                    case 'calcolo_ascendente':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: CALCOLO ASCENDENTE ZODIACALE & 1ª CASA (1 CREDITO).
DEVI GENERARE L'ANALISI APPROFONDITA DELL'ASCENDENTE ZODIACALE ESATTO PER ${userData.name}:
- Segno Solare: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Elemento ${calc.zodiacSign.element}, Governatore ${calc.zodiacSign.planet})
- Ascendente Calcolato: ${calc.ascendant.formatted} (Governatore dell'Ascendente: ${calc.ascendant.sign.planet}, Elemento: ${calc.ascendant.sign.element})
- Arcano Zodiacale dell'Ascendente: Arcano ${calc.ascendant.sign.arcana} (${ARCANA_DATA[calc.ascendant.sign.arcana]?.name})
- Arcano di Nascita: ${calc.nodeA} (${calc.arcA.name}) | Centro Cuore: ${calc.nodeE} (${calc.arcE.name})
NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Struttura la risposta con:
# 🧭 Calcolo Ascendente Zodiacale & Maschera Energetica
* **Soggetto:** ${userData.name} | **Segno Solare:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} | **Ascendente:** ${calc.ascendant.formatted}
* **Pianeta Governatore:** ${calc.ascendant.sign.planet} | **Arcano Guida:** Arcano ${calc.ascendant.sign.arcana} (${ARCANA_DATA[calc.ascendant.sign.arcana]?.name})
## 1. Natura dell'Ascendente, Gradi Esatti & Elemento
## 2. La Maschera Sociale, Presenza Fisica & Prima Impressione
## 3. Dinamica Alchemica: Segno Solare (Anima) vs Ascendente (Veicolo di Manifestazione)
## 4. Orientamento della 1ª Casa Astrologica & Consigli Pratici di Allineamento`;
                        break;

                    case 'oroscopo_giorno':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: OROSCOPO DEL GIORNO (${currentDateStr}).
DEVI GENERARE L'OROSCOPO DEL GIORNO INTEGRANDO:
- SEGNO ZODIACALE DEL SOGGETTO: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Elemento ${calc.zodiacSign.element}, Governatore ${calc.zodiacSign.planet})
- ASCENDENTE: ${calc.ascendant.formatted} (Governatore ${calc.ascendant.sign.planet})
- GIORNO PERSONALE NUMEROLOGICO DI OGGI: Numero ${calc.personalDay} (Arcano ${calc.personalDay} - ${calc.arcPersonalDay.name})
- CIELO ASTRONOMICO DI OGGI: Sole in ${calc.currentTransits.sunTransit.name} ${calc.currentTransits.sunTransit.symbol}, Fase Lunare: ${calc.currentTransits.moonPhase.name} (Luminosità ${calc.currentTransits.moonPhase.illumination}), Giorno della Settimana: ${calc.currentTransits.dayName} (Pianeta Governatore: ${calc.currentTransits.dayGovernor.planet} — Focus: ${calc.currentTransits.dayGovernor.focus}).
NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Struttura:
# 🌅 Oroscopo & Vibrazione Astrale del Giorno — ${currentDateStr}
* **Soggetto:** ${userData.name} | **Segno:** ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} | **Ascendente:** ${calc.ascendant.formatted}
* **Cielo di Oggi:** Sole in ${calc.currentTransits.sunTransit.name} | ${calc.currentTransits.moonPhase.name} (${calc.currentTransits.moonPhase.illumination}) | Governatore del Giorno: ${calc.currentTransits.dayGovernor.planet}
* **Giorno Personale:** ${calc.personalDay} (${calc.arcPersonalDay.name})
## 1. Clima Energetico & Transiti Astrali di Oggi
## 2. Le 3 Grandi Opportunità Odierne (Professione, Relazioni, Spirito)
## 3. Ombre & Insidie Astrali da Evitare
## 4. Consiglio & Rituale Pratico d'Azione`;
                        break;

                    case 'oroscopo_settimana':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: GUIDA ORACOLARE SETTIMANALE (7 GIORNI).
DEVI GENERARE LA PREVISIONE DEI 7 GIORNI DELLA SETTIMANA PER IL SEGNO ${calc.zodiacSign.name} ${calc.zodiacSign.symbol} (Ascendente ${calc.ascendant.formatted}) GIORNO PER GIORNO.
Dati chiave: Anno Personale = ${calc.personalYear} (${calc.arcPersonalYear.name}), Life Path = ${calc.lifePath}, Transito Solare = ${calc.currentTransits.sunTransit.name}, Fase Lunare = ${calc.currentTransits.moonPhase.name}.
NON GENERARE IL REPORT GENERALE A 14 SEZIONI.
Struttura: Mappa dei 7 giorni con Arcano quotidiano, focus specifico (lavoro, amore, crescita), giorni più favorevoli e consiglio di sintesi.`;
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

                    case 'meditazione':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: AUDIO-MEDITAZIONE GUIDATA ORACOLARE (2 CREDITI).
DEVI SCRIVERE UN TESTO DI MEDITAZIONE GUIDATA ESPERIENZIALE E TRASFORMATIVA (durata lettura 2-3 minuti), PERSONALIZZATA PER ${userData.name}.
Integra:
- L'elemento del Segno Solare (${calc.zodiacSign.element} - ${calc.zodiacSign.name})
- Il Cuore Energetico (Arcano ${calc.nodeE} - ${calc.arcE.name})
- Frequenza di Nascita (Arcano ${calc.nodeA} - ${calc.arcA.name})
Usa pause poetiche narrative, respiro guidato e visualizzazioni della Geometria Sacra per sbloccare centratura e pace interiore.`;
                        break;

                    case 'matrice_completa':
                        specificInstruction = `🔴 RICHIESTA CONSULTA: REPORT COMPLETO A 14 SEZIONI.
DEVI GENERARE L'INTERO REPORT A 14 SEZIONI PER ${userData.name} (${calc.zodiacSign.name} ${calc.zodiacSign.symbol}, Ascendente ${calc.ascendant.formatted}) IN MODO COMPLETO, PROFONDO E SENZA TRONCATURE.`;
                        break;

                    default:
                        specificInstruction = `🔴 RICHIESTA LIBERA IN CHAT: Rispondi in modo diretto, esauriente e approfondito alla domanda specifica dell'utente, integrando la saggezza dei suoi archetipi della Matrice (Nodo A: ${calc.nodeA}, Nodo E: ${calc.nodeE}, Segno: ${calc.zodiacSign.name} ${calc.zodiacSign.symbol}, Ascendente: ${calc.ascendant.formatted}).`;
                }

                const sysPrompt = `Sei l'Oracolo Supremo della Matrice del Destino, dell'Astrologia Esoterica e degli Archetipi Numerologici (metodo Ladini dei 22 Arcani, Astrologia Occidentale e Numerologia Pitagorica). 
Rispondi ESCLUSIVAMENTE IN LINGUA ITALIANA con tono profondo, autorevole, analitico, nobile e solenne. NESSUN TESTO PRECONFEZIONATO O HARDCODATO: genera ogni analisi in tempo reale incrociando rigorosamente i dati astronomici, astrologici e numerologici calcolati.

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

🔴 EFFEMERIDI ASTRONOMICHE REALI DI OGGI (${currentDateStr}):
- Sole in Transito: ${calc.currentTransits.sunTransit.formatted}
- Luna in Transito: ${calc.currentTransits.moonTransit.formatted} | Fase: ${calc.currentTransits.moonPhase.name} (${calc.currentTransits.moonPhase.illumination})
- Mercurio: ${calc.currentTransits.mercuryTransit.formatted} | Venere: ${calc.currentTransits.venusTransit.formatted} | Marte: ${calc.currentTransits.marsTransit.formatted}
- Giove: ${calc.currentTransits.jupiterTransit.formatted} | Saturno: ${calc.currentTransits.saturnTransit.formatted}
- Urano: ${calc.currentTransits.uranusTransit.formatted} | Nettuno: ${calc.currentTransits.neptuneTransit.formatted} | Plutone: ${calc.currentTransits.plutoTransit.formatted}
- Pianeta Governatore del Giorno: ${calc.currentTransits.dayGovernor.planet} (${calc.currentTransits.dayName}) — Focus: ${calc.currentTransits.dayGovernor.focus}
- Aspetti Planetari Attivi sul Segno Solare (${calc.zodiacSign.name}):
${calc.currentTransits.aspects.length > 0 ? calc.currentTransits.aspects.map(a => `  * ${a.planet} (${a.type}): ${a.quality} — ${a.effect}`).join('\n') : '  * Transiti stabili in flusso armonico.'}

${specificInstruction}`;

                if (consultType !== 'matrice_completa' && consultType !== 'dialogo_libero') {
                    const lastUserQuery = [...messages].reverse().find(m => m.role === 'user')?.content || 'Procedi con il consulto.';
                    finalMessages = [
                        { role: 'system', content: sysPrompt },
                        { role: 'user', content: lastUserQuery }
                    ];
                } else {
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

    // API: /api/generate-image (Cascading Image Generation)
    if (pathname === '/api/generate-image' && req.method === 'POST') {
        const body = await parseBody(req);
        const { prompt, arcanaNumber, arcanaName, archetype } = body;
        
        const ARCANA_IMAGE_PROMPTS = {
            1: "Sacred Tarot Card Arcana 1 The Magician (Il Mago), celestial sorcerer with infinity symbol glowing above head, wand pointed to heavens, table with golden chalice, sword, wand, and pentacle, radiant golden sacred geometry, cosmic ether nebula, 8k luxury masterpiece, no text",
            2: "Sacred Tarot Card Arcana 2 The High Priestess (La Papessa), mystical enthroned priestess between two celestial pillars of Boaz and Jachin (dark and light), glowing crescent moon at her feet, pomegranates veil, sacred scrolls of wisdom, glowing golden aura, 8k luxury masterpiece, no text",
            3: "Sacred Tarot Card Arcana 3 The Empress (L'Imperatrice), divine mother goddess sitting on golden throne in lush blooming cosmic garden, crown of twelve shining stars, golden scepter, shield with Venus symbol, wheat field, radiant gold sacred geometry, 8k luxury masterpiece, no text",
            4: "Sacred Tarot Card Arcana 4 The Emperor (L'Imperatore), regal majestic sovereign on a great carved stone cubic throne with ram heads, holding ankh scepter and golden orb, crimson robes, towering fiery mountains background, golden solar geometry, 8k luxury masterpiece, no text",
            5: "Sacred Tarot Card Arcana 5 The Hierophant (Il Papa), spiritual master and keeper of sacred mysteries, wearing triple papal tiara, holding triple cross staff, blessing hand sign, two crossed golden keys at feet, ancient temple columns, glowing divine light, 8k luxury masterpiece, no text",
            6: "Sacred Tarot Card Arcana 6 The Lovers (Gli Amanti), two harmonious souls blessed by glowing archangel Raphael with radiant wings in the sky, Tree of Life and Tree of Knowledge with serpent, radiant golden rays, cosmic heart energy, 8k luxury masterpiece, no text",
            7: "Sacred Tarot Card Arcana 7 The Chariot (Il Carro), triumphant armored warrior in celestial starry chariot, canopy of stars, guided by two mystical sphinxes (one black, one white), starry crown, glowing golden wheels, cosmic battlefield, 8k luxury masterpiece, no text",
            8: "Sacred Tarot Card Arcana 8 Justice (La Giustizia), majestic goddess on stone throne between two pillars, holding golden double-edged sword upright in right hand and balanced golden scales in left hand, square crown, purple veil, sacred balance geometry, 8k luxury masterpiece, no text",
            9: "Sacred Tarot Card Arcana 9 The Hermit (L'Eremita), venerable bearded sage in dark hooded cloak standing atop a snowy cosmic mountain, holding a glowing lantern with a shining 6-pointed golden star inside, staff of wisdom, starry twilight sky, 8k luxury masterpiece, no text",
            10: "Sacred Tarot Card Arcana 10 Wheel of Fortune (La Ruota della Fortuna), giant mystical 8-spoke golden wheel covered in sacred Hebrew and alchemical symbols, crowned sphinx sitting on top with sword, Anubis rising on the side, four winged creatures in the clouds (angel, eagle, lion, bull), glowing cosmic vortex nebula, 8k luxury masterpiece, no text",
            11: "Sacred Tarot Card Arcana 11 Strength (La Forza), serene maiden with radiant infinity symbol glowing above her head, gently closing the jaws of a majestic golden lion with love and spiritual power, garlands of cosmic flowers, warm golden sunlight, 8k luxury masterpiece, no text",
            12: "Sacred Tarot Card Arcana 12 The Hanged Man (L'Appeso), enlightened mystic suspended upside down by one foot from living wooden Tau cross, glowing golden halo of illumination around his head, serene enlightened expression, cosmic water reflections, 8k luxury masterpiece, no text",
            13: "Sacred Tarot Card Arcana 13 Transformation (Morte), celestial knight in obsidian and gold armor holding black banner with white mystic rose, golden sunrise on the horizon between two mystical towers, phoenix rising from ashes, sacred rebirth geometry, 8k luxury masterpiece, no text",
            14: "Sacred Tarot Card Arcana 14 Temperance (La Temperanza), glowing winged angel with one foot in water and one foot on earth, pouring glowing liquid of life between two golden chalices without spilling a single drop, golden sun rising over mountain path, iris flowers, 8k luxury masterpiece, no text",
            15: "Sacred Tarot Card Arcana 15 The Devil (Il Diavolo), majestic winged horned figure perched upon an altar, inverted glowing pentagram on forehead, holding torch of material fire, two figures with loose golden chains representing liberation from illusion, dark magnetic cosmic embers, 8k luxury masterpiece, no text",
            16: "Sacred Tarot Card Arcana 16 The Tower (La Torre), tall ancient monolithic stone tower on mountain summit struck by divine golden lightning bolt, crown blown off top, sparks and glowing embers, liberating awakening of truth from illusions, starry cosmic storm, 8k luxury masterpiece, no text",
            17: "Sacred Tarot Card Arcana 17 The Star (La Stella), celestial naked maiden pouring water of consciousness from two golden urns onto land and pool, giant 8-pointed golden star shining brightly in the night sky surrounded by seven smaller stars, sacred ibis bird, serene cosmic lake, 8k luxury masterpiece, no text",
            18: "Sacred Tarot Card Arcana 18 The Moon (La Luna), glowing full moon with face in night sky radiating golden dewdrops, two towers on horizon, wolf and dog howling at the moon, crayfish emerging from the deep pool of unconsciousness, winding path, mystical esoteric night, 8k luxury masterpiece, no text",
            19: "Sacred Tarot Card Arcana 19 The Sun (Il Sole), radiant giant golden smiling sun with alternating straight and wavy rays, joyous crowned child riding a pure white horse with red banner, wall of blooming sunflowers, boundless vitality, warmth and abundance, 8k luxury masterpiece, no text",
            20: "Sacred Tarot Card Arcana 20 Judgement (Il Giudizio), great winged archangel Gabriel sounding a golden trumpet with banner from glowing clouds, souls rising with open arms in spiritual rebirth and awakening, mountains and sea, cosmic resurrection of light, 8k luxury masterpiece, no text",
            21: "Sacred Tarot Card Arcana 21 The World (Il Mondo), dancing celestial figure surrounded by a glowing green and gold laurel wreath oval, holding two magic wands, flanked in four corners by the four sacred figures (angel, eagle, lion, bull), complete cosmic realization, 8k luxury masterpiece, no text",
            22: "Sacred Tarot Card Arcana 22 The Fool (Il Matto), carefree cosmic traveler in colorful tunic standing on the edge of a mountain cliff with white rose in hand, small playful white dog at his heels, knapsack on wand, brilliant rising sun, boundless freedom and infinite potential, 8k luxury masterpiece, no text"
        };

        let basePrompt = prompt;
        if (!basePrompt) {
            const num = parseInt(arcanaNumber, 10);
            if (num && ARCANA_IMAGE_PROMPTS[num]) {
                basePrompt = ARCANA_IMAGE_PROMPTS[num];
            } else {
                basePrompt = `Sacred Tarot Card Arcana ${arcanaNumber || ''} ${arcanaName || ''} (${archetype || ''}), mystical radiant golden sacred geometry, 8-pointed star octagram, glowing amber esoteric details, deep cosmic obsidian nebula background, 8k luxury masterpiece, no text`;
            }
        }

        // TIER 1: Google Gemini / Imagen
        const geminiKey = body.apiKey || process.env.GEMINI_TTS_API_KEY || process.env.GOOGLE_API_KEY;
        if (geminiKey) {
            try {
                const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-002:generateImages?key=${geminiKey}`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        prompt: basePrompt,
                        numberOfImages: 1,
                        aspectRatio: "1:1",
                        outputMimeType: "image/jpeg"
                    })
                });
                if (geminiRes.ok) {
                    const gemData = await geminiRes.json();
                    if (gemData.generatedImages && gemData.generatedImages[0]?.image?.imageBytes) {
                        const b64 = gemData.generatedImages[0].image.imageBytes;
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({
                            success: true,
                            provider: 'gemini',
                            mimeType: 'image/jpeg',
                            dataUrl: `data:image/jpeg;base64,${b64}`
                        }));
                        return;
                    }
                }
            } catch (e) {
                console.warn('Local Tier 1 Gemini image failed, proceeding to fallback:', e.message);
            }
        }

        // TIER 2: Pollinations.ai (Flux)
        try {
            const encoded = encodeURIComponent(basePrompt);
            const pollUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1024&height=1024&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
            const pollRes = await fetch(pollUrl);
            if (pollRes.ok) {
                const buffer = Buffer.from(await pollRes.arrayBuffer());
                if (buffer.length > 5000) {
                    const b64 = buffer.toString('base64');
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        provider: 'pollinations',
                        mimeType: 'image/png',
                        dataUrl: `data:image/png;base64,${b64}`,
                        imageUrl: pollUrl
                    }));
                    return;
                }
            }
        } catch (e) {
            console.warn('Local Tier 2 Pollinations failed, proceeding to fallback:', e.message);
        }

        // TIER 3: LLMAPI.ai (GLM-Image)
        const llmKey = process.env.LLMAPI_KEY;
        try {
            const llmRes = await fetch('https://api.llmapi.ai/v1/images/generations', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${llmKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'glm-image',
                    prompt: basePrompt,
                    size: '1024x1024',
                    n: 1
                })
            });
            if (llmRes.ok) {
                const llmData = await llmRes.json();
                const imgUrl = llmData.data?.[0]?.url;
                if (imgUrl) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({
                        success: true,
                        provider: 'llmapi',
                        imageUrl: imgUrl,
                        dataUrl: imgUrl
                    }));
                    return;
                }
            }
        } catch (e) {
            console.error('Local Tier 3 LLMAPI failed:', e.message);
        }

        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { message: 'Tutti i motori di generazione immagini sono temporaneamente non disponibili.' } }));
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
