import { createKeyset } from '@ermnvldmr/i18n';

export const { t, tRaw } = createKeyset({
  'Vladimir Eremin': { en: 'Vladimir Eremin', ru: 'Владимир Ерёмин' },
  'Privacy Policy': { en: 'Privacy Policy', ru: 'Политика конфиденциальности' },
  'Toggle anonymous telemetry': {
    en: 'Toggle anonymous telemetry',
    ru: 'Переключить анонимную телеметрию',
  },
  'To make this site better, I collect anonymous analytics · {privacyLink}': {
    en: 'To\u00A0make this site better, I\u00A0collect anonymous analytics · {privacyLink}',
    ru: 'Из\u00A0желания сделать этот сайт лучше\u00A0— я\u00A0собираю анонимную аналитику · {privacyLink}',
  },
});
