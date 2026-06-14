'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { Search, Menu } from 'lucide-react';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { MobileNav } from './MobileNav';
import { UserMenu } from '@/components/auth/UserMenu';
import { LoginModal } from '@/components/auth/LoginModal';
import { SITE } from '@/constants/site';
import { cn } from '@/lib/utils';

export function Navbar() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loginOpen, setLoginOpen] = useState(false);

  useEffect(() => {
    if (searchParams.get('login') === 'true') {
      setLoginOpen(true);
    }
  }, [searchParams]);

  useEffect(() => {
    function check() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', check, { passive: true });
    check();
    return () => window.removeEventListener('scroll', check);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <>
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          scrolled
            ? 'glass border-b border-black/5 dark:border-white/10 shadow-sm'
            : 'bg-background/80 backdrop-blur-sm'
        )}
      >
        <nav className="max-w-6xl mx-auto px-6 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight hover:opacity-70 transition-opacity"
          >
            {SITE.name}
          </Link>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-1">
            {SITE.navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'px-3.5 py-2 rounded-full text-sm font-medium transition-colors',
                  pathname === link.href || pathname.startsWith(link.href + '/')
                    ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                    : 'text-muted hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5'
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <Link
              href="/search"
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-muted hover:text-foreground"
              aria-label="搜索"
            >
              <Search className="w-4 h-4" />
            </Link>
            <ThemeToggle />
            <UserMenu onLoginClick={() => setLoginOpen(true)} />
            <button
              onClick={() => setMobileOpen(true)}
              className="ml-1 md:hidden w-11 h-11 flex items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
              aria-label="菜单"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </nav>
      </header>

      <MobileNav open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <LoginModal open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  );
}
