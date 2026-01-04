// src/services/authService.ts

import { UserData } from "@/app/dashboard/profil/page";
import { User } from "@/types/user";

const API_URL = "http://localhost:5000/api/user";

export const authService = {
    /**
     * Récupère les données de l'utilisateur connecté
     */
    getCurrentUser: async () => {
      try {
        /* // --- LOGIQUE BACKEND (Pure API) ---
        // Ici, on ne touche JAMAIS au localStorage.
        const response = await fetch(`${API_URL}/profile`, {
            headers: { "Authorization": `Bearer ${votre_logique_token}` }
        });
        if (response.ok) return await response.json(); 
        */
  
        // --- LOGIQUE FALLBACK / SIMULATION (LocalStorage) ---
        if (typeof window !== 'undefined') {
          const storedUser = localStorage.getItem('smartagro_user');
          if (storedUser) return JSON.parse(storedUser);
        }
  
        return {
          nom: "Utilisateur",
          email: "exemple@smartagro.com",
          telephone: "Non renseigné",
          nomExploitation: "Ma Ferme",
        };
      } catch (error) {
        console.error("Erreur authService:", error);
        return null;
      }
    },
  
    /**
     * Met à jour les informations du profil
     */
    updateProfile: async (userData: UserData) => {
      try {
        /* // --- LOGIQUE BACKEND (Pure API) ---
        // Le backend renvoie juste la donnée mise à jour.
        const response = await fetch(`${API_URL}/update`, {
            method: 'PUT',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData)
        });
        if (!response.ok) throw new Error("Erreur serveur");
        return await response.json(); 
        */

        // --- LOGIQUE SIMULATION (Persistence Locale) ---
        // On simule un délai et on enregistre localement pour le test
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (typeof window !== 'undefined') {
          localStorage.setItem('smartagro_user', JSON.stringify(userData));
        }
  
        return { success: true, data: userData };
      } catch (error) {
        console.error("Erreur lors de la mise à jour:", error);
        throw error;
      }
    },
  
    logout: () => {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('smartagro_user');
        localStorage.removeItem('smartagro_token');
        window.location.href = '/login';
      }
    }
};