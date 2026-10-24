/**
 * Inline bootstrapper script that registers a transparent default Trusted Types policy.
 * This prevents runtime DOM-based XSS injection crashes in React 19, Hextra, and third-party DOM sinks
 * when `require-trusted-types-for 'script'` is enforced via Content-Security-Policy.
 */
export const TRUSTED_TYPES_INIT_SCRIPT =
  '(function(){if(typeof window!=="undefined"&&window.trustedTypes&&window.trustedTypes.createPolicy){try{window.trustedTypes.createPolicy("default",{createHTML:function(s){return s},createScript:function(s){return s},createScriptURL:function(u){return u}});}catch(e){}}})();';

/**
 * SHA-256 base64 hash of `TRUSTED_TYPES_INIT_SCRIPT` for inclusion in CSP `script-src`.
 */
export const TRUSTED_TYPES_INIT_SCRIPT_HASH =
  'sha256-3VjVzYfJpuNMLKyrxQTIc8ACxv37paQ4Talwg1s/7N0=';

/**
 * SHA-256 base64 hash of `@ermnvldmr/ui` `THEME_INIT_SCRIPT` for inclusion in CSP `script-src`.
 */
export const THEME_INIT_SCRIPT_HASH =
  'sha256-gUpIj4OcSwECFlSp351SCYJAe1wTOCQlrKBlASuO3CY=';
