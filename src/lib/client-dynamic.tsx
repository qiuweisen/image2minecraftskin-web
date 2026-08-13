import {
  lazy,
  Suspense,
  type ComponentProps,
  type ComponentType,
  type ReactNode,
} from 'react';

type Loader<T extends ComponentType<any>> = () => Promise<{ default: T }>;

/**
 * Small TanStack/Vite equivalent for the subset of next/dynamic used by the
 * legacy simulator. The component stays code-split and renders only after its
 * browser-safe module has loaded.
 */
export function clientDynamic<T extends ComponentType<any>>(
  loader: Loader<T>,
  fallback: ReactNode = null
) {
  const LazyComponent = lazy(loader);

  return function ClientDynamic(props: ComponentProps<T>) {
    return (
      <Suspense fallback={fallback}>
        <LazyComponent {...props} />
      </Suspense>
    );
  };
}
