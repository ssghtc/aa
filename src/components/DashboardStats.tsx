import React from 'react';
import { Question, Blog, Subject } from '@/types';

interface DashboardStatsProps {
    questions: Question[];
    blogs: Blog[];
    subjects: Subject[];
}

export default function DashboardStats({ questions, blogs, subjects }: DashboardStatsProps) {
    const singleChoiceCount = questions.filter(q => q.type === 'single').length;
    const multiChoiceCount = questions.filter(q => q.type === 'multiple').length;

    const stats = [
        { label: 'Total Questions', value: questions.length, color: '#818cf8', icon: '❓' },
        { label: 'Total Blogs', value: blogs.length, color: '#34d399', icon: '📝' },
        { label: 'Subjects', value: subjects.length, color: '#f472b6', icon: '📚' },
        { label: 'Active Students', value: '1,234', color: '#fbbf24', icon: '👥' },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <h2 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: '800' }} className="text-gradient">
                Dashboard Overview
            </h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '3rem' }}>
                Welcome back, Admin. Here's what's happening today.
            </p>

            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '3rem'
            }}>
                {stats.map((stat, index) => (
                    <div key={index} style={{
                        background: 'var(--bg-card)',
                        padding: '1.5rem',
                        borderRadius: 'var(--radius-lg)',
                        border: 'var(--glass-border)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1.5rem',
                        transition: 'transform 0.2s',
                        cursor: 'default'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{
                            width: '60px',
                            height: '60px',
                            borderRadius: '50%',
                            background: `${stat.color}20`,
                            color: stat.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.5rem'
                        }}>
                            {stat.icon}
                        </div>
                        <div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{stat.label}</p>
                            <p style={{ fontSize: '2rem', fontWeight: 'bold', lineHeight: 1 }}>{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--glass-border)',
                    minHeight: '300px'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Question Distribution</h3>
                    <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', height: '200px', justifyContent: 'center' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '10px solid #38bdf8',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#38bdf8',
                                marginBottom: '1rem'
                            }}>
                                {singleChoiceCount}
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>Single Choice</p>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{
                                width: '120px',
                                height: '120px',
                                borderRadius: '50%',
                                border: '10px solid #a855f7',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2rem',
                                fontWeight: 'bold',
                                color: '#a855f7',
                                marginBottom: '1rem'
                            }}>
                                {multiChoiceCount}
                            </div>
                            <p style={{ color: 'var(--text-secondary)' }}>Multiple Choice</p>
                        </div>
                    </div>
                </div>

                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--glass-border)'
                }}>
                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem' }}>Quick Actions</h3>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'flex-start', padding: '1rem' }}>
                            <span style={{ marginRight: '1rem' }}>➕</span> Add New Question
                        </button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'flex-start', padding: '1rem' }}>
                            <span style={{ marginRight: '1rem' }}>✍️</span> Write Blog Post
                        </button>
                        <button className="btn" style={{ background: 'rgba(255,255,255,0.05)', justifyContent: 'flex-start', padding: '1rem' }}>
                            <span style={{ marginRight: '1rem' }}>👤</span> Manage Users
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
