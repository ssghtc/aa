'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Subject, Question, Chapter } from '@/types';
import styles from './student.module.css';

interface ExamState {
    status: 'login' | 'setup' | 'taking' | 'result';
    studentName: string;
    studentId: string;
    studentEmail: string;
    selectedSubject: string;
    selectedChapter: string;
    questions: Question[];
    answers: Record<string, any>; // Record<questionId, answerIndex | answerIndex[]>
    score: number;
    timeLeft: number; // in seconds
    currentQuestionIndex: number;
    // Step 1: Configuration Fields
    mode: 'practice' | 'adaptive';
    type: 'tutor' | 'timed';
    questionCount: number;
    selectedSubjects: string[]; // Subject IDs
    selectedChapters: string[]; // Chapter IDs
    selectedSystems: string[];  // Hardcoded for now
    // Step 2: Advanced Tools
    notes: Record<string, string>; // Maps questionId -> note
    markedQuestions: string[]; // List of questionIds
    calculatorOpen: boolean;
    notepadOpen: boolean;
    labValuesOpen: boolean;
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

// Icons as simple SVGs
const Icons = {
    Dashboard: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
            <rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" />
        </svg>
    ),
    StudyPlanner: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
            <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
        </svg>
    ),
    Lectures: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
            <polygon points="5 3 19 12 5 21 5 3" />
        </svg>
    ),
    QBank: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" /><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        </svg>
    ),
    Performance: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={styles.navIcon}>
            <path d="M12 20V10" /><path d="M18 20V4" /><path d="M6 20v-4" />
        </svg>
    ),
    Search: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16, color: '#94a3b8' }}>
            <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
    ),
    Lock: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 14, height: 14, marginRight: 4 }}>
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" />
        </svg>
    ),
    Calc: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <rect x="4" y="2" width="16" height="20" rx="2" ry="2" /><line x1="8" y1="6" x2="16" y2="6" /><line x1="16" y1="14" x2="16" y2="18" /><path d="M16 10h.01" /><path d="M12 10h.01" /><path d="M8 10h.01" /><path d="M12 14h.01" /><path d="M8 14h.01" /><path d="M12 18h.01" /><path d="M8 18h.01" />
        </svg>
    ),
    FileText: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /><polyline points="10 9 9 9 8 9" />
        </svg>
    ),
    Flag: () => (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
            <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z" /><line x1="4" y1="22" x2="4" y2="15" />
        </svg>
    )
};

export default function StudentPortal() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'Dashboard' | 'Study Planner' | 'Lectures' | 'QBank' | 'Performance'>('Dashboard');
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
        timeLeft: 3600,
        currentQuestionIndex: 0,
        mode: 'practice',
        type: 'tutor',
        questionCount: 10,
        selectedSubjects: [],
        selectedChapters: [],
        selectedSystems: [],
        notes: {},
        markedQuestions: [],
        calculatorOpen: false,
        notepadOpen: false,
        labValuesOpen: false
    });

    useEffect(() => {
        fetchSubjects();
    }, []);

    // Timer Effect
    useEffect(() => {
        let timer: NodeJS.Timeout;
        if (examState.status === 'taking' && examState.timeLeft > 0 && examState.type === 'timed') {
            timer = setInterval(() => {
                setExamState(prev => ({
                    ...prev,
                    timeLeft: prev.timeLeft - 1
                }));
            }, 1000);
        } else if (examState.timeLeft === 0 && examState.status === 'taking' && examState.type === 'timed') {
            submitExam();
        }
        return () => clearInterval(timer);
    }, [examState.status, examState.timeLeft, examState.type]);

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

    const generateTest = async () => {
        setLoading(true);
        try {
            let query = supabase.from('questions').select('*');

            if (examState.selectedChapters.length > 0) {
                query = query.in('chapter_id', examState.selectedChapters);
            } else if (examState.selectedSubjects.length > 0) {
                query = query.in('subject_id', examState.selectedSubjects);
            }

            const { data } = await query.limit(examState.questionCount);

            if (data && data.length > 0) {
                const formattedQuestions = data.map(q => ({
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
                alert('No questions found for the selected criteria. Try selecting different subjects or chapters.');
            }
        } catch (error) {
            console.error('Error generating test:', error);
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
            currentQuestionIndex: 0,
            mode: 'practice',
            type: 'tutor',
            questionCount: 10,
            selectedSubjects: [],
            selectedChapters: [],
            selectedSystems: [],
            notes: {},
            markedQuestions: [],
            calculatorOpen: false,
            notepadOpen: false,
            labValuesOpen: false
        });
        setEmail('');
        setPassword('');
    };

    // UI Components
    const Sidebar = () => (
        <aside className={styles.sidebar}>
            <div className={styles.sidebarLogo}>
                <span style={{ fontSize: '1.5rem', marginRight: '0.5rem' }}>📚</span>
                EduEternal Hub
                <span style={{ fontSize: '0.7em', background: '#3b82f6', padding: '2px 6px', borderRadius: '4px', marginLeft: 'auto' }}>PRO</span>
            </div>
            <nav className={styles.sidebarNav}>
                <div
                    className={`${styles.navItem} ${activeTab === 'Dashboard' ? styles.navItemActive : ''}`}
                    onClick={() => { setActiveTab('Dashboard'); setExamState(p => ({ ...p, status: 'setup' })); }}
                >
                    <Icons.Dashboard /> Dashboard
                </div>
                <div
                    className={`${styles.navItem} ${activeTab === 'Study Planner' ? styles.navItemActive : ''}`}
                    onClick={() => setActiveTab('Study Planner')}
                >
                    <Icons.StudyPlanner /> Study Planner
                </div>
                <div
                    className={`${styles.navItem} ${activeTab === 'Lectures' ? styles.navItemActive : ''}`}
                    onClick={() => setActiveTab('Lectures')}
                >
                    <Icons.Lectures /> Lectures
                </div>
                <div
                    className={`${styles.navItem} ${activeTab === 'QBank' ? styles.navItemActive : ''}`}
                    onClick={() => setActiveTab('QBank')}
                >
                    <Icons.QBank /> QBank
                </div>
                <div
                    className={`${styles.navItem} ${activeTab === 'Performance' ? styles.navItemActive : ''}`}
                    onClick={() => { setActiveTab('Performance'); setExamState(p => ({ ...p, status: 'result' })); }}
                >
                    <Icons.Performance /> Performance
                </div>
            </nav>

            {/* User Profile & Logout Section */}
            <div style={{
                marginTop: 'auto',
                padding: '1rem',
                borderTop: '1px solid #27272a'
            }}>
                <div style={{
                    background: '#18181b',
                    padding: '0.75rem',
                    borderRadius: '8px',
                    marginBottom: '0.75rem'
                }}>
                    <div style={{
                        fontSize: '0.875rem',
                        fontWeight: '600',
                        color: '#fff',
                        marginBottom: '0.25rem'
                    }}>
                        {examState.studentName || 'Student'}
                    </div>
                    <div style={{
                        fontSize: '0.75rem',
                        color: '#71717a'
                    }}>
                        {examState.studentEmail || 'student@edu.com'}
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        borderRadius: '6px',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.2s'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#b91c1c'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#dc2626'}
                >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 16, height: 16 }}>
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                        <polyline points="16 17 21 12 16 7" />
                        <line x1="21" y1="12" x2="9" y2="12" />
                    </svg>
                    Logout
                </button>
            </div>
        </aside>
    );

    const Header = () => (
        <header className={styles.header}>
            <div className={styles.headerLeft}>
                <div className={styles.searchBar}>
                    <Icons.Search />
                    <input type="text" placeholder="Search resources..." />
                </div>
            </div>
            <div className={styles.headerRight}>
                <div className={styles.countdownBadge}>
                    <Icons.Lock />
                    184 Days Left
                </div>
                <div className={styles.userName}>{examState.studentName || 'Ramanpreet Kaur'}</div>
            </div>
        </header>
    );

    // Render Login
    if (examState.status === 'login') {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                {/* Animated Background Elements */}
                <div style={{
                    position: 'absolute',
                    top: '-10%',
                    right: '-5%',
                    width: '500px',
                    height: '500px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }} />
                <div style={{
                    position: 'absolute',
                    bottom: '-10%',
                    left: '-5%',
                    width: '400px',
                    height: '400px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%',
                    filter: 'blur(60px)'
                }} />

                {/* Left Side - Branding */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3rem',
                    color: 'white',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{ maxWidth: '500px', textAlign: 'center' }}>
                        {/* Logo */}
                        <div style={{
                            fontSize: '3.5rem',
                            marginBottom: '1.5rem',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            gap: '1rem'
                        }}>
                            <span style={{
                                background: 'white',
                                color: '#667eea',
                                width: '80px',
                                height: '80px',
                                borderRadius: '20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
                            }}>
                                📚
                            </span>
                        </div>

                        <h1 style={{
                            fontSize: '3rem',
                            fontWeight: '800',
                            marginBottom: '1rem',
                            letterSpacing: '-0.02em',
                            textShadow: '0 2px 10px rgba(0,0,0,0.1)'
                        }}>
                            EduEternal Hub
                        </h1>

                        <p style={{
                            fontSize: '1.25rem',
                            opacity: 0.95,
                            marginBottom: '2rem',
                            lineHeight: '1.6'
                        }}>
                            Your comprehensive learning platform for nursing excellence
                        </p>

                        {/* Features */}
                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '1rem',
                            textAlign: 'left',
                            marginTop: '3rem'
                        }}>
                            {[
                                { icon: '✓', text: 'Adaptive practice exams' },
                                { icon: '✓', text: 'Comprehensive question bank' },
                                { icon: '✓', text: 'Detailed explanations & rationales' },
                                { icon: '✓', text: 'Track your progress & performance' }
                            ].map((feature, idx) => (
                                <div key={idx} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '1rem',
                                    background: 'rgba(255, 255, 255, 0.15)',
                                    padding: '1rem 1.5rem',
                                    borderRadius: '12px',
                                    backdropFilter: 'blur(10px)'
                                }}>
                                    <span style={{
                                        fontSize: '1.5rem',
                                        fontWeight: 'bold'
                                    }}>{feature.icon}</span>
                                    <span style={{ fontSize: '1rem' }}>{feature.text}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Side - Login Form */}
                <div style={{
                    flex: 1,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '3rem',
                    position: 'relative',
                    zIndex: 1
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '24px',
                        padding: '3rem',
                        width: '100%',
                        maxWidth: '480px',
                        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
                        position: 'relative'
                    }}>
                        {/* Form Header */}
                        <div style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
                            <h2 style={{
                                fontSize: '2rem',
                                fontWeight: '700',
                                color: '#1e293b',
                                marginBottom: '0.5rem'
                            }}>
                                Welcome Back
                            </h2>
                            <p style={{
                                fontSize: '0.95rem',
                                color: '#64748b'
                            }}>
                                Sign in to continue your learning journey
                            </p>
                        </div>

                        {/* Email Input */}
                        <div style={{ marginBottom: '1.5rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#334155',
                                marginBottom: '0.5rem'
                            }}>
                                Email Address
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '1.25rem',
                                    color: '#94a3b8'
                                }}>
                                    📧
                                </span>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="student@college.edu"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                        background: '#f8fafc'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.background = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = '#f8fafc';
                                    }}
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{
                                display: 'block',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                color: '#334155',
                                marginBottom: '0.5rem'
                            }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute',
                                    left: '1rem',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    fontSize: '1.25rem',
                                    color: '#94a3b8'
                                }}>
                                    🔒
                                </span>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem 1rem 0.875rem 3rem',
                                        border: '2px solid #e2e8f0',
                                        borderRadius: '12px',
                                        fontSize: '1rem',
                                        transition: 'all 0.2s',
                                        outline: 'none',
                                        background: '#f8fafc'
                                    }}
                                    onFocus={(e) => {
                                        e.target.style.borderColor = '#667eea';
                                        e.target.style.background = 'white';
                                    }}
                                    onBlur={(e) => {
                                        e.target.style.borderColor = '#e2e8f0';
                                        e.target.style.background = '#f8fafc';
                                    }}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter') handleLogin();
                                    }}
                                />
                            </div>
                        </div>

                        {/* Sign In Button */}
                        <button
                            onClick={handleLogin}
                            disabled={loading}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                background: loading ? '#94a3b8' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '12px',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                transition: 'all 0.3s',
                                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '0.5rem'
                            }}
                            onMouseOver={(e) => {
                                if (!loading) {
                                    e.currentTarget.style.transform = 'translateY(-2px)';
                                    e.currentTarget.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.5)';
                                }
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.4)';
                            }}
                        >
                            {loading ? (
                                <>
                                    <span style={{
                                        display: 'inline-block',
                                        width: '16px',
                                        height: '16px',
                                        border: '2px solid white',
                                        borderTopColor: 'transparent',
                                        borderRadius: '50%',
                                        animation: 'spin 0.6s linear infinite'
                                    }} />
                                    Authenticating...
                                </>
                            ) : (
                                <>
                                    Sign In
                                    <span style={{ fontSize: '1.25rem' }}>→</span>
                                </>
                            )}
                        </button>

                        {/* Footer */}
                        <div style={{
                            marginTop: '2rem',
                            paddingTop: '2rem',
                            borderTop: '1px solid #e2e8f0',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#64748b'
                            }}>
                                Need help? <a href="#" style={{
                                    color: '#667eea',
                                    textDecoration: 'none',
                                    fontWeight: '600'
                                }}>Contact Support</a>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // Main Portal Content
    return (
        <div className={styles.pageContainer}>
            <Sidebar />
            <div className={styles.contentArea}>
                <Header />

                {examState.status === 'setup' && (
                    <main className={styles.dashboardContent}>
                        <div>
                            <h2 className={styles.screenTitle}>Welcome Back, {examState.studentName}!</h2>
                            <p className={styles.screenSubtitle}>Choose a quick test option or create a custom exam tailored to your needs.</p>
                        </div>

                        {/* Quick Test Options */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                            gap: '1.5rem',
                            marginBottom: '2.5rem'
                        }}>
                            {/* Random Test Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                                onClick={() => {
                                    setExamState(p => ({
                                        ...p,
                                        mode: 'practice',
                                        type: 'tutor',
                                        questionCount: 10,
                                        selectedSubjects: [],
                                        selectedChapters: []
                                    }));
                                    generateTest();
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎲</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Random Test</h3>
                                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>10 random questions from all subjects</p>
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    Practice Mode • Untimed
                                </div>
                            </div>

                            {/* Full Mock Exam Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                                onClick={() => {
                                    setExamState(p => ({
                                        ...p,
                                        mode: 'adaptive',
                                        type: 'timed',
                                        questionCount: 75,
                                        selectedSubjects: [],
                                        selectedChapters: [],
                                        timeLeft: 4500 // 75 minutes
                                    }));
                                    generateTest();
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Full Mock Exam</h3>
                                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>75 questions simulating real exam</p>
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    Adaptive Mode • 75 Minutes
                                </div>
                            </div>

                            {/* Subject-Specific Test Card */}
                            <div style={{
                                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                                borderRadius: '12px',
                                padding: '1.5rem',
                                color: 'white',
                                cursor: 'pointer',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                                onClick={() => {
                                    if (subjects.length > 0) {
                                        setExamState(p => ({
                                            ...p,
                                            mode: 'practice',
                                            type: 'tutor',
                                            questionCount: 20,
                                            selectedSubjects: [subjects[0].id],
                                            selectedChapters: []
                                        }));
                                        generateTest();
                                    }
                                }}
                                onMouseOver={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-4px)';
                                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                                }}
                                onMouseOut={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                                }}
                            >
                                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📚</div>
                                <h3 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '0.5rem' }}>Subject Focus</h3>
                                <p style={{ fontSize: '0.875rem', opacity: 0.9 }}>20 questions from first subject</p>
                                <div style={{
                                    marginTop: '1rem',
                                    padding: '0.5rem',
                                    background: 'rgba(255,255,255,0.2)',
                                    borderRadius: '6px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    Practice Mode • Untimed
                                </div>
                            </div>
                        </div>

                        {/* Custom Test Builder */}
                        <div style={{
                            background: 'linear-gradient(135deg, #667eea15 0%, #764ba215 100%)',
                            borderRadius: '16px',
                            padding: '2rem',
                            border: '1px solid #e2e8f0'
                        }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    fontWeight: '700',
                                    marginBottom: '0.5rem',
                                    color: 'rgb(var(--foreground))',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '0.75rem'
                                }}>
                                    <span style={{ fontSize: '1.75rem' }}>⚙️</span>
                                    Create Custom Test
                                </h3>
                                <p style={{
                                    color: 'rgb(var(--muted-foreground))',
                                    fontSize: '0.95rem'
                                }}>
                                    Fine-tune your practice session with advanced options
                                </p>
                            </div>

                            <div className={styles.shadcnCard} style={{ marginBottom: 0 }}>
                                {/* Test Configuration */}
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                                    gap: '2rem',
                                    marginBottom: '2rem',
                                    paddingBottom: '2rem',
                                    borderBottom: '1px solid rgb(var(--border))'
                                }}>
                                    {/* Test Mode */}
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>🎓</span>
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'rgb(var(--foreground))'
                                            }}>
                                                Test Mode
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(var(--muted-foreground))',
                                            marginBottom: '0.75rem',
                                            lineHeight: '1.4'
                                        }}>
                                            Choose between practice or adaptive testing
                                        </p>
                                        <div className={styles.toggleSwitch}>
                                            <div
                                                className={`${styles.toggleOption} ${examState.mode === 'practice' ? styles.toggleOptionActive : ''}`}
                                                onClick={() => setExamState(p => ({ ...p, mode: 'practice' }))}
                                            >
                                                📝 Practice
                                            </div>
                                            <div
                                                className={`${styles.toggleOption} ${examState.mode === 'adaptive' ? styles.toggleOptionActive : ''}`}
                                                onClick={() => setExamState(p => ({ ...p, mode: 'adaptive' }))}
                                            >
                                                🧠 Adaptive
                                            </div>
                                        </div>
                                    </div>

                                    {/* Timing Mode */}
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>⏱️</span>
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'rgb(var(--foreground))'
                                            }}>
                                                Timing Mode
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(var(--muted-foreground))',
                                            marginBottom: '0.75rem',
                                            lineHeight: '1.4'
                                        }}>
                                            Timed for exam simulation or untimed for learning
                                        </p>
                                        <div className={styles.toggleSwitch}>
                                            <div
                                                className={`${styles.toggleOption} ${examState.type === 'tutor' ? styles.toggleOptionActive : ''}`}
                                                onClick={() => setExamState(p => ({ ...p, type: 'tutor' }))}
                                            >
                                                🎯 Tutor
                                            </div>
                                            <div
                                                className={`${styles.toggleOption} ${examState.type === 'timed' ? styles.toggleOptionActive : ''}`}
                                                onClick={() => setExamState(p => ({ ...p, type: 'timed' }))}
                                            >
                                                ⏰ Timed
                                            </div>
                                        </div>
                                    </div>

                                    {/* Question Count */}
                                    <div>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.75rem'
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>🔢</span>
                                            <span style={{
                                                fontSize: '0.95rem',
                                                fontWeight: '600',
                                                color: 'rgb(var(--foreground))'
                                            }}>
                                                Number of Questions
                                            </span>
                                        </div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(var(--muted-foreground))',
                                            marginBottom: '0.75rem',
                                            lineHeight: '1.4'
                                        }}>
                                            Select between 1 and 100 questions
                                        </p>
                                        <input
                                            type="number"
                                            value={examState.questionCount}
                                            onChange={e => setExamState(p => ({ ...p, questionCount: parseInt(e.target.value) || 0 }))}
                                            min="1"
                                            max="100"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                border: '1px solid rgb(var(--input))',
                                                borderRadius: 'var(--radius)',
                                                fontSize: '1.25rem',
                                                fontWeight: '600',
                                                textAlign: 'center',
                                                color: 'rgb(var(--foreground))',
                                                background: 'white'
                                            }}
                                        />
                                    </div>
                                </div>

                                {/* Content Selection */}
                                <div className={styles.filterGrid}>
                                    <div className={styles.filterSection}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>📚</span>
                                            <h3 className={styles.filterTitle} style={{ margin: 0 }}>
                                                Subjects & Chapters
                                            </h3>
                                        </div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(var(--muted-foreground))',
                                            marginBottom: '1rem'
                                        }}>
                                            Select subjects and expand to choose specific chapters
                                        </p>
                                        <div className={styles.multiselectList}>
                                            {subjects.length === 0 && (
                                                <div style={{
                                                    padding: '2rem',
                                                    textAlign: 'center',
                                                    color: '#999',
                                                    background: '#f9fafb',
                                                    borderRadius: '8px'
                                                }}>
                                                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📭</div>
                                                    <p style={{ margin: 0 }}>No subjects available</p>
                                                </div>
                                            )}
                                            {subjects.map(s => (
                                                <div key={s.id}>
                                                    <label className={styles.checkboxItem} style={{
                                                        background: examState.selectedSubjects.includes(s.id) ? '#eff6ff' : 'transparent',
                                                        borderRadius: '6px',
                                                        padding: '0.5rem 0.75rem'
                                                    }}>
                                                        <input
                                                            type="checkbox"
                                                            checked={examState.selectedSubjects.includes(s.id)}
                                                            onChange={e => {
                                                                const newS = e.target.checked
                                                                    ? [...examState.selectedSubjects, s.id]
                                                                    : examState.selectedSubjects.filter(id => id !== s.id);
                                                                setExamState(p => ({ ...p, selectedSubjects: newS }));
                                                            }}
                                                        />
                                                        <strong style={{ fontSize: '0.95rem' }}>{s.name}</strong>
                                                        {s.chapters && s.chapters.length > 0 && (
                                                            <span style={{
                                                                marginLeft: 'auto',
                                                                fontSize: '0.75rem',
                                                                color: 'rgb(var(--muted-foreground))',
                                                                background: '#f1f5f9',
                                                                padding: '2px 8px',
                                                                borderRadius: '12px'
                                                            }}>
                                                                {s.chapters.length} chapters
                                                            </span>
                                                        )}
                                                    </label>

                                                    {/* Chapter Expansion */}
                                                    {(examState.selectedSubjects.includes(s.id) && s.chapters && s.chapters.length > 0) && (
                                                        <div className={styles.nestedList} style={{
                                                            background: '#f8fafc',
                                                            borderRadius: '6px',
                                                            padding: '0.5rem',
                                                            marginTop: '0.5rem'
                                                        }}>
                                                            {s.chapters.map(c => (
                                                                <label key={c.id} className={styles.checkboxItem} style={{
                                                                    fontSize: '0.875rem',
                                                                    background: examState.selectedChapters.includes(c.id) ? 'white' : 'transparent',
                                                                    borderRadius: '4px'
                                                                }}>
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={examState.selectedChapters.includes(c.id)}
                                                                        onChange={e => {
                                                                            const newC = e.target.checked
                                                                                ? [...examState.selectedChapters, c.id]
                                                                                : examState.selectedChapters.filter(id => id !== c.id);
                                                                            setExamState(p => ({ ...p, selectedChapters: newC }));
                                                                        }}
                                                                    />
                                                                    {c.name}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.filterSection}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '1rem'
                                        }}>
                                            <span style={{ fontSize: '1.25rem' }}>🏥</span>
                                            <h3 className={styles.filterTitle} style={{ margin: 0 }}>
                                                Systems <span style={{
                                                    fontSize: '0.75rem',
                                                    fontWeight: '400',
                                                    color: 'rgb(var(--muted-foreground))'
                                                }}>(Optional)</span>
                                            </h3>
                                        </div>
                                        <p style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(var(--muted-foreground))',
                                            marginBottom: '1rem'
                                        }}>
                                            Filter questions by body system
                                        </p>
                                        <div className={styles.multiselectList}>
                                            <label className={styles.checkboxItem} style={{
                                                background: '#f0fdf4',
                                                borderRadius: '6px',
                                                padding: '0.5rem 0.75rem',
                                                fontWeight: '600'
                                            }}>
                                                <input type="checkbox" />
                                                <span>All Systems</span>
                                            </label>
                                            <div className={styles.nestedList} style={{ marginLeft: 0, marginTop: '0.5rem' }}>
                                                {['Cardiovascular', 'Respiratory', 'Gastrointestinal', 'Neurological', 'Endocrine', 'Musculoskeletal', 'Renal', 'Hematologic'].map(system => (
                                                    <label key={system} className={styles.checkboxItem} style={{
                                                        fontSize: '0.875rem',
                                                        borderRadius: '4px'
                                                    }}>
                                                        <input type="checkbox" /> {system}
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Generate Button */}
                                <div style={{
                                    marginTop: '2rem',
                                    paddingTop: '2rem',
                                    borderTop: '1px solid rgb(var(--border))',
                                    display: 'flex',
                                    justifyContent: 'flex-end',
                                    gap: '1rem'
                                }}>
                                    <button
                                        onClick={() => {
                                            setExamState(p => ({
                                                ...p,
                                                selectedSubjects: [],
                                                selectedChapters: [],
                                                questionCount: 10,
                                                mode: 'practice',
                                                type: 'tutor'
                                            }));
                                        }}
                                        style={{
                                            padding: '0.75rem 1.5rem',
                                            borderRadius: 'var(--radius)',
                                            fontSize: '0.95rem',
                                            fontWeight: '500',
                                            border: '1px solid rgb(var(--border))',
                                            background: 'white',
                                            color: 'rgb(var(--foreground))',
                                            cursor: 'pointer',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseOver={(e) => e.currentTarget.style.background = '#f9fafb'}
                                        onMouseOut={(e) => e.currentTarget.style.background = 'white'}
                                    >
                                        Reset Filters
                                    </button>
                                    <button
                                        className={styles.primaryBtn}
                                        onClick={generateTest}
                                        disabled={loading}
                                        style={{
                                            padding: '0.75rem 2rem',
                                            fontSize: '0.95rem',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem'
                                        }}
                                    >
                                        {loading ? (
                                            <>
                                                <span style={{
                                                    display: 'inline-block',
                                                    width: '16px',
                                                    height: '16px',
                                                    border: '2px solid white',
                                                    borderTopColor: 'transparent',
                                                    borderRadius: '50%',
                                                    animation: 'spin 0.6s linear infinite'
                                                }} />
                                                Building Exam...
                                            </>
                                        ) : (
                                            <>
                                                🚀 Generate Custom Test
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </main>
                )}

                {examState.status === 'taking' && (
                    <div className={styles.testingOverlay}>
                        {/* Advanced Tool Popups */}
                        {examState.calculatorOpen && (
                            <div className={styles.calculatorPopup}>
                                <div style={{ background: '#334155', padding: '0.5rem', borderRadius: '4px', textAlign: 'right', color: 'white', marginBottom: '0.5rem', fontFamily: 'monospace' }}>0</div>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.25rem' }}>
                                    {['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', 'C', '0', '=', '+'].map(k => (
                                        <button key={k} style={{ padding: '0.5rem', borderRadius: '4px', border: 'none', background: '#475569', color: 'white', cursor: 'pointer' }}>{k}</button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {examState.notepadOpen && (
                            <div className={styles.notepadPopup}>
                                <div className={styles.notepadHeader}>
                                    <span>Scratch Pad</span>
                                    <span onClick={() => setExamState(p => ({ ...p, notepadOpen: false }))} style={{ cursor: 'pointer' }}>×</span>
                                </div>
                                <textarea className={styles.notepadArea} placeholder="Type notes here..."></textarea>
                            </div>
                        )}

                        <div className={styles.testingHeader}>
                            <div className={styles.testMeta}>
                                <span><strong>Q:</strong> {examState.currentQuestionIndex + 1} of {examState.questions.length}</span>
                                {examState.questions[examState.currentQuestionIndex]?.customId && (
                                    <span><strong>ID:</strong> {examState.questions[examState.currentQuestionIndex].customId}</span>
                                )}
                                <span style={{
                                    background: '#3b82f6',
                                    color: 'white',
                                    padding: '2px 8px',
                                    borderRadius: '4px',
                                    fontSize: '0.75rem',
                                    fontWeight: '500'
                                }}>
                                    {examState.questions[examState.currentQuestionIndex]?.type === 'single' ? 'Single Choice' :
                                        examState.questions[examState.currentQuestionIndex]?.type === 'multiple' ? 'Multiple Choice' :
                                            examState.questions[examState.currentQuestionIndex]?.type === 'sata' ? 'Select All That Apply' :
                                                examState.questions[examState.currentQuestionIndex]?.type || 'Question'}
                                </span>
                                {examState.questions[examState.currentQuestionIndex]?.clientNeeds && (
                                    <span style={{
                                        background: '#10b981',
                                        color: 'white',
                                        padding: '2px 8px',
                                        borderRadius: '4px',
                                        fontSize: '0.75rem',
                                        fontWeight: '500'
                                    }}>
                                        {clientNeedsDisplay[examState.questions[examState.currentQuestionIndex].clientNeeds as keyof typeof clientNeedsDisplay] || examState.questions[examState.currentQuestionIndex].clientNeeds}
                                    </span>
                                )}
                            </div>
                            <div className={styles.timerDisplay}>
                                {examState.type === 'timed' ? (
                                    <>⏱️ {formatTime(examState.timeLeft)}</>
                                ) : (
                                    <span style={{ color: '#64748b', fontWeight: '500' }}>⏱️ Practice Mode</span>
                                )}
                            </div>
                        </div>

                        <div className={styles.testToolbar}>
                            <button
                                className={`${styles.toolBtn} ${examState.calculatorOpen ? styles.toolBtnActive : ''}`}
                                onClick={() => setExamState(p => ({ ...p, calculatorOpen: !p.calculatorOpen }))}
                            >
                                <Icons.Calc /> Calculator
                            </button>
                            <button
                                className={`${styles.toolBtn} ${examState.notepadOpen ? styles.toolBtnActive : ''}`}
                                onClick={() => setExamState(p => ({ ...p, notepadOpen: !p.notepadOpen }))}
                            >
                                <Icons.FileText /> Notes
                            </button>
                            <div style={{ flex: 1 }}></div>
                            <button
                                className={`${styles.toolBtn} ${examState.markedQuestions.includes(examState.questions[examState.currentQuestionIndex]?.id) ? styles.toolBtnActive : ''}`}
                                onClick={() => setExamState(p => {
                                    const qId = p.questions[p.currentQuestionIndex].id;
                                    const isMarked = p.markedQuestions.includes(qId);
                                    return {
                                        ...p,
                                        markedQuestions: isMarked ? p.markedQuestions.filter(id => id !== qId) : [...p.markedQuestions, qId]
                                    };
                                })}
                            >
                                <Icons.Flag /> {examState.markedQuestions.includes(examState.questions[examState.currentQuestionIndex]?.id) ? 'Marked' : 'Mark'}
                            </button>
                        </div>

                        <div className={styles.testingContent}>
                            <div className={styles.questionPanel}>
                                {/* Exhibits Section */}
                                {examState.questions[examState.currentQuestionIndex]?.exhibits &&
                                    (examState.questions[examState.currentQuestionIndex]?.exhibits?.length ?? 0) > 0 && (
                                        <div style={{
                                            background: '#f8fafc',
                                            border: '1px solid #e2e8f0',
                                            borderRadius: '8px',
                                            padding: '1rem',
                                            marginBottom: '1.5rem'
                                        }}>
                                            <div style={{
                                                display: 'flex',
                                                gap: '0.5rem',
                                                marginBottom: '1rem',
                                                borderBottom: '2px solid #e2e8f0',
                                                paddingBottom: '0.5rem'
                                            }}>
                                                {examState.questions[examState.currentQuestionIndex]?.exhibits?.map((exhibit: any, idx: number) => (
                                                    <button
                                                        key={exhibit.id || idx}
                                                        style={{
                                                            padding: '0.5rem 1rem',
                                                            background: idx === 0 ? '#3b82f6' : 'transparent',
                                                            color: idx === 0 ? 'white' : '#64748b',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            cursor: 'pointer',
                                                            fontWeight: '500',
                                                            fontSize: '0.875rem'
                                                        }}
                                                    >
                                                        {exhibit.title || `Exhibit ${idx + 1}`}
                                                    </button>
                                                ))}
                                            </div>
                                            <div style={{
                                                padding: '1rem',
                                                background: 'white',
                                                borderRadius: '6px',
                                                fontSize: '0.9rem',
                                                lineHeight: '1.6',
                                                whiteSpace: 'pre-wrap'
                                            }}>
                                                {examState.questions[examState.currentQuestionIndex]?.exhibits?.[0]?.content || 'No content available'}
                                            </div>
                                        </div>
                                    )}

                                {/* Scenario Section */}
                                {examState.questions[examState.currentQuestionIndex]?.scenario && (
                                    <div style={{
                                        background: '#eff6ff',
                                        border: '1px solid #bfdbfe',
                                        borderLeft: '4px solid #3b82f6',
                                        borderRadius: '6px',
                                        padding: '1rem',
                                        marginBottom: '1.5rem'
                                    }}>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.5rem',
                                            marginBottom: '0.5rem',
                                            color: '#1e40af',
                                            fontWeight: '600',
                                            fontSize: '0.875rem'
                                        }}>
                                            <span>📋</span>
                                            <span>CLINICAL SCENARIO</span>
                                        </div>
                                        <div
                                            style={{
                                                fontSize: '0.9rem',
                                                lineHeight: '1.6',
                                                color: '#1e3a8a'
                                            }}
                                            dangerouslySetInnerHTML={{ __html: examState.questions[examState.currentQuestionIndex].scenario || '' }}
                                        />
                                    </div>
                                )}

                                {/* Question Text */}
                                <div className={styles.questionText}>
                                    {examState.questions[examState.currentQuestionIndex]?.text}
                                </div>

                                {/* Options */}
                                <div className={styles.optionList}>
                                    {examState.questions[examState.currentQuestionIndex]?.options.map((opt, idx) => {
                                        const isSelected = examState.answers[examState.questions[examState.currentQuestionIndex].id] === idx;
                                        const currentQuestion = examState.questions[examState.currentQuestionIndex];
                                        const userAnswer = examState.answers[currentQuestion?.id];
                                        const isCorrect = currentQuestion?.correctOptions?.includes(idx);
                                        const showFeedback = examState.mode === 'practice' && userAnswer !== undefined;

                                        return (
                                            <div
                                                key={idx}
                                                className={`${styles.testingOption} ${isSelected ? styles.testingOptionSelected : ''}`}
                                                onClick={() => handleOptionSelect(examState.questions[examState.currentQuestionIndex].id, idx, false)}
                                                style={{
                                                    borderColor: showFeedback && isCorrect ? '#10b981' :
                                                        showFeedback && isSelected && !isCorrect ? '#ef4444' : undefined
                                                }}
                                            >
                                                <div style={{
                                                    minWidth: '24px', height: '24px', borderRadius: '50%', border: '1px solid #ccc',
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px',
                                                    background: showFeedback && isCorrect ? '#10b981' :
                                                        showFeedback && isSelected && !isCorrect ? '#ef4444' :
                                                            isSelected ? '#0056b3' : 'transparent',
                                                    color: showFeedback && (isCorrect || (isSelected && !isCorrect)) ? 'white' :
                                                        isSelected ? 'white' : '#666'
                                                }}>
                                                    {String.fromCharCode(65 + idx)}
                                                </div>
                                                <span style={{ flex: 1 }}>{opt}</span>
                                                {showFeedback && isCorrect && (
                                                    <span style={{ color: '#10b981', fontWeight: 'bold', fontSize: '1.2rem' }}>✓</span>
                                                )}
                                                {showFeedback && isSelected && !isCorrect && (
                                                    <span style={{ color: '#ef4444', fontWeight: 'bold', fontSize: '1.2rem' }}>✗</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {(examState.mode === 'practice' || examState.answers[examState.questions[examState.currentQuestionIndex]?.id] !== undefined) && (
                                <aside className={styles.explanationPanel}>
                                    <h3 className={styles.explanationTitle}>Detailed Explanation</h3>

                                    {/* Answer Feedback */}
                                    {examState.answers[examState.questions[examState.currentQuestionIndex]?.id] !== undefined && (
                                        <div style={{
                                            padding: '1rem',
                                            borderRadius: '8px',
                                            marginBottom: '1.5rem',
                                            background: examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                            ) ? '#d1fae5' : '#fee2e2',
                                            border: '2px solid',
                                            borderColor: examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                            ) ? '#10b981' : '#ef4444'
                                        }}>
                                            <div style={{
                                                fontWeight: 'bold',
                                                fontSize: '1.1rem',
                                                color: examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                    examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                                ) ? '#065f46' : '#991b1b',
                                                marginBottom: '0.5rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{ fontSize: '1.5rem' }}>
                                                    {examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                        examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                                    ) ? '✓' : '✗'}
                                                </span>
                                                {examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                    examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                                ) ? 'Correct Answer!' : 'Incorrect Answer'}
                                            </div>
                                            {!examState.questions[examState.currentQuestionIndex]?.correctOptions?.includes(
                                                examState.answers[examState.questions[examState.currentQuestionIndex].id]
                                            ) && (
                                                    <div style={{ fontSize: '0.9rem', color: '#7f1d1d', fontWeight: '500' }}>
                                                        The correct answer is: <strong style={{ fontSize: '1rem' }}>
                                                            Option {String.fromCharCode(65 + (examState.questions[examState.currentQuestionIndex]?.correctOptions?.[0] || 0))}
                                                        </strong>
                                                    </div>
                                                )}
                                        </div>
                                    )}

                                    {/* Rationale Section - Primary Explanation */}
                                    {examState.questions[examState.currentQuestionIndex]?.rationale && (
                                        <div style={{ marginBottom: '1.5rem' }}>
                                            <h4 style={{
                                                marginBottom: '0.75rem',
                                                color: '#1e40af',
                                                fontSize: '1rem',
                                                fontWeight: '600',
                                                borderBottom: '2px solid #eff6ff',
                                                paddingBottom: '0.5rem'
                                            }}>
                                                📚 Rationale
                                            </h4>
                                            <div
                                                className={styles.rationaleBox}
                                                style={{
                                                    background: '#f8fafc',
                                                    padding: '1rem',
                                                    borderRadius: '6px',
                                                    border: '1px solid #e2e8f0'
                                                }}
                                                dangerouslySetInnerHTML={{
                                                    __html: examState.questions[examState.currentQuestionIndex]?.rationale || ''
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Educational Objective */}
                                    {examState.questions[examState.currentQuestionIndex]?.scenario && (
                                        <div className={styles.edObjectives}>
                                            <h4 style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem',
                                                marginBottom: '0.75rem'
                                            }}>
                                                🎯 Educational Objective
                                            </h4>
                                            <div
                                                style={{ fontSize: '0.85rem', color: '#166534', lineHeight: '1.6' }}
                                                dangerouslySetInnerHTML={{
                                                    __html: examState.questions[examState.currentQuestionIndex]?.scenario || ''
                                                }}
                                            />
                                        </div>
                                    )}

                                    {/* Show message if no rationale available */}
                                    {!examState.questions[examState.currentQuestionIndex]?.rationale && (
                                        <div style={{
                                            padding: '1rem',
                                            background: '#fef3c7',
                                            border: '1px solid #fbbf24',
                                            borderRadius: '6px',
                                            color: '#92400e',
                                            fontSize: '0.875rem',
                                            textAlign: 'center'
                                        }}>
                                            ⚠️ Detailed explanation not available for this question.
                                        </div>
                                    )}
                                </aside>
                            )}
                        </div>

                        <div className={styles.testingFooter}>
                            <div className={styles.footerLeft}>
                                <button className={styles.endBtn} onClick={() => { if (confirm('End exam?')) submitExam(); }}>End Exam</button>
                                <button className={styles.suspendBtn} onClick={() => setExamState(p => ({ ...p, status: 'setup' }))}>Suspend</button>
                            </div>
                            <button
                                className={styles.nextBtn}
                                onClick={() => {
                                    if (examState.currentQuestionIndex < examState.questions.length - 1) {
                                        setExamState(p => ({ ...p, currentQuestionIndex: p.currentQuestionIndex + 1 }));
                                    } else {
                                        submitExam();
                                    }
                                }}
                            >
                                {examState.currentQuestionIndex === examState.questions.length - 1 ? 'Finish' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                )}

                {examState.status === 'result' && (activeTab === 'Performance' || examState.status === 'result') && (
                    <main className={styles.dashboardContent}>
                        <h2 className={styles.screenTitle}>Performance Analysis</h2>
                        <p className={styles.screenSubtitle}>Detailed breakdown of your session performance.</p>

                        <div className={styles.metricsGrid}>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Total Score</span>
                                <span className={styles.metricValue}>{examState.score}</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Accuracy</span>
                                <span className={styles.metricValue}>{((examState.score / (examState.questions.length || 1)) * 100).toFixed(0)}%</span>
                            </div>
                            <div className={styles.metricCard}>
                                <span className={styles.metricLabel}>Time Elapsed</span>
                                <span className={styles.metricValue}>{formatTime((examState.questions.length * 60) - examState.timeLeft)}</span>
                            </div>
                        </div>

                        <div className={styles.tableWrapper}>
                            <table className={styles.resultsTable}>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Subject / Chapter</th>
                                        <th>Topic</th>
                                        <th>Status</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {examState.questions.map((q, idx) => {
                                        const isCorrect = q.type === 'single'
                                            ? q.correctOptions?.includes(examState.answers[q.id])
                                            : JSON.stringify((q.correctOptions || []).sort()) === JSON.stringify((examState.answers[q.id] || []).sort());
                                        const subjName = subjects.find(s => s.id === q.subjectId)?.name || 'Unknown';

                                        return (
                                            <tr key={q.id} onClick={() => setExamState(p => ({ ...p, status: 'taking', currentQuestionIndex: idx }))}>
                                                <td>{q.customId || 'Q' + (idx + 1)}</td>
                                                <td>
                                                    <div style={{ fontWeight: 500 }}>{subjName}</div>
                                                </td>
                                                <td>{q.clientNeeds ? clientNeedsDisplay[q.clientNeeds] : 'General'}</td>
                                                <td>
                                                    <span className={isCorrect ? styles.statusCorrect : styles.statusIncorrect}>
                                                        {isCorrect ? 'Correct' : 'Incorrect'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button style={{ background: 'transparent', border: 'none', color: '#0056b3', cursor: 'pointer', fontWeight: 500 }}>Review</button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </main>
                )}
            </div>
        </div>
    );
}
