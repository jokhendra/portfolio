"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { expertiseGraph, focusAreas } from '@/data/profile';

const CLUSTER_X = [130, 400, 670, 940];
const NODE_Y = [64, 154, 244, 334];
const NODE_W = 168;
const NODE_H = 40;
const VIEW_W = 1070;
const VIEW_H = 420;

interface Placed {
  id: string;
  label: string;
  cluster: number;
  x: number;
  y: number;
}

const placed: Placed[] = expertiseGraph.clusters.flatMap((cluster, clusterIndex) =>
  cluster.nodes.map((node, nodeIndex) => ({
    id: node.id,
    label: node.label,
    cluster: clusterIndex,
    x: CLUSTER_X[clusterIndex],
    y: NODE_Y[nodeIndex],
  }))
);

const nodeMap = new Map(placed.map((node) => [node.id, node]));

/** Adjacency used to dim everything unrelated to the hovered node. */
const neighbours = new Map<string, Set<string>>();
for (const link of expertiseGraph.links) {
  if (!neighbours.has(link.from)) neighbours.set(link.from, new Set());
  if (!neighbours.has(link.to)) neighbours.set(link.to, new Set());
  neighbours.get(link.from)!.add(link.to);
  neighbours.get(link.to)!.add(link.from);
}

function linkPath(fromId: string, toId: string) {
  const from = nodeMap.get(fromId)!;
  const to = nodeMap.get(toId)!;

  if (from.cluster === to.cluster) {
    const x = from.x - NODE_W / 2 - 14;
    const y1 = from.y;
    const y2 = to.y;
    return `M ${from.x - NODE_W / 2} ${y1} C ${x - 26} ${y1}, ${x - 26} ${y2}, ${to.x - NODE_W / 2} ${y2}`;
  }

  const forward = to.cluster > from.cluster;
  const x1 = forward ? from.x + NODE_W / 2 : from.x - NODE_W / 2;
  const x2 = forward ? to.x - NODE_W / 2 : to.x + NODE_W / 2;
  const spansCluster = Math.abs(to.cluster - from.cluster) > 1;

  if (spansCluster) {
    const dip = VIEW_H - 26;
    return `M ${x1} ${from.y} C ${x1 + 90} ${dip}, ${x2 - 90} ${dip}, ${x2} ${to.y}`;
  }

  const mid = (x1 + x2) / 2;
  return `M ${x1} ${from.y} C ${mid} ${from.y}, ${mid} ${to.y}, ${x2} ${to.y}`;
}

export default function Expertise() {
  const reduceMotion = useReducedMotion();
  const [hovered, setHovered] = useState<string | null>(null);

  const isActive = (id: string) =>
    !hovered || hovered === id || neighbours.get(hovered)?.has(id) === true;

  const isLinkActive = (from: string, to: string) =>
    !hovered || hovered === from || hovered === to;

  return (
    <section id="expertise" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Expertise</p>
          <h2 className="section-heading mt-4">
            Retrieval, agents, and the systems that run them
          </h2>
          <p className="lede mt-5">
            Four capability areas, one system. Retrieval decides what is true, the graph decides what
            happens next, and the backend and platform underneath are what make either of them usable
            by real users at real volume.
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
          <div className="overflow-x-auto scrollbar-slim">
            <svg
              viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
              role="img"
              aria-label="Capability map linking GenAI, agentic, backend and platform skills"
              className="h-auto w-full"
              style={{ minWidth: 860 }}
            >
              {expertiseGraph.clusters.map((cluster, index) => (
                <text
                  key={cluster.id}
                  x={CLUSTER_X[index]}
                  y="22"
                  textAnchor="middle"
                  fontSize="11"
                  letterSpacing="2.6"
                  fontFamily="var(--font-mono), monospace"
                  fill="var(--ink-faint)"
                >
                  {cluster.label.toUpperCase()}
                </text>
              ))}

              {expertiseGraph.links.map((link, index) => {
                const active = isLinkActive(link.from, link.to);
                return (
                  <motion.path
                    key={`${link.from}-${link.to}`}
                    d={linkPath(link.from, link.to)}
                    fill="none"
                    stroke={hovered && active ? 'var(--accent)' : 'var(--line-strong)'}
                    strokeWidth={hovered && active ? 1.6 : 1}
                    initial={reduceMotion ? undefined : { pathLength: 0 }}
                    whileInView={reduceMotion ? undefined : { pathLength: 1 }}
                    viewport={{ once: true }}
                    animate={{ opacity: active ? 0.9 : 0.15 }}
                    transition={{ duration: 0.6, delay: index * 0.04 }}
                  />
                );
              })}

              {placed.map((node, index) => {
                const active = isActive(node.id);
                const focused = hovered === node.id;
                return (
                  <motion.g
                    key={node.id}
                    initial={reduceMotion ? undefined : { opacity: 0, y: 8 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    animate={{ opacity: active ? 1 : 0.28 }}
                    transition={{ duration: 0.35, delay: index * 0.03 }}
                    onMouseEnter={() => setHovered(node.id)}
                    onMouseLeave={() => setHovered(null)}
                    onFocus={() => setHovered(node.id)}
                    onBlur={() => setHovered(null)}
                    tabIndex={0}
                    style={{ cursor: 'default' }}
                  >
                    <rect
                      x={node.x - NODE_W / 2}
                      y={node.y - NODE_H / 2}
                      width={NODE_W}
                      height={NODE_H}
                      rx="3"
                      fill={focused ? 'var(--accent-soft)' : 'var(--surface)'}
                      stroke={focused ? 'var(--accent)' : 'var(--line-strong)'}
                      strokeWidth={focused ? 1.5 : 1}
                    />
                    <text
                      x={node.x}
                      y={node.y + 4.5}
                      textAnchor="middle"
                      fontSize="13"
                      fontFamily="var(--font-sans), sans-serif"
                      fill={focused ? 'var(--accent)' : 'var(--ink)'}
                    >
                      {node.label}
                    </text>
                  </motion.g>
                );
              })}
            </svg>
          </div>
          <p className="mono mt-4 text-[10px] uppercase tracking-[0.18em] text-faint">
            Hover a capability to trace how it connects
          </p>
        </motion.div>

        <div className="mt-16 grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
          {focusAreas.map((area, index) => (
            <motion.div
              key={area.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <span className="mono text-[11px] text-accent">0{index + 1}</span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{area.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{area.summary}</p>
              <p className="mono mt-4 border-t pt-3 text-[11px] leading-relaxed text-faint" style={{ borderColor: 'var(--line)' }}>
                {area.keywords.join(' · ')}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
