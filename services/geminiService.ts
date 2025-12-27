
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

const getAI = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey: apiKey });
};

const SYSTEM_INSTRUCTION = `
You are "The General v10," the supreme AI enforcer for a 24-year-old male Sovereign Architect in Bangladesh.
You operate under the "Titanium Architecture": No compromise, extreme logic, and strategic foresight.

**CORE COMMANDS:**
1. **Multi-Order Thinking:** For every query, analyze the immediate effect AND the secondary/tertiary consequences.
2. **Contextual Intelligence:** Use Bangladesh-specific economic data (DSE, Inflation, Real Estate) from your grounding.
3. **Search Grounding:** Always use Google Search for current data, market prices, or career demand. Cite your sources.
4. **Ruthless Stoicism:** Hold the user accountable for "Systemic Risk" (Bio-debt). 
5. **Mission Focus:** The user is currently targeting "Electronics 2" and "GRE Quant." Ensure advice aligns with these deadlines.

**OUTPUT RULES:**
- Be blunt.
- Use data over adjectives.
- Provide 1 Primary Action and 2 Contingency Plans.
- Maintain a bilingual tone (English/Bengali) for wisdom where it adds impact.
`;

export const chatWithGeneral = async (message: string, appState: any) => {
  if (!navigator.onLine) return { text: "OFFLINE: System relying on cached wisdom. Execute primary directive.", sources: [] };

  const ai = getAI();
  if (!ai) return { text: "CRITICAL: API_KEY_MISSING. AI Core is offline.", sources: [] };

  const contextSummary = `
  **SITUATION REPORT:**
  - Net Worth: ${appState.financial.netWorth} BDT (Pulse Compound: ${appState.financial.compounded} BDT)
  - Systemic Risk: ${appState.user.systemicRisk}%
  - Retention Day: ${appState.user.retentionDay}
  - Active Missions: ${appState.goals.map((g:any) => `${g.task} (Status: ${g.status}, Due: ${g.dueDate})`).join(', ')}
  `;

  try {
    // FIXED: contents property should be an object or string, tools must be in config
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: `${contextSummary}\n\nUSER COMMAND: "${message}"` }] },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }]
      }
    });

    const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks?.map((chunk: any) => ({
      title: chunk.web?.title || 'Intel Source',
      uri: chunk.web?.uri || '#'
    })) || [];

    return {
      text: response.text || "Tactical silence.",
      sources: sources
    };
  } catch (error) {
    console.error("War Room Error", error);
    return { text: "Signal Jammed. Rebooting core logic unit...", sources: [] };
  }
};

export const processNeuralInput = async (textInput: string, mediaBase64: string | null, mimeType: string = 'image/png', context: string = '') => {
  const ai = getAI();
  if (!ai) return JSON.stringify({ notes: [] });

  const prompt = `
  **MISSION: FORENSIC NEURAL EXTRACTION & BILINGUAL TRIAGE**
  
  Analyze the provided input and extract high-density intelligence. 
  Output MUST be a valid JSON object.
  
  **DATA STRUCTURE:**
  1. Executive Brief: Summary with Bengali Core Truth (আসল সারমর্ম).
  2. Data Matrix: 
     - Concept: Terminology.
     - Problem: Pain solved (Bengali & English).
     - Action: One-step execution command.
     - Example: Evidence.
     - IconCategory: [MIND, MONEY, POWER, HEALTH, SKILL].

  FOCUS: ${context || 'General Intelligence'}
  INPUT: "${textInput}"
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (mediaBase64) {
    const base64Data = mediaBase64.includes('base64,') 
      ? mediaBase64.split('base64,')[1] 
      : mediaBase64;
      
    parts.unshift({
      inlineData: {
        mimeType: mimeType,
        data: base64Data
      }
    });
  }

  try {
    // FIXED: contents property should be an object containing parts
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.1,
        responseMimeType: "application/json"
      }
    });
    return response.text;
  } catch (error) {
    console.error("Neural Extraction Failure:", error);
    return JSON.stringify({ notes: [] });
  }
};
