// @ts-check

/**
 * Calculates start and end line/column locations for a string offset.
 *
 * @param {string} code - Entire source code.
 * @returns {import('eslint').AST.SourceLocation} Full document SourceLocation.
 */
function getDocumentLocation(code) {
  const lines = code.split('\n');
  const lastLine = lines.length;
  const lastColumn = lines[lines.length - 1].length;

  return {
    start: { line: 1, column: 0 },
    end: { line: lastLine, column: lastColumn },
  };
}

/**
 * Custom lightweight parser for Markdown and MDX documents.
 * Produces an AST that enables typography linting and autofixing on prose text.
 */
export const markdownParser = {
  meta: {
    name: 'eslint-parser-markdown-typography',
    version: '1.0.0',
  },
  parseForESLint(code, options = {}) {
    const filePath = options.filePath || '';
    const isRu = /(?:^|[\\/])ru(?:[\\/]|\.ru\.)/i.test(filePath);
    const isEn = /(?:^|[\\/])en(?:[\\/]|\.en\.)/i.test(filePath);
    const locale = isRu ? 'ru' : isEn ? 'en' : undefined;

    const loc = getDocumentLocation(code);

    return {
      ast: {
        type: 'Program',
        range: [0, code.length],
        loc,
        body: [
          {
            type: 'MarkdownDocument',
            range: [0, code.length],
            loc,
            value: code,
            locale,
            filePath,
          },
        ],
        tokens: [],
        comments: [],
      },
      visitorKeys: {
        Program: ['body'],
        MarkdownDocument: [],
      },
    };
  },
};
