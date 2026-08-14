import { useEffect, useState } from 'react';
import { enUS } from 'date-fns/locale/en-US';
import type { Locale as DayPickerLocale } from 'react-day-picker';
import type { Locale } from '@/lib/locale';

type CalendarLocaleLoader = () => Promise<DayPickerLocale>;

const calendarLocaleLoaders: Partial<Record<Locale, CalendarLocaleLoader>> = {
  en: () => import('date-fns/locale/en-US').then(({ enUS: locale }) => locale),
  zh: () => import('date-fns/locale/zh-CN').then(({ zhCN: locale }) => locale),
  'zh-hans': () =>
    import('date-fns/locale/zh-CN').then(({ zhCN: locale }) => locale),
  'zh-hant': () =>
    import('date-fns/locale/zh-HK').then(({ zhHK: locale }) => locale),
  'es-419': () => import('date-fns/locale/es').then(({ es: locale }) => locale),
  pt: () => import('date-fns/locale/pt-BR').then(({ ptBR: locale }) => locale),
  fr: () => import('date-fns/locale/fr').then(({ fr: locale }) => locale),
  de: () => import('date-fns/locale/de').then(({ de: locale }) => locale),
  ru: () => import('date-fns/locale/ru').then(({ ru: locale }) => locale),
  ja: () => import('date-fns/locale/ja').then(({ ja: locale }) => locale),
  ko: () => import('date-fns/locale/ko').then(({ ko: locale }) => locale),
  ar: () => import('date-fns/locale/ar').then(({ ar: locale }) => locale),
  it: () => import('date-fns/locale/it').then(({ it: locale }) => locale),
  nl: () => import('date-fns/locale/nl').then(({ nl: locale }) => locale),
  pl: () => import('date-fns/locale/pl').then(({ pl: locale }) => locale),
  tr: () => import('date-fns/locale/tr').then(({ tr: locale }) => locale),
  vi: () => import('date-fns/locale/vi').then(({ vi: locale }) => locale),
  th: () => import('date-fns/locale/th').then(({ th: locale }) => locale),
  id: () => import('date-fns/locale/id').then(({ id: locale }) => locale),
  hi: () => import('date-fns/locale/hi').then(({ hi: locale }) => locale),
  he: () => import('date-fns/locale/he').then(({ he: locale }) => locale),
  fa: () => import('date-fns/locale/fa-IR').then(({ faIR: locale }) => locale),
  uk: () => import('date-fns/locale/uk').then(({ uk: locale }) => locale),
  cs: () => import('date-fns/locale/cs').then(({ cs: locale }) => locale),
  sv: () => import('date-fns/locale/sv').then(({ sv: locale }) => locale),
  no: () => import('date-fns/locale/nb').then(({ nb: locale }) => locale),
  da: () => import('date-fns/locale/da').then(({ da: locale }) => locale),
  fi: () => import('date-fns/locale/fi').then(({ fi: locale }) => locale),
  el: () => import('date-fns/locale/el').then(({ el: locale }) => locale),
  ro: () => import('date-fns/locale/ro').then(({ ro: locale }) => locale),
  hu: () => import('date-fns/locale/hu').then(({ hu: locale }) => locale),
  bg: () => import('date-fns/locale/bg').then(({ bg: locale }) => locale),
  sk: () => import('date-fns/locale/sk').then(({ sk: locale }) => locale),
  sl: () => import('date-fns/locale/sl').then(({ sl: locale }) => locale),
  sr: () => import('date-fns/locale/sr').then(({ sr: locale }) => locale),
  ms: () => import('date-fns/locale/ms').then(({ ms: locale }) => locale),
  bn: () => import('date-fns/locale/bn').then(({ bn: locale }) => locale),
  ta: () => import('date-fns/locale/ta').then(({ ta: locale }) => locale),
  te: () => import('date-fns/locale/te').then(({ te: locale }) => locale),
};

export function useCalendarLocale(locale: Locale) {
  const [calendarLocale, setCalendarLocale] = useState<DayPickerLocale>(enUS);

  useEffect(() => {
    let active = true;
    const loadLocale = calendarLocaleLoaders[locale];

    if (!loadLocale) {
      setCalendarLocale(enUS);
      return () => {
        active = false;
      };
    }

    void loadLocale()
      .then((nextLocale) => {
        if (active) setCalendarLocale(nextLocale);
      })
      .catch(() => {
        if (active) setCalendarLocale(enUS);
      });

    return () => {
      active = false;
    };
  }, [locale]);

  return calendarLocale;
}
