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
  private static instance: CodeHighlighter;
  private highlighter: Highlighter | null = null;
  private initializingPromise: Promise<Highlighter> | null = null;

  private constructor() {}

  /**
   * Gets the singleton instance of the highlighter.
   */
  public static getInstance(): CodeHighlighter {
    if (!CodeHighlighter.instance) {
      CodeHighlighter.instance = new CodeHighlighter();
    }
    return CodeHighlighter.instance;
  }

  /**
   * Initializes the highlighter if it hasn't been already.
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
