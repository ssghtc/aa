import React, { useState } from 'react';
import { Blog } from '@/types';

interface BlogManagerProps {
    blogs: Blog[];
    setBlogs: React.Dispatch<React.SetStateAction<Blog[]>>;
}

export default function BlogManager({ blogs, setBlogs }: BlogManagerProps) {
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');

    const handleAddBlog = () => {
        if (!title || !content) return;

        const newBlog: Blog = {
            id: Date.now().toString(),
            title,
            content,
            author: 'Admin',
            date: new Date().toLocaleDateString()
        };

        setBlogs([newBlog, ...blogs]);
        setTitle('');
        setContent('');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }} className="text-gradient">
                    Blog Management
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Publish articles and updates for your students
                </p>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--glass-border)',
                marginBottom: '3rem',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '200px',
                    height: '200px',
                    background: 'radial-gradient(circle at 70% 30%, rgba(52, 211, 153, 0.1) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ background: 'var(--gradient-primary)', width: '8px', height: '32px', borderRadius: '4px', display: 'block' }}></span>
                    Write New Article
                </h3>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter article title..."
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            fontSize: '1.1rem',
                            fontWeight: 500,
                            outline: 'none'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Content</label>
                    <textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        rows={12}
                        placeholder="Write your content here..."
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            resize: 'vertical',
                            fontFamily: 'inherit',
                            lineHeight: 1.6,
                            outline: 'none'
                        }}
                    />
                </div>

                <button className="btn btn-primary" style={{ padding: '1rem 2rem', fontSize: '1.1rem' }} onClick={handleAddBlog}>
                    Publish Article
                </button>
            </div>

            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Recent Articles</h3>
            <div style={{ display: 'grid', gap: '1.5rem' }}>
                {blogs.map(blog => (
                    <div key={blog.id} style={{
                        padding: '2rem',
                        background: 'var(--bg-card)',
                        borderRadius: 'var(--radius-lg)',
                        border: 'var(--glass-border)',
                        transition: 'transform 0.2s ease',
                        cursor: 'pointer'
                    }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{blog.title}</h3>
                            <span style={{
                                color: 'var(--text-secondary)',
                                fontSize: '0.85rem',
                                padding: '0.25rem 0.75rem',
                                background: 'rgba(255,255,255,0.05)',
                                borderRadius: '20px'
                            }}>{blog.date}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {blog.content}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}
