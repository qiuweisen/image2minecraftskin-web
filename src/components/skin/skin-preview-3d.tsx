import { useEffect, useRef } from 'react';

export function SkinPreview3d({
  skinUrl,
  label,
  frontLabel = 'Front',
  backLabel = 'Back',
  model = 'auto-detect',
}: {
  skinUrl?: string;
  label: string;
  frontLabel?: string;
  backLabel?: string;
  model?: 'auto-detect' | 'default' | 'slim';
}) {
  const frontRef = useRef<HTMLCanvasElement>(null);
  const backRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!skinUrl || !frontRef.current || !backRef.current) return;
    let disposed = false;
    const viewers: Array<{ dispose: () => void }> = [];
    import('skinview3d').then(({ SkinViewer, WalkingAnimation }) => {
      if (disposed || !frontRef.current || !backRef.current) return;
      for (const [canvas, z] of [
        [frontRef.current, 30],
        [backRef.current, -30],
      ] as const) {
        const next = new SkinViewer({
          canvas,
          width: 420,
          height: 380,
          skin: skinUrl,
          model,
          enableControls: true,
        });
        next.camera.position.set(12, 8, z);
        next.autoRotate = true;
        next.animation = new WalkingAnimation();
        viewers.push(next);
      }
    });
    return () => {
      disposed = true;
      viewers.forEach((viewer) => {
        viewer.dispose();
      });
    };
  }, [model, skinUrl]);

  return (
    <div
      className="skin-preview-world world-stage relative grid h-full min-h-80 w-full place-items-center overflow-hidden border border-zinc-800 bg-zinc-900"
      role="img"
      aria-label={label}
    >
      <div className="stars" aria-hidden="true" />
      <div className="moon" aria-hidden="true" />
      <div className="ground" aria-hidden="true">
        <div className="grass" />
        <div className="dirt" />
      </div>
      <div className="skin-preview-content grid w-full grid-cols-2 gap-2 px-2">
        <div className="grid gap-1 text-center text-[10px] uppercase tracking-widest text-zinc-500">
          <canvas ref={frontRef} className="max-h-full min-h-0 max-w-full" />
          <span>{frontLabel}</span>
        </div>
        <div className="grid gap-1 text-center text-[10px] uppercase tracking-widest text-zinc-500">
          <canvas ref={backRef} className="max-h-full min-h-0 max-w-full" />
          <span>{backLabel}</span>
        </div>
      </div>
      {!skinUrl && (
        <span className="font-mono text-3xl text-cyan-300/60">+</span>
      )}
    </div>
  );
}
