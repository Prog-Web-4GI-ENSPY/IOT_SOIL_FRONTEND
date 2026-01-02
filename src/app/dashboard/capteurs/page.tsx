"use client";

// CORRECTION 1 : Bien importer Suspense depuis 'react' (image_760aea.png)
import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from 'next/navigation';
import DashboardHeader from '@/components/shared/Header';
import DashboardFooter from '@/components/shared/Footer';
import SensorForm from "@/components/dashboard/SensorForm";
import { sensorService } from "@/services/sensorService";
import { parcelService } from "@/services/parcelService";

function CapteursContent() {
  const searchParams = useSearchParams();
  const [view, setView] = useState("list"); 
  const [sensors, setSensors] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
        const [sData, pData]: any = await Promise.all([
            sensorService.getSensors(),
            parcelService.getParcelles()
        ]);
        setSensors(sData || []);
        setParcelles(pData || []);
    } catch (error) {
        console.error("Erreur chargement:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  useEffect(() => {
    if (searchParams.get('action') === 'new') {
      setSelectedSensor(null);
      setView("form");
    }
  }, [searchParams]);

  const getParcelName = (id: string) => {
    const p = parcelles.find(item => String(item.id) === String(id));
    return p ? p.nom : "N/A";
  };

  const handleDelete = async (id: number) => {
    if (confirm("Voulez-vous vraiment supprimer ce capteur ?")) {
      await sensorService.deleteSensor(id);
      loadData();
    }
  };
  
  const handleCreateSensor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedParcelId || !sensorName) return alert("Champs requis");

    setIsSubmitting(true);
    const associationsStockees = JSON.parse(localStorage.getItem('simulated_sensors') || '{}');

    if (!associationsStockees[selectedParcelId]) {
      associationsStockees[selectedParcelId] = [];
    }
    associationsStockees[selectedParcelId].push(sensorName);

    localStorage.setItem('simulated_sensors', JSON.stringify(associationsStockees));

    setTimeout(() => {
      alert(`Le capteur "${sensorName}" a été créé avec succès !`);
      setIsSubmitting(false);
      window.location.href = "/dashboard/parcelles";
    }, 800);
  };

  return (
    <main className="flex-grow p-12 max-w-7xl mx-auto w-full">
      {view === "form" ? (
        <SensorForm 
          initialData={selectedSensor} 
          onSuccess={() => { setView("list"); loadData(); }} 
          onCancel={() => setView("list")} 
        />
      ) : (
        <>
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-4xl font-extrabold text-[#1A4D2E] mb-2">Mes Capteurs IoT</h1>
              <p className="text-gray-500 text-lg">Ajoutez, modifiez et gérez tous vos capteurs connectés</p>
            </div>
            <button 
              onClick={() => { setSelectedSensor(null); setView("form"); }}
              className="bg-[#2E7D32] text-white px-10 py-3 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-[#1B5E20] transition-colors"
            >
              + Ajouter
            </button>
          </div>

          {!loading && sensors.length === 0 ? (
            <div className="bg-white rounded-[40px] h-[500px] flex flex-col items-center justify-center text-center p-8 border border-gray-100 shadow-sm">
              <h2 className="text-3xl font-bold text-[#1A8D44] mb-8">Capteur actif (0)</h2>
              <div className="space-y-4">
                <p className="text-gray-400 text-2xl font-medium">Aucun capteur enregistré pour le moment.</p>
                {/* CORRECTION 2 : Utiliser &quot; pour les guillemets (image_760823.png) */}
                <p className="text-gray-400 text-2xl font-medium">Cliquez sur &quot;Ajouter le capteur&quot; pour commencer !</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
               <h2 className="text-2xl font-bold text-[#1A4D2E] mb-6">Capteur actif ({sensors.length})</h2>
               <div className="grid grid-cols-1 gap-6">
                 {sensors.map(s => (
                   <div key={s.id} className="bg-white rounded-[32px] p-10 shadow-sm border border-gray-100 flex flex-col md:flex-row justify-between items-center group hover:shadow-md transition-all">
                     <div className="space-y-3 w-full">
                        <h3 className="text-3xl font-black text-gray-900">{s.nom}</h3>
                        <p className="text-xl text-gray-500 font-medium italic">{s.typeMesure}</p>
                        <div className="flex gap-4 items-center pt-2">
                           <span className="text-xl font-bold text-gray-800">Parcelles :</span>
                           <span className="text-xl text-gray-400">{getParcelName(s.parcelleId)}</span>
                        </div>
                     </div>
                     <div className="flex gap-4 mt-6 md:mt-0 min-w-fit">
                        <button 
                          onClick={() => { setSelectedSensor(s); setView("form"); }}
                          className="bg-[#22C55E] text-white px-8 py-2.5 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-[#16A34A] transition-all"
                        >
                          + modifier
                        </button>
                        <button 
                          onClick={() => handleDelete(s.id)}
                          className="bg-[#E11D48] text-white px-8 py-2.5 rounded-xl font-bold text-lg flex items-center gap-2 hover:bg-[#BE123C] transition-all shadow-sm shadow-red-100"
                        >
                          🗑 supprimer
                        </button>
                     </div>
                   </div>
                 ))}
               </div>
            </div>
          )}
        </>
      )}
    </main>
  );
}

export default function CapteursPage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F1F8F4]">
      <DashboardHeader />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center">Chargement...</div>}>
        <CapteursContent />
      </Suspense>
      <DashboardFooter />
    </div>
  );
}