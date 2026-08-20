import { ArcanaInfo, MatrixData, MatrixNode } from './types';

export const ARCANA_DATABASE: Record<number, ArcanaInfo> = {
  1: {
    number: 1,
    name: "Il Mago",
    archetype: "Il Creatore, L'Iniziatore, Il Pioniere",
    light: "Capacità manifestativa, leadership carismatica, eloquenza, spirito d'iniziativa.",
    shadow: "Egocentrismo, manipolazione verbale, insicurezza mascherata da arroganza.",
    keywords: "Volontà, Creazione, Focalizzazione, Inizio",
    color: "#E5C07B"
  },
  2: {
    number: 2,
    name: "La Papessa",
    archetype: "La Custode dei Misteri, La Sacerdotessa",
    light: "Intuizione profonda, empatia raffinata, ascolto interiore, saggezza silenziosa.",
    shadow: "Passività, segretezza tossica, freddezza emotiva, diffidenza.",
    keywords: "Intuizione, Mistero, Saggezza, Ascolto",
    color: "#61AFEF"
  },
  3: {
    number: 3,
    name: "L'Imperatrice",
    archetype: "La Madre Divina, La Fertilità, L'Abbondanza",
    light: "Creatività fertile, amore incondizionato, senso estetico, prosperità materiale.",
    shadow: "Controllo soffocante, vanità, possessività emotiva, sperpero.",
    keywords: "Abbondanza, Bellezza, Nutrimento, Creazione",
    color: "#98C379"
  },
  4: {
    number: 4,
    name: "L'Imperatore",
    archetype: "Il Sovrano, Il Costruttore di Strutture",
    light: "Capacità organizzativa, autorevolezza etica, stabilità, protezione concreta.",
    shadow: "Tirannia, rigidità mentale, paura del caos, autoritarismo.",
    keywords: "Struttura, Autorità, Stabilità, Concretizzazione",
    color: "#E06C75"
  },
  5: {
    number: 5,
    name: "Il Papa (Il Maestro)",
    archetype: "La Guida Spirituale, Il Ponte di Tradizione",
    light: "Insegnamento etico, ricerca spirituale, saggezza morale, coerenza.",
    shadow: "Dogmatismo, fanatismo, ipocrisia, rigidità dottrinale.",
    keywords: "Insegnamento, Tradizione, Etica, Guida",
    color: "#C678DD"
  },
  6: {
    number: 6,
    name: "Gli Amanti",
    archetype: "L'Armonizzatore, Il Conciliatore del Cuore",
    light: "Capacità di scelta etica, amore autentico, creazione di bellezza e armonia sociale.",
    shadow: "Indecisione paralizzante, dipendenza affettiva, idealizzazione ingenua.",
    keywords: "Amore, Scelta, Armonia, Relazioni",
    color: "#56B6C2"
  },
  7: {
    number: 7,
    name: "Il Carro",
    archetype: "Il Vincitore Focalizzato, Il Conquistatore",
    light: "Determinazione incrollabile, superamento ostacoli, disciplina, successo meritato.",
    shadow: "Aggressività cieca, fretta distruttiva, arroganza competitiva.",
    keywords: "Vittoria, Direzione, Controllo, Volontà",
    color: "#D19A66"
  },
  8: {
    number: 8,
    name: "La Giustizia",
    archetype: "L'Arbitro Universale, La Legge di Causa-Effetto",
    light: "Equilibrio impeccabile, discernimento logico, integrità, senso karmico.",
    shadow: "Freddezza glaciale, ipercritica implacabile, vittimismo legale.",
    keywords: "Equilibrio, Causa-Effetto, Verità, Integrità",
    color: "#4FA6A6"
  },
  9: {
    number: 9,
    name: "L'Eremita",
    archetype: "Il Saggio Silenzioso, La Luce Interiore",
    light: "Profondità filosofica, introspezione fruttuosa, indipendenza, guida illuminata.",
    shadow: "Isolamento amaro, misantropia, chiusura ermetica al mondo.",
    keywords: "Introspezione, Solitudine feconda, Filosofia, Prudenza",
    color: "#ABB2BF"
  },
  10: {
    number: 10,
    name: "La Ruota della Fortuna",
    archetype: "Il Navigatore dei Cicli, Il Flusso Sincronico",
    light: "Adattabilità intuitiva, fiducia nella sincronicità, ottimismo cosmico.",
    shadow: "Fatalismo passivo, ansia per l'imprevedibile, instabilità perenne.",
    keywords: "Cicli, Opportunità, Sincronicità, Destino",
    color: "#DFB15B"
  },
  11: {
    number: 11,
    name: "La Forza",
    archetype: "Il Guerriero del Cuore, La Maestria Emotiva",
    light: "Coraggio indomito, dominio gentile degli istinti, magnetismo vitale.",
    shadow: "Impulsività violenta, prepotenza fisica, debolezza mascherata da rabbia.",
    keywords: "Coraggio, Autocontrollo, Vigore, Compassione",
    color: "#E06C75"
  },
  12: {
    number: 12,
    name: "L'Appeso",
    archetype: "La Visione Ribaltata, Il Servizio Disinteressato",
    light: "Prospettiva unica fuori dagli schemi, dedizione etica, pazienza strategica.",
    shadow: "Vittimismo cronico, immobilismo masochista, autosacrificio sterile.",
    keywords: "Nuova Prospettiva, Resa, Sacrificio Consapevole, Pazienza",
    color: "#61AFEF"
  },
  13: {
    number: 13,
    name: "La Morte (La Trasformazione)",
    archetype: "L'Agente di Rigenerazione, La Fenice",
    light: "Capacità di lasciar andare il vecchio, rinnovamento radicale, rinascita.",
    shadow: "Attaccamento morboso al passato, paura del cambiamento, depressione da perdita.",
    keywords: "Rinascita, Fine Ciclo, Metamorfosi, Purificazione",
    color: "#4B5263"
  },
  14: {
    number: 14,
    name: "La Temperanza",
    archetype: "L'Alchimista Interiore, Il Guaritore di Contrasti",
    light: "Moderazione virtuosa, fusione armonica di opposti, pace mentale, guarigione.",
    shadow: "Apatia, conformismo privo di carattere, temporeggiamento sterile.",
    keywords: "Alchimia, Equilibrio, Guarigione, Pazienza",
    color: "#98C379"
  },
  15: {
    number: 15,
    name: "Il Diavolo",
    archetype: "Il Magnetizzatore della Materia, Il Custode dell'Ombra",
    light: "Carisma magnetico travolgente, gestione abile del potere, energia vitale primordiale.",
    shadow: "Dipendenze ossessive, manipolazione avida, culto del denaro, inganno.",
    keywords: "Magnetismo, Ombra, Passione, Potere Materiale",
    color: "#BE5046"
  },
  16: {
    number: 16,
    name: "La Torre",
    archetype: "Il Liberatore dalle Illusioni, Il Risveglio Fulmineo",
    light: "Distruzione di false certezze, autenticità senza compromessi, ricostruzione solida.",
    shadow: "Crolli traumatici autodistruttivi, ostinazione cieca su fondamenta marce.",
    keywords: "Risveglio, Rottura Illusioni, Rinascita, Verità Cruda",
    color: "#D19A66"
  },
  17: {
    number: 17,
    name: "La Stella",
    archetype: "Il Faro di Speranza, L'Ispiratore di Bellezza",
    light: "Fede luminosa nel futuro, ispirazione artistica, purezza d'intenti, generosità.",
    shadow: "Idealismo ingenuo e sconnesso dalla realtà, pessimismo fatalista.",
    keywords: "Speranza, Talento, Guida, Ispirazione Divina",
    color: "#56B6C2"
  },
  18: {
    number: 18,
    name: "La Luna",
    archetype: "L'Esploratore dell'Inconscio, Il Poeta Visionario",
    light: "Immaginazione vivida, connessione psichica profonda, intuito medianico.",
    shadow: "Ansia ipocondriaca, illusioni paranoiche, paure irrazionali, fuga nella fantasia.",
    keywords: "Inconscio, Sogno, Intuizione Psichica, Mistero",
    color: "#828997"
  },
  19: {
    number: 19,
    name: "Il Sole",
    archetype: "Il Portatore di Chiarezza, Il Leader Radioso",
    light: "Gioia contagiosa, successo evidente, generosità calorosa, chiarezza mentale.",
    shadow: "Vanità accecante, narcisismo teatrale, arroganza infantile.",
    keywords: "Successo, Vitalità, Chiarezza, Gioia di Vivere",
    color: "#E5C07B"
  },
  20: {
    number: 20,
    name: "Il Giudizio",
    archetype: "Il Risveglio della Coscienza, La Chiamata Vocazionale",
    light: "Ascolto della propria vocazione, superamento dei limiti ancestrali, risveglio.",
    shadow: "Auto-condanna perenne, giudizio implacabile verso il prossimo, sordità interiore.",
    keywords: "Vocazione, Risveglio, Rinnovamento Karmico, Chiamata",
    color: "#C678DD"
  },
  21: {
    number: 21,
    name: "Il Mondo",
    archetype: "L'Integratore Universale, Il Trionfo Cosmico",
    light: "Realizzazione totale, visione globale senza confini, armonia cosmica, compimento.",
    shadow: "Sensazione di prigionia nei dettagli, isolamento dal mondo, paura di espandersi.",
    keywords: "Compimento, Visione Globale, Trionfo, Interezza",
    color: "#38EF7D"
  },
  22: {
    number: 22,
    name: "Il Matto",
    archetype: "Il Viaggiatore Libero, Il Salto Quantico",
    light: "Libertà assoluta dai condizionamenti, spontaneità pura, fiducia totale nell'esistenza.",
    shadow: "Inciviltà sconsiderata, caos irresponsabile, fuga dalle responsabilità.",
    keywords: "Libertà, Spontaneità, Salto nel Vuoto, Fiducia Cosmica",
    color: "#E5C07B"
  }
};

/**
 * Reduce any number to the 1-22 Arcana range (22 remains 22)
 */
export function reduceToArcana(n: number): number {
  if (n <= 0) return 22;
  while (n > 22) {
    let sum = 0;
    const str = n.toString();
    for (let i = 0; i < str.length; i++) {
      sum += parseInt(str[i], 10);
    }
    n = sum;
  }
  return n === 0 ? 22 : n;
}

export function reduceToSingleDigit(n: number): number {
  while (n > 9) {
    let sum = 0;
    const str = n.toString();
    for (let i = 0; i < str.length; i++) {
      sum += parseInt(str[i], 10);
    }
    n = sum;
  }
  return n;
}

export function getArcana(num: number): ArcanaInfo {
  const reduced = reduceToArcana(num);
  return ARCANA_DATABASE[reduced] || ARCANA_DATABASE[22];
}

function calculateZodiacSign(day: number, month: number) {
  const dates = [
    { sign: 'Capricorno', element: 'Terra', planet: 'Saturno', m: 1, d: 20 },
    { sign: 'Acquario', element: 'Aria', planet: 'Urano / Saturno', m: 2, d: 19 },
    { sign: 'Pesci', element: 'Acqua', planet: 'Nettuno / Giove', m: 3, d: 20 },
    { sign: 'Ariete', element: 'Fuoco', planet: 'Marte', m: 4, d: 20 },
    { sign: 'Toro', element: 'Terra', planet: 'Venere', m: 5, d: 21 },
    { sign: 'Gemelli', element: 'Aria', planet: 'Mercurio', m: 6, d: 21 },
    { sign: 'Cancro', element: 'Acqua', planet: 'Luna', m: 7, d: 23 },
    { sign: 'Leone', element: 'Fuoco', planet: 'Sole', m: 8, d: 23 },
    { sign: 'Vergine', element: 'Terra', planet: 'Mercurio', m: 9, d: 23 },
    { sign: 'Bilancia', element: 'Aria', planet: 'Venere', m: 10, d: 23 },
    { sign: 'Scorpione', element: 'Acqua', planet: 'Plutone / Marte', m: 11, d: 22 },
    { sign: 'Sagittario', element: 'Fuoco', planet: 'Giove', m: 12, d: 21 },
    { sign: 'Capricorno', element: 'Terra', planet: 'Saturno', m: 12, d: 31 }
  ];

  for (let i = 0; i < dates.length; i++) {
    if (month === dates[i].m && day <= dates[i].d) {
      return { sunSign: dates[i].sign, element: dates[i].element, planet: dates[i].planet };
    }
  }
  return { sunSign: 'Capricorno', element: 'Terra', planet: 'Saturno' };
}

export function calculateCompleteMatrix(fullName: string, birthDateStr: string): MatrixData {
  let day = 1, month = 1, year = 1990;
  if (birthDateStr) {
    const parts = birthDateStr.split(/[-\/\.]/).map(p => parseInt(p, 10));
    if (parts.length === 3) {
      if (parts[0] > 1000) {
        year = parts[0];
        month = parts[1];
        day = parts[2];
      } else {
        day = parts[0];
        month = parts[1];
        year = parts[2];
      }
    }
  }

  // 1. Primary Square (Personal Destiny)
  const topVal = reduceToArcana(day);
  const leftVal = reduceToArcana(month);
  const rightVal = reduceToArcana(year);
  const bottomVal = reduceToArcana(topVal + leftVal + rightVal);
  const centerVal = reduceToArcana(topVal + leftVal + rightVal + bottomVal);

  // 2. Ancestral Rhombus
  const fatherTopVal = reduceToArcana(topVal + leftVal);
  const motherTopVal = reduceToArcana(leftVal + rightVal);
  const motherBottomVal = reduceToArcana(rightVal + bottomVal);
  const fatherBottomVal = reduceToArcana(bottomVal + topVal);

  // 3. Channels (Love & Money)
  const moneyVal = reduceToArcana(centerVal + rightVal);
  const loveVal = reduceToArcana(centerVal + bottomVal);

  // 4. Purposes
  const personalPurposeVal = reduceToArcana(topVal + bottomVal + leftVal + rightVal);
  const socialPurposeVal = reduceToArcana(fatherTopVal + motherBottomVal + motherTopVal + fatherBottomVal);
  const spiritualPurposeVal = reduceToArcana(personalPurposeVal + socialPurposeVal);

  // 5. Pythagorean 3x3 Grid
  const dateDigits = `${day}${month}${year}`.replace(/\D/g, '');
  const counts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };
  for (let i = 0; i < dateDigits.length; i++) {
    const d = parseInt(dateDigits[i], 10);
    if (d >= 1 && d <= 9) counts[d] = (counts[d] || 0) + 1;
  }

  const astro = calculateZodiacSign(day, month);

  return {
    name: fullName || 'Elena Solaris',
    birthDate: {
      day,
      month,
      year,
      str: `${String(day).padStart(2, '0')}/${String(month).padStart(2, '0')}/${year}`
    },
    matrix: {
      top: {
        key: 'top',
        label: 'Giorno di Nascita (Risorsa Personale & Identità)',
        value: topVal,
        arcana: getArcana(topVal),
        description: 'La tua energia cosciente primaria, il modo in cui ti presenti al mondo.',
        category: 'personal'
      },
      left: {
        key: 'left',
        label: 'Mese di Nascita (Connessione Spirituale & Talento)',
        value: leftVal,
        arcana: getArcana(leftVal),
        description: 'Il canale di connessione con il tuo intuito e il talento innato.',
        category: 'personal'
      },
      right: {
        key: 'right',
        label: 'Anno di Nascita (Materia, Salute & Denaro)',
        value: rightVal,
        arcana: getArcana(rightVal),
        description: 'Il potenziale di realizzazione materiale, lavoro e benessere corporeo.',
        category: 'personal'
      },
      bottom: {
        key: 'bottom',
        label: 'Coda Karmica (Sfida Evolutiva Inconscia)',
        value: bottomVal,
        arcana: getArcana(bottomVal),
        description: 'La memoria karmica ereditata, la prova più impegnativa da trasmutare.',
        category: 'personal'
      },
      center: {
        key: 'center',
        label: 'Centro dell’Anima (Punto di Comfort & Equilibrio)',
        value: centerVal,
        arcana: getArcana(centerVal),
        description: 'Il nucleo interiore che armonizza tutte le energie e dona serenità.',
        category: 'purpose'
      },
      money: {
        key: 'money',
        label: 'Canale della Prosperità Finanziaria',
        value: moneyVal,
        arcana: getArcana(moneyVal),
        description: 'L’energia che sblocca il flusso del denaro e la realizzazione professionale.',
        category: 'channel'
      },
      love: {
        key: 'love',
        label: 'Canale delle Relazioni & Amore',
        value: loveVal,
        arcana: getArcana(loveVal),
        description: 'La chiave per creare relazioni intime sane, gratificanti e durature.',
        category: 'channel'
      },
      fatherTop: {
        key: 'fatherTop',
        label: 'Linea Paterna Superiore',
        value: fatherTopVal,
        arcana: getArcana(fatherTopVal),
        description: 'Il talento ereditato dal lignaggio paterno.',
        category: 'ancestral'
      },
      motherTop: {
        key: 'motherTop',
        label: 'Linea Materna Superiore',
        value: motherTopVal,
        arcana: getArcana(motherTopVal),
        description: 'Il talento emotivo e intuitivo dal lignaggio materno.',
        category: 'ancestral'
      },
      motherBottom: {
        key: 'motherBottom',
        label: 'Linea Materna Inferiore (Karmica)',
        value: motherBottomVal,
        arcana: getArcana(motherBottomVal),
        description: 'Il debito genealogico materno da sciogliere con consapevolezza.',
        category: 'ancestral'
      },
      fatherBottom: {
        key: 'fatherBottom',
        label: 'Linea Paterna Inferiore (Karmica)',
        value: fatherBottomVal,
        arcana: getArcana(fatherBottomVal),
        description: 'Il debito genealogico paterno da superare nell’arco della vita.',
        category: 'ancestral'
      },
      personalPurpose: {
        key: 'personalPurpose',
        label: 'Primo Scopo (Personale: 20-40 anni)',
        value: personalPurposeVal,
        arcana: getArcana(personalPurposeVal),
        description: 'La scoperta di sé e la costruzione della propria identità.',
        category: 'purpose'
      },
      socialPurpose: {
        key: 'socialPurpose',
        label: 'Secondo Scopo (Sociale: 40-60 anni)',
        value: socialPurposeVal,
        arcana: getArcana(socialPurposeVal),
        description: 'Il contributo verso la comunità e l’ambiente circostante.',
        category: 'purpose'
      },
      spiritualPurpose: {
        key: 'spiritualPurpose',
        label: 'Terzo Scopo (Spirituale & Oltre)',
        value: spiritualPurposeVal,
        arcana: getArcana(spiritualPurposeVal),
        description: 'La realizzazione dell’anima e il compimento cosmico.',
        category: 'purpose'
      }
    },
    grid3x3: {
      counts,
      lines: {
        mental: (counts[1] || 0) + (counts[2] || 0) + (counts[3] || 0),
        emotional: (counts[4] || 0) + (counts[5] || 0) + (counts[6] || 0),
        practical: (counts[7] || 0) + (counts[8] || 0) + (counts[9] || 0),
        thought: (counts[1] || 0) + (counts[4] || 0) + (counts[7] || 0),
        will: (counts[2] || 0) + (counts[5] || 0) + (counts[8] || 0),
        action: (counts[3] || 0) + (counts[6] || 0) + (counts[9] || 0),
        determination: (counts[1] || 0) + (counts[5] || 0) + (counts[9] || 0),
        spirituality: (counts[3] || 0) + (counts[5] || 0) + (counts[7] || 0)
      }
    },
    astrology: astro
  };
}
