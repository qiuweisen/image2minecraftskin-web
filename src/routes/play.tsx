import { createFileRoute } from '@tanstack/react-router';
import PlayI18nProvider from '@/components/PlayI18nProvider';
import PlayPage from '@/components/simulator/play-client';
import { getLocale } from '@/lib/locale';
import {
  jsonLdScript,
  seo,
  simulatorStructuredData,
  siteStructuredData,
} from '@/lib/seo';
import { m } from '@/locale/paraglide/messages';

export const Route = createFileRoute('/play')({
  head: () => ({
    ...seo('/play', {
      title: m.seo_play_title(),
      description: m.seo_play_description(),
    }),
    scripts: [
      jsonLdScript(simulatorStructuredData('/play', m.seo_play_description())),
      jsonLdScript(siteStructuredData()),
    ],
  }),
  component: PlayMigrationPage,
});

function PlayMigrationPage() {
  const locale = getLocale();

  return (
    <PlayI18nProvider lang={locale}>
      <PlayPage />
    </PlayI18nProvider>
  );
}
