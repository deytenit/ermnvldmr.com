import React from 'react';

/**
 * A separator that uses a rainbow gradient with a soft, dimmed upward ambient glow.
 * Glances at the bottom of the viewport to invite scrolling and visually bridge
 * the main page content and footer, placed behind page content (-z-10).
 *
 * @example
 * ```tsx
 * <RainbowSeparator />
 * ```
 */
export const RainbowSeparator = () => {
  return (
    <div className="relative w-full overflow-visible" role="separator">
      {/* Soft, dimmed upward ambient rainbow glow placed behind page content (-z-10) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-24 inset-x-0 -z-10 h-28 bg-gradient-to-r from-red-500/10 via-yellow-500/10 via-green-500/10 via-blue-500/10 to-purple-500/10 opacity-60 blur-3xl dark:from-red-500/15 dark:via-yellow-500/15 dark:via-green-500/15 dark:via-blue-500/15 dark:to-purple-500/15"
      />
      {/* Primary rainbow line */}
      <div className="relative h-[4px] w-full bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 opacity-80" />
    </div>
  );
};
