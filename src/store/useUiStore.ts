'use client';
import { createWithEqualityFn } from 'zustand/traditional';
import {
  detectSupportedLang,
  langToPrefix,
  supportedLangs,
  type SupportedLang,
} from '@/lib/languages';

export type Lang = SupportedLang;

export const availableLangs = [...supportedLangs] as Lang[];

type UiState = {
  lang: Lang;
  setLang: (l: Lang) => void;
  theme: 'light' | 'dark';
  setTheme: (t: 'light' | 'dark') => void;
};

const LANG_KEY = 'cg-lang';
const supportedLangSet = new Set<string>(supportedLangs as unknown as string[]);

function getPathLang(): Lang | null {
  if (typeof location === 'undefined') return null;

  const pathname = location.pathname.toLowerCase();
  const entries = Object.entries(langToPrefix) as [Lang, string][];
  const found = entries.find(
    ([, prefix]) => pathname === prefix || pathname.startsWith(prefix + '/')
  );
  return found ? found[0] : null;
}

function getDocumentLang(): Lang | null {
  if (typeof document === 'undefined') return null;

  const lang = document.documentElement.lang;
  return lang && supportedLangSet.has(lang) ? (lang as Lang) : null;
}

function getInitialLang(): Lang {
  const pathLang = getPathLang();
  if (pathLang) return pathLang;

  if (typeof window !== 'undefined') {
    // Canonical unprefixed pages always use English.
    return 'en';
  }

  const documentLang = getDocumentLang();
  if (documentLang) return documentLang;

  const browserLangs =
    typeof navigator !== 'undefined'
      ? navigator.languages || [navigator.language || 'en']
      : ['en'];
  return (detectSupportedLang(browserLangs) || 'en') as Lang;
}

export const useUiStore = createWithEqualityFn<UiState>((set) => ({
  lang: getInitialLang(),
  setLang: (l) => {
    try {
      localStorage.setItem(LANG_KEY, l);
    } catch {}
    set({ lang: l });
  },
  theme: 'dark',
  setTheme: (t) => {
    try {
      localStorage.setItem('cg-theme', t);
    } catch {}
    set({ theme: t });
  },
}));

export function detectLanguage(): Lang {
  const pathLang = getPathLang();
  if (pathLang) return pathLang;

  if (typeof window !== 'undefined') return 'en';

  const documentLang = getDocumentLang();
  if (documentLang) return documentLang;

  const browserLangs =
    typeof navigator !== 'undefined'
      ? navigator.languages || [navigator.language || 'en']
      : ['en'];
  return (detectSupportedLang(browserLangs) || 'en') as Lang;
}
