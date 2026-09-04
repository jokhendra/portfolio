"use client";

import { motion, useReducedMotion } from 'framer-motion';
import type { DiagramEdge, DiagramNode, DiagramNodeKind } from '@/types/project';

const NODE_W = 150;
const NODE_H = 58;
const COL_GAP = 74;
const ROW_GAP = 24;
const PAD = 8;

const kindStyle: Record<DiagramNodeKind, { stroke: string; fill: string; dashed?: boolean; accent?: boolean }> = {
  client: { stroke: 'var(--line-strong)', fill: 'var(--surface)' },
  api: { stroke: 'var(--line-strong)', fill: 'var(--bg-elevated)' },
  orchestrator: { stroke: 'var(--accent)', fill: 'var(--accent-soft)', accent: true },
  tool: { stroke: 'var(--line-strong)', fill: 'var(--surface)' },
  data: { stroke: 'var(--line-strong)', fill: 'var(--bg-elevated)', dashed: true },
  model: { stroke: 'var(--accent-line)', fill: 'var(--surface)' },
};

const legend: Array<{ kind: DiagramNodeKind; label: string }> = [
  { kind: 'orchestrator', label: 'Orchestration' },
  { kind: 'tool', label: 'Tool' },
  { kind: 'data', label: 'Data store' },
  { kind: 'model', label: 'Model' },
];

interface Props {
  nodes: DiagramNode[];
  edges: DiagramEdge[];
  caption?: string;
  /** Rendered above the diagram as its accessible description. */
  title: string;
  showLegend?: boolean;
}

export default function ArchitectureDiagram({ nodes, edges, caption, title, showLegend = true }: Props) {
  const reduceMotion = useReducedMotion();

  const columns = Math.max(...nodes.map((node) => node.column)) + 1;
  const rows = Math.max(...nodes.map((node) => node.row)) + 1;
  const width = (columns - 1) * (NODE_W + COL_GAP) + NODE_W + PAD * 2;
  const height = (rows - 1) * (NODE_H + ROW_GAP) + NODE_H + PAD * 2;

  const position = (node: DiagramNode) => ({
    x: PAD + node.column * (NODE_W + COL_GAP),
    y: PAD + node.row * (NODE_H + ROW_GAP),
  });

  const byId = new Map(nodes.map((node) => [node.id, node]));

  return (
    <figure className="w-full">
      <div className="overflow-x-auto scrollbar-slim">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          width={width}
          height={height}
          role="img"
          aria-label={title}
          className="h-auto w-full"
          style={{ minWidth: Math.min(width, 660) }}
        >
          <defs>
            <marker id="arrow-head" viewBox="0 0 8 8" refX="7" refY="4" markerWidth="7" markerHeight="7" orient="auto">
              <path d="M 0 1 L 7 4 L 0 7 z" fill="var(--line-strong)" />
            </marker>
          </defs>

          {edges.map((edge, index) => {
            const from = byId.get(edge.from);
            const to = byId.get(edge.to);
            if (!from || !to) return null;

            const a = position(from);
            const b = position(to);
            let path: string;
            let labelX: number;
            let labelY: number;

            if (to.column > from.column) {
              const x1 = a.x + NODE_W;
              const y1 = a.y + NODE_H / 2;
              const x2 = b.x;
              const y2 = b.y + NODE_H / 2;
              const mid = (x1 + x2) / 2;
              path = `M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`;
              labelX = mid;
              labelY = (y1 + y2) / 2 - 8;
            } else if (to.column === from.column) {
              const x1 = a.x + NODE_W / 2;
              const y1 = a.y + NODE_H;
              const x2 = b.x + NODE_W / 2;
              const y2 = b.y;
              path = `M ${x1} ${y1} L ${x2} ${y2}`;
              labelX = x1;
              labelY = (y1 + y2) / 2;
            } else {
              // Feedback edge: route underneath so it never crosses the forward path.
              const x1 = a.x + NODE_W / 2;
              const y1 = a.y + NODE_H;
              const x2 = b.x + NODE_W / 2;
              const y2 = b.y + NODE_H;
              const dip = Math.max(y1, y2) + 26;
              path = `M ${x1} ${y1} C ${x1} ${dip}, ${x2} ${dip}, ${x2} ${y2}`;
              labelX = (x1 + x2) / 2;
              labelY = dip + 2;
            }

            return (
              <g key={`${edge.from}-${edge.to}-${index}`}>
                <motion.path
                  d={path}
                  fill="none"
                  stroke="var(--line-strong)"
                  strokeWidth="1.25"
                  strokeDasharray={edge.dashed ? '4 4' : undefined}
                  markerEnd="url(#arrow-head)"
                  initial={reduceMotion ? undefined : { pathLength: 0, opacity: 0 }}
                  whileInView={reduceMotion ? undefined : { pathLength: 1, opacity: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: 0.15 + index * 0.06 }}
                />
                {edge.label && (
                  <text
                    x={labelX}
                    y={labelY}
                    textAnchor="middle"
                    fontSize="9.5"
                    fontFamily="var(--font-mono), monospace"
                    fill="var(--ink-faint)"
                  >
                    {edge.label}
                  </text>
                )}
              </g>
            );
          })}

          {nodes.map((node, index) => {
            const { x, y } = position(node);
            const style = kindStyle[node.kind];
            return (
              <motion.g
                key={node.id}
                initial={reduceMotion ? undefined : { opacity: 0, y: 6 }}
                whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.35, delay: index * 0.05 }}
              >
                <rect
                  x={x}
                  y={y}
                  width={NODE_W}
                  height={NODE_H}
                  rx="3"
                  fill={style.fill}
                  stroke={style.stroke}
                  strokeWidth={style.accent ? 1.5 : 1}
                  strokeDasharray={style.dashed ? '5 3' : undefined}
                />
                <text
                  x={x + 14}
                  y={node.sublabel ? y + 25 : y + NODE_H / 2 + 4}
                  fontSize="12.5"
                  fontWeight="500"
                  fontFamily="var(--font-sans), sans-serif"
                  fill={style.accent ? 'var(--accent)' : 'var(--ink)'}
                >
                  {node.label}
                </text>
                {node.sublabel && (
                  <text
                    x={x + 14}
                    y={y + 41}
                    fontSize="10"
                    fontFamily="var(--font-mono), monospace"
                    fill="var(--ink-faint)"
                  >
                    {node.sublabel}
                  </text>
                )}
              </motion.g>
            );
          })}
        </svg>
      </div>

      {(showLegend || caption) && (
        <figcaption className="mt-4 flex flex-col gap-3 border-t pt-3 sm:flex-row sm:items-start sm:justify-between" style={{ borderColor: 'var(--line)' }}>
          {caption && <p className="max-w-xl text-sm text-muted">{caption}</p>}
          {showLegend && (
            <ul className="flex flex-wrap items-center gap-x-4 gap-y-2">
              {legend.map((item) => {
                const style = kindStyle[item.kind];
                return (
                  <li key={item.kind} className="mono flex items-center gap-2 text-[10px] uppercase tracking-wider text-faint">
                    <span
                      className="inline-block h-2.5 w-4"
                      style={{
                        background: style.fill,
                        border: `1px ${style.dashed ? 'dashed' : 'solid'} ${style.stroke}`,
                      }}
                    />
                    {item.label}
                  </li>
                );
              })}
              <li className="mono flex items-center gap-2 text-[10px] uppercase tracking-wider text-faint">
                <span className="inline-block w-4 border-t border-dashed" style={{ borderColor: 'var(--line-strong)' }} />
                Conditional path
              </li>
            </ul>
          )}
        </figcaption>
      )}
    </figure>
  );
}
