import { cn } from '@/lib/utils';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'primary' | 'outline';
  size?: 'sm' | 'md';
  className?: string;
}

export function Badge({ children, variant = 'default', size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-full transition-colors',
        {
          'px-2.5 py-0.5 text-xs': size === 'sm',
          'px-3.5 py-1 text-sm': size === 'md',
        },
        {
          'bg-black/5 dark:bg-white/10 text-muted': variant === 'default',
          'bg-blue-500/10 text-blue-600 dark:text-blue-400': variant === 'primary',
          'border border-border text-muted': variant === 'outline',
        },
        className
      )}
    >
      {children}
    </span>
  );
}
