// @ts-check
import { noHangingParticlesRule } from '../rules/no-hanging-particles.js';

/**
 * ESLint plugin providing i18n translation validation and typography rules.
 */
export const i18nPlugin = {
  meta: {
    name: 'eslint-plugin-i18n',
    version: '1.0.0',
  },
  rules: {
    'no-hanging-particles': noHangingParticlesRule,
  },
};
