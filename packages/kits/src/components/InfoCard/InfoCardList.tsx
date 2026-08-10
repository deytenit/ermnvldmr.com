import { Accordion, HStack, List, Text } from '@ermnvldmr/ui';
import React from 'react';

import type { InfoCardListProps } from './types';

/**
 * Accordion list sub-component for InfoCard.
 *
 * @example
 * ```tsx
 * <InfoCard.List sections={[]} />
 * ```
 */
export function InfoCardList({
  sections,
  defaultValue,
  type = 'multiple',
  className,
}: InfoCardListProps): React.JSX.Element {
  return (
    <div className={`flex-grow w-full ${className ?? ''}`}>
      <Accordion collapsible defaultValue={defaultValue} type={type}>
        {sections.map((section) => (
          <Accordion.Item key={section.value} value={section.value}>
            <Accordion.Trigger className={section.labelClassName}>
              <HStack align="center" gap={2}>
                {section.labelIcon}
                <Text size="l" type="body">
                  {section.label}
                </Text>
              </HStack>
            </Accordion.Trigger>
            <Accordion.Content>
              <List>
                {section.items.map((item, index) => {
                  const content =
                    item && typeof item === 'object' && 'node' in item ? item.node : item;
                  const itemKey =
                    item && typeof item === 'object' && 'key' in item
                      ? item.key
                      : typeof item === 'string'
                        ? item
                        : index;

                  return (
                    <List.Item key={itemKey}>
                      <Text size="m">{content}</Text>
                    </List.Item>
                  );
                })}
              </List>
            </Accordion.Content>
          </Accordion.Item>
        ))}
      </Accordion>
    </div>
  );
}
