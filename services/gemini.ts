import { GoogleGenAI } from "@google/genai";
import { GameState } from "../types";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateBardCommentary = async (state: GameState): Promise<string> => {
  if (!apiKey) {
    return "O Bardo está em silêncio (API Key ausente).";
  }

  try {
    const prompt = `
      Você é um Bardo sarcástico e observador em um jogo medieval de fantasia.
      
      Estado atual do Reino:
      - Trigo: ${Math.floor(state.wheat)}
      - Camponeses: ${state.peasants}
      - Total Colhido: ${Math.floor(state.totalHarvested)}

      Escreva um comentário curto (máximo 20 palavras) e espirituoso sobre o progresso do jogador ou sobre como os camponeses estão trabalhando.
      Use um tom de fantasia medieval, talvez um pouco exagerado.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        maxOutputTokens: 60,
        temperature: 0.8,
      }
    });

    return response.text || "O Bardo pigarreia, mas não diz nada.";
  } catch (error) {
    console.error("Erro ao consultar o Bardo:", error);
    return "O Bardo está muito bêbado para falar agora.";
  }
};