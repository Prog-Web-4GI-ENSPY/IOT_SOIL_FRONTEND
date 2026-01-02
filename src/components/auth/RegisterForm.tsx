"use client";

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function RegisterForm({ role }: { role: string | null }) {
  const [step, setStep] = useState(1);
  const isAdmin = role === 'admin';

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 w-full max-w-md flex flex-col items-center border border-gray-100">
      {/* Logo & Titre */}
      <div className="flex flex-col items-center mb-6">
        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="object-contain mb-2" />
        <h1 className="text-2xl font-bold text-gray-900">Créer un compte</h1>
      </div>

      {/* Barre de Progression */}
      <div className="w-full flex items-center justify-between mb-8 px-4 relative">
        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 z-0"></div>
        <div 
          className="absolute top-1/2 left-0 h-1 bg-agro-bright -translate-y-1/2 z-0 transition-all duration-300" 
          style={{ width: step === 1 ? '50%' : '100%' }}
        ></div>
        
        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step >= 1 ? 'bg-agro-bright text-white' : 'bg-gray-200'}`}>1</div>
        <div className={`z-10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${step === 2 ? 'bg-agro-bright text-white' : 'bg-gray-200'}`}>2</div>
      </div>

      <form className="w-full flex flex-col gap-4">
        {step === 1 ? (
          /* ÉTAPE 1 : Informations Personnelles */
          <>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Nom</label>
              <input type="text" placeholder="Nom" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Prénom</label>
              <input type="text" placeholder="Prénom" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Tel</label>
              <input type="tel" placeholder="+237" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            <button 
              type="button" 
              onClick={() => setStep(2)}
              className="w-full bg-agro-bright hover:bg-agro-primary text-white font-bold py-3 rounded-full shadow-lg transition-all mt-4"
            >
              suivant
            </button>
          </>
        ) : (
          /* ÉTAPE 2 : Identifiants & Sécurité */
          <>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Email</label>
              <input type="email" placeholder="votre@email.com" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Mot de passe</label>
              <input type="password" placeholder="........" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-agro-primary font-bold text-sm ml-1">Confirmer mot de passe</label>
              <input type="password" placeholder="........" className="w-full border-2 border-gray-100 rounded-xl px-4 py-2.5 outline-none focus:border-agro-bright bg-gray-50/50" />
            </div>
            
            <div className="flex gap-4 mt-4">
              <button 
                type="button" 
                onClick={() => setStep(1)}
                className="flex-1 bg-agro-primary text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all"
              >
                retour
              </button>
              <button 
                type="submit" 
                className="flex-[2] bg-agro-bright text-white font-bold py-3 rounded-xl hover:opacity-90 transition-all shadow-lg"
              >
                S'inscrire
              </button>
            </div>
          </>
        )}
      </form>

      <div className="mt-6 text-sm">
        <span className="text-gray-500">Déjà un compte ? </span>
        <Link href={`/login?role=${role}`} className="text-agro-bright font-bold hover:underline">se connecter</Link>
      </div>
    </div>
  );
}