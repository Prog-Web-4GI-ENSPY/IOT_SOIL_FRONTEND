"use client";
import { useState, useEffect } from "react";
import DashboardHeader from '@/components/shared/Header';
import DashboardFooter from '@/components/shared/Footer';
import ParcelForm from "@/components/dashboard/ParcelForm";
import ParcelCard from "@/components/dashboard/ParcelCard"; // Import de la nouvelle carte
import { parcelService } from "@/services/parcelService";
import { terrainService } from "@/services/terrainService";

export default function ParcellesPage() {
  const [view, setView] = useState("list");
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedParcel, setSelectedParcel] = useState(null);

  const loadData = async () => {
    const [pData, tData]: any = await Promise.all([
      parcelService.getParcelles(),
      terrainService.getTerrains()
    ]);
    setParcelles(pData);
    setTerrains(tData);
    setView("list");
  };

  /*useEffect(() => { loadData(); }, []);*/
  useEffect(() => {
    const loadData = async () => {
      // 1. Récupération des parcelles depuis l'API ou le service
      const data: any = await parcelService.getParcelles();
      
      // 2. RÉCUPÉRATION DES DONNÉES SIMULÉES (La correction est ici)
      const capteursStockes = JSON.parse(localStorage.getItem('simulated_sensors') || '{}');
      const predictionsStockees = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');
  
      // 3. Fusion des données pour que la carte reçoive "capteursListe"
      const parcellesMisesAJour = data.map((p: any) => ({
        ...p,
          azote: p.azote ?? 0,
            phosphore: p.phosphore ?? 0,
            potassium: p.potassium ?? 0,
            humidite: p.humidite ?? 0,
            temperature: p.temperature ?? 0,
            ph: p.ph ?? 0,
        // On utilise la prédiction stockée ou celle par défaut
        culturePredite: predictionsStockees[p.id] || p.culturePredite,
        // On crée la chaîne de caractères que ParcelCard attend (image_74bdad)
        capteursListe: capteursStockes[p.id] ? capteursStockes[p.id].join(', ') : null
      }));
  
      setParcelles(parcellesMisesAJour);
    };
    loadData();
    /*
    const loadData = async () => {
      try {
        // 1. Appel simultané aux services API (Backend)
        const [data, tData]: any = await Promise.all([
          parcelService.getParcelles(),
          terrainService.getTerrains()
        ]);
  
        // 2. Transformation des données pour l'affichage des cartes
        const parcellesMisesAJour = data.map((p: any) => {
          
          // --- TRAITEMENT DES CAPTEURS ---
          // On transforme le tableau d'objets sensors en une chaîne lisible
          const listeCapteurs = p.sensors && p.sensors.length > 0 
            ? p.sensors.map((s: any) => s.nom).join(', ') 
            : "Aucun capteur";
  
          // --- TRAITEMENT DE LA PRÉDICTION ---
          // Le backend renvoie p.culturePredite (ex: "Maïs" ou null si non calculé)
          const culture = p.culturePredite || "Aucune culture predite";
  
          return {
            ...p,
            // Données Agronomiques (on s'assure qu'elles existent, sinon 0)
            azote: p.azote ?? 0,
            phosphore: p.phosphore ?? 0,
            potassium: p.potassium ?? 0,
            humidite: p.humidite ?? 0,
            temperature: p.temperature ?? 0,
            ph: p.ph ?? 0,
            culturePredite: p.culturePredite || "Analyse en cours",
            capteursListe: listeCapteurs
            // Optionnel : on peut aussi récupérer la date de la dernière prédiction
            derniereAnalyse: p.datePrediction || "N/A"
          };
        });
  
        // 3. Mise à jour de l'état React pour rafraîchir l'interface
        setParcelles(parcellesMisesAJour);
        setTerrains(tData);
        
        // Retour à la vue liste si on était dans un formulaire
        if(view !== "list") setView("list");
        
      } catch (error) {
        console.error("Erreur de synchronisation Backend:", error);
        // Optionnel : afficher une notification d'erreur à l'utilisateur ici
      }
    };
    */
  }, []);
  const getTerrainName = (id: string | number) => {
    const terrain = terrains.find(t => String(t.id) === String(id));
    return terrain ? terrain.nom : "Terrain inconnu";
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />
      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <ParcelForm initialData={selectedParcel} onSuccess={loadData} onCancel={() => setView("list")} />
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-extrabold text-green-900">Mes Parcelles</h1>
              <button 
    onClick={() => { setSelectedParcel(null); setView("form"); }} 
    className="bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#16A34A] transition-all transform active:scale-95"
  >
    + Ajouter
  </button>
            </div>

            {parcelles.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed h-[400px] flex items-center justify-center">
                <p className="text-gray-400 text-xl font-semibold">Pas de parcelle pour l'instant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parcelles.map(p => (
                  <ParcelCard 
                    key={p.id} 
                    parcel={p} 
                    terrainName={getTerrainName(p.terrainId)}
                    onEdit={() => { setSelectedParcel(p); setView("form"); }}
                    onDelete={async () => { if(confirm("Supprimer ?")) { await parcelService.deleteParcelle(p.id); loadData(); } }}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </main>
      <DashboardFooter />
    </div>
  );
}