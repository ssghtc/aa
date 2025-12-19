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
        { id: 'students', label: 'Students', icon: '👨‍🎓' },
        { id: 'webinars', label: 'Webinars', icon: '🎥' },
        { id: 'classes', label: 'Online Classes', icon: '🎓' },
        { id: 'preview', label: 'Preview', icon: '👁️' },
        { id: 'online-exam', label: 'Online Exam', icon: '📝', link: '/student' },
    ];

    return (
        <aside style={{
            width: '280px',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            background: 'linear-gradient(180deg, rgba(30, 41, 59, 0.98) 0%, rgba(15, 23, 42, 0.99) 100%)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.05)',
            boxShadow: '4px 0 24px rgba(0, 0, 0, 0.2)',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            zIndex: 100,
            transition: 'all 0.3s ease'
        }}>
            {/* Branding */}
            <div style={{ padding: '0 1rem', marginBottom: '1rem' }}>
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    marginBottom: '0.5rem'
                }}>
                    <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #a855f7 0%, #3b82f6 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        boxShadow: '0 0 15px rgba(168, 85, 247, 0.4)'
                    }}>
                        ⚡
                    </div>
                    <h1 style={{
                        fontSize: '1.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(to right, #fff, #94a3b8)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        letterSpacing: '-0.5px'
                    }}>
                        EduDash
                    </h1>
                </div>
                <p style={{
                    color: '#64748b',
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    paddingLeft: '3.5rem'
                }}>
                    Admin Console
                </p>
            </div>

            {/* Navigation */}
            <nav style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.5rem',
                flex: 1,
                overflowY: 'auto',
                paddingRight: '0.5rem'
            }}>
                {menuItems.map(item => {
                    const isActive = activeTab === item.id;
                    return (
                        <button
                            key={item.id}
                            onClick={() => {
                                if ((item as any).link) {
                                    window.open((item as any).link, '_blank');
                                } else {
                                    setActiveTab(item.id);
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '0.85rem 1rem',
                                background: isActive
                                    ? 'linear-gradient(90deg, rgba(168, 85, 247, 0.15) 0%, rgba(59, 130, 246, 0.05) 100%)'
                                    : 'transparent',
                                border: 'none',
                                borderRadius: '12px',
                                color: isActive ? '#fff' : '#94a3b8',
                                cursor: 'pointer',
                                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
                                textAlign: 'left',
                                fontSize: '0.95rem',
                                fontWeight: isActive ? 600 : 500,
                                borderLeft: isActive ? '3px solid #a855f7' : '3px solid transparent',
                                position: 'relative',
                                overflow: 'hidden'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.03)';
                                    e.currentTarget.style.color = '#e2e8f0';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.background = 'transparent';
                                    e.currentTarget.style.color = '#94a3b8';
                                }
                            }}
                        >
                            <span style={{
                                fontSize: '1.2rem',
                                filter: isActive ? 'drop-shadow(0 0 8px rgba(168, 85, 247, 0.5))' : 'none',
                                transition: 'filter 0.2s'
                            }}>
                                {item.icon}
                            </span>
                            {item.label}
                            {(item as any).link && (
                                <span style={{
                                    marginLeft: 'auto',
                                    fontSize: '0.8rem',
                                    opacity: 0.5
                                }}>↗</span>
                            )}
                        </button>
                    );
                })}
            </nav>

            {/* User Profile */}
            <div style={{
                marginTop: 'auto',
                padding: '1rem',
                background: 'rgba(255, 255, 255, 0.02)',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.05)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s'
            }}>
                <div style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '12px',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 'bold',
                    color: 'white',
                    boxShadow: '0 4px 12px rgba(6, 182, 212, 0.3)'
                }}>
                    A
                </div>
                <div style={{ overflow: 'hidden' }}>
                    <p style={{
                        fontWeight: 600,
                        color: '#fff',
                        fontSize: '0.9rem',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        Admin User
                    </p>
                    <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis'
                    }}>
                        admin@edu.com
                    </p>
                </div>
            </div>
        </aside>
    );
}
