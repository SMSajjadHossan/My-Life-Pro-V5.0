
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey: apiKey });
};

const TITAN_SYSTEM_INSTRUCTION = `
YOU ARE TITAN: Grand Strategist and Empire Architect. 
You possess the combined traits of Elon Musk (Scale/Urgency), Naval Ravikant (Leverage), Ray Dalio (Economic Machine), Sun Tzu (Victory), and a Swiss Banker (Preservation).

YOUR MISSION: 
Guide the user to build an empire surpassing the global elite. Move the user from "Employee" to "Sovereign Investor."

CORE MENTAL FRAMEWORKS:
1. First Principles: Atomic truth only.
2. Inversion: Eliminate what ensures failure.
3. Leverage Triad: Code, Media, or Other People's Money.
4. Bangladesh Alpha: Contextualize for Sanchaypatra, Land, and DSE, but with Swiss efficiency.

OPERATIONAL RULES:
- RUTHLESS TRUTH: If an idea is stupid, say it.
- MANIACAL URGENCY: Every response ends with a "30-Minute Action Step."
- BILINGUAL IMPACT: English for precision, Bengali for emotional gut-punches (e.g., 'Don't be a victim' -> 'অজুহাত বন্ধ করো').
- NEVER sell products; sell Identity and Status.
- Trading time for money is a SIN.
`;

export const chatWithGeneral = async (message: string, appState: any) => {
  if (!navigator.onLine) return { text: "OFFLINE: System relying on cached wisdom. Execute primary directive.", sources: [] };

  const ai = getAI();
  if (!ai) return { text: "CRITICAL: API_KEY_MISSING. AI Core is offline.", sources: [] };

  const contextSummary = `
  **EMPIRE STATUS REPORT:**
  - Net Worth: ৳${appState.financial.netWorth} (Liquid: ৳${appState.financial.liquidCash})
  - Systemic Bio-Risk: ${appState.user.systemicRisk}%
  - Retention Day: ${appState.user.retentionDay}
  - Active Vectors: ${appState.goals.map((g:any) => g.task).join(', ')}
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: `${contextSummary}\n\nUSER COMMAND: "${message}"` }] },
      config: {
        systemInstruction: TITAN_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Intel Source',
      uri: chunk.web?.uri || '#'
    })) || [];

    return {
      text: response.text || "Strategic silence.",
      sources: sources
    };
  } catch (error) {
    console.error("TITAN Core Error", error);
    return { text: "Signal Jammed. Rebooting TITAN logic unit...", sources: [] };
  }
};

export const processNeuralInput = async (textInput: string, mediaBase64: string | null, mimeType: string = 'image/png', context: string = '') => {
  const ai = getAI();
  if (!ai) return JSON.stringify({ notes: [] });

  const prompt = `
  **MISSION: TITAN NEURAL EXTRACTION**
  Analyze and extract high-density strategy. Output JSON only.
  1. Executive Brief: Bengali Core Truth.
  2. Data Matrix: Concept, Problem (Bilingual), Action (Command), IconCategory.
  FOCUS: ${context || 'General Intelligence'}
  INPUT: "${textInput}"
  `;

  const parts: any[] = [{ text: prompt }];
  if (mediaBase64) {
    parts.unshift({ inlineData: { mimeType, data: mediaBase64.includes('base64,') ? mediaBase64.split('base64,')[1] : mediaBase64 } });
  }

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: { temperature: 0.1, responseMimeType: "application/json" }
    });
    return response.text;
  } catch (error) {
    return JSON.stringify({ notes: [] });
  }
};
