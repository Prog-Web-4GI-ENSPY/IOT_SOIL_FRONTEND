// src/services/sensorService.ts

const getStoredSensors = () => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('real_sensors_list');
    return saved ? JSON.parse(saved) : [];
  }
  return [];
};

let mockSensors: any[] = [];

// URL de base de votre API (à adapter selon votre environnement)
const API_URL = "http://localhost:5000/api/sensors"; 

export const sensorService = {
  /**
   * RÉCUPÉRER TOUS LES CAPTEURS
   */
  getSensors: async () => {
    /* // --- LOGIQUE BACKEND ---
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Erreur réseau");
      return await response.json();
    } catch (error) {
      console.error("Erreur getSensors:", error);
      return [];
    }
    */

    // --- SIMULATION ---
    return new Promise((resolve) => {
      mockSensors = getStoredSensors(); // On synchronise avec le stockage
      setTimeout(() => resolve([...mockSensors]), 400);
    });
  },

  /**
   * ENREGISTRER OU MODIFIER UN CAPTEUR
   */
  saveSensor: async (sensor: any) => {
    /*
    // --- LOGIQUE BACKEND ---
    try {
      const method = sensor.id ? "PUT" : "POST";
      const url = sensor.id ? `${API_URL}/${sensor.id}` : API_URL;
      
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(sensor),
      });

      if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
      return await response.json();
    } catch (error) {
      console.error("Erreur saveSensor:", error);
      throw error;
    }
    */

    // --- SIMULATION ---
    return new Promise((resolve) => {
      setTimeout(() => {
        // 1. On récupère la liste actuelle du storage pour être à jour
        let currentSensors = getStoredSensors();

        if (sensor.id) {
          // Mise à jour
          currentSensors = currentSensors.map(s => s.id === sensor.id ? { ...sensor } : s);
        } else {
          // Création (génération d'un ID temporaire)
          const newSensor = { ...sensor, id: Date.now() };
          currentSensors.push(newSensor);
        }

        // 2. CRUCIAL : On enregistre dans le localStorage sinon la liste restera vide au refresh
        localStorage.setItem('real_sensors_list', JSON.stringify(currentSensors));
        
        mockSensors = currentSensors; // Mise à jour de la variable locale
        resolve(true);
      }, 600);
    });
  },

  /**
   * SUPPRIMER UN CAPTEUR
   */
  deleteSensor: async (id: number) => {
    /*
    // --- LOGIQUE BACKEND ---
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Erreur lors de la suppression");
      return true;
    } catch (error) {
      console.error("Erreur deleteSensor:", error);
      throw error;
    }
    */

    // --- SIMULATION ---
    return new Promise((resolve) => {
      setTimeout(() => {
        const currentSensors = getStoredSensors();
        const filtered = currentSensors.filter(s => s.id !== id);
        
        // On met à jour le storage après suppression
        localStorage.setItem('real_sensors_list', JSON.stringify(filtered));
        mockSensors = filtered;
        const dictionary: Record<string, string[]> = {};
      filtered.forEach((s: any) => {
        if (!dictionary[s.parcelleId]) dictionary[s.parcelleId] = [];
        dictionary[s.parcelleId].push(s.nom);
      });
      localStorage.setItem('simulated_sensors', JSON.stringify(dictionary));
      
      
        
        resolve(true);
      }, 300);
    });
  }
};