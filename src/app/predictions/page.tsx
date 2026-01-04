"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer'; // Réintégré
import { parcelService } from "@/features/parcels/services/parcelService";
import { predictionService } from "@/features/predictions/services/predictionService";
import { BrainCircuit, CheckCircle, ChevronDown, Loader2, Sparkles, Sprout } from "lucide-react";

export default function PredictionsPage() {
  const router = useRouter();
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [selectedParcelId, setSelectedParcelId] = useState("");
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isApplied, setIsApplied] = useState(false);

  useEffect(() => {
    const loadParcelles = async () => {
      try {
        const data: any = await parcelService.getParcelles();
        setParcelles(data);
      } catch (error) {
        console.error("Erreur chargement", error);
      }
    };
    loadParcelles();
  }, []);

  const handleSelectChange = async (id: string) => {
    setSelectedParcelId(id);
    setIsApplied(false);
    if (!id) { setPrediction(null); return; }

    setLoading(true);
    try {
      const result = await predictionService.getPrediction(id);
      setPrediction(result);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    if (!selectedParcelId || !prediction) return;
    try {
      await predictionService.applyCulture(selectedParcelId, prediction.culture);
      setIsApplied(true);
      setTimeout(() => router.push("/dashboard/parcelles"), 1500);
    } catch (error) {
      alert("Erreur lors de l'enregistrement.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DashboardHeader />

      <main className="flex-grow p-6 lg:p-12 max-w-4xl mx-auto w-full">
        <header className="text-center mb-10">
          <div className="inline-flex p-3 bg-orange-100 rounded-2xl mb-4">
            <BrainCircuit className="w-8 h-8 text-orange-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Assistant IA</h1>
          <p className="text-slate-500 font-medium mt-2 text-lg">Analyse intelligente de vos sols</p>
        </header>

        {/* SELECTEUR */}
        <div className="bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8 transition-all hover:shadow-md">
          <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">Parcelle à analyser</label>
          <div className="relative">
            <select
              value={selectedParcelId}
              onChange={(e) => handleSelectChange(e.target.value)}
              className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-[#22C55E] appearance-none transition-all cursor-pointer"
            >
              <option value="">Choisir une parcelle...</option>
              {parcelles.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.nom} {p.culturePredite ? `— Actuellement : ${p.culturePredite}` : ""}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </div>
        </div>

        {/* ZONE DE RÉSULTAT */}
        <div className="relative min-h-[400px]">
          {loading ? (
            <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-slate-100">
              <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin mx-auto mb-6" />
              <p className="text-slate-900 font-black text-xl">Calcul du rendement optimal...</p>
            </div>
          ) : prediction ? (
            <div className="bg-white rounded-[40px] p-10 shadow-xl border border-green-50 animate-in fade-in zoom-in duration-500">
              <div className="flex items-center gap-3 text-[#22C55E] mb-4">
                <Sparkles className="w-5 h-5" />
                <span className="text-sm font-black uppercase tracking-widest">Culture Recommandée</span>
              </div>

              <div className="flex items-center gap-5 mb-8">
                <div className="p-4 bg-green-100 rounded-3xl">
                  <Sprout className="w-10 h-10 text-green-600" />
                </div>
                <h2 className="text-5xl font-black text-slate-900">{prediction.culture}</h2>
              </div>

              <div className="bg-slate-50 p-8 rounded-3xl mb-10 border border-slate-100">
                <p className="text-slate-600 leading-relaxed italic text-lg">
                  "{prediction.raison}"
                </p>
              </div>

              <button
                onClick={handleApply}
                disabled={isApplied}
                className={`w-full py-5 rounded-[24px] font-black text-xl shadow-lg transition-all flex items-center justify-center gap-3 ${isApplied
                  ? "bg-green-100 text-green-600"
                  : "bg-[#1A4D2E] text-white hover:bg-[#22C55E] hover:-translate-y-1"
                  }`}
              >
                {isApplied ? (
                  <> <CheckCircle className="w-6 h-6" /> Appliquée avec succès </>
                ) : (
                  "Confirmer cette culture"
                )}
              </button>
            </div>
          ) : (
            <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-24 text-center">
              <p className="text-slate-400 font-bold text-lg">
                Veuillez sélectionner une zone pour démarrer l'analyse.
              </p>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER RÉINTÉGRÉ ICI */}
      <DashboardFooter />
    </div>
  );
}