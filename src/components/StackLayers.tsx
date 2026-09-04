"use client";

import { motion } from 'framer-motion';
import { stackLayers } from '@/data/profile';

export default function StackLayers() {
  return (
    <section id="stack" className="section-band py-20 sm:py-28">
      <div className="page-shell">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl"
        >
          <p className="eyebrow">Stack</p>
          <h2 className="section-heading mt-4">Organised by the job each layer does</h2>
          <p className="lede mt-5">
            Tools listed by where they sit in a system rather than as a percentage score. If it is on this
            list, I have shipped something with it.
          </p>
        </motion.div>

        <div className="mt-14">
          {stackLayers.map((layer, index) => (
            <motion.div
              key={layer.layer}
              initial={{ opacity: 0, y: 14 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: index * 0.06 }}
              className="grid gap-4 border-t py-6 last:border-b lg:grid-cols-[16rem_1fr] lg:gap-10"
              style={{ borderColor: 'var(--line)' }}
            >
              <div>
                <div className="flex items-baseline gap-3">
                  <span className="mono text-[11px] text-accent">0{index + 1}</span>
                  <h3 className="text-lg font-semibold text-ink">{layer.layer}</h3>
                </div>
                <p className="mt-1 pl-8 text-xs leading-relaxed text-faint">{layer.role}</p>
              </div>
              <ul className="flex flex-wrap gap-2">
                {layer.items.map((item) => (
                  <li key={item} className="tag">
                    {item}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
