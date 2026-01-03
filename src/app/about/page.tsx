"use client";

import DashboardHeader from '@/components/shared/Header';
import DashboardFooter from '@/components/shared/Footer';
import Link from 'next/link';

export default function AboutUsPage() {
  const team = [
    { name: "Marie Dupont", role: "Agronome & Fondatrice", img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400" },
    { name: "Lucas Martin", role: "Ingénieur IA", img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400" },
    { name: "Sophie Leroy", role: "Responsable produit", img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400" }
  ];
  return (
    <div className="min-h-screen flex flex-col">
      {/* HEADER EXISTANT */}
      <DashboardHeader />

      <main className="flex-grow">
        {/* SECTION HERO : L'image transmise est utilisée ici en background */}
        <section 
          className="relative h-[70vh] flex items-center justify-center bg-cover bg-center"
          style={{ 
            backgroundImage: `url('https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2832')` 
          }}
        >
          {/* Overlay sombre pour faire ressortir le texte */}
          <div className="absolute inset-0 bg-black/40"></div>
          
          <div className="relative z-10 text-center px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
              Cultiver l'Avenir
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-medium leading-relaxed">
              Smart Agro combine la sagesse de la terre et la puissance de la technologie 
              pour une agriculture plus durable et performante.
            </p>
          </div>
        </section>

        {/* SECTION CONTENU : Texte explicatif sur fond clair */}
        <section className="py-20 bg-[#F1F8F4] px-8">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
              <div>
                <h2 className="text-3xl font-extrabold text-[#1A4D2E] mb-6">Notre Mission</h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Chez <strong>Smart Agro</strong>, nous pensons que chaque agriculteur mérite d'avoir une vision précise de ses cultures. En utilisant des capteurs IoT de pointe et des algorithmes d'IA, nous transformons les données du sol en décisions concrètes.
                </p>
                <p className="text-gray-600 text-lg leading-relaxed">
                  Notre objectif est de maximiser vos rendements tout en optimisant l'utilisation des ressources naturelles comme l'eau et les nutriments.
                </p>
              </div>
              
              <div className="bg-white p-8 rounded-[40px] shadow-xl border border-green-100">
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-2xl">🌱</div>
                    <div>
                      <h4 className="font-bold text-gray-800">Durabilité</h4>
                      <p className="text-sm text-gray-500">Préserver le sol pour les générations futures.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-2xl">📡</div>
                    <div>
                      <h4 className="font-bold text-gray-800">Innovation IoT</h4>
                      <p className="text-sm text-gray-500">Suivi en temps réel de vos parcelles.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center text-2xl">🤖</div>
                    <div>
                      <h4 className="font-bold text-gray-800">Intelligence Artificielle</h4>
                      <p className="text-sm text-gray-500">Prédictions précises pour chaque type de culture.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION APPEL À L'ACTION */}
        {/* SECTION ÉQUIPE - Remplace le bouton "Commencer" */}
        <section className="py-20 px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-black text-[#1A4D2E] text-center mb-16">Notre équipe</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {team.map((member, idx) => (
                <div key={idx} className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-50 text-center transform transition-all hover:-translate-y-2">
                  <img src={member.img} alt={member.name} className="w-32 h-32 rounded-full mx-auto mb-6 object-cover border-4 border-[#e8f5e9]" />
                  <h3 className="text-2xl font-bold text-gray-800">{member.name}</h3>
                  <p className="text-[#22C55E] font-bold mt-1">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER EXISTANT */}
      <DashboardFooter />
    </div>
  );
}