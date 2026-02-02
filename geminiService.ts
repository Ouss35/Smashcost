import { Burger, AnalysisResult } from "../types";

export const analyzeBurgerCost = async (burger: Burger): Promise<AnalysisResult> => {
  try {
    const response = await fetch("/.netlify/functions/analyze", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(burger),
    });

    if (!response.ok) {
      throw new Error("Erreur serveur");
    }

    return await response.json();
  } catch (error) {
    console.error("Analyse failed:", error);
    return {
      profitability: "Erreur de connexion",
      suggestions: ["Vérifiez votre connexion internet", "Réessayez plus tard"],
      score: 0,
    };
  }
};
