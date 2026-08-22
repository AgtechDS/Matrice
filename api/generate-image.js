/**
 * 🌌 Cascading Image Generation Pipeline (MIT-Grade Architecture)
 * Tier 1: Google Gemini Imagen 3 (Luxury 8K Gold Sacred Geometry)
 * Tier 2 (Fallback 1): Pollinations.ai (Flux Fast Engine — 100% Free & Open)
 * Tier 3 (Fallback 2): LLMAPI.ai (GLM-Image Backup Engine)
 */

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: { message: 'Method not allowed' } });
    }

    const { prompt, arcanaNumber, arcanaName, archetype } = req.body || {};

    if (!prompt && !arcanaName) {
        return res.status(400).json({ error: { message: 'Il prompt o il nome dell\'Arcano è obbligatorio.' } });
    }

    const basePrompt = prompt || `Sacred Tarot Card Arcana ${arcanaNumber || ''} ${arcanaName || ''} (${archetype || ''}), mystical radiant golden sacred geometry, 8-pointed star octagram, glowing amber esoteric details, deep cosmic obsidian nebula background, 8k luxury masterpiece, no text`;

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
