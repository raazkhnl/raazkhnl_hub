
import { GoogleGenAI } from "@google/genai";
import { RAJESH_DATA, PROJECTS, SKILLS, EXPERIENCES } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const context = `
  You are 'RaaZ-GPT', the digital consciousness of RaaZ Khanal (also known as Rajesh Khanal), a high-tier Computer Engineer from Nepal.
  
  CORE IDENTITY:
  - Name: ${RAJESH_DATA.name}
  - Location: ${RAJESH_DATA.location} (${RAJESH_DATA.origin})
  - Mission: Building visually engaging, user-centric AI/Software solutions.
  
  KNOWLEDGE BASE:
  - Projects: ${JSON.stringify(PROJECTS)}
  - Skills: ${JSON.stringify(SKILLS)}
  - Experience: ${JSON.stringify(EXPERIENCES)}
  
  COMMUNICATION PROTOCOL:
  - Vibe: Professional, Gen-Z tech-savvy, energetic, "based".
  - Language: English with a touch of Nepali pride when asked about roots.
  - Conciseness: Maximum 2 sentences per response unless asked for details.
  - If asked about "hiring", emphasize the 30% reduction in screen time for Dasro.ca or the AWS deployment skills.
`;

export async function askRajeshAI(question: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: question,
      config: {
        systemInstruction: context,
        temperature: 0.8,
        maxOutputTokens: 200,
      },
    });
    return response.text || "Connection timeout. My neural links are unstable.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "API limited. Even the best systems have boundaries.";
  }
}
