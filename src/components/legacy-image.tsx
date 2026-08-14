import type { ImgHTMLAttributes } from 'react';

type LegacyImageProps = ImgHTMLAttributes<HTMLImageElement> & {
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  sizes?: string;
};

/** Compatibility image component for the reusable legacy simulator promos. */
export function LegacyImage({
  fill,
  priority,
  quality: _quality,
  sizes: _sizes,
  alt,
  className,
  loading,
  ...props
}: LegacyImageProps) {
  return (
    <img
      {...props}
      alt={alt ?? ''}
      className={
        fill ? `absolute inset-0 h-full w-full ${className ?? ''}` : className
      }
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding="async"
    />
  );
}
