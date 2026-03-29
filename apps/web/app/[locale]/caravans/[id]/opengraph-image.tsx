import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'كرفاني';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { id: string; locale: string } }) {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #4A5D3A 0%, #3A4A2E 50%, #2D2D2D 100%)',
          fontFamily: 'IBM Plex Sans Arabic, Arial',
          direction: 'rtl',
        }}
      >
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '60px',
          }}
        >
          <div style={{ fontSize: 80, marginBottom: 20 }}>🏕️</div>
          <div
            style={{
              fontSize: 48,
              fontWeight: 700,
              color: 'white',
              textAlign: 'center',
              marginBottom: 16,
            }}
          >
            كرفان عائلي فاخر
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              marginBottom: 24,
            }}
          >
            <div style={{ fontSize: 32, color: '#D4A574', fontWeight: 700 }}>
              1,200 ر.س / ليلة
            </div>
            <div style={{ fontSize: 24, color: '#E8CDB0' }}>⭐ 4.8</div>
          </div>
          <div style={{ fontSize: 20, color: '#E8CDB0', opacity: 0.8 }}>الرياض</div>
          <div
            style={{
              position: 'absolute',
              bottom: 40,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ fontSize: 28, fontWeight: 700, color: '#C67B3C' }}>كرفاني</div>
            <div style={{ fontSize: 16, color: '#E8CDB0' }}>karfani.sa</div>
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
