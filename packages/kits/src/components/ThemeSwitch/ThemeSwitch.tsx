import { Button, HStack, Switch, useLogger, useTheme } from '@ermnvldmr/ui';
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
  const log = useLogger();

  const isDark = resolvedTheme === 'dark';

  const handleToggle = (isSelected: boolean): void => {
    const nextTheme = isSelected ? 'dark' : 'light';
    setPreference(nextTheme);
    log('theme-toggle', { preference: nextTheme });
  };

  const handleSystem = (): void => {
    setPreference('system');
    log('theme-toggle', { preference: 'system' });
  };

  return (
    <HStack align="center" gap={2}>
      <HStack align="center" gap={1.5}>
        {lightIcon}
        <Switch
          aria-label="Toggle dark mode"
          data-umami-event="theme-toggle"
          isSelected={isDark}
          variant="outline"
          onChange={handleToggle}
        />
        {darkIcon}
      </HStack>
      <Button
        aria-label="Follow system theme"
        color={preference === 'system' ? 'primary' : 'neutral'}
        data-umami-event="theme-system"
        renderStartIcon={systemIcon ? () => systemIcon : undefined}
        size="s"
        variant={preference === 'system' ? 'solid' : 'ghost'}
        onPress={handleSystem}
      />
    </HStack>
  );
}
