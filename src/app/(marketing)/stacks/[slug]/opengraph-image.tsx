import { ImageResponse } from 'next/og';
import { getStack } from '@/features/stacks/queries';

export const alt = 'Stack Details';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const stack = await getStack(slug);

  if (!stack) {
    return new ImageResponse(
      (
        <div
          style={{
            background: '#0a0a0c',
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#e8e8ed',
            fontSize: 48,
          }}
        >
          Stack not found
        </div>
      ),
      { ...size }
    );
  }

  const authorName = stack.user.display_name ?? stack.user.username ?? 'anon';
  const displayTitle = stack.title.length > 50 ? stack.title.slice(0, 50) + '...' : stack.title;
  
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0c',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#e8e8ed',
          border: '12px solid #141418',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
          <div style={{
            background: 'rgba(110, 231, 160, 0.15)',
            border: '2px solid rgba(110, 231, 160, 0.2)',
            padding: '8px 24px',
            borderRadius: '9999px',
            color: '#6ee7a0',
            fontSize: 24,
            fontWeight: 600,
            display: 'flex',
          }}>
            MCP Stacks
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', fontSize: 32, gap: '16px', color: '#8a8a9a' }}>
            {stack.vote_count} ⬆
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', flex: 1, justifyItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 72, fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', color: '#ffffff' }}>
            {displayTitle}
          </h1>
          
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', marginBottom: '40px' }}>
            {stack.servers.slice(0, 5).map(server => (
              <div key={server.name} style={{
                background: '#141418',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: 32,
                color: '#e8e8ed',
                display: 'flex',
              }}>
                {server.name}
              </div>
            ))}
            {stack.servers.length > 5 && (
              <div style={{
                background: '#141418',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                padding: '12px 24px',
                borderRadius: '16px',
                fontSize: 32,
                color: '#8a8a9a',
                display: 'flex',
              }}>
                +{stack.servers.length - 5} more
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', paddingTop: '40px' }}>
          {stack.user.avatar_url ? (
            <img 
              src={stack.user.avatar_url} 
              width={64} 
              height={64} 
              style={{ borderRadius: '32px', marginRight: '24px' }} 
            />
          ) : (
            <div style={{
              width: 64, 
              height: 64, 
              borderRadius: '32px', 
              background: '#141418', 
              marginRight: '24px',
              display: 'flex',
            }} />
          )}
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 24, color: '#8a8a9a' }}>Curated by</span>
            <span style={{ fontSize: 32, fontWeight: 600, color: '#e8e8ed' }}>{authorName}</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
