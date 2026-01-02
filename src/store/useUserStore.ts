import { create } from 'zustand'

interface LanguageState {
  lang: 'en' | 'fr'
  setLang: (lang: 'en' | 'fr') => void
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'fr', // Langue par défaut
  setLang: (newLang) => set({ lang: newLang }),
}))