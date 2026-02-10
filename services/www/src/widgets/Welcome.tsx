import { Container, Header, Paragraph } from '@ermnvldmr/ui';
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
    <Container bg="muted" padding={4} rounded="lg">
      <Header level={1}>Welcome to WWW Service</Header>
      <Paragraph>This is a placeholder component for Storybook.</Paragraph>
    </Container>
  );
};
