import { getCreditTaskStatus } from '@/api/credit-tasks';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { mapAiSheetToSkin } from '@/lib/skin/ai-sheet';
import { textureToDataUrl } from '@/lib/skin/browser';
import type { SkinModel } from '@/lib/skin/types';
import { trackSkinEvent } from '@/lib/analytics-events';

type Task = {
  id: string;
  status: string;
  preset?: string | null;
  completedAt?: number | null;
  refundTransactionId?: string | null;
};
export function SkinTaskCard({
  task: initial,
  model = 'classic',
}: {
  task: Task;
  model?: SkinModel;
}) {
  const [task, setTask] = useState(initial);
  const [result, setResult] = useState<string>();
  const [quality, setQuality] = useState<string>();
  useEffect(() => {
    if (['succeeded', 'failed', 'rejected'].includes(task.status)) return;
    let cancelled = false;
    let delay = 1500;
    const poll = async () => {
      try {
        const next = await getCreditTaskStatus({ data: { taskId: task.id } });
        if (!cancelled) setTask(next);
      } catch {
        /* retry */
      }
      if (
        !cancelled &&
        !['succeeded', 'failed', 'rejected'].includes(task.status)
      ) {
        delay = Math.min(delay * 1.5, 15000);
        window.setTimeout(poll, delay);
      }
    };
    const timer = window.setTimeout(poll, delay);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [task.id, task.status]);
  useEffect(() => {
    if (task.status !== 'succeeded') return;
    let cancelled = false;
    fetch(`/api/credits/task-result?taskId=${encodeURIComponent(task.id)}`)
      .then((r) => r.blob())
      .then(async (blob) => {
        if (cancelled) return;
        const image = new Image();
        const url = URL.createObjectURL(blob);
        image.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = image.naturalWidth;
          canvas.height = image.naturalHeight;
          const ctx = canvas.getContext('2d');
          if (!ctx) return;
          ctx.drawImage(image, 0, 0);
          const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const mapped = mapAiSheetToSkin(
            { width: canvas.width, height: canvas.height, pixels: data.data },
            model
          );
          setQuality(mapped.quality.valid ? undefined : 'AI 图不规范');
          if (mapped.quality.valid) {
            setResult(textureToDataUrl(mapped.texture));
            trackSkinEvent({ name: 'ai_generate_success', payload: { model } });
          } else {
            trackSkinEvent({
              name: 'ai_generate_fail',
              payload: { reason: 'layout_invalid' },
            });
          }
          URL.revokeObjectURL(url);
        };
        image.src = url;
      })
      .catch(() => setQuality('AI 结果暂时无法读取'));
    return () => {
      cancelled = true;
    };
  }, [task.id, task.status, model]);
  if (task.status === 'failed' || task.status === 'rejected')
    return (
      <div className="border border-red-400/30 p-4 text-sm text-red-200">
        生成失败，积分已退回。请稍后重试。
      </div>
    );
  if (task.status === 'refund_pending')
    return (
      <div className="border border-amber-400/30 p-4 text-sm text-amber-200">
        生成失败，正在退回积分。
      </div>
    );
  return (
    <div className="grid gap-3 border border-cyan-300/30 bg-zinc-900/60 p-4">
      <div className="font-mono text-xs uppercase text-cyan-300">
        {task.status === 'succeeded'
          ? 'AI skin ready'
          : `AI skin ${task.status}`}
      </div>
      {quality && (
        <div className="text-sm text-amber-200">
          {quality} · 可免费重新生成一次
        </div>
      )}
      {result && (
        <>
          <img
            src={result}
            alt="Generated Minecraft skin"
            className="max-h-64 w-full object-contain"
          />
          <div className="flex gap-2">
            <a
              className="inline-flex min-h-10 items-center border border-cyan-300 px-3 text-sm text-cyan-100"
              href={result}
              download={`minecraft-skin-${task.id}.png`}
            >
              下载 PNG
            </a>
            <Button
              variant="outline"
              onClick={() =>
                window.open(
                  `/api/credits/task-result?taskId=${encodeURIComponent(task.id)}&download=1`,
                  '_blank'
                )
              }
            >
              下载 AI 原图
            </Button>
          </div>
        </>
      )}
    </div>
  );
}
