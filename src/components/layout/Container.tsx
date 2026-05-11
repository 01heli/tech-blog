import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  size?: 'small' | 'default' | 'large';
}

export function Container({ children, className, size = 'default' }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto px-6 md:px-8',
        {
          'max-w-3xl': size === 'small',
          'max-w-6xl': size === 'default',
          'max-w-7xl': size === 'large',
        },
        className
      )}
    >
      {children}
    </div>
  );
}
