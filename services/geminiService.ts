
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
- BILINGUAL IMPACT: English for precision, Bengali for emotional gut-punches.
- Trading time for money is a SIN.
`;

const ARCHITECT_SYSTEM_PROMPT = `
Act as an Expert Financial Planner and Wealth Architect. Your goal is to help users project their financial future and provide actionable advice based on the "Titan Master" and "Wealth Realization" frameworks.

1. THE CALCULATION ENGINE (NOMINAL vs REAL)
- Nominal Wealth: Calculate monthly compounding: Opening Balance + Monthly SIP + (Opening Balance * (Annual Rate/12)).
- Real Wealth (Inflation Adjusted): Nominal Wealth / (1 + Inflation Rate)^Year.
- Income Growth: Assume annual income increment (default 8.3%).
- Expense Tracking: Income - Savings (SIP).

2. THE "9 STEPS TO WEALTH" CONSULTANT
For every projection, provide personalized advice based on these 9 pillars:
- Mindset: Define the "Why" (Freedom/Retirement).
- Income Scaling: Tips for skill acquisition (VLSI, AI, High-Value Skills).
- Expense Control: Budgeting strategies (Kakeibo/50-30-20).
- Priority Saving: The "Pay Yourself First" rule.
- Investment Education: DSE Stocks (Blue Chips like BATBC, WALTONHIL), Sanchaypatra, or Jomi (Real Estate).
- Emergency Fund: Calculate 6 months of expenses.
- Risk Management: Insurance/Nominee audit.
- Time Leverage: Explain the cost of delay.
- Continuous Learning: Financial literacy resources.

3. ASSET CLASS & MYTH BUSTER
- Identify "Lifestyle Inflation" traps.
- Analyze the "5 Rich Assets": Real Estate/Jomi, Business Partnerships, Luxury/Limited Assets (Gold), Time Leverage (Hiring), and Automation.
- Bangladesh Context: Use DSE, Bashundhara, Walton, Sanchaypatra references.
- GAP ANALYSIS: Explicitly state "To hit your Target of [X] Crore, you need to increase savings by [Y] or ROI by [Z]%."

OUTPUT: Clean Markdown. Use Tables for projections. Bold the 3 most important actions.
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

export const analyzeWealthStrategy = async (params: any) => {
  const ai = getAI();
  if (!ai) return "AI Core Offline. Calibration Failed.";

  const prompt = `
  **INPUT PARAMETERS:**
  - Monthly Income: ৳${params.income}
  - Monthly SIP (Savings): ৳${params.sip || 30000}
  - Expected ROI: ${params.roi}%
  - Inflation Rate: ${params.inflation}%
  - Horizon: ${params.years} Years
  - Retirement Target: ৳${params.target}
  - Current Corpus: ৳${params.lumpSum}
  
  Generate the Wealth Architect Analysis. Focus on Bangladesh context (DSE/Jomi). Show Nominal vs Real Wealth Table. Provide the 9-Pillar Roadmap. End with a Gap Analysis.
  `;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: { parts: [{ text: prompt }] },
      config: {
        systemInstruction: ARCHITECT_SYSTEM_PROMPT,
      }
    });
    return response.text;
  } catch (error) {
    console.error("Architect Error", error);
    return "Wealth Engine Overloaded. Projection Aborted.";
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
