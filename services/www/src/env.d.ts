declare module '*.mdx' {
  import type { ComponentType } from 'react';
  const Component: ComponentType<{ components?: Record<string, React.ComponentType> }>;
  export default Component;
}
