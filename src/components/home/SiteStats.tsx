import { getSiteStats } from '@/lib/stats';

const formatter = Intl.NumberFormat('zh-CN', { notation: 'compact' });

const statsConfig = [
  { key: 'articleCount' as const, label: '篇文章', icon: '✍️' },
  { key: 'totalWords' as const, label: '字输出', icon: '📝' },
  { key: 'projectCount' as const, label: '个项目', icon: '🚀' },
  { key: 'tagCount' as const, label: '个标签', icon: '🏷️' },
];

export function SiteStats() {
  const stats = getSiteStats();

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsConfig.map(({ key, label, icon }) => (
        <div
          key={key}
          className="rounded-xl border border-border bg-card p-5 text-center"
        >
          <span className="text-2xl">{icon}</span>
          <div className="mt-2 text-2xl font-bold tracking-tight">
            {formatter.format(stats[key])}
          </div>
          <div className="text-xs text-muted mt-0.5">{label}</div>
        </div>
      ))}
    </div>
  );
}
