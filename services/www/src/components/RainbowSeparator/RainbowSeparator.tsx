import React from 'react';

/**
 /**
 * A separator that uses a rainbow gradient.
 * Glances at the bottom of the viewport to invite scrolling.
 *
 * @example
 * ```tsx
 * <RainbowSeparator />
 * ```
 */
export const RainbowSeparator = () => {
  return (
    <div
      className="w-full h-[4px] bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse opacity-70"
      role="separator"
    />
  );
};
