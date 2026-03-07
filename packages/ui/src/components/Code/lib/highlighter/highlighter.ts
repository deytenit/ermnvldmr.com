import { createHighlighter } from 'shiki';

import type { Highlighter } from 'shiki';

/**
 * Supported languages for syntax highlighting.
 */
export type CodeLanguage =
  | 'typescript'
  | 'javascript'
  | 'tsx'
  | 'jsx'
  | 'bash'
  | 'shell'
  | 'json'
  | 'css'
  | 'html'
  | 'markdown'
  | 'yaml'
  | 'dockerfile'
  | 'toml'
  | 'rust'
  | 'go'
  | 'python';

export const SUPPORTED_LANGUAGES: CodeLanguage[] = [
  'typescript',
  'javascript',
  'tsx',
  'jsx',
  'bash',
  'shell',
  'json',
  'css',
  'html',
  'markdown',
  'yaml',
  'dockerfile',
  'toml',
  'rust',
  'go',
  'python',
];

/**
 * A singleton highlighter service for code blocks.
 */
class CodeHighlighter {
  private static instance: CodeHighlighter | null = null;
  private highlighter: Highlighter | null = null;
  private initializingPromise: Promise<Highlighter> | null = null;

  /**
   * Gets the singleton instance of the highlighter.
   * @example
   * ```typescript
   * const highlighter = CodeHighlighter.getInstance();
   * ```
   */
  public static getInstance(): CodeHighlighter {
    return (CodeHighlighter.instance ??= new CodeHighlighter());
  }

  /**
   * Initializes the highlighter if it hasn't been already.
   * @example
   * ```typescript
   * const highlighter = await this.getHighlighter();
   * ```
   */
  private async getHighlighter(): Promise<Highlighter> {
    if (this.highlighter) {
      return this.highlighter;
    }

    if (this.initializingPromise) {
      return this.initializingPromise;
    }

    this.initializingPromise = createHighlighter({
      themes: ['github-dark', 'github-light'],
      langs: SUPPORTED_LANGUAGES,
    }).then((highlighter) => {
      this.highlighter = highlighter;
      this.initializingPromise = null;
      return highlighter;
    });

    return this.initializingPromise;
  }

  /**
   * Highlights the given code.
   *
   * @param code - The raw source code to highlight
   * @param lang - The language of the code
   * @returns A promise resolving to the highlighted HTML
   * @example
   * ```typescript
   * const html = await highlighter.highlight('const a = 1;', 'typescript');
   * ```
   */
  public async highlight(code: string, lang: CodeLanguage): Promise<string> {
    try {
      const highlighter = await this.getHighlighter();
      return highlighter.codeToHtml(code, {
        lang,
        themes: {
          light: 'github-light',
          dark: 'github-dark',
        },
      });
    } catch (err) {
      console.error('Failed to highlight code:', err);
      throw err;
    }
  }
}

export const codeHighlighter = CodeHighlighter.getInstance();
