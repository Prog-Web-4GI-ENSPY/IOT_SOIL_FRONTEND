import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface LanguageState {
  lang: 'en' | 'fr'
  setLang: (lang: 'en' | 'fr') => void
}

export const useLanguageStore = create<LanguageState>()(
  persist(
    (set) => ({
      lang: 'fr', // Langue par défaut
      setLang: (newLang) => set({ lang: newLang }),
    }),
    {
      name: 'language-storage', // Nom de la clé dans le localStorage
    }
  )
)