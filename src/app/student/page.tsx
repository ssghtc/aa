'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Subject, Chapter, Question } from '@/types';
import styles from './student.module.css';

interface ExamState {
    status: 'login' | 'setup' | 'taking' | 'result';
    studentName: string;
    studentId: string;
    studentEmail: string;
    selectedSubject: string;
    selectedChapter: string;
    questions: Question[];
    answers: Record<string, any>;
    score: number;
}

export default function StudentPortal() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [examState, setExamState] = useState<ExamState>({
        status: 'login',
        studentName: '',
        studentId: '',
        studentEmail: '',
        selectedSubject: '',
        selectedChapter: '',
        questions: [],
        answers: {},
        score: 0
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchSubjects();
    }, []);

    const fetchSubjects = async () => {
        const { data } = await supabase.from('subjects').select('*, chapters(*)');
        if (data) setSubjects(data);
    };

    const handleLogin = async () => {
        if (!email.trim() || !password.trim()) {
            alert('Please enter email and password');
            return;
        }

        setLoading(true);
        try {
            const { data, error } = await supabase
                .from('students')
                .select('*')
                .eq('email', email)
                .eq('password', password) // Note: In production, hash passwords!
                .single();

            if (error || !data) {
                alert('Invalid credentials');
            } else {
                setExamState({
                    ...examState,
                    status: 'setup',
                    studentId: data.id,
                    studentName: data.name,
                    studentEmail: data.email
                });
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const startExam = async () => {
        if (!examState.selectedSubject || !examState.selectedChapter) {
            alert('Please select subject and chapter');
            return;
        }

        setLoading(true);
        try {
            const { data } = await supabase
                .from('questions')
                .select('*')
                .eq('chapter_id', examState.selectedChapter);

            if (data && data.length > 0) {
                // Map DB fields to types
                const formattedQuestions = data.map(q => ({
                    id: q.id,
                    type: q.type,
                    text: q.text,
                    options: q.options || [],
                    correctOptions: q.correct_options || [],
                    subjectId: q.subject_id,
                    chapterId: q.chapter_id,
                    // Map other fields as necessary
                }));

                setExamState({
                    ...examState,
                    status: 'taking',
                    questions: formattedQuestions
                });
            } else {
                alert('No questions found for this chapter.');
            }
        } catch (error) {
            console.error('Error starting exam:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitExam = () => {
        let score = 0;
        examState.questions.forEach(q => {
            const answer = examState.answers[q.id];
            // Simple scoring for single choice for now
            if (q.type === 'single') {
                if (q.correctOptions && q.correctOptions.includes(answer)) {
                    score++;
                }
            } else if (q.type === 'multiple' || q.type === 'sata') {
                const correct = q.correctOptions ? q.correctOptions.sort().toString() : '';
                const student = answer ? answer.sort().toString() : '';
                if (correct === student) {
                    score++;
                }
            }
            // Add logic for other types
        });

        setExamState({
            ...examState,
            status: 'result',
            score: score
        });
    };

    const handleLogout = () => {
        setExamState({
            status: 'login',
            studentName: '',
            studentId: '',
            studentEmail: '',
            selectedSubject: '',
            selectedChapter: '',
            questions: [],
            answers: {},
            score: 0
        });
        setEmail('');
        setPassword('');
    };

    if (examState.status === 'login') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Student Login</h1>

                    <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                            type="email"
                            className={styles.input}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="Enter your email"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label>Password</label>
                        <input
                            type="password"
                            className={styles.input}
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            placeholder="Enter your password"
                        />
                    </div>

                    <button className={styles.button} onClick={handleLogin} disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                        Contact administrator for access credentials
                    </div>
                </div>
            </div>
        );
    }

    if (examState.status === 'setup') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h1 className={styles.title} style={{ margin: 0 }}>Exam Setup</h1>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>Logout</button>
                    </div>
                    <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-secondary)' }}>
                        Welcome, <strong>{examState.studentName}</strong>
                    </p>

                    <div className={styles.formGroup}>
                        <label>Subject</label>
                        <select
                            className={styles.select}
                            value={examState.selectedSubject}
                            onChange={e => setExamState({ ...examState, selectedSubject: e.target.value, selectedChapter: '' })}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className={styles.formGroup}>
                        <label>Chapter</label>
                        <select
                            className={styles.select}
                            value={examState.selectedChapter}
                            onChange={e => setExamState({ ...examState, selectedChapter: e.target.value })}
                            disabled={!examState.selectedSubject}
                        >
                            <option value="">Select Chapter</option>
                            {subjects.find(s => s.id === examState.selectedSubject)?.chapters.map(c =>
                                <option key={c.id} value={c.id}>{c.name}</option>
                            )}
                        </select>
                    </div>

                    <button className={styles.button} onClick={startExam} disabled={loading}>
                        {loading ? 'Loading...' : 'Start Exam'}
                    </button>
                </div>
            </div>
        );
    }

    if (examState.status === 'taking') {
        return (
            <div className={styles.container}>
                <div className={styles.examHeader}>
                    <h2>Exam: {subjects.find(s => s.id === examState.selectedSubject)?.chapters.find(c => c.id === examState.selectedChapter)?.name}</h2>
                    <span>Student: {examState.studentName}</span>
                </div>

                <div className={styles.questionsList}>
                    {examState.questions.map((q, index) => (
                        <div key={q.id} className={styles.questionCard}>
                            <h3>{index + 1}. {q.text}</h3>
                            <div className={styles.options}>
                                {q.type === 'multiple' || q.type === 'sata' ? (
                                    // Multiple Choice / SATA (Checkbox)
                                    q.options.map((opt, optIndex) => (
                                        <label key={optIndex} className={styles.optionLabel}>
                                            <input
                                                type="checkbox"
                                                name={q.id}
                                                value={optIndex}
                                                checked={(examState.answers[q.id] || []).includes(optIndex)}
                                                onChange={(e) => {
                                                    const currentAnswers = examState.answers[q.id] || [];
                                                    let newAnswers;
                                                    if (e.target.checked) {
                                                        newAnswers = [...currentAnswers, optIndex].sort();
                                                    } else {
                                                        newAnswers = currentAnswers.filter((a: number) => a !== optIndex);
                                                    }
                                                    setExamState({
                                                        ...examState,
                                                        answers: { ...examState.answers, [q.id]: newAnswers }
                                                    });
                                                }}
                                            />
                                            {opt}
                                        </label>
                                    ))
                                ) : (
                                    // Single Choice (Radio)
                                    q.options.map((opt, optIndex) => (
                                        <label key={optIndex} className={styles.optionLabel}>
                                            <input
                                                type="radio"
                                                name={q.id}
                                                value={optIndex}
                                                checked={examState.answers[q.id] === optIndex}
                                                onChange={() => setExamState({
                                                    ...examState,
                                                    answers: { ...examState.answers, [q.id]: optIndex }
                                                })}
                                            />
                                            {opt}
                                        </label>
                                    ))
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                <button className={styles.submitButton} onClick={submitExam}>Submit Exam</button>
            </div>
        );
    }

    if (examState.status === 'result') {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h1 className={styles.title}>Exam Results</h1>
                    <div className={styles.scoreDisplay}>
                        <span>Score</span>
                        <strong>{examState.score} / {examState.questions.length}</strong>
                    </div>
                    <p>Percentage: {((examState.score / examState.questions.length) * 100).toFixed(1)}%</p>
                    <button
                        className={styles.button}
                        onClick={() => setExamState({
                            ...examState,
                            status: 'setup',
                            questions: [],
                            answers: {},
                            score: 0
                        })}
                    >
                        Take Another Exam
                    </button>
                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                        <button onClick={handleLogout} style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', textDecoration: 'underline' }}>Logout</button>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
