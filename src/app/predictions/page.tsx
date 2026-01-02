"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/shared/Header';
import DashboardFooter from '@/components/shared/Footer';
import { parcelService } from "@/services/parcelService";

export default function PredictionsPage() {
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      const data: any = await parcelService.getParcelles();
      setParcelles(data);
    };
    loadData();
  }, []);

  const handleSelectChange = async (id: string) => {
    setSelectedParcelId(id);
    setIsApplied(false);
    if (!id) {
      setPrediction(null);
      return;
    }

    setLoading(true);
    
    // --- SIMULATION APPEL BACKEND (COMMENTÉ) ---
    /*
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/predict/${id}`);
      const data = await response.json();
      setPrediction(data);
    } catch (error) {
      console.error(error);
    }
    */

    // Simulation d'un délai de réflexion de l'IA
    setTimeout(() => {
      setPrediction({
        culture: "Maïs Doux",
        score: "94%",
        raison: "Analyse simulée : Les niveaux d'humidité et d'azote sont optimaux pour cette variété sur cette parcelle.",
        rendement: "+15%"
      });
      setLoading(false);
    }, 1000);
  };
  
  /*
  const handleApplySimulation = async () => {
    if (!selectedParcelId || !prediction) return;

    // --- SIMULATION ENREGISTREMENT BACKEND (COMMENTÉ) ---
    /*
    try {
      await parcelService.updateParcel(selectedParcelId, { 
        culturePredite: prediction.culture 
      });
    } catch (error) {
      console.error(error);
    }
    */

    // MISE À JOUR LOCALE DE LA CARTE
    // On remplace "Aucune donnée" par la valeur prédite dans l'état local
    /*setParcelles(prevParcelles => 
      prevParcelles.map(p => 
        p.id === selectedParcelId 
          ? { ...p, culturePredite: prediction.culture } 
          : p
      )
    );

    setIsApplied(true);
    alert(`Simulation : La culture "${prediction.culture}" a été appliquée à la parcelle. La carte est mise à jour.`);
  };
  */

  const handleApplySimulation = () => {
    if (!selectedParcelId || !prediction) return;
  
    // 1. Récupérer les données actuelles du localStorage ou créer un objet vide
    const predictionsStockees = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');
  
    // 2. Associer la culture à l'ID de la parcelle
    predictionsStockees[selectedParcelId] = prediction.culture;
  
    // 3. Sauvegarder dans le navigateur
    localStorage.setItem('simulated_predictions', JSON.stringify(predictionsStockees));
  
    setIsApplied(true);
    
    // 4. Rediriger vers la liste des parcelles pour voir le changement
    alert(`Simulation : "${prediction.culture}" enregistrée. Retour à vos parcelles.`);
    window.location.href = "/dashboard/parcelles";
  };
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />

      <main className="flex-grow p-8 max-w-4xl mx-auto w-full">
        <h1 className="text-3xl font-black text-[#1A4D2E] text-center mb-8">Assistant de Culture (Mode Simulation)</h1>

        {/* SELECTEUR DE PARCELLE */}
        <div className="bg-white rounded-[24px] p-6 shadow-sm border border-gray-100 mb-8">
          <label className="block text-xs font-bold text-gray-400 mb-2 uppercase tracking-widest">Parcelle à analyser</label>
          <div className="relative">
            <select 
              value={selectedParcelId}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-xl font-bold text-[#1A4D2E] outline-none focus:border-[#22C55E] appearance-none"
            >
              <option value="">-- Sélectionner une parcelle --</option>
              {parcelles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.culturePredite ? `(${p.culturePredite})` : "(Aucune donnée)"}
                </option>
              ))}
            </select>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </div>

        {/* ZONE DE RÉSULTAT */}
        <div className="min-h-[300px]">
          {loading ? (
            <div className="bg-white rounded-[32px] p-16 text-center shadow-sm border border-gray-100">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#22C55E] mx-auto mb-4"></div>
              <p className="text-[#1A4D2E] font-bold">Calcul des probabilités par l'IA...</p>
            </div>
          ) : prediction ? (
            <div className="bg-white rounded-[32px] p-8 shadow-xl border border-green-50 animate-in fade-in slide-in-from-bottom-2">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <span className="text-[#22C55E] text-xs font-black uppercase tracking-tighter">Culture Recommandée</span>
                  <h2 className="text-4xl font-black text-[#1A4D2E] mt-1">{prediction.culture}</h2>
                </div>
                <div className="bg-[#e8f5e9] p-4 rounded-2xl text-center border-l-4 border-[#2d8c44]">
                  <p className="text-3xl font-black text-[#1a5c2b]">{prediction.score}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">Affinité</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-2xl text-gray-600 italic mb-8 border border-gray-100">
                "{prediction.raison}"
              </div>

              <button 
                onClick={handleApplySimulation}
                disabled={isApplied}
                className={`w-full py-4 rounded-xl font-black text-lg transition-all shadow-md flex items-center justify-center gap-2 ${
                  isApplied 
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed" 
                  : "bg-[#1A4D2E] text-white hover:bg-[#2d8c44] hover:-translate-y-1"
                }`}
              >
                {isApplied ? (
                  <> <i className="fas fa-check-circle"></i> Culture appliquée </>
                ) : (
                  "Appliquer à la carte"
                )}
              </button>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-200 rounded-[32px] p-20 text-center text-gray-400 font-medium">
              Veuillez sélectionner une parcelle pour simuler une prédiction.
            </div>
          )}
        </div>
      </main>

      <DashboardFooter />
    </div>
  );
}