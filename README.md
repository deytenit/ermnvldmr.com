# [ermnvldmr.com](https://ermnvldmr.com)

The monorepo powering the front pages of my own

## Quick Start

- Visit the live site: <https://ermnvldmr.com>
- Report an issue: <https://github.com/deytenit/ermnvldmr.com/issues>
- View UI components: `pnpm ui:storybook`
- Development guide: [AGENTS.md](./AGENTS.md)

## Essential Information

You should learn the following, before exploring the project:

### License

Composite (see [Copyright & License](#copyright--license))

### Monorepo Structure

#### Services

- **[www](./services/www)**: Main website, built with Astro and React.
- **[docs](./services/docs)**: Documentation site, built with Hugo and the Hextra theme.

#### Packages

- **[@ermnvldmr/ui](./packages/ui)**: Shared React component library and design system.
- **[@ermnvldmr/stl](./packages/stl)**: Standard Template Library – common utilities and reusable logic.
- **[@ermnvldmr/eslint-config](./packages/eslint-config)**: Shared linting configurations.
- **[@ermnvldmr/jest-config](./packages/jest-config)**: Shared testing configurations.
- **[@ermnvldmr/vite-config](./packages/vite-config)**: Shared build configurations.
- **[@ermnvldmr/storybook-config](./packages/storybook-config)**: Shared Storybook configurations.

## Who Are You?

### Visitor

Just browsing or interested in the content.

- **Live Website**: <https://ermnvldmr.com>

### Developer

Want to contribute or understand the codebase.

- **Setup**: `pnpm install`
- **Development**:
    - Website: `pnpm www:dev`
    - Documentation: `pnpm docs:dev`
    - UI Library: `pnpm ui:dev`
- **Development Guide**: [AGENTS.md](./AGENTS.md)
- **Component Development**: `pnpm ui:storybook`
- **Testing**: `pnpm test` or `pnpm test:coverage`
- **Code Quality**: `pnpm lint` and `pnpm typecheck`

### Designer

Interested in the design system and components.

- **Components**: Run `pnpm ui:storybook` to explore components
- **Design System**: See [packages/ui/src/styles/index.css](./packages/ui/src/styles/index.css)
for the color palette and theme
- **Theme Structure**: CSS variables with light/dark mode support

### Contributor

Want to submit improvements.

- **Workflow**: Fork, branch from `next`, submit pull request
- **Code Standards**: See [AGENTS.md](./AGENTS.md) for conventions
- **Testing Required**: All changes must include tests
- **Documentation**: TSDoc required for all public exports
- **CI Requirements**: Pull requests must pass all checks

## Communication & Support

- **Issues**: <https://github.com/deytenit/ermnvldmr.com/issues>
- **Email**: <personal@ermnvldmr.com>

## Copyright & License

**Source Code**: Licensed under the [GNU GPL 2.0](./LICENSE).

**Documentation & Informational Content**: Technical documentation, guides, and informational articles within `services/docs/content/` and `services/www/content/` are licensed under [Creative Commons Attribution 4.0 International (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/).

**Creative Literature & Art**: Poems, personal essays, artworks, photography, and other purely creative or literary works are **individually copyrighted by their respective owners**. These works are *not* open-source and are *not* covered by the GPL or CC BY 4.0 licenses. They remain under full copyright protection unless explicitly stated otherwise within their specific file metadata or directory.

---

**AI Assistance**:
Significant portions of this project's *source code* were developed with
the assistance of AI code generation tools.

Copyright © 2026 Vladimir Eremin
