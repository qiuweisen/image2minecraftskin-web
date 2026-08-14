'use client';

import { createContext, useContext, useMemo } from 'react';
import type { Locale } from '@/lib/locale';
import type { Dictionary } from '@/locales/en';
import { getSimulatorDictionary } from '@/locales/simulator-messages';

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
