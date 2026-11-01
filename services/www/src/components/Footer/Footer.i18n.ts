import { createKeyset } from '@ermnvldmr/i18n';

export const { t, tRaw } = createKeyset({
  'Vladimir Eremin': { en: 'Vladimir Eremin', ru: 'Владимир Ерёмин' },
  'Privacy Policy': { en: 'Privacy Policy', ru: 'Политика конфиденциальности' },
  'Anonymous telemetry by {umamiLink} · {privacyLink}': {
    en: 'Anonymous telemetry by\u00A0{umamiLink} · {privacyLink}',
    ru: 'Анонимная телеметрия {umamiLink} · {privacyLink}',
  },
});
