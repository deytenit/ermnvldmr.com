// @ts-check
import tseslint from 'typescript-eslint';

/**
 * TypeScript configuration.
 *
 * @param {string} rootDir - The root directory for the TypeScript parser.
 * @returns {import('eslint').Linter.Config[]} ESLint configurations.
 */
export function getTypescriptConfig(rootDir) {
  return [
    // TypeScript - Strict Configuration (only for .ts/.tsx files)
    ...[...tseslint.configs.recommendedTypeChecked, ...tseslint.configs.stylisticTypeChecked].map(
      (config) => ({
        ...config,
        files: ['**/*.{ts,tsx,mts,cts}'],
      })
    ),
    {
      files: ['**/*.{ts,tsx,mts,cts}'],
      languageOptions: {
        parserOptions: {
          projectService: true,
          tsconfigRootDir: rootDir,
        },
      },
      rules: {
        // TypeScript strict rules
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-unused-vars': 'error',
        '@typescript-eslint/prefer-nullish-coalescing': 'error',
        '@typescript-eslint/prefer-optional-chain': 'error',
        '@typescript-eslint/no-unnecessary-condition': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/prefer-as-const': 'error',
        '@typescript-eslint/consistent-type-definitions': ['error', 'interface'],
        '@typescript-eslint/consistent-type-imports': [
          'error',
          { prefer: 'type-imports', disallowTypeAnnotations: false },
        ],
        '@typescript-eslint/consistent-type-assertions': [
          'error',
          {
            assertionStyle: 'never',
          },
        ],
        '@typescript-eslint/explicit-function-return-type': [
          'error',
          { allowExpressions: true, allowTypedFunctionExpressions: true },
        ],
      },
    },
    // Allow triple-slash references in `*.d.ts` files.
    {
      files: ['**/*.d.ts'],
      rules: {
        '@typescript-eslint/triple-slash-reference': 'off',
      },
    },
  ];
}
