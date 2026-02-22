'use client';

import { createContext, useContext, useState, ReactNode } from "react";
import { Locale } from "@/lib/i18n";

export interface LocaleContextProps {
    locale: Locale;
    setLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextProps>({
    locale: "ru",
    setLocale: () => {},
});

export function LocaleProvider({ children, initialLocale = "ru" }: { children: ReactNode; initialLocale?: Locale }) {
    const [locale, setLocaleState] = useState<Locale>(initialLocale);

    const setLocale = (l: Locale) => {
        setLocaleState(l);
        localStorage.setItem("locale", l);
        document.cookie = `NEXT_LOCALE=${l}; path=/; max-age=31536000; SameSite=Lax`;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale }}>
            {children}
        </LocaleContext.Provider>
    );
}

export const useLocale = () => useContext(LocaleContext);
