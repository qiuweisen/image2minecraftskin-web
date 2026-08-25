import { useEffect, useRef } from 'react';

export function SkinPreview3d({
  skinUrl,
  label,
}: {
  skinUrl?: string;
  label: string;
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
      });
      next.autoRotate = true;
      next.animation = new WalkingAnimation();
      viewer = next;
    });
    return () => {
      disposed = true;
      viewer?.dispose();
    };
  }, [skinUrl]);

  return (
    <div className="skin-3d-stage" role="img" aria-label={label}>
      <canvas ref={canvasRef} />
      {!skinUrl && <span className="skin-preview-placeholder">+</span>}
    </div>
  );
}
