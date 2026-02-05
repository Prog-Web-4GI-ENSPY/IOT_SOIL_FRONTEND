// src/services/parcelService.ts

import { Parcelle } from "@/types/user";

// Simulation de la base de données locale
let mockParcelles = [
  { 
    id: 1, 
    nom: "Parcelle Nord", 
    superficie: 2.3, 
    terrainId: 1,
    code: "PK-01",
    azote: 12,        // Portion verte (12/20)
    phosphore: 8,     // Portion orange (8/20)
    potassium: 15,    // Portion violette (15/20)
    humidite: 23,     // Portion bleue (23%)
    temperature: 28,
    ph: 6.4,
    culturePredite: "Blé tendre"
  },
  { 
    id: 2, 
    nom: "Zone Est", 
    superficie: 1.8, 
    terrainId: 1,
    code: "PK-02",
    azote: 7, 
    phosphore: 5, 
    potassium: 10, 
    humidite: 12, 
    temperature: 25,
    ph: 5.9,
    culturePredite: "Colza"
  }
];

const API_URL = "http://localhost:5000/api/parcelles"; // URL de votre futur Backend

export const parcelService = {
  
  /**
   * RÉCUPÉRER TOUTES LES PARCELLES
   */
  getParcelles: async () => {
      /* // --- LOGIQUE BACKEND ---
      try {
          const response = await fetch(API_URL);
          if (!response.ok) throw new Error("Erreur lors de la récupération");
          return await response.json(); // Le backend devrait renvoyer la parcelle + ses capteurs
      } catch (error) {
          console.error("Erreur getParcelles:", error);
          return [];
      }
      */

      // --- LOGIQUE SIMULÉE ---
      return new Promise<Parcelle[]>((resolve) => {
          setTimeout(() => resolve([...mockParcelles]), 400);
      });
  },

  /**
   * ENREGISTRER OU MODIFIER UNE PARCELLE
   */
  saveParcelle: async (parcelle: Parcelle) => {
      /* // --- LOGIQUE BACKEND ---
      try {
          const isUpdate = !!parcelle.id;
          const url = isUpdate ? `${API_URL}/${parcelle.id}` : API_URL;
          const method = isUpdate ? 'PUT' : 'POST';

          const response = await fetch(url, {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(parcelle),
          });

          if (!response.ok) throw new Error("Erreur lors de la sauvegarde");
          return await response.json();
      } catch (error) {
          console.error("Erreur saveParcelle:", error);
          throw error;
      }
      */

      // --- LOGIQUE SIMULÉE ---
      return new Promise((resolve) => {
          setTimeout(() => {
              if (parcelle.id) {
                  mockParcelles = mockParcelles.map(p => p.id === parcelle.id ? { ...parcelle } : p);
              } else {
                  const nouvelle = { ...parcelle, id: Date.now() };
                  mockParcelles.push(nouvelle);
              }
              resolve(true);
          }, 600);
      });
  },

  /**
   * SUPPRIMER UNE PARCELLE
   */
  deleteParcelle: async (id: number | string) => {
      /* // --- LOGIQUE BACKEND ---
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: 'DELETE',
          });
          if (!response.ok) throw new Error("Erreur lors de la suppression");
          return true;
      } catch (error) {
          console.error("Erreur deleteParcelle:", error);
          throw error;
      }
      */

      // --- LOGIQUE SIMULÉE ---
      return new Promise((resolve) => {
          setTimeout(() => {
              mockParcelles = mockParcelles.filter(p => String(p.id) !== String(id));
              resolve(true);
          }, 300);
      });
  },

  /**
   * MISE À JOUR PARTIELLE (PATCH)
   */
  updateParcel: async (id: string | number, data: Parcelle) => {
      /* // --- LOGIQUE BACKEND ---
      try {
          const response = await fetch(`${API_URL}/${id}`, {
              method: 'PATCH',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
          });
          if (!response.ok) throw new Error("Erreur lors de la mise à jour");
          return await response.json();
      } catch (error) {
          console.error("Erreur updateParcel:", error);
          throw error;
      }
      */

      // --- SIMULATION ---
      return new Promise((resolve) => {
          mockParcelles = mockParcelles.map(p => 
              String(p.id) === String(id) ? { ...p, ...data } : p
          );
          resolve(true);
      });
  }
};