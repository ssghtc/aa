import React from 'react';

const Header = () => {
    return (
        <header style={{
            padding: '2rem 0',
            textAlign: 'center',
            marginBottom: '3rem',
            position: 'relative'
        }}>
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                width: '200px',
                height: '100px',
                background: 'var(--gradient-primary)',
                filter: 'blur(80px)',
                opacity: 0.5,
                zIndex: -1
            }} />
            <h1 style={{
                fontSize: '3.5rem',
                fontWeight: 800,
                marginBottom: '1rem',
                letterSpacing: '-0.02em',
                lineHeight: 1.1
            }}>
                Discover <span className="text-gradient">AI Tools</span>
            </h1>
            <p style={{
                color: 'var(--text-secondary)',
                fontSize: '1.2rem',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                Curated directory of the best artificial intelligence tools to supercharge your workflow.
            </p>
        </header>
    );
};

export default Header;
