import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  let systemPrompt = '';
  try {
    const promptPath = path.join(process.cwd(), 'prompt2analisi.md');
    if (fs.existsSync(promptPath)) {
      systemPrompt = fs.readFileSync(promptPath, 'utf8');
    }
  } catch (e) {
    console.error('Error reading system prompt:', e);
  }

  return NextResponse.json({
    model: process.env.TOKENROUTER_MODEL || 'qwen/qwen3.6-27b',
    baseUrl: process.env.TOKENROUTER_BASE_URL || 'https://api.groq.com/openai/v1',
    hasApiKey: !!process.env.TOKENROUTER_API_KEY,
    hasGeminiKey: !!process.env.GEMINI_TTS_API_KEY,
    defaultSystemPrompt: systemPrompt
  });
}
