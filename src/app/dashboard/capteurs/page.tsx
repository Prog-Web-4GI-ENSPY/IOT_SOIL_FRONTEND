"use client";

import { useState, useEffect } from "react";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { CapteursService } from "@/lib/services/CapteursService";
import { ParcellesService } from "@/lib/services/ParcellesService";
import { TerrainsService } from "@/lib/services/TerrainsService";
import { Capteur } from "@/lib/models/Capteur";
import { ParcelleResponse } from "@/lib/models/ParcelleResponse";
import SensorForm from "@/features/sensors/components/SensorForm";
import {
  Thermometer,
  Droplets,
  Activity
} from "lucide-react";

export default function CapteursPage() {
  const [view, setView] = useState("list");
  const [sensors, setSensors] = useState<Capteur[]>([]);
  const [parcelles, setParcelles] = useState<ParcelleResponse[]>([]);
  const [selectedSensor, setSelectedSensor] = useState<Capteur | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const loadData = async () => {
    try {
      setLoading(true);
      // Fetch parcelles first to be able to map names
      const terrains = await TerrainsService.getAllTerrainsApiV1TerrainsTerrainsGet();
      const allParcellesPromises = terrains.map(t =>
        ParcellesService.getParcellesByTerrainApiV1ParcellesParcellesTerrainTerrainIdGet(t.id)
      );
      const allParcellesResults = await Promise.all(allParcellesPromises);
      const flattenedParcelles = allParcellesResults.flat();
      setParcelles(flattenedParcelles);

      // Fetch all sensors
      const sData = await CapteursService.readCapteursApiV1CapteursGet();
      setSensors(sData);
      setView("list");
    } catch (err) {
      console.error("Error loading sensors data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleDelete = async (id: string) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer ce capteur ?")) {
      try {
        await CapteursService.deleteCapteurApiV1CapteursCapteurIdDelete(id);
        loadData();
      } catch (err) {
        console.error("Error deleting sensor:", err);
      }
    }
  };

  const getParcelName = (parcelId: string | null | undefined): string => {
    if (!parcelId) return "Non assignée";
    const parcel = parcelles.find((p) => p.id === parcelId);
    return parcel?.nom ?? "Non assignée";
  };

  const getIconForType = (type: string) => {
    if (type.toLowerCase().includes("temp")) return <Thermometer className="w-6 h-6 text-red-500" />;
    if (type.toLowerCase().includes("hum")) return <Droplets className="w-6 h-6 text-blue-500" />;
    return <Activity className="w-6 h-6 text-[#12A125]" />;
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />

      <main className="flex-grow p-8 max-w-7xl mx-auto w-full">
        {view === "form" ? (
          <SensorForm
            initialData={selectedSensor}
            onSuccess={loadData}
            onCancel={() => setView("list")}
          />
        ) : (
          <>
            <div className="flex justify-between items-center mb-10">
              <h1 className="text-3xl font-extrabold text-green-900">Mes Capteurs</h1>
              <button
                onClick={() => { setSelectedSensor(null); setView("form"); }}
                className="bg-[#22C55E] text-white px-8 py-3 rounded-2xl font-bold shadow-lg hover:bg-[#16A34A] transition-all transform active:scale-95"
              >
                + Ajouter
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#12A125]"></div>
              </div>
            ) : sensors.length === 0 ? (
              <div className="bg-white rounded-[40px] border-2 border-dashed border-gray-200 h-[400px] flex flex-col items-center justify-center">
                <div className="bg-green-50 w-20 h-20 rounded-full flex items-center justify-center mb-4">
                  <Activity className="w-10 h-10 text-[#12A125]" />
                </div>
                <p className="text-gray-400 text-xl font-semibold">Pas de capteur pour l&apos;instant</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {sensors.map((sensor) => (
                  <div
                    key={sensor.id}
                    className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 hover:shadow-md transition-all relative overflow-hidden group"
                  >
                    {/* Header Card */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="bg-green-50 p-3 rounded-2xl">
                        {getIconForType(sensor.nom)}
                      </div>
                      <div className="flex gap-3">
                        <button
                          onClick={() => { setSelectedSensor(sensor); setView("form"); }}
                          className="text-blue-500 font-bold text-sm hover:underline"
                        >
                          Modifier
                        </button>
                        <button
                          onClick={() => handleDelete(sensor.id)}
                          className="text-red-400 font-bold text-sm hover:underline"
                        >
                          Supprimer
                        </button>
                      </div>
                    </div>

                    {/* Body Card */}
                    <h3 className="font-extrabold text-xl text-gray-800 mb-1">{sensor.nom}</h3>
                    <p className="text-gray-400 text-sm mb-6 bg-gray-50 inline-block px-2 py-1 rounded-lg">
                      {sensor.code}
                    </p>

                    {/* Footer Card */}
                    <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                      <span className="text-gray-500 font-medium text-sm">Parcelle</span>
                      <span className="text-[#22C55E] font-bold text-sm">
                        {getParcelName(sensor.parcelle_id)}
                      </span>
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
