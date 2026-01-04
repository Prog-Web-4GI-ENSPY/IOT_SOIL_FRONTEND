"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { parcelService } from "@/features/parcels/services/parcelService";

export default function PredictionsListPage() {
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      try {
        /** * --- FUTUR CÔTÉ BACKEND (À décommenter plus tard) ---
         * const response = await predictionService.getHistory();
         * setPredictions(response); 
         */

        // --- CÔTÉ SIMULATION (LocalStorage) ---
        const allParcelles: any = await parcelService.getParcelles();
        const iaSimu = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');

        // On simule une date (Aujourd'hui) pour les besoins de la démo
        const dateAujourdhui = new Date().toLocaleDateString('fr-FR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });

        const filteredList = allParcelles
          .filter((p: any) => iaSimu[String(p.id)])
          .map((p: any) => ({
            id: p.id,
            nomParcelle: p.nom,
            culture: iaSimu[String(p.id)],
            date: dateAujourdhui // Sera remplacé par p.date_analyse via le backend
          }));

        setPredictions(filteredList);
      } catch (error) {
        console.error("Erreur chargement prédictions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />

      <main className="flex-grow p-8 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#1A4D2E]">Historique des Analyses</h1>
            <p className="text-gray-500 font-medium">Suivi temporel des recommandations IA</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Total</span>
            <p className="text-2xl font-black text-[#1A4D2E]">{predictions.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-lg font-medium">Aucune analyse n'a encore été effectuée.</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date d'analyse</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Parcelle</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Culture Recommandée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {predictions.map((item) => (
                  <tr key={item.id} className="hover:bg-green-50/20 transition-all group">
                    <td className="px-8 py-6 text-sm text-gray-500 font-medium">
                      {item.date}
                    </td>
                    <td className="px-8 py-6">
                      <p className="font-bold text-gray-800 group-hover:text-[#1A4D2E] transition-colors">
                        {item.nomParcelle}
                      </p>
                    </td>
                    <td className="px-8 py-6">
                      <div className="inline-flex items-center gap-2 bg-[#F0FDF4] text-[#166534] px-4 py-1.5 rounded-full border border-green-100">
                        <span className="w-2 h-2 bg-[#22C55E] rounded-full animate-pulse"></span>
                        <span className="font-black text-sm uppercase tracking-tight">{item.culture}</span>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>

      <DashboardFooter />
    </div>
  );
}