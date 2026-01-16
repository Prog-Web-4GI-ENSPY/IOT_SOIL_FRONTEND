"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { RecommandationsService } from "@/lib/services/RecommandationsService";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { useTranslation } from "@/providers/TranslationProvider";

export default function PredictionsListPage() {
  const { t } = useTranslation();
  const [predictions, setPredictions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPredictions = async () => {
      setLoading(true);
      try {
        // Fetch all parcelles to map IDs to names
        const terrains = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
        const allParcellesPromises = terrains.map(t =>
          ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
        );
        const allParcellesResults = await Promise.all(allParcellesPromises);
        const parcelles = allParcellesResults.flat();

        // Fetch recommendations history
        const history = await RecommandationsService.getAllRecommendationsApiV1RecommendationsGet();

        const mappedList = history.map((rec: any) => {
          const parcel = parcelles.find(p => p.id === rec.parcelle_id);
          return {
            id: rec.id,
            nomParcelle: parcel?.nom || "Parcelle inconnue",
            culture: rec.culture_predite || "Inconnu",
            date: new Date(rec.created_at).toLocaleDateString(t('welcome.lang') === 'FR' ? 'fr-FR' : 'en-US', {
              day: '2-digit',
              month: 'long',
              year: 'numeric'
            })
          };
        });

        setPredictions(mappedList);
      } catch (error) {
        console.error("Erreur chargement prédictions:", error);
      } finally {
        setLoading(false);
      }
    };

    loadPredictions();
  }, [t]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />

      <main className="flex-grow p-8 max-w-5xl mx-auto w-full">
        <div className="mb-10 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-black text-[#1A4D2E]">{t('history.title')}</h1>
            <p className="text-gray-500 font-medium">{t('history.subtitle')}</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">{t('history.total')}</span>
            <p className="text-2xl font-black text-[#1A4D2E]">{predictions.length}</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => <div key={i} className="h-20 bg-white rounded-2xl animate-pulse border border-gray-100" />)}
          </div>
        ) : predictions.length === 0 ? (
          <div className="bg-white p-16 rounded-[40px] text-center border border-gray-100 shadow-sm">
            <p className="text-gray-400 text-lg font-medium">{t('history.no_analysis')}</p>
          </div>
        ) : (
          <div className="bg-white rounded-[32px] shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('history.date_column')}</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('history.parcel_column')}</th>
                  <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-wider">{t('history.culture_column')}</th>
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