import React from 'react';

interface ComingSoonProps {
    title: string;
    description: string;
    icon: string;
}

export default function ComingSoon({ title, description, icon }: ComingSoonProps) {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            padding: '2rem'
        }}>
            <div style={{
                fontSize: '5rem',
                marginBottom: '2rem',
                animation: 'bounce 2s infinite'
            }}>
                {icon}
            </div>

            <h2 style={{
                fontSize: '3rem',
                fontWeight: '800',
                marginBottom: '1rem'
            }} className="text-gradient">
                Coming Soon
            </h2>

            <h3 style={{
                fontSize: '1.5rem',
                color: 'var(--text-primary)',
                marginBottom: '1rem'
            }}>
                {title}
            </h3>

            <p style={{
                color: 'var(--text-secondary)',
                maxWidth: '500px',
                lineHeight: 1.6,
                fontSize: '1.1rem'
            }}>
                {description}
            </p>

            <div style={{
                marginTop: '3rem',
                padding: '1rem 2rem',
                background: 'var(--bg-card)',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--glass-border)'
            }}>
                <p style={{ color: 'var(--text-accent)', fontWeight: 500 }}>
                    🔔 Get notified when this feature launches
                </p>
            </div>

            <style jsx>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
      `}</style>
        </div>
    );
}
