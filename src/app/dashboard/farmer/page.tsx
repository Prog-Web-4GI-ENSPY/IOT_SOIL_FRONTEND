"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import DashboardHeader from '@/components/shared/Header';
import { terrainService } from "@/services/terrainService";
import { parcelService } from "@/services/parcelService";
import { LayoutGrid, Map as MapIcon, BrainCircuit, Lightbulb, History, ArrowRight } from "lucide-react";

export default function FarmerDashboard() {
  const router = useRouter();
  const [terrains, setTerrains] = useState<any[]>([]);
  const [parcelles, setParcelles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAllData = async () => {
      try {
        setLoading(true);
        const [terrainData, parcelData]: any = await Promise.all([
          terrainService.getTerrains(),
          parcelService.getParcelles()
        ]);
        setTerrains(terrainData);
        setParcelles(parcelData);
      } catch (error) {
        console.error("Erreur de chargement:", error);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  const stats = useMemo(() => ({
    nbTerrains: terrains.length,
    surfaceTerrains: terrains.reduce((acc, t) => acc + Number(t.superficie || 0), 0),
    nbParcelles: parcelles.length,
    surfaceParcelles: parcelles.reduce((acc, p) => acc + Number(p.superficie || 0), 0)
  }), [terrains, parcelles]);

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC]">
      <DashboardHeader />

      <main className="flex-grow p-6 lg:p-12 max-w-7xl mx-auto w-full">
        {/* Header Minimaliste */}
        <div className="mb-12">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Tableau de bord<span className="text-[#22C55E]">.</span>
          </h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">
            Gérez vos ressources et analysez vos performances agricoles.
          </p>
        </div>

        {/* Grille des services avec statistiques intégrées */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <ActionCard 
            icon={<MapIcon className="w-7 h-7 text-green-600" />}
            title="Mes Terrains"
            stats={[
              { label: "Total", value: loading ? "..." : `${stats.nbTerrains}` },
              { label: "Surface", value: loading ? "..." : `${stats.surfaceTerrains} m²` }
            ]}
            description="Accédez à la gestion complète de vos titres et emplacements."
            onClick={() => router.push('/dashboard/terrains')}
            color="bg-green-50"
          />

          <ActionCard 
            icon={<LayoutGrid className="w-7 h-7 text-emerald-600" />}
            title="Mes Parcelles"
            stats={[
              { label: "Actives", value: loading ? "..." : `${stats.nbParcelles}` },
              { label: "Surface", value: loading ? "..." : `${stats.surfaceParcelles} m²` }
            ]}
            description="Suivi de la santé des sols et des capteurs installés."
            onClick={() => router.push('/dashboard/parcelles')}
            color="bg-emerald-50"
          />

          <ActionCard 
            icon={<BrainCircuit className="w-7 h-7 text-orange-600" />}
            title="Prédictions IA"
            stats={[{ label: "Statut", value: "Analyses prêtes" }]}
            description="Recommandations intelligentes basées sur vos relevés."
            onClick={() => router.push('/historiqueprediction')}
            color="bg-orange-50"
            isFeatured
          />

          <ActionCard 
            icon={<Lightbulb className="w-7 h-7 text-yellow-600" />}
            title="Recommandations"
            stats={[{ label: "Alertes", value: "3 nouvelles" }]}
            description="Conseils techniques pour booster votre rendement."
            onClick={() => router.push('/dashboard/recommandations')}
            color="bg-yellow-50"
          />

          <ActionCard 
            icon={<History className="w-7 h-7 text-blue-600" />}
            title="Historique Global"
            stats={[{ label: "Logs", value: "Journal complet" }]}
            description="Suivi chronologique de toutes vos actions passées."
            onClick={() => router.push('/dashboard/activites')}
            color="bg-blue-50"
          />

        </div>
      </main>
      {/* Footer supprimé */}
    </div>
  );
}

function ActionCard({ icon, title, stats, description, onClick, color, isFeatured = false }: any) {
  return (
    <button 
      onClick={onClick}
      className={`group relative text-left p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2 overflow-hidden ${isFeatured ? 'ring-2 ring-orange-500/20' : ''}`}
    >
      <div className={`w-16 h-16 ${color} rounded-3xl flex items-center justify-center mb-8`}>
        {icon}
      </div>
      
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-bold text-slate-800">{title}</h3>
        <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-[#22C55E] group-hover:translate-x-1 transition-all" />
      </div>

      {/* Affichage des statistiques directement dans la carte */}
      <div className="flex gap-4 mb-5">
        {stats.map((s: any, i: number) => (
          <div key={i} className="bg-slate-50 px-3 py-1 rounded-lg border border-slate-100">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{s.label}</p>
            <p className="text-sm font-black text-slate-700">{s.value}</p>
          </div>
        ))}
      </div>
      
      <p className="text-slate-500 leading-relaxed font-medium text-sm">{description}</p>
      
      <div className={`absolute -bottom-6 -right-6 w-32 h-32 ${color} opacity-10 rounded-full transition-transform group-hover:scale-150`} />
    </button>
  );
}