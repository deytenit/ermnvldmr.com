import type { ContainerBackground } from '@ermnvldmr/ui';
import type React from 'react';

/**
 * Props for the InfoCard root component.
 */
export interface InfoCardProps extends React.HTMLAttributes<HTMLElement> {
  /** Surface background variant */
  bg?: ContainerBackground;
  /** Variant style for the card */
  variant?: 'default' | 'primary';
  /** Grid column span */
  colSpan?: 1 | 2 | 3 | 4;
  /** Grid row span */
  rowSpan?: 1 | 2 | 3;
  /** Optional link destination */
  href?: string;
  /** Optional press handler */
  onPress?: () => void;
  /** Additional CSS class names */
  className?: string;
  /** Card content elements */
  children: React.ReactNode;
}

/**
 * Props for InfoCardHeader component.
 */
export interface InfoCardHeaderProps {
  /** Header title text or nodes */
  children: React.ReactNode;
  /** Optional leading icon */
  icon?: React.ReactNode;
  /** Heading semantic level (1-6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Props for InfoCardBody component.
 */
export interface InfoCardBodyProps {
  /** Body content nodes */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Props for InfoCardFooter component.
 */
export interface InfoCardFooterProps {
  /** Footer content nodes */
  children: React.ReactNode;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Props for InfoCardImage component.
 */
export interface InfoCardImageProps {
  /** Image source URL */
  src: string;
  /** Alternate text for accessibility */
  alt: string;
  /** Optional overlay header title */
  overlayTitle?: string;
  /** Optional overlay description text */
  overlayDescription?: string;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Section definition for InfoCardList component.
 */
export interface InfoCardListSection {
  /** Accordion item value key */
  value: string;
  /** Section label text */
  label: string;
  /** Optional icon next to section label */
  labelIcon?: React.ReactNode;
  /** Additional class names for trigger label */
  labelClassName?: string;
  /** List items inside section */
  items: (React.ReactNode | { key?: string; node: React.ReactNode })[];
}

/**
 * Props for InfoCardList component.
 */
export interface InfoCardListProps {
  /** List sections array */
  sections: InfoCardListSection[];
  /** Default expanded item values */
  defaultValue?: string[];
  /** Expansion mode: single or multiple */
  type?: 'single' | 'multiple';
  /** Additional CSS class names */
  className?: string;
}
