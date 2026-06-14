import { getStats } from '@/lib/jobs/queries';
import { formatSalary } from '@/lib/jobs/format';
import { Briefcase, MapPin, TrendingUp, Database } from 'lucide-react';

export async function JobStatsBar() {
  const stats = await getStats();

  const items = [
    {
      label: '岗位总数',
      value: stats.totalJobs.toLocaleString(),
      icon: Briefcase,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      label: '覆盖城市',
      value: `${stats.totalCities} 个`,
      icon: MapPin,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      label: '平均薪资',
      value: stats.avgSalary ? formatSalary(stats.avgSalary, stats.avgSalary) : '暂无',
      icon: TrendingUp,
      color: 'text-orange-500 bg-orange-500/10',
    },
    {
      label: '最新数据',
      value: stats.latestScrapedAt
        ? stats.latestScrapedAt.slice(0, 10)
        : '暂无',
      icon: Database,
      color: 'text-purple-500 bg-purple-500/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
      {items.map((item) => (
        <div
          key={item.label}
          className="glass-card p-4 flex items-center gap-3"
        >
          <div
            className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${item.color}`}
          >
            <item.icon className="w-4 h-4" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-muted/60">{item.label}</div>
            <div className="text-sm font-semibold truncate">
              {item.value}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
