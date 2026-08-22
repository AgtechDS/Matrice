/**
 * 🌌 Ultra-Luxury Cascading Image Generation Pipeline (MIT-Grade Architecture)
 * Tier 1: Qwen Image Max (LLMAPI) — Ultra-HD 8K Sacred Gold Geometry (No Watermark)
 * Tier 2: Seedream 5.0 Pro (LLMAPI) — Luxury Framed Tarot Art with Astrological Glyphs
 * Tier 3: Qwen Image Plus (LLMAPI) — High-Res Sacred Art with Classical Typography
 * Tier 4: CogView-4 / GLM-Image (LLMAPI) — Fast Esoteric Mandala Engine
 * Tier 5: Pollinations.ai (Flux) — 100% Open Emergency Safety Net
 */

export const ARCANA_IMAGE_PROMPTS = {
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

async function fetchLLMAPIImage(modelId, prompt, apiKey) {
    const payload = {
        model: modelId,
        prompt: prompt,
        n: 1
    };
    if (!modelId.includes('qwen')) {
        payload.size = '1024x1024';
    }

    const res = await fetch('https://api.llmapi.ai/v1/images/generations', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!res.ok) {
        const err = await res.json().catch(() => ({ error: { message: `HTTP ${res.status}` } }));
        throw new Error(err.error?.message || `LLMAPI HTTP ${res.status}`);
    }

    const data = await res.json();
    const item = data.data?.[0];
    if (!item) throw new Error('No image returned from LLMAPI');

    return item.url || item.b64_json;
}

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method not allowed' } });
    }

    const { prompt, arcanaNumber, arcanaName, archetype } = req.body || {};

    let basePrompt = prompt;
    if (!basePrompt) {
        const num = parseInt(arcanaNumber, 10);
        if (num && ARCANA_IMAGE_PROMPTS[num]) {
            basePrompt = ARCANA_IMAGE_PROMPTS[num];
        } else {
            basePrompt = `Sacred Tarot Card Arcana ${arcanaNumber || ''} ${arcanaName || ''} (${archetype || ''}), mystical radiant golden sacred geometry, 8-pointed star octagram, glowing amber esoteric details, deep cosmic obsidian nebula background, 8k luxury masterpiece, no text`;
        }
    }

    console.log(`[ImageGen Cascade] Generazione per Arcano ${arcanaNumber || 'Custom'}: "${basePrompt.slice(0, 75)}..."`);

    const llmKey = process.env.LLMAPI_KEY || 'llmapi_17acd03b348ba3984473006be0ab0ccac001b934f826ade8b26edbc23125cdf5';

    // -------------------------------------------------------------------------
    // TIER 1 to 4: LLMAPI High-End Image Models Pipeline
    // -------------------------------------------------------------------------
    const priorityModels = [
        { id: 'qwen-image-max', label: 'Qwen Image Max 8K' },
        { id: 'dola-seedream-5-0-pro-260628', label: 'Seedream 5.0 Pro' },
        { id: 'qwen-image-plus', label: 'Qwen Image Plus' },
        { id: 'cogview-4', label: 'CogView-4' },
        { id: 'glm-image', label: 'GLM Image' }
    ];

    for (const item of priorityModels) {
        try {
            console.log(`[ImageGen Cascade] Tentativo su LLMAPI: ${item.id}...`);
            const imageResult = await fetchLLMAPIImage(item.id, basePrompt, llmKey);
            if (imageResult) {
                console.log(`[ImageGen Cascade] ✅ SUCCESSO con ${item.label}!`);
                return res.status(200).json({
                    success: true,
                    provider: 'llmapi',
                    model: item.id,
                    modelLabel: item.label,
                    imageUrl: imageResult.startsWith('http') ? imageResult : undefined,
                    dataUrl: imageResult.startsWith('http') ? imageResult : `data:image/png;base64,${imageResult}`
                });
            }
        } catch (e) {
            console.warn(`[ImageGen Cascade] ${item.id} non riuscito (${e.message}), provo modello successivo...`);
        }
    }

    // -------------------------------------------------------------------------
    // TIER 5: Pollinations.ai Flux (Open Fallback Safety Net)
    // -------------------------------------------------------------------------
    try {
        console.log(`[ImageGen Cascade] Tentativo Fallback di Emergenza: Pollinations.ai (Flux)...`);
        const encoded = encodeURIComponent(basePrompt);
        const pollUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1024&height=1024&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
        
        const pollRes = await fetch(pollUrl);
        if (pollRes.ok) {
            const buffer = Buffer.from(await pollRes.arrayBuffer());
            if (buffer.length > 5000) {
                console.log(`[ImageGen Cascade] ✅ Successo con Pollinations Flux! Dimensione: ${(buffer.length / 1024).toFixed(1)} KB`);
                const b64 = buffer.toString('base64');
                return res.status(200).json({
                    success: true,
                    provider: 'pollinations',
                    model: 'flux',
                    modelLabel: 'Pollinations Flux Engine',
                    mimeType: 'image/png',
                    dataUrl: `data:image/png;base64,${b64}`,
                    imageUrl: pollUrl
                });
            }
        }
    } catch (e) {
        console.error(`[ImageGen Cascade] Pollinations fallito:`, e.message);
    }

    return res.status(500).json({
        success: false,
        error: { message: 'Tutti i motori di generazione immagini su LLMAPI e di emergenza sono momentaneamente occupati. Riprova tra qualche istante.' }
    });
}
