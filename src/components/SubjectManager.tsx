import React, { useState } from 'react';
import { Subject, Chapter } from '@/types';

interface SubjectManagerProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

export default function SubjectManager({ subjects, setSubjects }: SubjectManagerProps) {
    const [newSubject, setNewSubject] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [newChapter, setNewChapter] = useState('');

    const handleAddSubject = () => {
        if (!newSubject.trim()) return;
        const subject: Subject = {
            id: Date.now().toString(),
            name: newSubject,
            chapters: []
        };
        setSubjects([...subjects, subject]);
        setNewSubject('');
    };

    const handleAddChapter = () => {
        if (!newChapter.trim() || !selectedSubjectId) return;

        setSubjects(subjects.map(sub => {
            if (sub.id === selectedSubjectId) {
                return {
                    ...sub,
                    chapters: [...sub.chapters, { id: Date.now().toString(), name: newChapter }]
                };
            }
            return sub;
        }));
        setNewChapter('');
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }} className="text-gradient">
                    Curriculum Management
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Organize your subjects and chapters structure
                </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '2rem' }}>
                {/* Add Subject Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle at 80% 20%, rgba(99, 102, 241, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📚</span> New Subject
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            placeholder="e.g. Computer Science"
                            style={{
                                flex: 1,
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                outline: 'none'
                            }}
                        />
                        <button className="btn btn-primary" onClick={handleAddSubject}>Add</button>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Active Subjects
                        </h4>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
                            {subjects.map(sub => (
                                <div key={sub.id} style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#818cf8',
                                    fontWeight: 500
                                }}>
                                    {sub.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Add Chapter Card */}
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '2rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--glass-border)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '150px',
                        height: '150px',
                        background: 'radial-gradient(circle at 80% 20%, rgba(236, 72, 153, 0.1) 0%, transparent 70%)',
                        pointerEvents: 'none'
                    }} />

                    <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1.5rem' }}>📑</span> New Chapter
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                        <select
                            value={selectedSubjectId}
                            onChange={(e) => setSelectedSubjectId(e.target.value)}
                            style={{
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(sub => (
                                <option key={sub.id} value={sub.id}>{sub.name}</option>
                            ))}
                        </select>

                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <input
                                type="text"
                                value={newChapter}
                                onChange={(e) => setNewChapter(e.target.value)}
                                placeholder="e.g. Introduction to Algorithms"
                                style={{
                                    flex: 1,
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <button
                                className="btn btn-primary"
                                onClick={handleAddChapter}
                                disabled={!selectedSubjectId}
                                style={{ opacity: !selectedSubjectId ? 0.5 : 1 }}
                            >
                                Add
                            </button>
                        </div>
                    </div>

                    <div>
                        <h4 style={{ marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            {subjects.find(s => s.id === selectedSubjectId)?.name
                                ? `Chapters in ${subjects.find(s => s.id === selectedSubjectId)?.name}`
                                : 'Select a subject to view chapters'}
                        </h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '200px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {subjects.find(s => s.id === selectedSubjectId)?.chapters.map(chap => (
                                <div key={chap.id} style={{
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.5rem'
                                }}>
                                    <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></span>
                                    {chap.name}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
