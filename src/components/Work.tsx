"use client";

import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowTopRightOnSquareIcon,
  ArrowUpRightIcon,
  CodeBracketIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import ArchitectureDiagram from './ArchitectureDiagram';
import { capabilityLabels, projects } from '@/data/projects';
import type { Project } from '@/types/project';

function statusLabelFor(project: Project): string {
  if (project.status === 'live') {
    return project.liveUrl?.startsWith('/') ? 'Live on this site' : 'Live product';
  }
  if (project.status === 'demo') return 'Demo available';
  if (project.status === 'source-available') return 'Source available';
  return 'Production work';
}

/** Capabilities worth highlighting at a glance: the two halves of the profile. */
const accentCapabilities = new Set<Project['capabilities'][number]>(['agent', 'rag', 'backend', 'realtime']);

function CapabilityTags({ project }: { project: Project }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {project.capabilities.map((capability) => (
        <li key={capability} className={`tag ${accentCapabilities.has(capability) ? 'tag-accent' : ''}`}>
          {capabilityLabels[capability] ?? capability}
        </li>
      ))}
    </ul>
  );
}

function CaseStudyPanel({ project, onClose }: { project: Project; onClose: () => void }) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKeyDown);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
    };
  }, [onClose]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      style={{ background: 'color-mix(in srgb, var(--bg) 82%, transparent)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} case study`}
    >
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 16 }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        onClick={(event) => event.stopPropagation()}
        className="relative flex max-h-[min(92dvh,900px)] w-full max-w-4xl flex-col overflow-hidden border bg-surface"
        style={{ borderColor: 'var(--line)' }}
      >
        <header
          className="flex shrink-0 items-start justify-between gap-4 border-b px-6 py-5 sm:px-10"
          style={{ borderColor: 'var(--line)', background: 'var(--surface)' }}
        >
          <div className="min-w-0 flex-1 pr-2">
            <p className="eyebrow">{project.capabilityArea}</p>
            <h3 className="mt-2 text-2xl font-semibold text-ink sm:text-3xl">{project.title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            autoFocus
            aria-label="Close case study"
            className="flex h-10 w-10 shrink-0 items-center justify-center border transition-colors hover:border-accent-line hover:text-accent"
            style={{ borderColor: 'var(--line)', color: 'var(--ink-muted)', background: 'var(--surface)' }}
          >
            <XMarkIcon className="h-5 w-5" aria-hidden />
          </button>
        </header>

        <div className="min-h-0 flex-1 space-y-12 overflow-y-auto overscroll-contain px-6 py-10 sm:px-10">
          <section>
            <div className="mono flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-faint">
              <span>{project.role}</span>
              <span>{project.timeframe}</span>
              <span className="text-accent">{statusLabelFor(project)}</span>
            </div>
            <h4 className="mt-8 text-xs uppercase tracking-[0.18em] text-faint">The problem</h4>
            <p className="mt-3 text-base leading-relaxed text-ink">{project.problem}</p>
            <p className="mt-4 text-sm leading-relaxed text-muted">{project.description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              {project.liveUrl && (
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" className="btn-primary !py-2.5">
                  <ArrowTopRightOnSquareIcon className="h-4 w-4" />
                  {project.liveUrl.startsWith('/') ? 'Open on this site' : 'View live'}
                </a>
              )}
              {project.githubUrl && (
                <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className="btn-ghost !py-2.5">
                  <CodeBracketIcon className="h-4 w-4" />
                  Source
                </a>
              )}
              {!project.liveUrl && !project.githubUrl && project.linkNote && (
                <p className="mono text-[11px] text-faint">{project.linkNote}</p>
              )}
            </div>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-[0.18em] text-faint">Architecture</h4>
            <div className="mt-5">
              <ArchitectureDiagram
                title={`${project.title} architecture`}
                nodes={project.architecture.nodes}
                edges={project.architecture.edges}
                caption={project.architecture.summary}
              />
            </div>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-[0.18em] text-faint">Decisions and tradeoffs</h4>
            <ol className="mt-5 space-y-6">
              {project.decisions.map((decision, index) => (
                <li key={decision.choice} className="border-t pt-5" style={{ borderColor: 'var(--line)' }}>
                  <div className="flex gap-4">
                    <span className="mono pt-1 text-[11px] text-accent">0{index + 1}</span>
                    <div>
                      <p className="font-medium text-ink">{decision.choice}</p>
                      <p className="mt-2 text-sm leading-relaxed text-muted">{decision.rationale}</p>
                      {decision.alternative && (
                        <p className="mt-2 text-sm leading-relaxed text-faint">
                          <span className="mono text-[11px] uppercase tracking-wider">Considered: </span>
                          {decision.alternative}
                        </p>
                      )}
                    </div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          {project.incident && (
            <section className="border-l-2 pl-5" style={{ borderColor: 'var(--accent)' }}>
              <h4 className="text-xs uppercase tracking-[0.18em] text-faint">What broke</h4>
              <p className="mt-3 text-sm leading-relaxed text-ink">{project.incident.broke}</p>
              <h4 className="mt-6 text-xs uppercase tracking-[0.18em] text-faint">How it was fixed</h4>
              <p className="mt-3 text-sm leading-relaxed text-muted">{project.incident.fix}</p>
            </section>
          )}

          <section>
            <h4 className="text-xs uppercase tracking-[0.18em] text-faint">Results</h4>
            <dl className="mt-5 grid gap-px sm:grid-cols-3" style={{ background: 'var(--line)' }}>
              {project.metrics.map((metric) => (
                <div key={metric.label} className="bg-surface p-5">
                  <dt className="mono text-[10px] uppercase tracking-wider text-faint">{metric.label}</dt>
                  <dd className="mt-2 text-lg font-medium leading-snug text-ink">
                    {metric.value}
                    {metric.approximate && <span className="mono ml-1.5 text-[10px] text-faint">approx.</span>}
                  </dd>
                  {metric.note && <p className="mt-2 text-xs leading-relaxed text-muted">{metric.note}</p>}
                </div>
              ))}
            </dl>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-[0.18em] text-faint">Stack by layer</h4>
            <ul className="mt-5 divide-y" style={{ borderColor: 'var(--line)' }}>
              {project.stackLayers.map((layer) => (
                <li
                  key={layer.layer}
                  className="flex flex-col gap-2 border-t py-3 sm:flex-row sm:items-baseline sm:gap-8"
                  style={{ borderColor: 'var(--line)' }}
                >
                  <span className="mono w-40 shrink-0 text-[11px] uppercase tracking-wider text-faint">
                    {layer.layer}
                  </span>
                  <span className="text-sm text-ink">{layer.items.join(', ')}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4 className="text-xs uppercase tracking-[0.18em] text-faint">What it does</h4>
            <ul className="mt-5 grid gap-3 sm:grid-cols-2">
              {project.features.map((feature) => (
                <li key={feature} className="flex gap-3 text-sm text-muted">
                  <span className="mt-2 h-1 w-1 shrink-0" style={{ background: 'var(--accent)' }} />
                  {feature}
                </li>
              ))}
            </ul>
          </section>
        </div>
      </motion.article>
    </motion.div>
  );
}

export default function Work() {
  const [selected, setSelected] = useState<Project | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <section id="work" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between"
        >
          <div className="max-w-2xl">
            <p className="eyebrow">Selected work</p>
            <h2 className="section-heading mt-4">
              Production systems first — realtime, retrieval, agents
            </h2>
            <p className="lede mt-5">
              Ordered by impact. Start with the platforms that carried real users, then the RAG and
              agent systems that show how I design AI on top of that engineering. Each case study
              covers the problem, architecture, decisions, and what broke.
            </p>
          </div>
          <p className="mono text-[11px] text-faint">
            {projects.length} case studies
          </p>
        </motion.div>

        <div className="mt-14">
          {projects.map((project, index) => (
            <motion.button
              key={project.slug}
              onClick={() => setSelected(project)}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group block w-full border-t py-8 text-left transition-colors last:border-b"
              style={{ borderColor: 'var(--line)' }}
            >
              <div className="grid gap-6 lg:grid-cols-[7rem_1fr_auto] lg:items-start">
                <div>
                  <span className="mono text-[11px] text-accent">0{index + 1}</span>
                  <p className="mono mt-2 text-[10px] uppercase tracking-[0.16em] text-faint">
                    {project.capabilityArea}
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-ink transition-colors group-hover:text-accent sm:text-3xl">
                    {project.title}
                  </h3>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted">{project.tagline}</p>
                  <div className="mt-5">
                    <CapabilityTags project={project} />
                  </div>
                  <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3">
                    {project.metrics.slice(0, 2).map((metric) => (
                      <div key={metric.label}>
                        <dt className="mono text-[10px] uppercase tracking-wider text-faint">{metric.label}</dt>
                        <dd className="mt-1 text-sm text-ink">{metric.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>

                <div className="flex items-center gap-2 text-sm text-muted transition-colors group-hover:text-accent lg:pt-2">
                  Read case study
                  <ArrowUpRightIcon className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {selected && (
              <CaseStudyPanel
                key={selected.slug}
                project={selected}
                onClose={() => setSelected(null)}
              />
            )}
          </AnimatePresence>,
          document.body
        )}
    </section>
  );
}
