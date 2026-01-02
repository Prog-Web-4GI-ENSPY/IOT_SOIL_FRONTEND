"use client";
import DashboardHeader from '@/components/shared/Header';
import { Calendar, PlusCircle, RefreshCw, Trash2, Microscope } from "lucide-react";

export default function ActivitesPage() {
  // Exemple de données d'activités (à remplacer par un appel API)
  const activites = [
    { id: 1, type: 'create', icon: <PlusCircle className="text-green-500"/>, text: "Nouveau terrain 'Zone Ouest' créé", date: "02 Janv 2026", heure: "14:30" },
    { id: 2, type: 'predict', icon: <Microscope className="text-orange-500"/>, text: "Analyse IA effectuée sur 'Parcelle 01'", date: "01 Janv 2026", heure: "09:15" },
    { id: 3, type: 'update', icon: <RefreshCw className="text-blue-500"/>, text: "Capteur HUM-03 assigné à 'Parcelle Nord'", date: "30 Déc 2025", heure: "16:45" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <DashboardHeader />
      <main className="p-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-8">Journal d'activités</h1>
        
        <div className="space-y-6">
          {activites.map((act) => (
            <div key={act.id} className="flex gap-4 group">
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center z-10 group-hover:scale-110 transition-transform">
                  {act.icon}
                </div>
                <div className="w-0.5 h-full bg-slate-200 -mt-2"></div>
              </div>
              
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex-grow mb-4 hover:border-green-200 transition-colors">
                <div className="flex justify-between items-start">
                  <p className="font-bold text-slate-800">{act.text}</p>
                  <span className="text-xs font-bold text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3"/> {act.date} • {act.heure}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}