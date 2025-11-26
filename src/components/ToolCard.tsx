import React from 'react';
import { Tool } from '@/data/tools';

interface ToolCardProps {
    tool: Tool;
}

const ToolCard: React.FC<ToolCardProps> = ({ tool }) => {
    return (
        <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'var(--bg-card)',
                border: 'var(--glass-border)',
                borderRadius: 'var(--radius-md)',
                padding: '1.5rem',
                transition: 'all 0.3s ease',
                height: '100%',
                position: 'relative',
                overflow: 'hidden',
                backdropFilter: 'blur(10px)',
                boxShadow: 'var(--shadow-md)'
            }}
            className="tool-card"
        >
            <div style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '1rem'
            }}>
                <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: 'var(--radius-sm)',
                    background: 'var(--bg-secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginRight: '1rem',
                    overflow: 'hidden',
                    border: '1px solid var(--border-color)'
                }}>
                    {/* Using a colored placeholder if image fails or for design consistency */}
                    <div style={{
                        width: '100%',
                        height: '100%',
                        background: `linear-gradient(135deg, ${stringToColor(tool.name)} 0%, ${stringToColor(tool.category)} 100%)`,
                        opacity: 0.8
                    }} />
                </div>
                <div>
                    <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: 700,
                        color: 'var(--text-primary)',
                        marginBottom: '0.25rem'
                    }}>
                        {tool.name}
                    </h3>
                    <span style={{
                        fontSize: '0.875rem',
                        color: 'var(--text-accent)',
                        fontWeight: 500
                    }}>
                        {tool.category}
                    </span>
                </div>
            </div>

            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '0.95rem',
                lineHeight: 1.6,
                marginBottom: '1.5rem',
                flex: 1
            }}>
                {tool.description}
            </p>

            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                {tool.tags.map(tag => (
                    <span key={tag} style={{
                        fontSize: '0.75rem',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        background: 'rgba(56, 189, 248, 0.1)',
                        color: 'var(--text-accent)',
                        border: '1px solid rgba(56, 189, 248, 0.2)'
                    }}>
                        {tag}
                    </span>
                ))}
            </div>
        </a>
    );
};

// Helper to generate consistent colors from strings
function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
    return '#' + '00000'.substring(0, 6 - c.length) + c;
}

export default ToolCard;
