import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const size = {
  width: 32,
  height: 32,
};

export const contentType = 'image/png';

/** Browser tab favicon — JP monogram on the site accent. */
export default function Icon() {
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
          fontSize: 16,
          fontWeight: 700,
          letterSpacing: '-0.04em',
          fontFamily: 'ui-sans-serif, system-ui, sans-serif',
        }}
      >
        JP
      </div>
    ),
    { ...size }
  );
}
