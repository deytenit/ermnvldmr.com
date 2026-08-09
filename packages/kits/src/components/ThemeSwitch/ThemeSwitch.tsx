import { Button, HStack, Switch, useTheme } from '@ermnvldmr/ui';
import React from 'react';

/**
 * Props for the ThemeSwitch component.
 */
export interface ThemeSwitchProps {
  /** Optional icon for light theme */
  lightIcon?: React.ReactNode;
  /** Optional icon for dark theme */
  darkIcon?: React.ReactNode;
  /** Optional icon for system theme */
  systemIcon?: React.ReactNode;
}

/**
 * A composite component for managing theme preferences.
 *
 * @example
 * ```tsx
 * <ThemeSwitch />
 * ```
 */
export function ThemeSwitch({
  lightIcon,
  darkIcon,
  systemIcon,
}: ThemeSwitchProps = {}): React.JSX.Element {
  const { preference, setPreference, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <HStack align="center" gap={2}>
      <HStack align="center" gap={1.5}>
        {lightIcon}
        <Switch
          aria-label="Toggle dark mode"
          isSelected={isDark}
          variant="outline"
          onChange={(isSelected) => setPreference(isSelected ? 'dark' : 'light')}
        />
        {darkIcon}
      </HStack>
      <Button
        aria-label="Follow system theme"
        color={preference === 'system' ? 'primary' : 'neutral'}
        renderStartIcon={systemIcon ? () => systemIcon : undefined}
        size="s"
        variant={preference === 'system' ? 'solid' : 'ghost'}
        onPress={() => setPreference('system')}
      />
    </HStack>
  );
}
