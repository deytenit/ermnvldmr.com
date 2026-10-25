// @ts-check
import { describe, it } from 'node:test';
import { RuleTester } from 'eslint';
import { noHangingParticlesRule } from './no-hanging-particles.js';
import { markdownParser } from '../parsers/markdown.js';

// Configure RuleTester for node:test
RuleTester.describe = describe;
RuleTester.it = it;

const ruleTester = new RuleTester();

ruleTester.run('no-hanging-particles', noHangingParticlesRule, {
  valid: [
    {
      code: `
        createKeyset({
          'Yet capturing context': {
            en: 'Yet\\u00A0capturing context and\\u00A0architectural decisions',
            ru: 'Мои мысли и\\u00A0проекты',
          },
        });
      `,
    },
    {
      // Keys should not trigger errors even if they contain particles
      code: `
        createKeyset({
          'и иные проблемы': {
            en: 'and\\u00A0other issues',
            ru: 'и\\u00A0иные проблемы',
          },
        });
      `,
    },
    {
      // Manual {nbsp} token is allowed
      code: `
        createKeyset({
          manual: {
            en: 'Yet{nbsp}capturing',
            ru: 'и{nbsp}иные',
          },
        });
      `,
    },
    {
      // Not a createKeyset call
      code: `
        const regularObj = {
          en: 'Yet capturing without keyset',
        };
      `,
    },
  ],
  invalid: [
    {
      // English leading particle
      code: `
        createKeyset({
          key: {
            en: 'Yet capturing context',
            ru: 'Фиксация контекста',
          },
        });
      `,
      output: `
        createKeyset({
          key: {
            en: 'Yet\u00A0capturing context',
            ru: 'Фиксация контекста',
          },
        });
      `,
      errors: [
        {
          messageId: 'hangingParticle',
        },
      ],
    },
    {
      // Russian leading particle
      code: `
        createKeyset({
          'и иные проблемы': {
            en: 'and other issues',
            ru: 'и иные проблемы',
          },
        });
      `,
      output: `
        createKeyset({
          'и иные проблемы': {
            en: 'and\u00A0other issues',
            ru: 'и\u00A0иные проблемы',
          },
        });
      `,
      errors: [
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
      ],
    },
    {
      // Interpolation placeholder & trailing particles & dashes & numbers
      code: `
        createKeyset({
          welcome: {
            en: 'Inspect the {repositoryLink} for 10 items — all good',
            ru: 'Загляните в {repositoryLink}, как же так — это 10 вещей в 2026 году',
          },
        });
      `,
      output: `
        createKeyset({
          welcome: {
            en: 'Inspect the\u00A0{repositoryLink} for\u00A010\u00A0items\u00A0— all good',
            ru: 'Загляните в\u00A0{repositoryLink}, как\u00A0же так\u00A0— это 10\u00A0вещей в\u00A02026\u00A0году',
          },
        });
      `,
      errors: [
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
      ],
    },
    {
      // HTML entity replacement
      code: `
        createKeyset({
          test: {
            en: 'Text&nbsp;with entity',
            ru: 'Текст&nbsp;с сущностью',
          },
        });
      `,
      output: `
        createKeyset({
          test: {
            en: 'Text\u00A0with\u00A0entity',
            ru: 'Текст\u00A0с\u00A0сущностью',
          },
        });
      `,
      errors: [
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
      ],
    },
    {
      // Plural forms
      code: `
        createKeyset({
          counter: {
            en: {
              one: '{count} item',
              other: '{count} items in stock',
            },
            ru: {
              one: '{count} штука в наличии',
              few: '{count} штуки в наличии',
              many: '{count} штук в наличии',
              other: '{count} штук в наличии',
            },
          },
        });
      `,
      output: `
        createKeyset({
          counter: {
            en: {
              one: '{count} item',
              other: '{count} items in\u00A0stock',
            },
            ru: {
              one: '{count} штука в\u00A0наличии',
              few: '{count} штуки в\u00A0наличии',
              many: '{count} штук в\u00A0наличии',
              other: '{count} штук в\u00A0наличии',
            },
          },
        });
      `,
      errors: [
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
      ],
    },
  ],
});

const markdownRuleTester = new RuleTester({
  languageOptions: {
    parser: markdownParser,
  },
});

markdownRuleTester.run('no-hanging-particles (markdown)', noHangingParticlesRule, {
  valid: [
    {
      code: '# Title\n\nYet\\u00A0capturing context\\u00A0— for\\u00A010\\u00A0items',
      filename: 'content/en/overview.md',
    },
    {
      // Code blocks should be protected
      code: '```ts\nconst in = 10;\n```',
      filename: 'content/en/guide.md',
    },
    {
      // Inline code and link targets should be protected
      code: 'Use `in` keyword here [link](https://example.com/in/path).',
      filename: 'content/en/guide.md',
    },
    {
      // Hugo shortcodes should be protected
      code: '{{< card link="apex" title="apex" >}}',
      filename: 'content/en/guide.md',
    },
    {
      // Frontmatter tags/date should be protected
      code: '---\ntitle: "Title"\ntags: [a, in, on]\n---\nBody text',
      filename: 'content/en/guide.md',
    },
  ],
  invalid: [
    {
      code: '# Title\n\nYet capturing context — for 10 items',
      output: '# Title\n\nYet\u00A0capturing context\u00A0— for\u00A010\u00A0items',
      filename: 'content/en/overview.md',
      errors: [{ messageId: 'hangingParticle' }],
    },
    {
      code: 'Это руководство для заметок с нуля',
      output: 'Это руководство для\u00A0заметок с\u00A0нуля',
      filename: 'content/ru/overview.md',
      errors: [{ messageId: 'hangingParticle' }],
    },
    {
      code: '---\ntitle: "Руководство по развертыванию"\ntags: [a, in]\n---\nС нуля',
      output: '---\ntitle: "Руководство по\u00A0развертыванию"\ntags: [a, in]\n---\nС\u00A0нуля',
      filename: 'content/ru/guide.md',
      errors: [
        { messageId: 'hangingParticle' },
        { messageId: 'hangingParticle' },
      ],
    },
  ],
});
