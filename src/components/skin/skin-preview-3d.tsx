import { useEffect, useRef } from 'react';

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

  useEffect(() => {
    if (!skinUrl || !canvasRef.current) return;
    let disposed = false;
    let viewer: { dispose: () => void } | undefined;
    import('skinview3d').then(({ SkinViewer, WalkingAnimation }) => {
      if (disposed || !canvasRef.current) return;
      const next = new SkinViewer({
        canvas: canvasRef.current,
        width: 420,
        height: 520,
        skin: skinUrl,
        model,
        enableControls: true,
      });
      next.autoRotate = true;
      next.animation = new WalkingAnimation();
      viewer = next;
    });
    return () => {
      disposed = true;
      viewer?.dispose();
    };
  }, [model, skinUrl]);

  return (
    <div
      className="relative grid h-full min-h-80 w-full place-items-center overflow-hidden border border-zinc-800 bg-zinc-900"
      role="img"
      aria-label={label}
    >
      <canvas ref={canvasRef} className="max-h-full max-w-full" />
      {!skinUrl && (
        <span className="font-mono text-3xl text-cyan-300/60">+</span>
      )}
    </div>
  );
}
