
import { GoogleGenAI } from "@google/genai";
import { SearchResult, GroundingSource } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const fetchLatestNeuroNews = async (query: string): Promise<SearchResult> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Agis en tant qu'expert en neurosciences et psychologie. 
      Recherche spécifiquement les actualités et publications scientifiques datant de l'année 2026 concernant : ${query}. 
      Si la requête demande un nombre précis (ex: "Top 8"), essaie de trouver et lister ce nombre exact d'éléments distincts.
      Fais une synthèse structurée en français, mettant l'accent sur les découvertes de 2026 et leurs implications pratiques pour les couples ou la psychologie humaine.
      Cite tes sources précisément.`,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const text = response.text || "Désolé, aucune information n'a pu être synthétisée.";
    
    // Extract grounding sources
    const sources: GroundingSource[] = [];
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (chunks) {
      chunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
          sources.push({
            title: chunk.web.title,
            uri: chunk.web.uri
          });
        }
      });
    }

    // Deduplicate sources by URI
    const uniqueSources = sources.filter((v, i, a) => a.findIndex(t => t.uri === v.uri) === i);

    return {
      text,
      sources: uniqueSources
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};

export const getArticleSummary = async (url: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Analyse et résume cet article scientifique ou de vulgarisation : ${url}. 
      Explique comment cela influence notre compréhension des neurosciences et des relations de couple.`,
    });
    return response.text || "Impossible de générer un résumé.";
  } catch (error) {
    return "Erreur lors de la génération du résumé.";
  }
};
