import { GoogleGenAI, Type } from "@google/genai";

export async function handler(event: any) {
  // Seulement les requêtes POST
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  try {
    const apiKey = process.env.API_KEY;

    if (!apiKey) {
      return {
        statusCode: 500,
        body: JSON.stringify({
          profitability: "Clé API non configurée sur le serveur",
          suggestions: ["Contactez l'administrateur"],
          score: 0,
        }),
      };
    }

    const burger = JSON.parse(event.body);
    const ai = new GoogleGenAI({ apiKey });

    const totalCostHT = burger.ingredients.reduce((sum: number, i: any) => sum + i.cost, 0);
    const sellingPriceHT = burger.sellingPrices.single / 1.1;
    const marginHT = sellingPriceHT - totalCostHT;
    const foodCostRatioHT = (totalCostHT / sellingPriceHT) * 100;

    const prompt = `
      Act as a restaurant financial consultant for "Smash Eats". Analyze this burger cost sheet:
      Product: ${burger.name}
      Ingredients Cost (HT): ${JSON.stringify(burger.ingredients)}
      Total Cost (HT): ${totalCostHT.toFixed(2)} €
      Selling Price (TTC): ${burger.sellingPrices.single.toFixed(2)} €
      Selling Price (HT - adjusted for 10% VAT): ${sellingPriceHT.toFixed(2)} €
      Margin (HT): ${marginHT.toFixed(2)} €
      Food Cost Ratio (on HT price): ${foodCostRatioHT.toFixed(1)}%

      Provide a brief analysis in French (JSON format).
      1. 'profitability': A short sentence about the margin health (target food cost is 30% of HT price).
      2. 'suggestions': An array of 3 specific, actionable tips to improve margin without ruining quality.
      3. 'score': An integer 0-100 rating the financial health of this item.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            profitability: { type: Type.STRING },
            suggestions: { type: Type.ARRAY, items: { type: Type.STRING } },
            score: { type: Type.INTEGER },
          },
          required: ["profitability", "suggestions", "score"],
        },
      },
    });

    const result = JSON.parse(response.text || "{}");

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        profitability: result.profitability || "Analyse indisponible",
        suggestions: result.suggestions || [],
        score: result.score || 0,
      }),
    };
  } catch (error) {
    console.error("Gemini error:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        profitability: "Erreur technique IA",
        suggestions: ["Réessayez plus tard"],
        score: 0,
      }),
    };
  }
}
