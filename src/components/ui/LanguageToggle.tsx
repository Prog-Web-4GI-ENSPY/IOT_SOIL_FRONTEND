"use client";

import { useLanguageStore } from '@/store/useUserStore';

export default function LanguageToggle() {
  const { lang, setLang } = useLanguageStore();

  const toggleLanguage = () => {
    const newLang = lang === 'en' ? 'fr' : 'en';
    setLang(newLang);
    // Optionnel: Sauvegarder dans un cookie pour que la langue reste au rafraîchissement
    document.cookie = `NEXT_LOCALE=${newLang}; path=/; max-age=31536000`;
  };

  return (
    <button 
      onClick={toggleLanguage}
      className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-md px-4 py-2 rounded-lg text-white font-bold transition-all border border-white/20 active:scale-95"
    >
      <span className="text-xl">{lang === 'en' ? '🇬🇧' : '🇫🇷'}</span>
      <span>{lang.toUpperCase()}</span>
    </button>
  );
}