"use client";

import { useState, FormEvent } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface LoginFormProps {
  role: string | null;
}

export default function LoginForm({ role }: LoginFormProps) {
  const router = useRouter();
  const isAdmin = role === 'admin';
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // LE CODE ADMINISTRATEUR FIXE
  const ADMIN_SECRET_CODE = "SA-2025-ADMIN";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');
    const adminCode = formData.get('adminCode');

    // 1. Validation du code fixe pour l'administrateur
    if (isAdmin) {
      if (adminCode !== ADMIN_SECRET_CODE) {
        setError("Code de sécurité administrateur incorrect.");
        setLoading(false);
        return;
      }
    }

    // 2. Simulation de la logique d'authentification
    try {
      // Ici tu ajouteras ton appel API (ex: fetch('/api/login', ...))
      console.log("Connexion en cours...", { email, role });
      
      // Simulation d'un délai réseau
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirection selon le rôle
      router.push(isAdmin ? '/dashboard/admin' : '/dashboard/farmer');
    } catch (err) {
      setError("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-10 w-full max-w-md flex flex-col items-center border border-gray-100 animate-in fade-in zoom-in duration-500">
      {/* Logo Smart Agro */}
      <div className="mb-4">
        <Image 
          src="/logo.jpg" 
          alt="Smart Agro Logo" 
          width={50} 
          height={50} 
          className="object-contain" 
        />
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-8">Connexion</h1>

      {/* Affichage des erreurs de validation */}
      {error && (
        <div className="w-full bg-red-50 text-red-600 border border-red-200 p-3 rounded-xl text-sm mb-6 text-center font-medium animate-shake">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="w-full flex flex-col gap-5">
        {/* Champ Email */}
        <div className="flex flex-col gap-1">
          <label className="text-agro-primary font-bold ml-1 text-sm">Email</label>
          <input 
            name="email"
            type="email" 
            required
            placeholder="votre adresse email"
            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-agro-bright outline-none transition-all bg-gray-50/50 placeholder:text-gray-300"
          />
        </div>

        {/* Champ Mot de Passe */}
        <div className="flex flex-col gap-1">
          <label className="text-agro-primary font-bold ml-1 text-sm">Mot de Passe</label>
          <input 
            name="password"
            type="password" 
            required
            placeholder="........"
            className="w-full border-2 border-gray-100 rounded-2xl px-4 py-3 focus:border-agro-bright outline-none transition-all bg-gray-50/50 placeholder:text-gray-300"
          />
        </div>

        {/* Champ Code Fixe Administrateur - Conditionnel */}
        {isAdmin && (
          <div className="flex flex-col gap-1 animate-in slide-in-from-top-2 duration-300">
            <label className="text-red-600 font-bold ml-1 text-sm">Code de Sécurité Administrateur</label>
            <input 
              name="adminCode"
              type="password" 
              required
              placeholder="Code secret"
              className="w-full border-2 border-red-50 rounded-2xl px-4 py-3 focus:border-red-500 outline-none transition-all bg-red-50/30 placeholder:text-red-200"
            />
          </div>
        )}

        {/* Bouton Se Connecter */}
        <button 
          type="submit"
          disabled={loading}
          className="w-full bg-agro-bright hover:bg-agro-primary text-white font-bold py-4 rounded-full shadow-lg transition-all mt-4 text-lg active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      {/* Liens de bas de page */}
      <div className="w-full flex justify-between mt-8 text-xs text-agro-primary/60 font-semibold px-2">
        {/* LIEN MODIFIÉ : On passe le rôle actuel dans l'URL */}
  <Link 
    href={`/forgot-password?role=${role}`} 
    title="Récupérer mon compte" 
    className="hover:text-agro-primary transition-colors"
  >
    Mot de passe oublié ?
  </Link>
        <Link 
          href={`/register?role=${role}`} 
          title="Créer un compte" 
          className="hover:text-agro-primary transition-colors"
        >
          Créer un compte
        </Link>
      </div>
    </div>
  );
}