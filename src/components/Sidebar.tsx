import React from 'react';

interface SidebarProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: '📊' },
        { id: 'questions', label: 'Questions', icon: '❓' },
        { id: 'clinical', label: 'Clinical Questions', icon: '🏥' },
        { id: 'blogs', label: 'Blogs', icon: '📝' },
        { id: 'subjects', label: 'Subjects', icon: '📚' },
        { id: 'webinars', label: 'Webinars', icon: '🎥' },
        { id: 'classes', label: 'Online Classes', icon: '🎓' },
        { id: 'preview', label: 'Preview', icon: '👁️' },
    ];

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'var(--bg-secondary)',
            borderRight: 'var(--glass-border)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            zIndex: 100
        }}>
            <div style={{ padding: '0 1rem' }}>
                <h1 className="text-gradient" style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                    EduDash
                </h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                    Admin Control Panel
                </p>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1rem',
                            padding: '1rem',
                            background: activeTab === item.id ? 'var(--gradient-primary)' : 'transparent',
                            border: 'none',
                            borderRadius: 'var(--radius-md)',
                            color: activeTab === item.id ? 'white' : 'var(--text-secondary)',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            textAlign: 'left',
                            fontSize: '1rem',
                            fontWeight: 500,
                            boxShadow: activeTab === item.id ? 'var(--shadow-glow)' : 'none'
                        }}
                        onMouseEnter={(e) => {
                            if (activeTab !== item.id) {
                                e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                e.currentTarget.style.color = 'var(--text-primary)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (activeTab !== item.id) {
                                e.currentTarget.style.background = 'transparent';
                                e.currentTarget.style.color = 'var(--text-secondary)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '1.25rem' }}>{item.icon}</span>
                        {item.label}
                    </button>
                ))}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', borderTop: 'var(--glass-border)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        background: 'var(--gradient-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 'bold',
                        color: 'white'
                    }}>
                        A
                    </div>
                    <div>
                        <p style={{ fontWeight: 600 }}>Admin User</p>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>admin@edu.com</p>
                    </div>
                </div>
            </div>
        </aside>
    );
}
