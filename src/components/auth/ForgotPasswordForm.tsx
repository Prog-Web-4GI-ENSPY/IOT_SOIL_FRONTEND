"use client";

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function ForgotPasswordForm({ role }: { role: string | null }) {
  const [isSent, setIsSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Logique d'envoi du lien de réinitialisation
    console.log("Envoi du lien à :", email);
    setIsSent(true);
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-10 w-full max-w-md flex flex-col items-center border border-gray-100 animate-in fade-in zoom-in duration-500">
      {/* Logo Smart Agro */}
      <div className="mb-4">
        <Image src="/logo.jpg" alt="Logo" width={40} height={40} className="object-contain" />
      </div>

      <h1 className="text-2xl font-bold text-gray-900 mb-8 text-center">
        Mot de passe oublié ?
      </h1>

      {isSent ? (
        <div className="text-center animate-in fade-in slide-in-from-bottom-2">
          <p className="text-agro-primary font-medium mb-6">
            Un lien de réinitialisation a été envoyé à votre adresse email.
          </p>
          <Link 
            href={`/login?role=${role}`} 
            className="text-agro-bright font-bold hover:underline"
          >
            Retour à la connexion
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-6">
          {/* Champ Email */}
          <div className="flex flex-col gap-1">
            <label className="text-agro-primary font-bold ml-1 text-sm">Email</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="votre adresse email"
              className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-agro-bright outline-none transition-all bg-gray-50/50"
            />
          </div>

          {/* Bouton d'action */}
          <button 
            type="submit"
            className="w-full bg-agro-bright hover:bg-agro-primary text-white font-bold py-4 rounded-full shadow-lg transition-all mt-2 text-md active:scale-95"
          >
            Envoyer le lien de reinitialisation
          </button>

          {/* Retour à la connexion */}
          <div className="mt-4 text-center">
            <Link 
              href={`/login?role=${role}`} 
              className="text-agro-primary/60 text-xs font-semibold hover:text-agro-primary transition-colors"
            >
              Retour à la connexion
            </Link>
          </div>
        </form>
      )}
    </div>
  );
}