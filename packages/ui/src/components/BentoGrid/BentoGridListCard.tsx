import { cn } from '@ermnvldmr/stl';
import React from 'react';

import { Accordion } from '../Accordion';
import { Header } from '../Header/Header';
import { HStack } from '../HStack/HStack';
import { List } from '../List';
import { BentoGridBaseCard } from './BentoGridBaseCard';
import { Text } from '../Text/Text';
import { VStack } from '../VStack/VStack';

import type { BentoCardBaseProps } from './types';

/**
 *
 */
export interface BentoGridListCardSection {
  /** Unique identifier for the accordion section */
  value: string;
  /** Label text for the accordion trigger */
  label: string;
  /** Optional icon next to the label */
  labelIcon?: React.ReactNode;
  /** Optional class name for the label text color (e.g. 'text-rb-orange-600') */
  labelClassName?: string;
  /** List of items to display when expanded. Can be raw nodes or objects with keys. */
  items: (React.ReactNode | { key: string; node: React.ReactNode })[];
}

/**
 *
 */
export interface BentoGridListCardProps extends BentoCardBaseProps {
  /** Title of the card */
  title: string;
  /** Description text */
  description?: string;
  /** Optional icon next to the title. For colored backgrounds, wrap the icon in a styled div. */
  icon?: React.ReactNode;
  /** Sections containing lists of items, rendered as Accordions */
  sections: BentoGridListCardSection[];
  /** Which sections are expanded by default (uses section value) */
  defaultValue?: string[];
  /** Whether multiple sections can be open at once */
  type?: 'single' | 'multiple';
}

/**
 * A Bento card designed for categorized lists of items using Accordions.
 *
 * @example
 * ```tsx
 * <BentoGrid.ListCard
 *   title="My List"
 *   sections={[
 *     { value: 's1', label: 'Section 1', items: ['Item 1', 'Item 2'] }
 *   ]}
 * />
 * ```
 */
export const BentoGridListCard = ({
  title,
  description,
  icon,
  sections,
  defaultValue,
  type = 'multiple',
  ...baseProps
}: BentoGridListCardProps) => {
  return (
    <BentoGridBaseCard {...baseProps} className={cn('flex flex-col', baseProps.className)}>
      <VStack className="h-full" gap={4}>
        <HStack align="center" gap={3}>
          {icon && <div>{icon}</div>}
          <Header level={3}>{title}</Header>
        </HStack>

        {description && (
          <Text className="text-rb-muted-text">
            {description}
          </Text>
        )}

        <div className="flex-grow w-full">
          <Accordion collapsible defaultValue={defaultValue} type={type}>
            {sections.map((section) => (
              <Accordion.Item key={section.value} value={section.value}>
                <Accordion.Trigger className={section.labelClassName}>
                  <HStack align="center" gap={2}>
                    {section.labelIcon}
                    <Text size="l" type="body">{section.label}</Text>
                  </HStack>
                </Accordion.Trigger>
                <Accordion.Content>
                  <List>
                    {section.items.map((item, index) => {
                      const content = (() => {
                        if (item && typeof item === 'object' && 'node' in item) {
                          return item.node;
                        }
                        return item;
                      })();

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
      </VStack>
    </BentoGridBaseCard>
  );
};
