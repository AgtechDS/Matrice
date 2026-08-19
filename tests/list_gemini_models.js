const fs = require('fs');

const API_KEY = 'YOUR_GEMINI_TTS_API_KEY';

async function listGeminiModels() {
    console.log("Listing available models on Google AI Studio...");
    try {
        const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`);
        const data = await res.json();
        console.log("Models list status:", res.status);
        if (data.models) {
            console.log("Available Models:");
            data.models.forEach(m => {
                console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods?.join(', ')})`);
            });
        } else {
            console.log("Response:", data);
        }
    } catch(e) {
        console.error("Error:", e);
    }
}

listGeminiModels();
