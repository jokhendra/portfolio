import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 180,
  height: 180,
};

export const contentType = 'image/png';

/** Apple touch / home-screen icon. */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0b6e63',
          color: '#ffffff',
          fontSize: 84,
          fontWeight: 700,
          letterSpacing: '-0.05em',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
          borderRadius: 36,
        }}
      >
        JP
      </div>
    ),
    { ...size }
  );
}
