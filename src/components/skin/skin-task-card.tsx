import { getCreditTaskStatus, startSkinTask } from '@/api/credit-tasks';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { mapAiSheetToSkin } from '@/lib/skin/ai-sheet';
import { textureToDataUrl } from '@/lib/skin/browser';
import type { SkinModel } from '@/lib/skin/types';
import { trackSkinEvent } from '@/lib/analytics-events';

type Task = {
  id: string;
  status: string;
  cost?: number;
  preset?: string | null;
  completedAt?: number | null;
  refundTransactionId?: string | null;
  freeRetryAvailable?: boolean;
};

export function SkinTaskCard({
  task: initial,
  model = 'classic',
  onTaskReplace,
}: {
  task: Task;
  model?: SkinModel;
  onTaskReplace?: (task: Task) => void;
}) {
  const [task, setTask] = useState(initial);
  const [result, setResult] = useState<string>();
  const [quality, setQuality] = useState<string>();
  const [retrying, setRetrying] = useState(false);
  const [retryError, setRetryError] = useState<string>();
  const [retryUsedLocally, setRetryUsedLocally] = useState(false);

  useEffect(() => {
    setTask(initial);
  }, [initial]);

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

  const showFreeRetry =
    !retryUsedLocally &&
    task.freeRetryAvailable === true &&
    (task.status === 'failed' ||
      (task.status === 'succeeded' && quality === 'AI 图不规范'));

  const runFreeRetry = async () => {
    if (retrying || retryUsedLocally) return;
    setRetrying(true);
    setRetryError(undefined);
    try {
      trackSkinEvent({
        name: 'ai_generate_start',
        payload: { preset: task.preset ?? model, model, free_retry: true },
      });
      const next = await startSkinTask({
        data: {
          bizKey: `skin-retry-${crypto.randomUUID()}`,
          retryOf: task.id,
        },
      });
      setRetryUsedLocally(true);
      setTask(next);
      setResult(undefined);
      setQuality(undefined);
      onTaskReplace?.(next);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : 'FREE_RETRY_FAILED';
      setRetryError(message);
      if (message === 'FREE_RETRY_ALREADY_USED') setRetryUsedLocally(true);
      trackSkinEvent({
        name: 'ai_generate_fail',
        payload: { reason: 'free_retry_failed' },
      });
    } finally {
      setRetrying(false);
    }
  };

  const freeRetryButton = showFreeRetry ? (
    <div className="grid gap-2">
      <Button
        type="button"
        variant="outline"
        disabled={retrying || retryUsedLocally}
        onClick={() => void runFreeRetry()}
      >
        {retrying ? '正在免费重新生成…' : '免费重新生成一次'}
      </Button>
      {retryError && (
        <p className="text-xs text-red-300">
          {retryError === 'FREE_RETRY_ALREADY_USED'
            ? '该任务的免费重试已用过。'
            : `免费重试失败：${retryError}`}
        </p>
      )}
    </div>
  ) : null;

  if (task.status === 'failed' || task.status === 'rejected')
    return (
      <div className="grid gap-3 border border-red-400/30 p-4 text-sm text-red-200">
        <div>
          {task.status === 'rejected'
            ? '积分不足，未能开始生成。'
            : '生成失败，积分已退回。请稍后重试。'}
        </div>
        {task.status === 'failed' && freeRetryButton}
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
        {task.cost === 0 ? ' · free retry' : ''}
      </div>
      {quality && (
        <div className="text-sm text-amber-200">
          {quality}
          {showFreeRetry
            ? ' · 可免费重新生成一次'
            : retryUsedLocally
              ? ' · 免费重试已使用'
              : ''}
        </div>
      )}
      {freeRetryButton}
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
