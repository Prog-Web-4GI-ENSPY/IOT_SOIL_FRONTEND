"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import LanguageToggle from '@/components/ui/LanguageToggle';
import { useLanguageStore } from '@/store/useUserStore';

interface Dictionary {
  welcome: {
    title: string;
    admin: string;
    farmer: string;
    slogan: string;
  };
}

export default function WelcomePage() {
  const { lang } = useLanguageStore();
  const [dict, setDict] = useState<Dictionary | null>(null);

  useEffect(() => {
    import(`@/dictionaries/${lang}.json`).then((module) => {
      setDict(module.default as Dictionary);
    });
  }, [lang]);

  if (!dict) return null;

  return (
    <main className="relative min-h-screen w-full flex flex-col items-center justify-between py-12 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-[-1]">
        <Image
          src="/image.png"
          alt="Champ"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/15 backdrop-blur-[1px]" />
      </div>

      {/* Header */}
      <header className="w-full flex justify-end px-8 md:px-16">
        <LanguageToggle />
      </header>

      {/* Logo et Titre */}
      <div className="flex flex-col items-center gap-2">
        <div className="relative w-24 h-24 drop-shadow-2xl">
          <Image
            src="/logo.jpg"
            alt="Smart Agro Logo"
            fill
            className="object-contain"
          />
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-white drop-shadow-md">
          {dict.welcome.title}
        </h1>
      </div>

      {/* Boutons de sélection de rôle */}
      <div className="flex flex-col gap-6 w-full max-w-md px-6">
        {/* Lien vers Login Administrateur */}
        <Link
          href="/login?role=admin"
          className="w-full bg-agro-bright hover:bg-agro-primary text-white font-bold py-4 rounded-xl shadow-lg transition-all text-center text-lg active:scale-95"
        >
          {dict.welcome.admin}
        </Link>

        {/* Lien vers Login Agriculteur */}
        <Link
          href="/login?role=agriculteur"
          className="w-full bg-agro-bright hover:bg-agro-primary text-white font-bold py-4 rounded-xl shadow-lg transition-all text-center text-lg active:scale-95"
        >
          {dict.welcome.farmer}
        </Link>
      </div>

      {/* Slogan Footer */}
      <div className="text-white text-2xl md:text-4xl font-bold italic drop-shadow-lg text-center px-4">
        {dict.welcome.slogan}
      </div>
    </main>
  );
}