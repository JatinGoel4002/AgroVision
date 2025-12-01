import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;   // <-- replace

const genAI = new GoogleGenerativeAI(API_KEY);

export async function askGemini(prompt) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (err) {
    console.error("Gemini error:", err);
    return "Sorry, I'm having trouble fetching a response.";
  }
}
