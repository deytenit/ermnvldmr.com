import React from 'react';

/**
 * A welcome component for the WWW service.
 *
 * @example
 * <Welcome />
 *
 * @returns {React.JSX.Element} The welcome message.
 */
export const Welcome: React.FC = (): React.JSX.Element => {
  return (
    <div className="p-4 bg-gray-100 rounded-lg">
      <h1 className="text-2xl font-bold">Welcome to WWW Service</h1>
      <p>This is a placeholder component for Storybook.</p>
    </div>
  );
};
