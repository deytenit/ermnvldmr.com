import { cn } from '@ermnvldmr/stl';
import { cva } from 'class-variance-authority';
import React, { useState } from 'react';

import { Stub } from '../Stub/Stub';

/**
 * Image dimension constraints to ensure CLS safety.
 * Requires either:
 * - Both width and height
 * - Width and ratio
 * - Height and ratio
 */
type ImageDimensions =
  | { width: number | string; height: number | string; ratio?: never }
  | { width: number | string; ratio: number | string; height?: never }
  | { height: number | string; ratio: number | string; width?: never };

/**
 * Base props for the Image component.
 */
interface ImageBaseProps {
  /** Image source URL */
  src: string;
  /** Accessible alt text */
  alt: string;
  /** Corner radius variant */
  rounded?: 'none' | 'sm' | 'md' | 'lg' | 'full';
  /** Shadow variant */
  shadow?: 'none' | 'sm' | 'md' | 'lg';
  /** CSS object-fit property */
  objectFit?: 'cover' | 'contain' | 'fill';
  /** Additional CSS classes for the wrapper */
  className?: string;
}

/**
 * Unified Image props.
 */
export type ImageProps = ImageBaseProps & ImageDimensions;

const imageWrapperVariants = cva('relative overflow-hidden', {
  variants: {
    rounded: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      full: 'rounded-full',
    },
    shadow: {
      none: '',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
  },
  defaultVariants: {
    rounded: 'none',
    shadow: 'none',
  },
});

const imageVariants = cva('w-full h-full transition-opacity duration-300', {
  variants: {
    objectFit: {
      cover: 'object-cover',
      contain: 'object-contain',
      fill: 'object-fill',
    },
  },
  defaultVariants: {
    objectFit: 'cover',
  },
});

/**
 * A performance-optimized Image component with built-in CLS prevention,
 * loading states, and Rainby design system styles.
 *
 * @param props - Component properties
 * @returns A styled image component with loading skeleton
 * @example
 * <Image src="path/to/img.jpg" alt="Description" width={300} ratio="16/9" />
 */
export const Image: React.FC<ImageProps> = (props) => {
  const { src, alt, rounded = 'none', shadow = 'none', objectFit = 'cover', className } = props;
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  const wrapperStyle: React.CSSProperties = {
    width: 'width' in props ? props.width : undefined,
    height: 'height' in props ? props.height : undefined,
    aspectRatio: 'ratio' in props ? String(props.ratio) : undefined,
  };

  return (
    <div
      className={cn(imageWrapperVariants({ rounded, shadow }), className)}
      data-testid="image-wrapper"
      style={wrapperStyle}
    >
      {!isLoaded && (
        <Stub animate={!hasError} className="absolute inset-0 z-10" rounded={rounded} />
      )}
      <img
        alt={alt}
        className={cn(imageVariants({ objectFit }), isLoaded ? 'opacity-100' : 'opacity-0')}
        data-testid="image-element"
        decoding="async"
        loading="lazy"
        src={src}
        onError={() => setHasError(true)}
        onLoad={() => setIsLoaded(true)}
      />
    </div>
  );
};
