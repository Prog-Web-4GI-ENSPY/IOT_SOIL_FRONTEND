const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const predictionService = {
  /**
   * Envoie une requête au backend pour analyser une parcelle
   */
  getPrediction: async (parcelId: string) => {
    // --- LOGIQUE RÉELLE (DÉCOMMENTER POUR ACTIVER) ---
    /*
    const response = await fetch(`${API_URL}/predict/${parcelId}`);
    if (!response.ok) throw new Error("Erreur lors de la prédiction IA");
    return await response.json();
    */

    // --- LOGIQUE SIMULÉE ---
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          culture: "Maïs Doux",
          raison: "Les niveaux d'humidité et d'azote détectés par vos capteurs sont parfaits pour cette variété sur cette parcelle.",
          rendement: "+15%"
        });
      }, 1500);
    });
  },

  /**
   * Enregistre la culture choisie
   */
  applyCulture: async (parcelId: string, culture: string) => {
    // --- LOGIQUE RÉELLE ---
    /*
    const response = await fetch(`${API_URL}/parcelles/${parcelId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ culturePredite: culture })
    });
    return await response.json();
    */
    
    const stock = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');
    stock[parcelId] = culture;
    localStorage.setItem('simulated_predictions', JSON.stringify(stock));
    return true;
  }
};