import { GoogleGenAI } from "@google/genai";
import { HadithResult } from "../types";

// Helper to extract JSON from markdown code blocks
const extractJson = (text: string): any => {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/);
  if (jsonMatch && jsonMatch[1]) {
    return JSON.parse(jsonMatch[1]);
  }
  // Fallback: try parsing the whole text if it's raw JSON
  return JSON.parse(text);
};

export const searchHadith = async (query: string): Promise<{ data: HadithResult; groundingUrls: any[] }> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key tidak dijumpai. Sila pastikan API_KEY disetkan.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const systemInstruction = `
    Anda adalah pakar rujuk Hadis yang berwibawa dan teliti. 
    Tugas anda adalah mencari, menyemak, dan mengesahkan hadis berdasarkan input pengguna (Bahasa Melayu atau Arab).
    
    Sila ikut langkah ini:
    1. Cari matan penuh hadis tersebut (teks Arab).
    2. Cari terjemahan Bahasa Melayu yang tepat.
    3. Tentukan status hadis (Sahih, Hasan, Daif, atau Palsu) dengan merujuk ulama hadis muktabar (Al-Bukhari, Muslim, At-Tirmidzi, dll).
    4. Senaraikan kitab-kitab sumber.
    
    PENTING:
    Output anda MESTI dalam format JSON sahaja di dalam code block \`\`\`json.
    Struktur JSON mestilah:
    {
      "matan": "Teks arab lengkap berbaris",
      "translation": "Terjemahan lengkap bahasa melayu",
      "status": "Sahih/Hasan/Daif/Palsu",
      "sources": ["Nama Kitab 1", "Nama Kitab 2"],
      "explanation": "Ringkasan pendek tentang hadis ini dan hukumnya jika ada"
    }

    Jika hadis tidak dijumpai atau bukan hadis, nyatakan status sebagai "Tidak Diketahui" atau jelaskan dalam "explanation".
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Semak hadis ini: "${query}"`,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.3, // Low temperature for factual accuracy
        tools: [{ googleSearch: {} }], // Enable grounding to verify against the web sources requested
      },
    });

    const text = response.text;
    
    let groundingUrls: any[] = [];
    if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
      groundingUrls = response.candidates[0].groundingMetadata.groundingChunks
        .map((chunk: any) => chunk.web)
        .filter((web: any) => web && web.uri && web.title);
    }

    try {
      const parsedData = extractJson(text);
      return { data: parsedData as HadithResult, groundingUrls };
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      console.log("Raw text:", text);
      throw new Error("Gagal memproses data hadis. Sila cuba lagi.");
    }

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};