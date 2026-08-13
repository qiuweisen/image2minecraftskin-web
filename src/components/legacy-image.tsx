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
  className,
  loading,
  ...props
}: LegacyImageProps) {
  return (
    <img
      {...props}
      className={
        fill ? `absolute inset-0 h-full w-full ${className ?? ''}` : className
      }
      loading={loading ?? (priority ? 'eager' : 'lazy')}
      decoding="async"
    />
  );
}
