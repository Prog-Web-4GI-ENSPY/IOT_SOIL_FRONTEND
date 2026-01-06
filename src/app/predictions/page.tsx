"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from '@/components/layout/Header';
import DashboardFooter from '@/components/layout/Footer';
import { parcelService } from "@/features/parcels/services/parcelService";
import { predictionService } from "@/features/predictions/services/predictionService";
import { useTranslation } from "@/providers/TranslationProvider";
import { BrainCircuit, CheckCircle, Loader2, Sparkles, Sprout, MapPin, ChevronRight } from "lucide-react";

export default function PredictionsPage() {
  const router = useRouter();
  const { t } = useTranslation();
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

  const handleSelectParcel = async (id: string) => {
    if (selectedParcelId === id) return;
    setSelectedParcelId(id);
    setIsApplied(false);
    setPrediction(null);

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

      <div className="flex flex-1 overflow-hidden">
        {/* SIDEBAR */}
        <aside className="w-80 bg-white border-r border-slate-100 flex flex-col hidden md:flex">
          <div className="p-6 border-b border-slate-50">
            <h2 className="text-lg font-black text-slate-900">{t('predictions.select_parcel')}</h2>
            <p className="text-xs text-slate-400 font-medium uppercase tracking-wider mt-1">{parcelles.length} {t('nav.parcelles').toLowerCase()}</p>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-2">
            {parcelles.length > 0 ? (
              parcelles.map((p) => (
                <button
                  key={p.id}
                  onClick={() => handleSelectParcel(p.id)}
                  className={`w-full text-left p-4 rounded-2xl transition-all flex items-center gap-3 group ${selectedParcelId === p.id
                      ? "bg-green-50 border-2 border-green-500/20"
                      : "hover:bg-slate-50 border-2 border-transparent"
                    }`}
                >
                  <div className={`p-2 rounded-xl transition-colors ${selectedParcelId === p.id ? "bg-green-500 text-white" : "bg-slate-100 text-slate-400 group-hover:bg-slate-200"
                    }`}>
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-bold truncate ${selectedParcelId === p.id ? "text-green-700" : "text-slate-700"}`}>
                      {p.nom}
                    </p>
                    {p.culturePredite && (
                      <p className="text-[10px] text-slate-400 font-medium truncate uppercase">
                        {t('predictions.currently')}: {p.culturePredite}
                      </p>
                    )}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-transform ${selectedParcelId === p.id ? "text-green-500 translate-x-0" : "text-slate-300 -translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0"}`} />
                </button>
              ))
            ) : (
              <p className="text-center py-10 text-slate-400 text-sm">{t('predictions.no_parcels')}</p>
            )}
          </div>
        </aside>

        {/* MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-12">
          <div className="max-w-4xl mx-auto w-full">
            <header className="text-center mb-10">
              <div className="inline-flex p-3 bg-orange-100 rounded-2xl mb-4">
                <BrainCircuit className="w-8 h-8 text-orange-600" />
              </div>
              <h1 className="text-4xl font-black text-slate-900 tracking-tight">{t('predictions.title')}</h1>
              <p className="text-slate-500 font-medium mt-2 text-lg">{t('predictions.subtitle')}</p>
            </header>

            {/* MOBILE SELECTOR (Fallback) */}
            <div className="md:hidden bg-white rounded-[32px] p-8 shadow-sm border border-slate-100 mb-8">
              <label className="block text-[11px] font-black text-slate-400 mb-3 uppercase tracking-[0.2em]">{t('predictions.select_parcel')}</label>
              <select
                value={selectedParcelId}
                onChange={(e) => handleSelectParcel(e.target.value)}
                className="w-full p-5 bg-slate-50 border-2 border-slate-100 rounded-2xl font-bold text-slate-800 outline-none focus:border-[#22C55E] appearance-none transition-all cursor-pointer"
              >
                <option value="">{t('predictions.choose_parcel')}</option>
                {parcelles.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.nom} {p.culturePredite ? `— ${t('predictions.currently')} : ${p.culturePredite}` : ""}
                  </option>
                ))}
              </select>
            </div>

            {/* ZONE DE RÉSULTAT */}
            <div className="relative min-h-[400px]">
              {loading ? (
                <div className="bg-white rounded-[40px] p-20 text-center shadow-sm border border-slate-100">
                  <Loader2 className="w-12 h-12 text-[#22C55E] animate-spin mx-auto mb-6" />
                  <p className="text-slate-900 font-black text-xl">{t('predictions.calculating')}</p>
                </div>
              ) : prediction ? (
                <div className="bg-white rounded-[40px] p-10 shadow-xl border border-green-50 animate-in fade-in zoom-in duration-500">
                  <div className="flex items-center gap-3 text-[#22C55E] mb-4">
                    <Sparkles className="w-5 h-5" />
                    <span className="text-sm font-black uppercase tracking-widest">{t('predictions.recommended_culture')}</span>
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
                      <> <CheckCircle className="w-6 h-6" /> {t('predictions.applied_success')} </>
                    ) : (
                      t('predictions.confirm_culture')
                    )}
                  </button>
                </div>
              ) : (
                <div className="border-4 border-dashed border-slate-100 rounded-[40px] p-24 text-center">
                  <p className="text-slate-400 font-bold text-lg">
                    {t('predictions.select_zone_message')}
                  </p>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>

      <DashboardFooter />
    </div>
  );
}