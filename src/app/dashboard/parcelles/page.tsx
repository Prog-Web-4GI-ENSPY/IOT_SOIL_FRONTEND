"use client";
import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import ParcelCard from "@/features/parcels/components/ParcelCard";
import ParcelForm from "@/features/parcels/components/ParcelForm";
import { parcelService } from "@/features/parcels/services/parcelService";
import { terrainService } from "@/features/terrains/services/terrainService";
import { useTranslation } from "@/providers/TranslationProvider";

export default function ParcellesPage() {
  const { t } = useTranslation();
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

  useEffect(() => {
    const loadAllData = async () => {
      const data: any = await parcelService.getParcelles();
      const tData: any = await terrainService.getTerrains();
      setTerrains(tData);

      const capteursStockes = JSON.parse(localStorage.getItem('simulated_sensors') || '{}');
      const predictionsStockees = JSON.parse(localStorage.getItem('simulated_predictions') || '{}');

      const parcellesMisesAJour = data.map((p: any) => ({
        ...p,
        azote: p.azote ?? 0,
        phosphore: p.phosphore ?? 0,
        potassium: p.potassium ?? 0,
        humidite: p.humidite ?? 0,
        temperature: p.temperature ?? 0,
        ph: p.ph ?? 0,
        culturePredite: predictionsStockees[p.id] || p.culturePredite,
        capteursListe: capteursStockes[p.id] ? capteursStockes[p.id].join(', ') : null
      }));

      setParcelles(parcellesMisesAJour);
    };
    loadAllData();
  }, []);

  const getTerrainName = (id: string | number) => {
    const terrain = terrains.find(tr => String(tr.id) === String(id));
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
              <h1 className="text-3xl font-extrabold text-green-900">{t('parcelles_list.title')}</h1>
              <button
                onClick={() => { setSelectedParcel(null); setView("form"); }}
                className="bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#16A34A] transition-all transform active:scale-95"
              >
                + {t('parcelles_list.add_button')}
              </button>
            </div>

            {parcelles.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed h-[400px] flex items-center justify-center">
                <p className="text-gray-400 text-xl font-semibold">{t('parcelles_list.no_parcelles')}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {parcelles.map(p => (
                  <ParcelCard
                    key={p.id}
                    parcel={p}
                    terrainName={getTerrainName(p.terrainId)}
                    onEdit={() => { setSelectedParcel(p); setView("form"); }}
                    onDelete={async () => { if (confirm(t('parcelles_list.delete_confirm'))) { await parcelService.deleteParcelle(p.id); loadData(); } }}
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