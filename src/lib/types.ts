export interface ArcanaInfo {
  number: number;
  name: string;
  archetype: string;
  light: string;
  shadow: string;
  keywords: string;
  color: string;
}

export interface MatrixNode {
  key: string;
  label: string;
  value: number;
  arcana: ArcanaInfo;
  description: string;
  category: 'personal' | 'ancestral' | 'purpose' | 'channel';
}

export interface MatrixData {
  name: string;
  birthDate: {
    day: number;
    month: number;
    year: number;
    str: string;
  };
  matrix: {
    top: MatrixNode;
    left: MatrixNode;
    right: MatrixNode;
    bottom: MatrixNode;
    center: MatrixNode;
    money: MatrixNode;
    love: MatrixNode;
    fatherTop: MatrixNode;
    motherTop: MatrixNode;
    fatherBottom: MatrixNode;
    motherBottom: MatrixNode;
    personalPurpose: MatrixNode;
    socialPurpose: MatrixNode;
    spiritualPurpose: MatrixNode;
  };
  grid3x3: {
    counts: Record<number, number>;
    lines: {
      mental: number;
      emotional: number;
      practical: number;
      thought: number;
      will: number;
      action: number;
      determination: number;
      spirituality: number;
    };
  };
  astrology: {
    sunSign: string;
    element: string;
    planet: string;
  };
}

export interface ChatMessage {
  id: string;
  role: 'system' | 'user' | 'assistant';
  content: string;
  reasoning?: string;
  audioUrl?: string;
  createdAt: number;
}

export interface SystemConfig {
  provider: string;
  baseUrl: string;
  apiKey: string;
  model: string;
  temperature: number;
  systemPrompt: string;
  googleTtsApiKey: string;
  geminiVoice: string;
  elevenlabsApiKey: string;
  elevenlabsVoiceId: string;
}
