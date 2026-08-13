'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Locale } from '@/lib/locale';
import { en, type Dictionary } from '@/locales/en';
import { m } from '@/locale/paraglide/messages';

type GeneratedMessage = (
  inputs?: Record<string, never>,
  options?: { locale?: Locale }
) => string;

const generatedMessages = m as unknown as Record<string, GeneratedMessage>;

function toMessageKey(key: string) {
  return key
    .replace(/([A-Z]+)([A-Z][a-z])/g, '$1_$2')
    .replace(/([a-z0-9])([A-Z])/g, '$1_$2')
    .toLowerCase();
}

function getSimulatorDictionary(locale: Locale): Dictionary {
  return Object.fromEntries(
    (Object.keys(en) as Array<keyof Dictionary>).map((key) => {
      const messageKey = `simulator_${toMessageKey(String(key))}`;
      const message = generatedMessages[messageKey];
      if (!message) {
        throw new Error(`Missing Paraglide message: ${messageKey}`);
      }
      return [key, message({}, { locale })];
    })
  ) as Dictionary;
}

type PlayI18nValue = {
  lang: Locale;
  t: (key: keyof Dictionary) => string;
};

const PlayI18nContext = createContext<PlayI18nValue | null>(null);

export default function PlayI18nProvider({
  lang,
  children,
}: {
  lang: Locale;
  children: React.ReactNode;
}) {
  const dictionary = useMemo(() => getSimulatorDictionary(lang), [lang]);

  const value = useMemo<PlayI18nValue>(
    () => ({
      lang,
      t: (key) => dictionary[key] ?? String(key),
    }),
    [dictionary, lang]
  );

  return (
    <PlayI18nContext.Provider value={value}>
      {children}
    </PlayI18nContext.Provider>
  );
}

export function usePlayI18n() {
  const value = useContext(PlayI18nContext);
  if (!value) {
    throw new Error('usePlayI18n must be used inside PlayI18nProvider');
  }
  return value;
}
