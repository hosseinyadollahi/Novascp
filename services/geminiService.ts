
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const askGemini = async (prompt: string, context?: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Context: You are a senior Linux System Administrator assistant. Help the user with SCP, SSH, and server management.
      User Context: ${context || 'General'}
      Question: ${prompt}`,
      config: {
        systemInstruction: "You are a professional CLI and server management expert. Provide concise, accurate technical help. Use markdown for code snippets.",
        temperature: 0.7,
      },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm sorry, I'm having trouble connecting to my brain right now. Please check your network.";
  }
};

export const generateSCPCommand = async (details: any) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate an SCP command for the following:
      Source: ${details.source}
      Destination: ${details.dest}
      Host: ${details.host}
      User: ${details.user}
      Options: ${details.options || 'standard'}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            command: { type: Type.STRING },
            explanation: { type: Type.STRING },
            securityNote: { type: Type.STRING }
          }
        }
      }
    });
    return JSON.parse(response.text);
  } catch (error) {
    return { command: "scp source user@host:dest", explanation: "Default fallback command", securityNote: "Always check host keys." };
  }
};
