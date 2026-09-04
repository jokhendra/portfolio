import { ImageResponse } from 'next/og';
import { profile } from '@/data/profile';

/** Edge runtime: the Node build of @vercel/og cannot resolve Windows paths at build time. */
export const runtime = 'edge';

export const alt = `${profile.name} - ${profile.role}`;
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

/**
 * Generated at request time so the social card always matches the current
 * positioning in `profile.ts` - no stale exported asset to maintain.
 */
export default function OpengraphImage() {
  const ink = '#e8efec';
  const muted = '#96a3a0';
  const accent = '#45d6bc';
  const line = 'rgba(232, 239, 236, 0.14)';

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#090c0b',
          padding: '72px',
          position: 'relative',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `linear-gradient(to right, ${line} 1px, transparent 1px), linear-gradient(to bottom, ${line} 1px, transparent 1px)`,
            backgroundSize: '72px 72px',
            display: 'flex',
          }}
        />

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <div
            style={{
              width: 44,
              height: 44,
              border: `2px solid ${accent}`,
              color: accent,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 20,
              fontWeight: 700,
            }}
          >
            {profile.initials}
          </div>
          <div style={{ color: muted, fontSize: 22, letterSpacing: 4, textTransform: 'uppercase' }}>
            {profile.role}
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div style={{ color: ink, fontSize: 92, fontWeight: 700, lineHeight: 1, letterSpacing: -2 }}>
            {profile.name}
          </div>
          <div style={{ color: muted, fontSize: 34, lineHeight: 1.3, maxWidth: 900 }}>
            {profile.brandLine}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          {['LangGraph', 'RAG', 'MCP', 'FastAPI', 'NestJS', 'AWS'].map((item) => (
            <div
              key={item}
              style={{
                border: `1px solid ${line}`,
                color: ink,
                fontSize: 22,
                padding: '10px 18px',
                display: 'flex',
              }}
            >
              {item}
            </div>
          ))}
        </div>
      </div>
    ),
    size
  );
}
