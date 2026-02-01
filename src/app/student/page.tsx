'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Subject, Question } from '@/types';
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
    timeLeft: number; // in seconds
    currentQuestionIndex: number;
}

const clientNeedsDisplay: Record<string, string> = {
    'management_of_care': 'Management of Care',
    'safety_infection_control': 'Safety and Infection Control',
    'health_promotion_maintenance': 'Health Promotion and Maintenance',
    'psychosocial_integrity': 'Psychosocial Integrity',
    'basic_care_comfort': 'Basic Care and Comfort',
    'pharmacological_parenteral_therapies': 'Pharmacological and Parenteral Therapies',
    'reduction_risk_potential': 'Reduction of Risk Potential',
    'physiological_adaptation': 'Physiological Adaptation',
    'clinical_judgment': 'Clinical Judgment',
    'recognize_cues': 'Recognize Cues',
    'analyze_cues': 'Analyze Cues',
    'prioritize_hypotheses': 'Prioritize Hypotheses',
    'generate_solutions': 'Generate Solutions',
    'take_actions': 'Take Actions',
    'evaluate_outcomes': 'Evaluate Outcomes'
};

export default function StudentPortal() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeExhibit, setActiveExhibit] = useState<string | null>(null);
    const [showRationale, setShowRationale] = useState(false);
    const [examState, setExamState] = useState<ExamState>({
        status: 'login',
        studentName: '',
        studentId: '',
        studentEmail: '',
        selectedSubject: '',
        selectedChapter: '',
        questions: [],
        answers: {},
        score: 0,
        timeLeft: 3600, // Default 60 mins
        currentQuestionIndex: 0
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Timer Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (examState.status === 'taking' && examState.timeLeft > 0) {
            timer = setInterval(() => {
                setExamState(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1
                }));
            }, 1000);
        } else if (examState.timeLeft === 0 && examState.status === 'taking') {
            submitExam();
        }
        return () => clearInterval(timer);
    }, [examState.status, examState.timeLeft]);

    // Reset view states when question changes
    useEffect(() => {
        setActiveExhibit(null);
        setShowRationale(false);
    }, [examState.currentQuestionIndex]);

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
                .eq('password', password)
                .single();

            if (error || !data) {
                alert('Invalid credentials');
            } else {
                setExamState(prev => ({
                    ...prev,
                    status: 'setup',
                    studentId: data.id,
                    studentName: data.name,
                    studentEmail: data.email
                }));
            }
        } catch (error) {
            console.error('Login error:', error);
            alert('An error occurred during login');
        } finally {
            setLoading(false);
        }
    };

    const startExam = async (mode: 'chapter' | 'category' | 'random' = 'chapter') => {
        setLoading(true);
        try {
            let query = supabase.from('questions').select('*');

            if (mode === 'chapter') {
                if (!examState.selectedChapter) {
                    alert('Please select a chapter');
                    setLoading(false);
                    return;
                }
                query = query.eq('chapter_id', examState.selectedChapter);
            } else if (mode === 'category') {
                const category = (document.getElementById('categorySelect') as HTMLSelectElement)?.value;
                if (!category) {
                    alert('Please select a Client Needs category');
                    setLoading(false);
                    return;
                }
                query = query.eq('client_needs', category);
            } else if (mode === 'random') {
                query = query.limit(100);
            }

            const { data } = await query;

            if (data && data.length > 0) {
                let finalQuestions = [...data];
                if (mode !== 'chapter') {
                    finalQuestions = finalQuestions.sort(() => Math.random() - 0.5).slice(0, 50);
                }

                const formattedQuestions = finalQuestions.map(q => ({
                    ...q,
                    subjectId: q.subject_id,
                    chapterId: q.chapter_id,
                    correctOptions: q.correct_options || [],
                    options: q.options || [],
                    customId: q.custom_id,
                    clientNeeds: q.client_needs,
                    rationale: q.rationale,
                    scenario: q.scenario,
                    exhibits: q.exhibits || []
                }));

                setExamState(prev => ({
                    ...prev,
                    status: 'taking',
                    questions: formattedQuestions,
                    timeLeft: formattedQuestions.length * 60,
                    currentQuestionIndex: 0,
                    answers: {}
                }));
            } else {
                alert('No questions found for the selected criteria.');
            }
        } catch (error) {
            console.error('Error starting exam:', error);
        } finally {
            setLoading(false);
        }
    };

    const submitExam = useCallback(() => {
        let score = 0;
        examState.questions.forEach(q => {
            const answer = examState.answers[q.id];
            if (q.type === 'single') {
                if (q.correctOptions && q.correctOptions.includes(answer)) {
                    score++;
                }
            } else if (q.type === 'multiple' || q.type === 'sata') {
                const correct = (q.correctOptions || []).sort().toString();
                const student = (answer || []).sort().toString();
                if (correct === student) score++;
            }
        });

        setExamState(prev => ({
            ...prev,
            status: 'result',
            score: score
        }));
    }, [examState.questions, examState.answers]);

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleOptionSelect = (questionId: string, optionIndex: number, isMultiple: boolean) => {
        setExamState(prev => {
            const currentAnswers = prev.answers[questionId];
            let newAnswer;

            if (isMultiple) {
                const answers = Array.isArray(currentAnswers) ? currentAnswers : [];
                if (answers.includes(optionIndex)) {
                    newAnswer = answers.filter(a => a !== optionIndex);
                } else {
                    newAnswer = [...answers, optionIndex].sort();
                }
            } else {
                newAnswer = optionIndex;
            }

            return {
                ...prev,
                answers: { ...prev.answers, [questionId]: newAnswer }
            };
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
            score: 0,
            timeLeft: 3600,
            currentQuestionIndex: 0
        });
        setEmail('');
        setPassword('');
    };

    // Render Login
    if (examState.status === 'login') {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginCenter}>
                    <div className={styles.card}>
                        <h1 className={styles.title}>EduDash</h1>
                        <p className={styles.subtitle}>Student Examination Portal</p>

                        <div className={styles.formGroup}>
                            <label>Email Address</label>
                            <input
                                type="email"
                                className={styles.input}
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="name@college.edu"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Password</label>
                            <input
                                type="password"
                                className={styles.input}
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="••••••••"
                            />
                        </div>

                        <button className={styles.primaryBtn} onClick={handleLogin} disabled={loading} style={{ width: '100%', marginTop: '1rem' }}>
                            {loading ? 'Authenticating...' : 'Sign In to Portal'}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Render Setup
    if (examState.status === 'setup') {
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginCenter}>
                    <div className={styles.card} style={{ maxWidth: '600px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Start Assessment</h2>
                            <button onClick={handleLogout} className={styles.secondaryBtn} style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Logout</button>
                        </div>

                        <div className={styles.studentInfo} style={{ marginBottom: '1.5rem' }}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Candidate</span>
                                <span className={styles.infoValue}>{examState.studentName}</span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Chapter Wise */}
                            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#6366f1' }}>📚 Focus Assessment</h3>
                                <div className={styles.formGroup} style={{ marginBottom: '0.75rem' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Subject</label>
                                    <select
                                        className={styles.select}
                                        style={{ padding: '0.6rem', fontSize: '0.8rem' }}
                                        value={examState.selectedSubject}
                                        onChange={e => setExamState({ ...examState, selectedSubject: e.target.value, selectedChapter: '' })}
                                    >
                                        <option value="">Subject...</option>
                                        {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </select>
                                </div>
                                <div className={styles.formGroup} style={{ marginBottom: '1rem' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Chapter</label>
                                    <select
                                        className={styles.select}
                                        style={{ padding: '0.6rem', fontSize: '0.8rem' }}
                                        value={examState.selectedChapter}
                                        onChange={e => setExamState({ ...examState, selectedChapter: e.target.value })}
                                        disabled={!examState.selectedSubject}
                                    >
                                        <option value="">Chapter...</option>
                                        {subjects.find(s => s.id === examState.selectedSubject)?.chapters.map(c =>
                                            <option key={c.id} value={c.id}>{c.name}</option>
                                        )}
                                    </select>
                                </div>
                                <button className={styles.primaryBtn} onClick={() => startExam('chapter')} disabled={loading || !examState.selectedChapter} style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem' }}>
                                    Start Chapter Test
                                </button>
                            </div>

                            {/* Category Wise */}
                            <div style={{ padding: '1.25rem', background: 'rgba(255,255,255,0.02)', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
                                <h3 style={{ fontSize: '0.9rem', marginBottom: '1rem', color: '#10b981' }}>🎯 Category Wise</h3>
                                <div className={styles.formGroup} style={{ marginBottom: '1.15rem' }}>
                                    <label style={{ fontSize: '0.7rem' }}>Client Needs Category</label>
                                    <select id="categorySelect" className={styles.select} style={{ padding: '0.6rem', fontSize: '0.8rem' }}>
                                        <option value="">Select Category...</option>
                                        {Object.entries(clientNeedsDisplay).map(([key, val]) => (
                                            <option key={key} value={key}>{val}</option>
                                        ))}
                                    </select>
                                </div>
                                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                    Focus on specific NCLEX client needs categories for targeted practice.
                                </p>
                                <button className={styles.primaryBtn} onClick={() => startExam('category')} disabled={loading} style={{ width: '100%', fontSize: '0.8rem', padding: '0.6rem', background: 'var(--success)' }}>
                                    Start Category Drill
                                </button>
                            </div>
                        </div>

                        {/* Random Mock Exam */}
                        <div style={{ marginTop: '1.5rem', padding: '1.25rem', background: 'rgba(99, 102, 241, 0.05)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)', textAlign: 'center' }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>⚡ Comprehensive Mock Exam</h3>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                                50 Random questions across all subjects and categories. Mimics the official exam experience.
                            </p>
                            <button className={styles.primaryBtn} onClick={() => startExam('random')} disabled={loading} style={{ padding: '0.75rem 2.5rem', fontSize: '0.9rem', background: 'var(--gradient-primary)' }}>
                                Generate Full Mock Exam
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Render Exam
    if (examState.status === 'taking') {
        const currentQ = examState.questions[examState.currentQuestionIndex];
        const isMultiple = currentQ.type === 'multiple' || currentQ.type === 'sata';

        return (
            <div className={styles.pageContainer}>
                <div className={styles.examDesktopLayout}>
                    {/* Sidebar */}
                    <aside className={styles.sidebar}>
                        <div style={{ marginBottom: '1.5rem' }}>
                            <h2 style={{ fontSize: '1.1rem', fontWeight: 800, marginBottom: '0.2rem' }}>Exam Portal</h2>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>
                                {subjects.find(s => s.id === examState.selectedSubject)?.name}
                            </p>
                        </div>

                        <div className={styles.timerContainer}>
                            <span className={styles.timerLabel}>Time Remaining</span>
                            <div className={styles.timerValue} style={{ color: examState.timeLeft < 300 ? '#f43f5e' : 'white' }}>
                                {formatTime(examState.timeLeft)}
                            </div>
                        </div>

                        {/* Question Metadata */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            {currentQ.customId && (
                                <div className={styles.detailSection}>
                                    <span className={styles.detailLabel}>Question ID</span>
                                    <span className={styles.detailValue}>{currentQ.customId}</span>
                                </div>
                            )}
                            {currentQ.clientNeeds && (
                                <div className={styles.detailSection}>
                                    <span className={styles.detailLabel}>Client Needs</span>
                                    <span className={styles.detailValue}>{clientNeedsDisplay[currentQ.clientNeeds]}</span>
                                </div>
                            )}
                        </div>

                        <div style={{ fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.75rem', color: 'var(--text-secondary)' }}>
                            PROGRESS: {Object.keys(examState.answers).length} / {examState.questions.length}
                        </div>
                        <div className={styles.navigationGrid}>
                            {examState.questions.map((_, idx) => (
                                <div
                                    key={idx}
                                    onClick={() => setExamState(prev => ({ ...prev, currentQuestionIndex: idx }))}
                                    className={`${styles.navItem} ${idx === examState.currentQuestionIndex ? styles.navItemActive : ''} ${examState.answers[examState.questions[idx].id] !== undefined ? styles.navItemAnswered : ''}`}
                                >
                                    {idx + 1}
                                </div>
                            ))}
                        </div>

                        <button
                            className={styles.primaryBtn}
                            style={{ marginTop: 'auto', background: '#f43f5e', boxShadow: '0 8px 16px rgba(244, 63, 94, 0.2)', padding: '0.6rem', fontSize: '0.85rem' }}
                            onClick={() => { if (confirm('Finish and submit exam?')) submitExam() }}
                        >
                            End Session
                        </button>
                    </aside>

                    {/* Main Content */}
                    <main className={styles.mainContent}>
                        <div className={styles.questionWrapper}>
                            <div className={styles.questionHeader}>
                                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span className={`${styles.badge} ${styles.badgeQuestion}`}>Item {examState.currentQuestionIndex + 1}</span>
                                    {isMultiple && <span className={styles.badge} style={{ background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8' }}>Multiple Response</span>}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                                    {currentQ.subjectId && subjects.find(s => s.id === currentQ.subjectId)?.name} / {currentQ.chapterId && subjects.find(s => s.id === currentQ.subjectId)?.chapters.find(c => c.id === currentQ.chapterId)?.name}
                                </div>
                            </div>

                            <div className={styles.questionBody}>
                                {/* Scenario Context */}
                                {currentQ.scenario && (
                                    <div className={styles.scenarioBox}>
                                        {currentQ.scenario}
                                    </div>
                                )}

                                {/* Exhibits Toggle */}
                                {currentQ.exhibits && currentQ.exhibits.length > 0 && (
                                    <div className={styles.exhibitsContainer}>
                                        {currentQ.exhibits.map((ex, idx) => (
                                            <button
                                                key={ex.id}
                                                className={`${styles.exhibitBtn} ${activeExhibit === ex.id ? styles.exhibitActive : ''}`}
                                                onClick={() => setActiveExhibit(activeExhibit === ex.id ? null : ex.id)}
                                            >
                                                📁 {ex.title || `Exhibit ${idx + 1}`}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Active Exhibit Content */}
                                {activeExhibit && currentQ.exhibits && (
                                    <div className={styles.exhibitContent}>
                                        <div className={styles.exhibitTitle}>
                                            {currentQ.exhibits.find(e => e.id === activeExhibit)?.title}
                                        </div>
                                        <div dangerouslySetInnerHTML={{ __html: currentQ.exhibits.find(e => e.id === activeExhibit)?.content || '' }} />
                                    </div>
                                )}

                                <h3>{currentQ.text}</h3>

                                <div className={styles.optionsGrid}>
                                    {currentQ.options.map((opt, optIdx) => {
                                        const isSelected = isMultiple
                                            ? (examState.answers[currentQ.id] || []).includes(optIdx)
                                            : examState.answers[currentQ.id] === optIdx;

                                        return (
                                            <div
                                                key={optIdx}
                                                className={`${styles.optionCard} ${isSelected ? styles.optionCardSelected : ''}`}
                                                onClick={() => handleOptionSelect(currentQ.id, optIdx, isMultiple)}
                                            >
                                                <div className={styles.optionCircle}>
                                                    <span className={styles.optionLetter}>{String.fromCharCode(65 + optIdx)}</span>
                                                </div>
                                                <div style={{ fontSize: '1.05rem', fontWeight: 500 }}>{opt}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Rationale Display (if available and toggled) */}
                                {currentQ.rationale && (
                                    <>
                                        <div className={styles.rationaleToggle} onClick={() => setShowRationale(!showRationale)}>
                                            {showRationale ? 'Hide Explanation' : 'Show Explanation & Rationale'}
                                        </div>
                                        {showRationale && (
                                            <div className={styles.rationaleContent}>
                                                <div style={{ fontWeight: 800, marginBottom: '0.5rem', color: '#10b981', fontSize: '0.8rem' }}>RATIONALE</div>
                                                <div dangerouslySetInnerHTML={{ __html: currentQ.rationale }} />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>

                            <div className={styles.footerActions}>
                                <button
                                    className={styles.secondaryBtn}
                                    disabled={examState.currentQuestionIndex === 0}
                                    onClick={() => setExamState(prev => ({ ...prev, currentQuestionIndex: prev.currentQuestionIndex - 1 }))}
                                >
                                    Previous
                                </button>
                                <button
                                    className={styles.secondaryBtn}
                                    style={{ background: 'rgba(99, 102, 241, 0.1)', color: '#818cf8', borderColor: 'rgba(99, 102, 241, 0.2)' }}
                                    onClick={() => setExamState(prev => ({
                                        ...prev,
                                        currentQuestionIndex: Math.min(prev.questions.length - 1, prev.currentQuestionIndex + 1)
                                    }))}
                                >
                                    {examState.currentQuestionIndex === examState.questions.length - 1 ? 'End of Exam' : 'Next Question'}
                                </button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }

    // Render Results
    if (examState.status === 'result') {
        const percentage = (examState.score / examState.questions.length) * 100;
        return (
            <div className={styles.pageContainer}>
                <div className={styles.loginCenter}>
                    <div className={styles.card}>
                        <h1 className={styles.title}>Performance Report</h1>
                        <p className={styles.subtitle}>Session Completed successfully</p>

                        <div className={styles.resultGrid}>
                            <div className={styles.resultStat}>
                                <span className={styles.statValue}>{examState.score} / {examState.questions.length}</span>
                                <span className={styles.statLabel}>Raw Score</span>
                            </div>
                            <div className={styles.resultStat}>
                                <span className={styles.statValue}>{percentage.toFixed(1)}%</span>
                                <span className={styles.statLabel}>Success Rate</span>
                            </div>
                        </div>

                        <div className={styles.studentInfo} style={{ marginBottom: '2.5rem' }}>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Status</span>
                                <span className={styles.infoValue} style={{ color: percentage >= 70 ? '#34d399' : '#f43f5e' }}>
                                    {percentage >= 70 ? 'CERTIFIED' : 'NOT QUALIFIED'}
                                </span>
                            </div>
                            <div className={styles.infoItem}>
                                <span className={styles.infoLabel}>Assessment</span>
                                <span className={styles.infoValue}>
                                    {subjects.find(s => s.id === examState.selectedSubject)?.name}
                                </span>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gap: '1rem' }}>
                            <button
                                className={styles.primaryBtn}
                                onClick={() => setExamState(prev => ({
                                    ...prev,
                                    status: 'setup',
                                    questions: [],
                                    answers: {},
                                    score: 0
                                }))}
                            >
                                Start New Assessment
                            </button>
                            <button onClick={handleLogout} className={styles.secondaryBtn}>
                                Final Exit & Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return null;
}
