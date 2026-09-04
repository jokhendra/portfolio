"use client";

import { motion } from 'framer-motion';
import ArchitectureDiagram from './ArchitectureDiagram';
import type { DiagramEdge, DiagramNode } from '@/types/project';

/** The reference shape I reuse for production services, AI or not. */
const nodes: DiagramNode[] = [
  { id: 'client', label: 'Clients', sublabel: 'web and mobile', kind: 'client', column: 0, row: 0 },
  { id: 'gateway', label: 'API gateway', sublabel: 'REST, rate limits', kind: 'api', column: 1, row: 0 },
  { id: 'socket', label: 'Realtime gateway', sublabel: 'WebSocket handshake', kind: 'api', column: 1, row: 1 },
  { id: 'services', label: 'Services', sublabel: 'FastAPI · Nest · Express', kind: 'orchestrator', column: 2, row: 0 },
  { id: 'auth', label: 'AuthN / AuthZ', sublabel: 'JWT · OAuth', kind: 'tool', column: 2, row: 2 },
  { id: 'queue', label: 'Queue + workers', sublabel: 'retries, backoff, DLQ', kind: 'orchestrator', column: 3, row: 0 },
  { id: 'cache', label: 'Redis', sublabel: 'cache + pub/sub', kind: 'data', column: 3, row: 1 },
  { id: 'db', label: 'Postgres / Mongo', sublabel: 'system of record', kind: 'data', column: 4, row: 0 },
  { id: 'storage', label: 'S3 + CDN', sublabel: 'objects and media', kind: 'data', column: 4, row: 1 },
  { id: 'obs', label: 'Logs + metrics', sublabel: 'health and alerts', kind: 'data', column: 4, row: 2 },
];

const edges: DiagramEdge[] = [
  { from: 'client', to: 'gateway', label: 'https' },
  { from: 'client', to: 'socket', label: 'ws' },
  { from: 'gateway', to: 'services' },
  { from: 'socket', to: 'services' },
  { from: 'gateway', to: 'auth', label: 'verify', dashed: true },
  { from: 'services', to: 'queue', label: 'async work' },
  { from: 'services', to: 'db' },
  { from: 'services', to: 'cache' },
  { from: 'queue', to: 'db' },
  { from: 'cache', to: 'socket', label: 'fanout', dashed: true },
  { from: 'services', to: 'obs', label: 'spans', dashed: true },
];

const principles = [
  {
    title: 'APIs designed for change',
    body:
      'Every endpoint validates at the edge and fails with one consistent error contract, so a client never has to guess whether a 500 means bad input or a dead dependency. Versioning is planned before the first consumer, not retrofitted after the first break.',
    detail: 'Pydantic · class-validator · versioned REST · typed error contracts',
  },
  {
    title: 'Realtime that survives scale',
    body:
      'Sockets authenticate on handshake and join rooms scoped to what the user may see. Fanout across instances goes through Redis pub/sub instead of in-process state, and clients heartbeat and reconnect with backoff so a dropped connection recovers on its own.',
    detail: 'Socket.IO · MediaSoup · Redis pub/sub · heartbeat and reconnect',
  },
  {
    title: 'Built for the bad day',
    body:
      'Slow work goes behind a queue with retries, backoff and a dead-letter path. Handlers are idempotent so a retry cannot double-charge or double-send, timeouts are explicit at every hop, and structured logs make an incident readable instead of archaeological.',
    detail: 'Idempotent handlers · DLQ · explicit timeouts · structured logs',
  },
];

const runtimes = [
  {
    label: 'Python',
    items: ['FastAPI', 'Django', 'Pydantic', 'Async workers', 'LangChain / LangGraph'],
  },
  {
    label: 'Node.js',
    items: ['Express', 'NestJS', 'TypeScript', 'Prisma / Mongoose', 'Next route handlers'],
  },
  {
    label: 'Realtime',
    items: ['WebSockets', 'Socket.IO', 'MediaSoup', 'Redis pub/sub', 'Token streaming'],
  },
  {
    label: 'Cloud',
    items: ['AWS EC2', 'AWS S3', 'AWS Lambda', 'Docker', 'CI/CD + Nginx'],
  },
];

export default function BackendPlatform() {
  return (
    <section id="backend" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Backend and platform</p>
          <h2 className="section-heading mt-4">A model is only as good as the service around it.</h2>
          <p className="lede mt-5">
            Before the AI work, and underneath all of it, is ordinary hard engineering: request contracts,
            realtime transport, background jobs, data stores and deploys. I build that half in both
            runtimes, Python and Node, and I operate what I ship.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="mt-14 border-y py-8"
          style={{ borderColor: 'var(--line)' }}
        >
          <ArchitectureDiagram
            title="Reference backend architecture: clients, REST and WebSocket gateways, services, queue and workers, data stores and observability"
            nodes={nodes}
            edges={edges}
            caption="Dashed paths run outside the request: auth verification, Redis fanout back to connected sockets, and instrumentation that never blocks a response."
          />
        </motion.div>

        <div className="mt-16 grid gap-x-10 gap-y-12 md:grid-cols-3">
          {principles.map((principle, index) => (
            <motion.div
              key={principle.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="mono text-[11px] text-accent">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{principle.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{principle.body}</p>
              <p
                className="mono mt-4 border-t pt-3 text-[11px] leading-relaxed text-faint"
                style={{ borderColor: 'var(--line)' }}
              >
                {principle.detail}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.5 }}
          className="mt-16 border-t pt-10"
          style={{ borderColor: 'var(--line)' }}
        >
          <p className="mono text-[11px] uppercase tracking-[0.18em] text-faint">
            What I reach for
          </p>
          <div className="mt-6 grid gap-x-10 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {runtimes.map((runtime) => (
              <div key={runtime.label}>
                <h3 className="text-sm font-semibold text-ink">{runtime.label}</h3>
                <ul className="mono mt-3 space-y-1.5 text-[12px] text-muted">
                  {runtime.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
