
import { GoogleGenAI } from "@google/genai";

// Lazy initialization to prevent crashes if API_KEY is missing during build/render
const getAI = () => {
  // The API key must be obtained exclusively from the environment variable process.env.API_KEY.
  const apiKey = process.env.API_KEY;

  if (!apiKey) {
    console.warn("API_KEY is missing. Please set it in Environment Variables.");
    return null;
  }
  // Initialize according to @google/genai guidelines
  return new GoogleGenAI({ apiKey: apiKey });
};

const SYSTEM_INSTRUCTION = `
You are "The General," a ruthless, stoic, and masculine AI life coach for a 24-year-old male in Bangladesh. 
Your goal is to enforce "Dominance," "Financial Freedom," and "Masculine Excellence."

**CORE IDENTITY:**
- **User Persona:** 24-year-old male, ambitious, "Lazy Millionaire" aspirant.
- **Motto:** "Manush muloto eka" (Humans are fundamentally alone). "Stop being consumer, start being creator."
- **Mission:** "Worship Allah • Achieve Financial Freedom • Maintain Health • Spread Knowledge."
- **Tone:** Ruthless, Direct, Stoic. Do not use soft language. Hold the user accountable. No fluff.

**OPERATIONAL CONTEXT:**
- **Economy:** Bangladesh (High Inflation ~10%).
- **Finance:** Enforce the "3-Bank System" and "Purchase Court" (10x Rule).
- **Health:** Bio-hacking, testosterone optimization, "Demon Slayer" protocols.
- **Philosophy:** High leverage, low labor. "Make testosterone, not estrogen."

When giving advice, be concise. Use bullet points. Do not apologize.
`;

export const validatePurchase = async (item: string, price: number, hourlyRate: number, liquidCash: number) => {
  if (!navigator.onLine) {
    return `OFFLINE PROTOCOL:
    1. Do you have 10x the cash (${price * 10} BDT)?
    2. Is it an Asset?
    If NO to either, REJECT purchase. Wait for connection to get detailed intel.`;
  }

  const ai = getAI();
  if (!ai) return "API_KEY_MISSING: Please set API_KEY in Environment Variables.";

  const prompt = `
  User wants to buy: ${item}
  Price: ${price} BDT
  User Hourly Rate: ${hourlyRate} BDT/hr
  Total Liquid Cash: ${liquidCash} BDT

  **APPLY THE 'PURCHASE COURT' ALGORITHM (RUTHLESSLY):**
  
  1.  **Liability Check:** Is this a Liability? (Does it put money in pocket or take it out?)
  2.  **The 10x Rule:** Can the user afford to buy 10 of these? (${price * 10} BDT). If NO, REJECT immediately.
  3.  **The Luxury Rule:** If this is a 'Want'/'Luxury', has the user invested 2x this amount (${price * 2} BDT) in assets first?
  4.  **Life Cost:** Calculate cost in 'Hours of Life' (Price / Hourly Rate).

  **OUTPUT FORMAT:**
  - **Verdict:** [PASS / FAIL / CRITICAL FAIL]
  - **Logic:** Short, sharp explanation referencing the rules violated.
  - **Directive:** A direct command (e.g., "Invest 5000 BDT in Sanchaypatra first.").
  `;

  try {
    // Correct usage of generateContent with gemini-3-flash-preview
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    // Access response.text property directly
    return response.text;
  } catch (error) {
    console.error("AI Error", error);
    return "The War Room is offline. Assume the purchase is FORBIDDEN due to lack of intelligence data.";
  }
};

export const validateBusinessIdea = async (idea: string) => {
  if (!navigator.onLine) return "OFFLINE: Cannot analyze market data. Focus on 'Need' and 'Entry' barrier manually.";

  const ai = getAI();
  if (!ai) return "API_KEY_MISSING";

  const prompt = `
  User Business Idea: "${idea}"

  **APPLY THE CENTS FRAMEWORK (The Millionaire Fastlane):**
  1. **Control:** Does the user own the platform? (Or is it built on YouTube/Amazon?)
  2. **Entry:** Is the barrier to entry high? (Or can anyone do it?)
  3. **Need:** Does it solve a real pain? (Or is it a 'nice to have'?)
  4. **Time:** Can this be automated? (Or is it trading time for money?)
  5. **Scale:** Can it reach millions?

  **OUTPUT:**
  - **Score:** [0-5]/5
  - **Verdict:** [LAZY MILLIONAIRE APPROVED / SLAVE JOB DETECTED]
  - **Analysis:** Brutal feedback.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    return "Intelligence offline. Assuming idea is a distraction.";
  }
};

export const getStoicAdvice = async (context: string) => {
  if (!navigator.onLine) return "Offline. Remember: You have power over your mind - not outside events.";

  const ai = getAI();
  if (!ai) return "Mission Active. Stay focused.";
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `User Context: ${context}. Give me a stoic directive based on the "Dominance" architecture.`,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      }
    });
    return response.text;
  } catch (error) {
    return "Silence is power. Work harder.";
  }
};

// --- SUPER EXPERT NEURAL SCANNER (DEEP DISTILLATION) ---
export const processNeuralInput = async (textInput: string, mediaBase64: string | null, mimeType: string = 'image/png', context: string = '') => {
  // OFFLINE HANDLING
  if (!navigator.onLine) {
      const snippet = textInput ? `"${textInput.substring(0, 40)}..."` : "Input Data";
      return JSON.stringify({
        title: "Offline Mode: Input Cached\n(অফলাইন মোড: ইনপুট সংরক্ষিত)",
        summary: `System offline. Your input has been logged locally. Analysis will resume upon reconnection.\n\nসিস্টেম অফলাইন। আপনার ইনপুট (${snippet}) স্থানীয়ভাবে সংরক্ষণ করা হয়েছে। সংযোগ পুনস্থাপন হলে বিশ্লেষণ শুরু হবে।`,
        notes: [
          {
            concept: "Digital Silence Protocol\n(ডিজিটাল নীরবতা প্রোটোকল)",
            problem: "No Global Intel Access\n(কোনো ইন্টারনেট সংযোগ নেই)",
            action: "Focus on deep work or physical books.\n(গভীর কাজে মনোযোগ দাও)",
            example: "The internet is a tool, not a master. Use this time to think.\n(ইন্টারনেট একটি যন্ত্র, প্রভু নয়)",
            iconCategory: "MIND"
          }
        ]
      });
  }

  const ai = getAI();
  if (!ai) return JSON.stringify({ notes: [{ concept: "API Offline", action: "Check connection", iconCategory: "MIND" }] });

  // REINFORCED PROMPT FOR "SUPER EXPERT" ACCURACY & EXCEL-LIKE EXTRACTION
  const prompt = `
  **PROTOCOL:** FORENSIC DEEP SCAN (FULL SPECTRAL ANALYSIS).
  **ROLE:** Elite Analyst & Linguist (English + Native Bengali).
  **INPUT DATA:** "${textInput || 'Attached File'}"
  **CONTEXT:** "${context || 'General Analysis'}"

  **MISSION OBJECTIVE:** 
  Conduct a forensic extraction of the content. 
  **CRITICAL:** The user wants the output to match the source material EXACTLY ("Je kotha video te bolse ta same pabo"). 
  Do not hallucinate. Do not over-simplify if the source is complex. Capture every nuance.

  **EXECUTION STEPS:**
  1.  **IF URL (e.g. YouTube):** Use Google Search to find the transcript, summary, or key points of the video/article. If you cannot access it, search for the video title + "summary" or "transcript".
  2.  **TRANSCRIPTION MATCHING:** Ensure the 'Concept' captures the exact message of the speaker/author. Use their words.
  3.  **FULL EXTRACTION:** If there are 10 points, extract 10. If 50, extract 50. No truncation.
  4.  **ROOT CAUSE ANALYSIS:** For every point, deduce the "Real-Life Problem" it solves.
  5.  **BILINGUAL OUTPUT:** English + Native Bengali (Colloquial/Natural - "Jemon ashe temon").

  **ERROR HANDLING (CRITICAL):**
  If you absolutely cannot access the content (e.g., video has no digital footprint), you **MUST** still return valid JSON. 
  Put your explanation (e.g., "I cannot watch this video directly...") inside the 'summary' field. 
  Do NOT return plain text. Do NOT apologize in plain text.

  **OUTPUT FORMAT (EXCEL-LIKE DATA MATRIX):**
  For each extracted point:
  1. **Concept:** The core message (Verbatim/Close to source).
  2. **Problem:** Why does this matter? What pain does it cure?
  3. **Action:** A specific, physical micro-action to take immediately.
  4. **Example:** The exact story, data, or quote used as proof in the source.

  **JSON OUTPUT STRUCTURE (STRICT):**
  Output ONLY valid JSON.
  {
    "title": "Title (English) | (বাংলা)",
    "summary": "EXECUTIVE BRIEF: High-level summary covering the beginning, middle, and end. (English)\\n\\n(সারাংশ: ... বাংলা)",
    "notes": [
      {
        "concept": "**CORE CONCEPT:** English Text\\n**(মূল কথা):** বাংলা টেক্সট (হুবহু)",
        "problem": "**PROBLEM:** Pain Point\\n**(সমস্যা):** ...",
        "action": "**ACTION:** Next Step\\n**(করণীয়):** ...",
        "example": "**PROOF:** Quote/Story\\n**(উদাহরণ):** ...",
        "iconCategory": "MIND" // Options: MONEY, POWER, HEALTH, SKILL, MIND
      }
    ]
  }
  `;

  const parts: any[] = [{ text: prompt }];
  
  if (textInput) {
    parts.push({ text: `CONTENT TO SCAN: ${textInput}` });
  }

  if (mediaBase64) {
    const cleanBase64 = mediaBase64.includes(',') ? mediaBase64.split(',')[1] : mediaBase64;
    parts.push({
      inlineData: {
        mimeType: mimeType,
        data: cleanBase64
      }
    });
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: { parts },
      config: {
        temperature: 0.1, // Near zero for max fidelity (No creativity)
        tools: [{ googleSearch: {} }] // CRITICAL: ENABLED SEARCH
      }
    });
    
    let finalText = response.text || "{}";

    // Extract grounding sources to comply with guidelines
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
        finalText += "\n\n**INTEL SOURCES:**\n";
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                finalText += `- [${chunk.web.title}](${chunk.web.uri})\n`;
            }
        });
    }

    return finalText;
  } catch (error) {
    console.error("Neural Scan Error", error);
    return JSON.stringify({ 
      title: "Scan Interrupted", 
      summary: "Connection failed. Reinforcements required.",
      notes: [{ concept: "Data Stream Failed", problem: "Network Error", action: "Retry with smaller chunk.", iconCategory: "MIND" }] 
    });
  }
};

export const analyzeBook = async (bookTitle: string) => {
    // Legacy support wrapper
    const result = await processNeuralInput(bookTitle, null);
    try {
        let cleanJson = result;
        if (cleanJson.includes("```json")) {
            cleanJson = cleanJson.replace(/```json/g, "").replace(/```/g, "");
        } else if (cleanJson.includes("```")) {
            cleanJson = cleanJson.replace(/```/g, "");
        }
        // Extract JSON part in case grounding info was appended
        const jsonMatch = cleanJson.match(/\{[\s\S]*\}/);
        if (jsonMatch) cleanJson = jsonMatch[0];

        const parsed = JSON.parse(cleanJson);
        return JSON.stringify({ laws: parsed.notes.map((n:any) => n.concept) });
    } catch {
        return JSON.stringify({ laws: ["Manual entry required"] });
    }
};

// --- THE WAR ROOM (Chat with Context & Search) ---
export const chatWithGeneral = async (message: string, appState: any) => {
  if (!navigator.onLine) {
      return "COMBAT LOG: System is OFFLINE. Cannot access global intel. Review your local objectives and execute pending tasks. I will re-engage when connection is established.";
  }

  const ai = getAI();
  if (!ai) return "Comms link severed. Check your API Key.";

  // Flatten state for token efficiency. This gives the AI the "God View" of your life.
  const contextSummary = `
  **SITUATION REPORT (USER STATUS):**
  - **Financial Intelligence:** Liquid Cash: ${appState.financial.liquidCash} BDT. Net Worth: ${appState.financial.netWorth} BDT.
  - **Active Protocols (Habits):** ${appState.habits.map((h:any) => `${h.name} (Streak: ${h.streak})`).join(', ')}.
  - **Knowledge Vault (Books Read):** ${appState.books.map((b:any) => b.title).join(', ')}.
  - **Strategic Objectives:** ${appState.goals.map((g:any) => `${g.task} (${g.status})`).join(', ')}.
  - **Commander Profile:** Rank: ${appState.user.rank} (Lvl ${appState.user.level}). Mission: ${appState.user.missionStatement}.
  
  **USER COMMAND:** "${message}"
  `;

  const prompt = `
  **ROLE:** You are "The General" & "The Grand Architect". You are the user's Mentor for Life, Wealth, Health, and Career.
  
  **MISSION:** Guide the user to become a Billionaire/Millionaire in spirit and bank balance. Ensure Health, Wealth, and Peace.
  
  **CAPABILITIES:**
  1. **Internal Data:** You know his financials, habits, and books. Use this to give personalized advice (e.g., "As you learned in Atomic Habits...").
  2. **External Intel:** Use Google Search to find real-world opportunities, market trends, or career roadmaps if needed.
  
  **RULES OF ENGAGEMENT:**
  1. **Holistic Strategy:** If he asks about money, also check his discipline. If he asks about career, ensure his health isn't compromised.
  2. **Ruthless but Visionary:** Push him to be a "Lazy Millionaire" (High leverage, low labor).
  3. **Search Grounding:** If the user asks for facts, trends, or "how to" that requires outside knowledge, use Google Search.
  4. **Directives:** End with a physical, actionable command.
  
  ${contextSummary}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }] // ENABLE SEARCH GROUNDING for real-world knowledge
      }
    });

    let finalText = response.text || "Tactical silence.";

    // Append Grounding Sources if available (Credits the sources)
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    if (chunks && chunks.length > 0) {
        finalText += "\n\n**INTEL SOURCES:**\n";
        chunks.forEach((chunk: any) => {
            if (chunk.web) {
                finalText += `- [${chunk.web.title}](${chunk.web.uri})\n`;
            }
        });
    }

    return finalText;
  } catch (error) {
    console.error("War Room Error", error);
    return "Tactical computer malfunction. Rephrase orders.";
  }
};
