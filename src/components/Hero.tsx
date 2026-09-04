"use client";

import { motion, useReducedMotion } from 'framer-motion';
import { ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import { profile } from '@/data/profile';

/**
 * Edge-to-edge system graph that acts as the hero's dominant visual plane.
 * Shows both halves of the work: the service layer and the agent layer.
 */
const planeNodes = [
  { id: 'client', label: 'client', x: 110, y: 540 },
  { id: 'ws', label: 'websocket', x: 330, y: 660 },
  { id: 'api', label: 'fastapi / nest', x: 360, y: 420 },
  { id: 'router', label: 'router', x: 610, y: 290 },
  { id: 'graph', label: 'langgraph', x: 850, y: 370 },
  { id: 'tools', label: 'tools / mcp', x: 1085, y: 235 },
  { id: 'retrieval', label: 'retrieval', x: 1080, y: 515 },
  { id: 'store', label: 'postgres / vectors', x: 1300, y: 625 },
  { id: 'model', label: 'model', x: 1315, y: 155 },
];

const planeEdges: Array<[string, string]> = [
  ['client', 'api'],
  ['client', 'ws'],
  ['ws', 'api'],
  ['api', 'router'],
  ['router', 'graph'],
  ['graph', 'tools'],
  ['graph', 'retrieval'],
  ['retrieval', 'store'],
  ['tools', 'model'],
];

function nodeById(id: string) {
  return planeNodes.find((node) => node.id === id)!;
}

function HeroPlane({ animate }: { animate: boolean }) {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <svg
        viewBox="0 0 1440 800"
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <radialGradient id="hero-fade" cx="62%" cy="38%" r="72%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.16" />
            <stop offset="55%" stopColor="var(--accent)" stopOpacity="0.05" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width="1440" height="800" fill="url(#hero-fade)" />

        {planeEdges.map(([fromId, toId], index) => {
          const from = nodeById(fromId);
          const to = nodeById(toId);
          const midX = (from.x + to.x) / 2;
          const path = `M ${from.x} ${from.y} C ${midX} ${from.y}, ${midX} ${to.y}, ${to.x} ${to.y}`;
          return (
            <g key={`${fromId}-${toId}`}>
              <path d={path} fill="none" stroke="var(--line-strong)" strokeWidth="1" opacity="0.6" />
              {animate && (
                <motion.path
                  d={path}
                  fill="none"
                  stroke="var(--accent)"
                  strokeWidth="1.5"
                  strokeDasharray="6 150"
                  initial={{ strokeDashoffset: 156 }}
                  animate={{ strokeDashoffset: 0 }}
                  transition={{
                    duration: 3.2,
                    repeat: Infinity,
                    ease: 'linear',
                    delay: index * 0.45,
                  }}
                  opacity="0.75"
                />
              )}
            </g>
          );
        })}

        {planeNodes.map((node) => (
          <g key={node.id}>
            <circle cx={node.x} cy={node.y} r="4.5" fill="var(--accent)" opacity="0.55" />
            <circle
              cx={node.x}
              cy={node.y}
              r="13"
              fill="none"
              stroke="var(--accent)"
              strokeWidth="1"
              opacity="0.22"
            />
            <text
              x={node.x + 22}
              y={node.y + 4}
              fill="var(--ink-faint)"
              fontSize="12"
              fontFamily="var(--font-mono), monospace"
              opacity="0.7"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export default function Hero() {
  const reduceMotion = useReducedMotion();

  const rise = (delay: number) => ({
    initial: { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  });

  return (
    <section id="home" className="relative flex min-h-[100svh] items-end overflow-hidden pb-16 pt-28">
      <HeroPlane animate={!reduceMotion} />

      <div className="page-shell relative z-10">
        <motion.p {...rise(0)} className="eyebrow mb-5">
          {profile.location} / {profile.remote}
        </motion.p>

        <motion.h1
          {...rise(0.08)}
          className="max-w-4xl text-[clamp(2.75rem,9vw,6.5rem)] font-bold leading-[0.92] text-ink"
        >
          {profile.name}
        </motion.h1>

        <motion.div {...rise(0.18)} className="mt-7 max-w-3xl">
          <h2 className="text-2xl font-medium sm:text-[2rem]" style={{ color: 'var(--accent)' }}>
            {profile.role}
          </h2>
          <p className="mono mt-3 border-t pt-3 text-xs tracking-wide text-faint" style={{ borderColor: 'var(--line)' }}>
            {profile.supportingLine}
          </p>
        </motion.div>

        <motion.p {...rise(0.28)} className="lede mt-8 max-w-2xl">
          {profile.heroSentence}
        </motion.p>

        <motion.div {...rise(0.38)} className="mt-10 flex flex-wrap items-center gap-3">
          <a href="#work" className="btn-primary">
            See selected work
          </a>
          <a href="#ask" className="btn-ghost">
            Ask my agent
          </a>
          <a
            href={profile.cvUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-2 py-3 text-sm text-muted transition-colors hover:text-accent"
          >
            <ArrowDownTrayIcon className="h-4 w-4" />
            Resume
          </a>
        </motion.div>
      </div>
    </section>
  );
}
