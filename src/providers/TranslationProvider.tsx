"use client";

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useLanguageStore } from '@/store/useUserStore';

// Basic type for our dictionary - strictly speaking it's recursive but any is easier for now
// or we can define a stricter shape.
type Dictionary = Record<string, any>;

interface TranslationContextType {
    dict: Dictionary | null;
    t: (key: string) => string;
    isLoading: boolean;
}

const TranslationContext = createContext<TranslationContextType | undefined>(undefined);

export function TranslationProvider({ children }: { children: ReactNode }) {
    const { lang } = useLanguageStore();
    const [dict, setDict] = useState<Dictionary | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        import(`@/dictionaries/${lang}.json`)
            .then((module) => {
                setDict(module.default);
                setIsLoading(false);
            })
            .catch((err) => {
                console.error("Failed to load dictionary", err);
                setIsLoading(false);
            });
    }, [lang]);

    // Helper to get nested values like "landing.hero.title"
    const t = (path: string) => {
        if (!dict) return path;
        const keys = path.split('.');
        let current: any = dict;

        for (const key of keys) {
            if (current[key] === undefined) {
                console.warn(`Missing translation for key: ${path}`);
                return path;
            }
            current = current[key];
        }

        if (typeof current !== 'string') {
            // If we point to an object, return empty or handle differently? 
            // For now, return path if it's not a string
            return path;
        }

        return current;
    };

    return (
        <TranslationContext.Provider value={{ dict, t, isLoading }}>
            {children}
        </TranslationContext.Provider>
    );
}

export function useTranslation() {
    const context = useContext(TranslationContext);
    if (context === undefined) {
        throw new Error('useTranslation must be used within a TranslationProvider');
    }
    return context;
}
