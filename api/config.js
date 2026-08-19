import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
    let systemPrompt = '';
    try {
        const promptPath = path.join(process.cwd(), 'prompt2analisi.md');
        if (fs.existsSync(promptPath)) {
            systemPrompt = fs.readFileSync(promptPath, 'utf8');
        }
    } catch (e) {
        console.error('Error reading prompt:', e);
    }

    res.json({
        model: process.env.LLM_MODEL || process.env.TOKENROUTER_MODEL || 'deepseek-v4-flash-0731',
        baseUrl: process.env.LLM_BASE_URL || process.env.TOKENROUTER_BASE_URL || 'https://api.llmapi.ai/v1',
        hasApiKey: !!(process.env.LLMAPI_KEY || process.env.TOKENROUTER_API_KEY),
        defaultSystemPrompt: systemPrompt
    });
}
