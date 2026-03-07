import { Monitor, Moon, Sun } from 'lucide-react';
import React from 'react';

import { useTheme } from '../../lib/theme';
import { Button } from '../Button/Button';
import { HStack } from '../HStack/HStack';
import { Separator } from '../Separator/Separator';
import { Switch } from '../Switch/Switch';
import { Text } from '../Text/Text';

/**
 * A composite component for managing theme preferences.
 * Includes a toggle for Light/Dark and a button for System mode.
 *
 * @returns A React element representing the theme switcher.
 * @example
 * ```tsx
 * <ThemeSwitch />
 * ```
 */
export function ThemeSwitch(): React.JSX.Element {
  const { preference, setPreference, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  return (
    <HStack align="center" gap={4}>
      <HStack align="center" gap={2}>
        <Sun className="w-4 h-4 text-[var(--rb-text)] opacity-60" />
        <Switch
          aria-label="Toggle dark mode"
          isSelected={isDark}
          variant="outline"
          onChange={(isSelected) => setPreference(isSelected ? 'dark' : 'light')}
        />
        <Moon className="w-4 h-4 text-[var(--rb-text)] opacity-60" />
      </HStack>
      <Separator direction="vertical" thinned="none" />
      <Button
        aria-label="Follow system theme"
        color={preference === 'system' ? 'primary' : 'neutral'}
        renderStartIcon={(className) => <Monitor className={className} />}
        size="s"
        variant={preference === 'system' ? 'solid' : 'ghost'}
        onPress={() => setPreference('system')}
      >
        <Text bold={preference === 'system'} size="s" type="label">
          Follow system theme
        </Text>
      </Button>
    </HStack>
  );
}
