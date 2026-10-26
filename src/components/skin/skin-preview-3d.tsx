import { useEffect, useRef, useState } from 'react';

type AnimationMode = 'idle' | 'walk' | 'wave';

export function SkinPreview3d({
  skinUrl,
  label,
  model = 'auto-detect',
}: {
  skinUrl?: string;
  label: string;
  model?: 'auto-detect' | 'default' | 'slim';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const viewerRef = useRef<import('skinview3d').SkinViewer | null>(null);
  const [animation, setAnimation] = useState<AnimationMode>('idle');

  useEffect(() => {
    if (!skinUrl || !canvasRef.current) return;
    let disposed = false;
    let viewer: import('skinview3d').SkinViewer | undefined;
    let resizeObserver: ResizeObserver | undefined;
    import('skinview3d').then(({ SkinViewer, IdleAnimation }) => {
      if (disposed || !canvasRef.current) return;
      viewer = new SkinViewer({
        canvas: canvasRef.current,
        width: canvasRef.current.clientWidth || 640,
        height: canvasRef.current.clientHeight || 520,
        skin: skinUrl,
        model,
        enableControls: true,
      });
      viewer.camera.position.set(24, 12, 50);
      viewer.autoRotate = false;
      viewer.animation = new IdleAnimation();
      viewerRef.current = viewer;
      resizeObserver = new ResizeObserver((entries) => {
        const { width, height } = entries[0].contentRect;
        if (width > 0 && height > 0) {
          viewer?.setSize(Math.round(width), Math.round(height));
        }
      });
      resizeObserver.observe(canvasRef.current);
    });
    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      viewer?.dispose();
      if (viewerRef.current === viewer) viewerRef.current = null;
    };
  }, [model, skinUrl]);

  useEffect(() => {
    let cancelled = false;
    const applyAnimation = async () => {
      const { IdleAnimation, WalkingAnimation, WaveAnimation } = await import(
        'skinview3d'
      );
      if (cancelled || !viewerRef.current) return;
      const animations = {
        idle: IdleAnimation,
        walk: WalkingAnimation,
        wave: WaveAnimation,
      };
      viewerRef.current.animation = new animations[animation]();
    };
    void applyAnimation();
    return () => {
      cancelled = true;
    };
  }, [animation, skinUrl]);

  return (
    <figure
      className="skin-preview-world world-stage skin-preview-single relative grid h-full min-h-80 w-full place-items-center overflow-hidden border border-zinc-800 bg-zinc-900"
      aria-label={label}
    >
      <div className="stars" aria-hidden="true" />
      <div className="moon" aria-hidden="true" />
      <div className="skin-preview-chrome">
        <nav className="skin-preview-animations" aria-label="Preview animation">
          {(['idle', 'walk', 'wave'] as const).map((mode) => (
            <button
              key={mode}
              type="button"
              className={animation === mode ? 'is-active' : ''}
              aria-pressed={animation === mode}
              onClick={() => setAnimation(mode)}
            >
              {mode === 'walk' ? 'Walk' : mode[0].toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </nav>
        <span className="skin-preview-drag-hint">Drag to spin</span>
      </div>
      <div className="skin-preview-content">
        {skinUrl ? (
          <canvas ref={canvasRef} aria-label={label} />
        ) : (
          <div className="stage-ghost-v51" aria-hidden="true" />
        )}
      </div>
      <div className="ground" aria-hidden="true">
        <div className="grass" />
        <div className="dirt" />
      </div>
    </figure>
  );
}
