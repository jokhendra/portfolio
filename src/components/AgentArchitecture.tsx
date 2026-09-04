"use client";

import { motion } from 'framer-motion';
import ArchitectureDiagram from './ArchitectureDiagram';
import type { DiagramEdge, DiagramNode } from '@/types/project';

/** The reference shape I reuse across agent projects: one brain, isolated hands. */
const nodes: DiagramNode[] = [
  { id: 'ui', label: 'Product UI', sublabel: 'streaming client', kind: 'client', column: 0, row: 0 },
  { id: 'api', label: 'API layer', sublabel: 'FastAPI or Next', kind: 'api', column: 1, row: 0 },
  { id: 'memory', label: 'Checkpointer', sublabel: 'per-thread state', kind: 'data', column: 1, row: 2 },
  { id: 'router', label: 'Intent router', sublabel: 'small fast model', kind: 'orchestrator', column: 2, row: 0 },
  { id: 'direct', label: 'Direct answer', sublabel: 'no tools needed', kind: 'model', column: 2, row: 2 },
  { id: 'toolnode', label: 'Tool node', sublabel: 'retry + fallback', kind: 'orchestrator', column: 3, row: 0 },
  { id: 'retrieve', label: 'Retrieval', sublabel: 'hybrid search', kind: 'tool', column: 3, row: 1 },
  { id: 'mcp', label: 'MCP servers', sublabel: 'typed tools', kind: 'tool', column: 4, row: 0 },
  { id: 'store', label: 'Vector + SQL', sublabel: 'grounding data', kind: 'data', column: 4, row: 1 },
  { id: 'traces', label: 'Traces + evals', sublabel: 'offline and live', kind: 'data', column: 4, row: 2 },
];

const edges: DiagramEdge[] = [
  { from: 'ui', to: 'api', label: 'turn' },
  { from: 'api', to: 'router' },
  { from: 'api', to: 'memory', label: 'checkpoint', dashed: true },
  { from: 'router', to: 'toolnode', label: 'task intent' },
  { from: 'router', to: 'direct', label: 'chitchat', dashed: true },
  { from: 'toolnode', to: 'mcp', label: 'tool call' },
  { from: 'toolnode', to: 'retrieve' },
  { from: 'retrieve', to: 'store' },
  { from: 'toolnode', to: 'traces', label: 'spans', dashed: true },
];

const principles = [
  {
    title: 'State, not chat history',
    body:
      'A graph carries typed state between nodes and checkpoints it per thread. Retries resume where they failed instead of replaying an entire conversation, and you can inspect exactly what the agent believed at each step.',
    detail: 'LangGraph StateGraph · conditional edges · checkpointed threads',
  },
  {
    title: 'Tools behind a boundary',
    body:
      'The model never holds credentials or raw system access. Tools are declared with typed inputs and executed behind MCP or equivalent server boundaries, so the same toolset is reusable across agents and auditable per call.',
    detail: 'MCP servers · typed tool schemas · no credentials in prompts',
  },
  {
    title: 'Failure is a routed path',
    body:
      'Tool timeouts and bad arguments are expected inputs, not exceptions. Each tool node has a fallback so the graph answers with whatever succeeded and states plainly what it could not fetch.',
    detail: 'Fallback nodes · typed errors · partial answers over stack traces',
  },
];

export default function AgentArchitecture() {
  return (
    <section id="agents" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">How I build agents</p>
          <h2 className="section-heading mt-4">LangGraph is the brain. MCP is the hands.</h2>
          <p className="lede mt-5">
            Separating orchestration from execution is what moves an agent past the demo stage. The graph
            decides; tools do the work behind an explicit boundary; every step is traceable.
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
            title="Reference agent architecture: UI, API, router, tool node, MCP servers and data stores"
            nodes={nodes}
            edges={edges}
            caption="Dashed paths are conditional: cheap turns skip tool execution entirely, and instrumentation runs alongside rather than inside the request path."
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
              <p className="mono mt-4 border-t pt-3 text-[11px] leading-relaxed text-faint" style={{ borderColor: 'var(--line)' }}>
                {principle.detail}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
