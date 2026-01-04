import { Terrain } from "@/types/user";

// Simulation d'une base de données en mémoire pour le mode démo
let mockTerrains = [
  { id: 1, nom: "Terrain Nord", superficie: 500, pays: "Cameroun", ville: "Yaoundé", quartier: "Melen" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const terrainService = {
  
  // ==========================================
  // LOGIQUE BACKEND RÉELLE (API)
  // ==========================================
  /*
  getTerrains: async () => {
    const response = await fetch(`${API_URL}/terrains`);
    if (!response.ok) throw new Error("Erreur lors de la récupération des terrains");
    return await response.json();
  },

  saveTerrain: async (terrain: any) => {
    const isUpdate = !!terrain.id;
    const url = isUpdate ? `${API_URL}/terrains/${terrain.id}` : `${API_URL}/terrains`;
    const method = isUpdate ? 'PUT' : 'POST';

    const response = await fetch(url, {
      method: method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(terrain)
    });

    if (!response.ok) throw new Error("Erreur lors de l'enregistrement");
    return await response.json();
  },

  deleteTerrain: async (id: number) => {
    const response = await fetch(`${API_URL}/terrains/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error("Erreur lors de la suppression");
    return true;
  },
  */

  // ==========================================
  // LOGIQUE SIMULÉE AVEC MOCKS (Actuelle)
  // ==========================================
  getTerrains: async () => {
    return new Promise((resolve) => {
      setTimeout(() => resolve([...mockTerrains]), 500);
    });
  },

  saveTerrain: async (terrain: Terrain) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (terrain.id) {
          // Mise à jour
          mockTerrains = mockTerrains.map(t => t.id === terrain.id ? terrain : t);
        } else {
          // Création
          const nouveau = { ...terrain, id: Date.now() };
          mockTerrains.push(nouveau);
        }
        resolve(true);
      }, 800);
    });
  },

  deleteTerrain: async (id: number) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        mockTerrains = mockTerrains.filter(t => t.id !== id);
        resolve(true);
      }, 400);
    });
  }
};