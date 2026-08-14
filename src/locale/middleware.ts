import { paraglideMiddleware } from '@/locale/paraglide/server';
import type { Locale } from '@/locale/paraglide/runtime';

type LocaleRequest = {
  request: Request;
  locale: Locale;
};

export function localeMiddleware(
  request: Request,
  resolve: (context: LocaleRequest) => Response | Promise<Response>
) {
  return paraglideMiddleware(request, ({ request: localizedRequest, locale }) =>
    resolve({ request: localizedRequest, locale })
  );
}
