/**
 * 🌌 Cascading Image Generation Pipeline (MIT-Grade Architecture)
 * Tier 1: Google Gemini Imagen 3 (Luxury 8K Gold Sacred Geometry)
 * Tier 2 (Fallback 1): Pollinations.ai (Flux Fast Engine — 100% Free & Open)
 * Tier 3 (Fallback 2): LLMAPI.ai (GLM-Image Backup Engine)
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

    console.log(`[ImageGen Cascade] Avvio generazione per: "${basePrompt.slice(0, 80)}..."`);

    // =========================================================================
    // TIER 1: Google Gemini / Imagen 3
    // =========================================================================
    const geminiKey = process.env.GEMINI_TTS_API_KEY || process.env.GOOGLE_API_KEY || 'AIzaSyAqrAhDHx5gsVQbFYghzUJKGIcKfoV09OE';
    if (geminiKey) {
        try {
            console.log(`[ImageGen Cascade] Tentativo Tier 1: Google Imagen 3...`);
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
                    console.log(`[ImageGen Cascade] ✅ Successo Tier 1 (Gemini Imagen 3)!`);
                    const b64 = gemData.generatedImages[0].image.imageBytes;
                    return res.status(200).json({
                        success: true,
                        provider: 'gemini',
                        mimeType: 'image/jpeg',
                        base64: b64,
                        dataUrl: `data:image/jpeg;base64,${b64}`
                    });
                }
            } else {
                console.warn(`[ImageGen Cascade] Tier 1 Gemini HTTP ${geminiRes.status}: procedo al fallback.`);
            }
        } catch (e) {
            console.warn(`[ImageGen Cascade] Tier 1 Gemini fallito (${e.message}): procedo al fallback.`);
        }
    }

    // =========================================================================
    // TIER 2 (Fallback 1): Pollinations.ai (Flux Engine)
    // =========================================================================
    try {
        console.log(`[ImageGen Cascade] Tentativo Tier 2: Pollinations.ai (Flux)...`);
        const encoded = encodeURIComponent(basePrompt);
        const pollUrl = `https://image.pollinations.ai/prompt/${encoded}?model=flux&width=1024&height=1024&nologo=true&enhance=true&seed=${Math.floor(Math.random() * 999999)}`;
        
        const pollRes = await fetch(pollUrl);
        if (pollRes.ok) {
            const buffer = Buffer.from(await pollRes.arrayBuffer());
            if (buffer.length > 5000) {
                console.log(`[ImageGen Cascade] ✅ Successo Tier 2 (Pollinations Flux)! Dimensione: ${(buffer.length / 1024).toFixed(1)} KB`);
                const b64 = buffer.toString('base64');
                return res.status(200).json({
                    success: true,
                    provider: 'pollinations',
                    mimeType: 'image/png',
                    base64: b64,
                    dataUrl: `data:image/png;base64,${b64}`,
                    imageUrl: pollUrl
                });
            }
        }
        console.warn(`[ImageGen Cascade] Tier 2 Pollinations HTTP ${pollRes.status}: procedo al fallback Tier 3.`);
    } catch (e) {
        console.warn(`[ImageGen Cascade] Tier 2 Pollinations fallito (${e.message}): procedo al fallback Tier 3.`);
    }

    // =========================================================================
    // TIER 3 (Fallback 2): LLMAPI.ai (GLM-Image)
    // =========================================================================
    const llmKey = process.env.LLMAPI_KEY || 'llmapi_17acd03b348ba3984473006be0ab0ccac001b934f826ade8b26edbc23125cdf5';
    try {
        console.log(`[ImageGen Cascade] Tentativo Tier 3: LLMAPI.ai (GLM-Image)...`);
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
                console.log(`[ImageGen Cascade] ✅ Successo Tier 3 (LLMAPI GLM-Image)!`);
                return res.status(200).json({
                    success: true,
                    provider: 'llmapi',
                    imageUrl: imgUrl,
                    dataUrl: imgUrl
                });
            }
        }
    } catch (e) {
        console.error(`[ImageGen Cascade] Tier 3 LLMAPI fallito:`, e.message);
    }

    return res.status(500).json({
        success: false,
        error: { message: 'Tutti i motori di generazione immagini (Gemini, Pollinations, LLMAPI) sono momentaneamente non disponibili.' }
    });
}
