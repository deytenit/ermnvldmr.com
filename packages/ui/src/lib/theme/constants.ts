/**
 * A minified script to be injected into the <head> of the HTML document.
 * This prevents the Flash of Unstyled Content (FOUC) by applying the
 * correct theme class before the rest of the page hydrates.
 */
export const THEME_INIT_SCRIPT = `(function(){try{var k='ermnvldmr/ui/lib/theme';var p=JSON.parse(localStorage.getItem(k)||'"system"');var d=p==='dark'||(p==='system'&&window.matchMedia('(prefers-color-scheme:dark)').matches);document.documentElement.classList.toggle('dark',d)}catch(e){}})();`;

/**
 * Initial inline styles to prevent FOUC before the main CSS is loaded.
 * These align with the main palette in styles.css.
 */
export const THEME_INIT_STYLES = `
  :root { background-color: #fafafa; color: #262626; }
  .dark { background-color: #141414; color: #f6f6f6; }
  body { margin: 0; transition: background-color 0.2s ease; }
`;
