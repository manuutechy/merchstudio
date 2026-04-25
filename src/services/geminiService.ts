import { GoogleGenAI } from "@google/genai";
import { ProductTemplate, LogoPlacement } from "../constants";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });

export async function optimizePlacement(
  logoDescription: string,
  product: ProductTemplate
): Promise<LogoPlacement> {
  const prompt = `
    You are a professional merch designer. 
    I have a logo described as: "${logoDescription}"
    I want to place it on a "${product.name}" (${product.category}).
    The product's printable area is defined as ${JSON.stringify(product.printArea)}.
    
    Suggest the optimal placement for this logo on this product.
    A LogoPlacement object has:
    - x: horizontal offset within the print area (-50 to 50, 0 is center)
    - y: vertical offset within the print area (-50 to 50, 0 is center)
    - scale: multiplier (0.1 to 2.0, 1.0 fits the print area width/height)
    - opacity: 0 to 1
    - rotation: degrees (-180 to 180)
    
    Respond STRICTLY with a JSON object.
    
    Example: {"x": 0, "y": -10, "scale": 0.8, "opacity": 1.0, "rotation": 0}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [{ parts: [{ text: prompt }] }],
    });
    
    const text = response.text;
    if (!text) throw new Error("No response text");
    const jsonStr = text.match(/\{.*\}/s)?.[0];
    if (jsonStr) {
      return JSON.parse(jsonStr);
    }
  } catch (error) {
    console.error("AI Error:", error);
  }

  // Fallback
  return { x: 0, y: 0, scale: 0.8, opacity: 1, rotation: 0 };
}
