"use client";

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Bars3Icon, MoonIcon, SunIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { profile } from '@/data/profile';

const navItems = [
  { name: 'Expertise', id: 'expertise' },
  { name: 'Work', id: 'work' },
  { name: 'Agents', id: 'agents' },
  { name: 'Backend', id: 'backend' },
  { name: 'Stack', id: 'stack' },
  { name: 'Ask', id: 'ask' },
  { name: 'Contact', id: 'contact' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isDark, setIsDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = stored ? stored === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleThemeChange = (event: MediaQueryListEvent) => {
      if (localStorage.getItem('theme')) return;
      setIsDark(event.matches);
      document.documentElement.classList.toggle('dark', event.matches);
    };

    mediaQuery.addEventListener('change', handleThemeChange);
    return () => mediaQuery.removeEventListener('change', handleThemeChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('section[id]'));
    if (sections.length === 0) return;

    // Observer beats scroll math: no layout thrash and it survives variable
    // section heights.
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActiveSection(visible.target.id);
      },
      { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50"
    >
      <div
        className="transition-colors duration-300"
        style={
          scrolled
            ? {
                backgroundColor: 'color-mix(in srgb, var(--bg) 88%, transparent)',
                backdropFilter: 'blur(10px)',
                borderBottom: '1px solid var(--line)',
              }
            : { borderBottom: '1px solid transparent' }
        }
      >
        <nav className="page-shell flex h-16 items-center justify-between" aria-label="Primary">
          <a href="#home" className="group flex items-center gap-3">
            <span
              className="mono flex h-9 w-9 items-center justify-center border text-[13px] font-semibold transition-colors"
              style={{ borderColor: 'var(--accent-line)', color: 'var(--accent)' }}
            >
              {profile.initials}
            </span>
            <span className="hidden sm:block leading-tight">
              <span className="block text-sm font-semibold text-ink">{profile.name}</span>
              <span className="mono block text-[10px] uppercase tracking-[0.18em] text-faint">
                {profile.role}
              </span>
            </span>
          </a>

          <div className="hidden items-center gap-6 md:flex lg:gap-7">
            {navItems.map((item) => {
              const active = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  className="relative py-1 text-sm transition-colors"
                  style={{ color: active ? 'var(--accent)' : 'var(--ink-muted)' }}
                >
                  {item.name}
                  {active && (
                    <motion.span
                      layoutId="nav-active"
                      className="absolute -bottom-0.5 left-0 right-0 h-px"
                      style={{ background: 'var(--accent)' }}
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.5 }}
                    />
                  )}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-2">
            <a href="#contact" className="hidden lg:inline-flex btn-primary !px-4 !py-2">
              Get in touch
            </a>
            <button
              onClick={toggleTheme}
              aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
              className="flex h-9 w-9 items-center justify-center border transition-colors"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-muted)' }}
            >
              {isDark ? <SunIcon className="h-4 w-4" /> : <MoonIcon className="h-4 w-4" />}
            </button>
            <button
              onClick={() => setIsOpen((open) => !open)}
              aria-label={isOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isOpen}
              className="flex h-9 w-9 items-center justify-center border transition-colors md:hidden"
              style={{ borderColor: 'var(--line)', color: 'var(--ink-muted)' }}
            >
              {isOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
            </button>
          </div>
        </nav>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden md:hidden"
            style={{
              backgroundColor: 'color-mix(in srgb, var(--bg) 96%, transparent)',
              backdropFilter: 'blur(10px)',
              borderBottom: '1px solid var(--line)',
            }}
          >
            <div className="page-shell flex flex-col py-2">
              {navItems.map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={() => setIsOpen(false)}
                  className="border-b py-3 text-sm last:border-b-0"
                  style={{
                    borderColor: 'var(--line)',
                    color: activeSection === item.id ? 'var(--accent)' : 'var(--ink-muted)',
                  }}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
