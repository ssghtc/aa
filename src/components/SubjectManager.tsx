import React, { useState } from 'react';
import { Subject, Chapter } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface SubjectManagerProps {
    subjects: Subject[];
    setSubjects: React.Dispatch<React.SetStateAction<Subject[]>>;
}

export default function SubjectManager({ subjects, setSubjects }: SubjectManagerProps) {
    const [editingSubject, setEditingSubject] = useState<{ id: string, name: string } | null>(null);
    const [editingChapter, setEditingChapter] = useState<{ id: string, name: string } | null>(null);
    const [newSubject, setNewSubject] = useState('');
    const [selectedSubjectId, setSelectedSubjectId] = useState<string>('');
    const [newChapter, setNewChapter] = useState('');

    const handleAddSubject = async () => {
        if (!newSubject.trim()) return;

        try {
            const { data, error } = await supabase
                .from('subjects')
                .insert([{ name: newSubject }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                const subject: Subject = {
                    id: data.id,
                    name: data.name,
                    chapters: []
                };
                setSubjects([...subjects, subject]);
                setNewSubject('');
            }
        } catch (error: any) {
            console.error('Error adding subject:', error);
            alert('Error adding subject: ' + error.message);
        }
    };

    const handleUpdateSubject = async () => {
        if (!editingSubject || !editingSubject.name.trim()) return;

        try {
            const { error } = await supabase
                .from('subjects')
                .update({ name: editingSubject.name })
                .eq('id', editingSubject.id);

            if (error) throw error;

            setSubjects(subjects.map(sub =>
                sub.id === editingSubject.id ? { ...sub, name: editingSubject.name } : sub
            ));
            setEditingSubject(null);
        } catch (error: any) {
            console.error('Error updating subject:', error);
            alert('Error updating subject: ' + error.message);
        }
    };

    const handleDeleteSubject = async (id: string) => {
        if (!confirm('Are you sure you want to delete this subject? All associated chapters and questions will be deleted.')) return;

        try {
            const { error } = await supabase
                .from('subjects')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setSubjects(subjects.filter(sub => sub.id !== id));
            if (selectedSubjectId === id) setSelectedSubjectId('');
        } catch (error: any) {
            console.error('Error deleting subject:', error);
            alert('Error deleting subject: ' + error.message);
        }
    };

    const handleAddChapter = async () => {
        if (!newChapter.trim() || !selectedSubjectId) return;

        try {
            const { data, error } = await supabase
                .from('chapters')
                .insert([{ name: newChapter, subject_id: selectedSubjectId }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setSubjects(subjects.map(sub => {
                    if (sub.id === selectedSubjectId) {
                        return {
                            ...sub,
                            chapters: [...sub.chapters, { id: data.id, name: data.name }]
                        };
                    }
                    return sub;
                }));
                // Reset chapter input but keep subject selected
                setNewChapter('');
            }
        } catch (error: any) {
            console.error('Error adding chapter:', error);
            alert('Error adding chapter: ' + error.message);
        }
    };

    const handleUpdateChapter = async () => {
        if (!editingChapter || !editingChapter.name.trim() || !selectedSubjectId) return;

        try {
            const { error } = await supabase
                .from('chapters')
                .update({ name: editingChapter.name })
                .eq('id', editingChapter.id);

            if (error) throw error;

            setSubjects(subjects.map(sub => {
                if (sub.id === selectedSubjectId) {
                    return {
                        ...sub,
                        chapters: sub.chapters.map(chap =>
                            chap.id === editingChapter.id ? { ...chap, name: editingChapter.name } : chap
                        )
                    };
                }
                return sub;
            }));
            setEditingChapter(null);
        } catch (error: any) {
            console.error('Error updating chapter:', error);
            alert('Error updating chapter: ' + error.message);
        }
    };

    const handleDeleteChapter = async (chapterId: string) => {
        if (!confirm('Are you sure you want to delete this chapter?')) return;

        try {
            const { error } = await supabase
                .from('chapters')
                .delete()
                .eq('id', chapterId);

            if (error) throw error;

            setSubjects(subjects.map(sub => {
                if (sub.id === selectedSubjectId) {
                    return {
                        ...sub,
                        chapters: sub.chapters.filter(chap => chap.id !== chapterId)
                    };
                }
                return sub;
            }));
        } catch (error: any) {
            console.error('Error deleting chapter:', error);
            alert('Error deleting chapter: ' + error.message);
        }
    };

    const handleAddOrUpdateSubjectEnterData = (e: any) => {
        if (e.key === 'Enter') {
            if (editingSubject) {
                handleUpdateSubject();
            } else {
                handleAddSubject();
            }
        }
    }

    const handleAddOrUpdateChapterEnterData = (e: any) => {
        if (e.key === 'Enter') {
            if (editingChapter) {
                handleUpdateChapter();
            } else {
                handleAddChapter();
            }
        }
    }

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
                {/* Manage Subjects Card */}
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
                        <span style={{ fontSize: '1.5rem' }}>📚</span> Manage Subjects
                    </h3>

                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        <input
                            type="text"
                            value={newSubject}
                            onChange={(e) => setNewSubject(e.target.value)}
                            onKeyDown={handleAddOrUpdateSubjectEnterData}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                            {subjects.map(sub => (
                                <div key={sub.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 1rem',
                                    background: 'rgba(99, 102, 241, 0.1)',
                                    border: '1px solid rgba(99, 102, 241, 0.2)',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#818cf8'
                                }}>
                                    {editingSubject?.id === sub.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                            <input
                                                type="text"
                                                value={editingSubject.name}
                                                onChange={(e) => setEditingSubject({ ...editingSubject, name: e.target.value })}
                                                onKeyDown={handleAddOrUpdateSubjectEnterData}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'white',
                                                    outline: 'none'
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleUpdateSubject}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}
                                                title="Save"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={() => setEditingSubject(null)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                                title="Cancel"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <span style={{ fontWeight: 500 }}>{sub.name}</span>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setEditingSubject({ id: sub.id, name: sub.name })}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteSubject(sub.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem' }}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Manage Chapters Card */}
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
                        <span style={{ fontSize: '1.5rem' }}>📑</span> Manage Chapters
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
                                onKeyDown={handleAddOrUpdateChapterEnterData}
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
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '400px', overflowY: 'auto', paddingRight: '0.5rem' }}>
                            {subjects.find(s => s.id === selectedSubjectId)?.chapters.map(chap => (
                                <div key={chap.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 'var(--radius-sm)',
                                    color: 'var(--text-secondary)'
                                }}>
                                    {editingChapter?.id === chap.id ? (
                                        <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                                            <input
                                                type="text"
                                                value={editingChapter.name}
                                                onChange={(e) => setEditingChapter({ ...editingChapter, name: e.target.value })}
                                                onKeyDown={handleAddOrUpdateChapterEnterData}
                                                style={{
                                                    flex: 1,
                                                    padding: '0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    background: 'var(--bg-secondary)',
                                                    border: '1px solid var(--border-color)',
                                                    color: 'white',
                                                    outline: 'none'
                                                }}
                                                autoFocus
                                            />
                                            <button
                                                onClick={handleUpdateChapter}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--success)' }}
                                                title="Save"
                                            >
                                                ✅
                                            </button>
                                            <button
                                                onClick={() => setEditingChapter(null)}
                                                style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)' }}
                                                title="Cancel"
                                            >
                                                ❌
                                            </button>
                                        </div>
                                    ) : (
                                        <>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-secondary)' }}></span>
                                                {chap.name}
                                            </div>
                                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                                <button
                                                    onClick={() => setEditingChapter({ id: chap.id, name: chap.name })}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }}
                                                    title="Edit"
                                                >
                                                    ✏️
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteChapter(chap.id)}
                                                    style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', opacity: 0.7 }}
                                                    title="Delete"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
