"use client";
import { useState, useEffect, useMemo } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import TerrainForm from "@/features/terrains/components/TerrainForm";
import { terrainService } from "@/features/terrains/services/terrainService";

export default function TerrainsPage() {
  const [view, setView] = useState("list");
  const [terrains, setTerrains] = useState<any[]>([]);
  const [selectedTerrain, setSelectedTerrain] = useState(null);

  const loadData = async () => {
    const data: any = await terrainService.getTerrains();
    setTerrains(data);
    setView("list");
  };

  useEffect(() => { loadData(); }, []);

  const stats = useMemo(() => {
    const totalSurface = terrains.reduce((acc, t) => acc + Number(t.superficie || 0), 0);
    return { count: terrains.length, surface: totalSurface };
  }, [terrains]);

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous supprimer ce terrain ?")) {
      await terrainService.deleteTerrain(id);
      loadData();
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <TerrainForm
            initialData={selectedTerrain}
            onSuccess={loadData}
            onCancel={() => setView("list")}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <div>
                <h1 className="text-3xl font-extrabold text-green-900">Mes Terrains</h1>
                <p className="text-gray-500 font-medium">
                  Total : <span className="text-green-600">{stats.count}</span> |
                  Surface : <span className="text-green-600">{stats.surface} m²</span>
                </p>
              </div>
              <button
                onClick={() => { setSelectedTerrain(null); setView("form"); }}
                className="bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#16A34A] shadow-lg shadow-green-100 transition-all"
              >
                + Ajouter
              </button>
            </div>

            {terrains.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-200 h-[400px] flex flex-col items-center justify-center">
                <p className="text-gray-400 text-xl font-semibold">Pas de terrain pour l'instant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {terrains.map((t) => (
                  <div key={t.id} className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-green-50 p-3 rounded-2xl text-[#22C55E]">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                      </div>
                      <div className="flex gap-3">
                        <button onClick={() => { setSelectedTerrain(t); setView("form"); }} className="text-blue-500 font-bold text-sm">Modifier</button>
                        <button onClick={() => handleDelete(t.id)} className="text-red-400 font-bold text-sm">Supprimer</button>
                      </div>
                    </div>
                    <h3 className="font-extrabold text-xl text-gray-800">{t.nom}</h3>
                    <p className="text-gray-400 text-sm mb-4">{t.ville}, {t.quartier}</p>
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-gray-500 font-medium">Superficie</span>
                      <span className="text-[#22C55E] font-black text-lg">{t.superficie} m²</span>
                    </div>
                  </div>
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