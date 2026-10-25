// @ts-check

const RU_PARTICLES = [
  '[а-яё]',
  'во', 'со', 'ко', 'до', 'по', 'на', 'из', 'за', 'от', 'об', 'не', 'ни', 'но', 'да', 'то', 'уж',
  'обо', 'под', 'над', 'при', 'про', 'для', 'без', 'или', 'как', 'что', 'еще', 'ещё', 'уже',
  'через', 'сквозь', 'перед', 'из-за', 'из-под',
].join('|');

const EN_PARTICLES = [
  'a', 'an', 'the',
  'in', 'on', 'at', 'to', 'of', 'by', 'for', 'up', 'as', 'if', 'is', 'it', 'no',
  'and', 'or', 'nor', 'but', 'yet', 'so', 'with', 'into', 'from',
].join('|');

const RU_TRAILING = ['ли', 'ль', 'же', 'ж', 'бы', 'б'].join('|');

const KNOWN_LOCALES = new Set(['en', 'ru']);
const PLURAL_KEYS = new Set(['zero', 'one', 'two', 'few', 'many', 'other']);

/**
 * Applies non-breaking space typography rules to a translation string value.
 *
 * @param {string} input - The raw translation string.
 * @param {string} [locale] - The locale code ('en' | 'ru').
 * @returns {string} The transformed string with non-breaking spaces.
 */
export function applyTypography(input, locale) {
  let text = input.replaceAll('&nbsp;', '\u00A0');

  /** @type {string[]} */
  const protectedTokens = [];
  text = text.replace(/\{[^}]+\}|<[^>]+>|\]\([^)]+\)/g, (match) => {
    const idx = protectedTokens.length;
    protectedTokens.push(match);
    return `__TYPO_PROT_${idx}__`;
  });

  // Em-dash and en-dash (prepend non-breaking space)
  text = text.replace(/(?<=\S)[\t \u00A0]+([—–])[\t ]+/g, '\u00A0$1 ');

  // Numbers & units/symbols
  text = text.replace(/(?<=\d)[\t ]+(?=[a-zA-Zа-яА-ЯёЁ%№$€₽]|__TYPO_PROT_)/g, '\u00A0');
  text = text.replace(/(?<=[№§$€₽])[\t ]+(?=\d|__TYPO_PROT_)/g, '\u00A0');

  // Trailing particles (Russian)
  if (!locale || locale === 'ru') {
    const trailingRegex = new RegExp(`(?<=[а-яА-ЯёЁ\\w])\\s+(${RU_TRAILING})(?=[\\s\\u00A0.,!?:;»"')\\]]|$)`, 'gi');
    text = text.replace(trailingRegex, '\u00A0$1');
  }

  // Leading particles (RU / EN)
  const particles = locale === 'en' ? EN_PARTICLES : locale === 'ru' ? RU_PARTICLES : `${RU_PARTICLES}|${EN_PARTICLES}`;
  const leadingRegex = new RegExp(`(?<=^|[\\s\\u00A0.,!?:;«"'(])(${particles})[ \\t]+(?=\\S)`, 'gi');
  text = text.replace(leadingRegex, '$1\u00A0');

  // Restore protected tokens
  text = text.replace(/__TYPO_PROT_(\d+)__/g, (_, idx) => protectedTokens[Number(idx)]);

  return text;
}

/**
 * Masks frontmatter non-title/description lines.
 *
 * @param {string} text - Raw document text.
 * @param {(str: string) => string} mask - Masking function.
 * @returns {string} Text with frontmatter metadata masked.
 */
function maskFrontmatter(text, mask) {
  if (!text.startsWith('---')) return text;
  const endIdx = text.indexOf('\n---', 3);
  if (endIdx === -1) return text;
  const fm = text.slice(0, endIdx + 4);
  const rest = text.slice(endIdx + 4);

  const lines = fm.split('\n');
  const processedLines = lines.map((line, idx) => {
    if (idx === 0 || idx === lines.length - 1) return mask(line);
    const trimmed = line.trim();
    if (trimmed.startsWith('title:') || trimmed.startsWith('description:')) {
      return line;
    }
    return mask(line);
  });
  return processedLines.join('\n') + rest;
}

/**
 * Applies typography rules to a Markdown/MDX document, protecting code blocks,
 * inline code, shortcodes, link URLs, HTML tags, and frontmatter metadata.
 *
 * @param {string} content - Markdown document content.
 * @param {string} [locale] - The document locale ('en' | 'ru').
 * @returns {string} Transformed markdown content.
 */
export function applyMarkdownTypography(content, locale) {
  /** @type {string[]} */
  const protectedTokens = [];
  /**
   * @param {string} str
   * @returns {string}
   */
  function mask(str) {
    const idx = protectedTokens.length;
    protectedTokens.push(str);
    return `__MD_PROT_${idx}__`;
  }

  let text = maskFrontmatter(content, mask);

  // Mask fenced code blocks ```...``` and ~~~...~~~
  text = text.replace(/```[\s\S]*?```|~~~[\s\S]*?~~~/g, mask);
  // Mask Hugo shortcodes {{< ... >}} or {{% ... %}}
  text = text.replace(/\{\{[<%][\s\S]*?[>%]\}\}/g, mask);
  // Mask inline code `...`
  text = text.replace(/`[^`\n]+`/g, mask);
  // Mask Markdown link targets ](...)
  text = text.replace(/\]\([^)]+\)/g, mask);
  // Mask HTML tags
  text = text.replace(/<[^>]+>/g, mask);

  // Apply typography rules
  text = applyTypography(text, locale);

  // Restore protected tokens
  text = text.replace(/__MD_PROT_(\d+)__/g, (_, idx) => protectedTokens[Number(idx)]);

  return text;
}

/**
 * Serializes a string into a valid JS string literal with specified quote.
 *
 * @param {string} str - String to escape and wrap.
 * @param {string} quote - Quote character (' or ").
 * @returns {string} Serialized literal.
 */
function serializeStringLiteral(str, quote) {
  const escaped = str
    .replace(/\\/g, '\\\\')
    .replace(/\r/g, '\\r')
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(new RegExp(quote, 'g'), `\\${quote}`);
  return `${quote}${escaped}${quote}`;
}

/**
 * Extracts property name from a property node.
 *
 * @param {any} prop - Property AST node.
 * @returns {string | null} Property name or null.
 */
function getPropertyName(prop) {
  if (!prop || !prop.key) return null;
  if (prop.key.type === 'Identifier') return prop.key.name;
  if (prop.key.type === 'Literal') return String(prop.key.value);
  return null;
}

/**
 * ESLint rule module for enforcing non-breaking spaces in i18n translation values
 * and Markdown/MDX documentation.
 *
 * @type {import('eslint').Rule.RuleModule}
 */
export const noHangingParticlesRule = {
  meta: {
    type: 'layout',
    docs: {
      description: 'Enforce non-breaking spaces for hanging particles and numbers in i18n translation values and markdown documentation.',
      recommended: true,
    },
    fixable: 'whitespace',
    schema: [],
    messages: {
      hangingParticle: 'Translation value contains hanging particles or numbers that should be bound with a non-breaking space (\\u00A0).',
    },
  },
  create(context) {
    /**
     * Checks and fixes a single string literal node.
     *
     * @param {any} node - String Literal AST node.
     * @param {string} [locale] - The locale code if known.
     */
    function checkStringLiteral(node, locale) {
      if (!node || typeof node.value !== 'string') return;
      const original = node.value;
      const formatted = applyTypography(original, locale);

      if (original !== formatted) {
        context.report({
          node,
          messageId: 'hangingParticle',
          fix(fixer) {
            const raw = node.raw || '';
            const quote = raw.startsWith('"') ? '"' : "'";
            return fixer.replaceText(node, serializeStringLiteral(formatted, quote));
          },
        });
      }
    }

    /**
     * Inspects a locale entry inside a translation item.
     *
     * @param {any} prop - Locale property node (e.g. en or ru).
     */
    function processLocaleEntry(prop) {
      const locale = getPropertyName(prop);
      if (!locale || !KNOWN_LOCALES.has(locale)) return;

      const valueNode = prop.value;
      if (!valueNode) return;

      if (valueNode.type === 'Literal') {
        checkStringLiteral(valueNode, locale);
      } else if (valueNode.type === 'ObjectExpression' && Array.isArray(valueNode.properties)) {
        for (const pluralProp of valueNode.properties) {
          if (pluralProp.type === 'Property') {
            const pluralKey = getPropertyName(pluralProp);
            if (pluralKey && PLURAL_KEYS.has(pluralKey) && pluralProp.value?.type === 'Literal') {
              checkStringLiteral(pluralProp.value, locale);
            }
          }
        }
      }
    }

    /**
     * Processes keyset object dictionary properties.
     *
     * @param {any} objectNode - Keyset ObjectExpression AST node.
     */
    function processKeysetObject(objectNode) {
      if (!objectNode || !Array.isArray(objectNode.properties)) return;

      for (const dictEntry of objectNode.properties) {
        if (
          dictEntry.type === 'Property' &&
          dictEntry.value &&
          dictEntry.value.type === 'ObjectExpression' &&
          Array.isArray(dictEntry.value.properties)
        ) {
          for (const localeProp of dictEntry.value.properties) {
            if (localeProp.type === 'Property') {
              processLocaleEntry(localeProp);
            }
          }
        }
      }
    }

    return {
      CallExpression(node) {
        if (
          node.callee &&
          node.callee.type === 'Identifier' &&
          node.callee.name === 'createKeyset' &&
          node.arguments.length > 0 &&
          node.arguments[0].type === 'ObjectExpression'
        ) {
          processKeysetObject(node.arguments[0]);
        }
      },

      MarkdownDocument(node) {
        if (!node || typeof node.value !== 'string') return;
        const original = node.value;
        const formatted = applyMarkdownTypography(original, node.locale);

        if (original === formatted) return;

        const origLines = original.split('\n');
        const formLines = formatted.split('\n');

        let reported = false;
        for (let i = 0; i < origLines.length; i++) {
          const origLine = origLines[i];
          const formLine = formLines[i];
          if (origLine !== formLine) {
            let diffCol = 0;
            while (
              diffCol < origLine.length &&
              diffCol < formLine.length &&
              origLine[diffCol] === formLine[diffCol]
            ) {
              diffCol++;
            }

            const isFirst = !reported;
            reported = true;

            context.report({
              node,
              loc: {
                start: { line: i + 1, column: diffCol },
                end: { line: i + 1, column: diffCol + 1 },
              },
              messageId: 'hangingParticle',
              fix: isFirst ? (fixer) => fixer.replaceText(node, formatted) : undefined,
            });
          }
        }
      },
    };
  },
};
