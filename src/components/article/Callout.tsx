import { Info, AlertTriangle, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CalloutProps {
  children: React.ReactNode;
  type?: 'info' | 'warning' | 'tip';
}

const styles = {
  info: {
    icon: Info,
    className: 'border-blue-500/30 bg-blue-500/5 dark:bg-blue-500/10',
    iconClassName: 'text-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    className: 'border-amber-500/30 bg-amber-500/5 dark:bg-amber-500/10',
    iconClassName: 'text-amber-500',
  },
  tip: {
    icon: Lightbulb,
    className: 'border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10',
    iconClassName: 'text-emerald-500',
  },
};

export function Callout({ children, type = 'tip' }: CalloutProps) {
  const { icon: Icon, className, iconClassName } = styles[type];

  return (
    <div className={cn('flex gap-3 p-4 rounded-2xl border my-6', className)}>
      <Icon className={cn('w-5 h-5 flex-shrink-0 mt-0.5', iconClassName)} />
      <div className="text-sm text-muted">{children}</div>
    </div>
  );
}
