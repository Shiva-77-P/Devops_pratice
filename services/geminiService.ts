import { GoogleGenAI, Chat } from "@google/genai";
import { TerminalLine } from '../types';

const apiKey = process.env.API_KEY || '';

// Initialize client
// Note: In a real production app, you might want to proxy this through a backend
// to keep the key secure, but for this client-side demo, we use env var.
const ai = new GoogleGenAI({ apiKey });

export class TerminalSession {
  private chat: Chat;
  private history: string[] = [];

  constructor(systemInstruction: string) {
    this.chat = ai.chats.create({
      model: 'gemini-2.5-flash', // Efficient for terminal responses
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.1, // Low temperature for deterministic, technical outputs
        maxOutputTokens: 1000,
      },
    });
  }

  async sendCommand(command: string): Promise<string> {
    this.history.push(command);
    try {
      const response = await this.chat.sendMessage({ message: command });
      return response.text || '';
    } catch (error) {
      console.error("Terminal AI Error:", error);
      return "Error: Connection to simulated environment failed.";
    }
  }

  async verifyTask(verificationPrompt: string, terminalHistory: TerminalLine[]): Promise<{ success: boolean; message: string }> {
    // We use a fresh model for verification to avoid polluting the terminal context
    // and to analyze the history objectively.
    try {
      // Reconstruct the session as a text log for the verifier
      const log = terminalHistory
        .map(line => `[${line.type.toUpperCase()}] ${line.content}`)
        .join('\n');

      const fullPrompt = `
        ${verificationPrompt}
        
        Here is the full terminal session log:
        ---
        ${log}
        ---
        Respond ONLY with a valid JSON object: { "success": boolean, "message": "string" }
      `;

      const result = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const text = result.text;
      if (!text) throw new Error("No response from verifier");
      
      return JSON.parse(text);
    } catch (error) {
      console.error("Verification Error:", error);
      return { success: false, message: "Could not verify automatically. Please retry." };
    }
  }
}

export const getTutorResponse = async (question: string, context: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Context: ${context}. User Question: ${question}`,
      config: {
        systemInstruction: "You are a helpful DevOps mentor. Keep answers concise, encouraging, and related to the current lab.",
      }
    });
    return response.text || "I'm having trouble thinking right now.";
  } catch (e) {
    return "I couldn't reach the knowledge base.";
  }
};
