import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Student } from '@/types';

export default function StudentManager() {
    const [students, setStudents] = useState<Student[]>([]);
    const [newStudentName, setNewStudentName] = useState('');
    const [newStudentEmail, setNewStudentEmail] = useState('');
    const [newStudentPassword, setNewStudentPassword] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStudents();
    }, []);

    const fetchStudents = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .order('created_at', { ascending: false });

            if (error) throw error;
            if (data) setStudents(data);
        } catch (error) {
            console.error('Error fetching students:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddStudent = async () => {
        if (!newStudentName.trim() || !newStudentEmail.trim() || !newStudentPassword.trim()) {
            alert('Please provide name, email, and password');
            return;
        }

        try {
            const { data, error } = await supabase
                .from('students')
                .insert([{
                    name: newStudentName,
                    email: newStudentEmail,
                    password: newStudentPassword
                }])
                .select()
                .single();

            if (error) throw error;

            if (data) {
                setStudents([data, ...students]);
                setNewStudentName('');
                setNewStudentEmail('');
                setNewStudentPassword('');
            }
        } catch (error: any) {
            console.error('Error adding student:', error);
            alert('Error adding student: ' + error.message);
        }
    };

    const handleDeleteStudent = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const { error } = await supabase
                .from('students')
                .delete()
                .eq('id', id);

            if (error) throw error;

            setStudents(students.filter(s => s.id !== id));
        } catch (error: any) {
            console.error('Error deleting student:', error);
            alert('Error deleting student: ' + error.message);
        }
    };

    return (
        <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ marginBottom: '3rem' }}>
                <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }} className="text-gradient">
                    Student Management
                </h2>
                <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                    Manage student profiles and access
                </p>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--glass-border)',
                marginBottom: '2rem'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Add New Student</h3>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <input
                        type="text"
                        placeholder="Student Name"
                        value={newStudentName}
                        onChange={(e) => setNewStudentName(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="email"
                        placeholder="Email Address"
                        value={newStudentEmail}
                        onChange={(e) => setNewStudentEmail(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <input
                        type="text"
                        placeholder="Password"
                        value={newStudentPassword}
                        onChange={(e) => setNewStudentPassword(e.target.value)}
                        style={{
                            flex: 1,
                            minWidth: '200px',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            outline: 'none'
                        }}
                    />
                    <button className="btn btn-primary" onClick={handleAddStudent}>Add Student</button>
                </div>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                padding: '2rem',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--glass-border)'
            }}>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.25rem', fontWeight: 600 }}>Registered Students ({students.length})</h3>

                {loading ? (
                    <p style={{ color: 'var(--text-secondary)' }}>Loading students...</p>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {students.length === 0 ? (
                            <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic' }}>No students registered yet.</p>
                        ) : (
                            students.map(student => (
                                <div key={student.id} style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div>
                                        <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{student.name}</div>
                                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{student.email}</div>
                                    </div>
                                    <button
                                        onClick={() => handleDeleteStudent(student.id)}
                                        style={{
                                            background: 'rgba(239, 68, 68, 0.1)',
                                            color: '#ef4444',
                                            border: 'none',
                                            padding: '0.5rem 1rem',
                                            borderRadius: '6px',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.2)'}
                                        onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)'}
                                    >
                                        Delete
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
