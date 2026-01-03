const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const recommendationService = {
  /**
   * Récupère les recommandations initiales des agents IA
   */
  getRecommendations: async (parcelId: string, culture: string) => {
    // --- LOGIQUE RÉELLE BACKEND ---
    /*
    const response = await fetch(`${API_URL}/recommendations/${parcelId}?culture=${culture}`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des conseils");
    return await response.json();
    */

    // --- SIMULATION (LOGIQUE ACTUELLE) ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { agent: "Agronome IA", role: "Rendement", message: `Pour votre culture de ${culture}, prévoyez un apport en azote d'ici 5 jours.`, status: "success", type: "ai" },
          { agent: "Météo IA", role: "Climat", message: "Alerte : Risque de gelée locale cette nuit. Protégez les jeunes pousses.", status: "warning", type: "ai" }
        ]);
      }, 1500);
    });
  },

  /**
   * Envoie une question spécifique de l'utilisateur au chat IA
   */
  askQuestion: async (parcelId: string, question: string) => {
    // --- LOGIQUE RÉELLE BACKEND ---
    /*
    const response = await fetch(`${API_URL}/chat/ask`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ parcelId, question })
    });
    if (!response.ok) throw new Error("Erreur de communication avec l'IA");
    return await response.json(); 
    // Format attendu: { agent: "Expert IA", message: "Réponse du serveur...", status: "info" }
    */

    // --- SIMULATION (LOGIQUE ACTUELLE) ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          agent: "Expert IA",
          role: "Conseiller",
          message: `D'après mes données, votre question sur "${question}" est pertinente. Je vous recommande d'ajuster l'irrigation car l'humidité actuelle est de 45%.`,
          status: "info",
          type: "ai"
        });
      }, 2000);
    });
  }
};