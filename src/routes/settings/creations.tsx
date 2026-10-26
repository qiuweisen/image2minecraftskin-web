import { listSkinTasks } from '@/api/credit-tasks';
import { SkinTaskCard } from '@/components/skin/skin-task-card';
import { SidebarLayout } from '@/components/layout/sidebar-layout';
import { createFileRoute } from '@tanstack/react-router';
import { useEffect, useState } from 'react';

export const Route = createFileRoute('/settings/creations')({
  component: CreationsPage,
});

function CreationsPage() {
  const [items, setItems] = useState<
    Array<{
      id: string;
      status: string;
      preset?: string | null;
      completedAt?: number | null;
      refundTransactionId?: string | null;
    }>
  >([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const load = async (next?: string) => {
    setLoading(true);
    try {
      const page = await listSkinTasks({ data: { cursor: next, limit: 24 } });
      setItems((old) => (next ? [...old, ...page.items] : page.items));
      setCursor(page.nextCursor);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  return (
    <SidebarLayout>
      <main className="mx-auto w-full max-w-5xl p-6">
        <div className="mb-8">
          <h1 className="font-mono text-2xl text-cyan-200">我的皮肤</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            AI 皮肤任务与生成结果
          </p>
        </div>
        {loading && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">加载中…</p>
        ) : items.length === 0 ? (
          <p className="border border-dashed p-8 text-center text-sm text-muted-foreground">
            还没有 AI 皮肤。
          </p>
        ) : (
          <div className="grid gap-4">
            {items.map((item) => (
              <SkinTaskCard key={item.id} task={item} />
            ))}
          </div>
        )}
        {cursor && (
          <button
            type="button"
            className="mt-6 min-h-10 border border-cyan-300/60 px-4 text-sm text-cyan-100"
            onClick={() => void load(cursor)}
          >
            加载更多
          </button>
        )}
      </main>
    </SidebarLayout>
  );
}
