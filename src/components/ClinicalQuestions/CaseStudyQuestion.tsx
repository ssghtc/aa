'use client';

import React, { useState } from 'react';
import type { CaseStudyQuestion, CaseStudyAnswer, CaseStudySubQuestion } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: CaseStudyQuestion;
    onAnswer?: (answer: CaseStudyAnswer) => void;
    showResults?: boolean;
}

export default function CaseStudyQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [currentSubQuestion, setCurrentSubQuestion] = useState(0);
    const [subAnswers, setSubAnswers] = useState<Record<string, string | string[]>>({});

    const handleSubAnswer = (subQuestionId: string, answer: string | string[]) => {
        const newAnswers = { ...subAnswers, [subQuestionId]: answer };
        setSubAnswers(newAnswers);
        onAnswer?.({ subAnswers: newAnswers });
    };

    const handleSataToggle = (subQuestionId: string, optionId: string) => {
        const currentAnswer = (subAnswers[subQuestionId] as string[]) || [];
        const newAnswer = currentAnswer.includes(optionId)
            ? currentAnswer.filter(id => id !== optionId)
            : [...currentAnswer, optionId];
        handleSubAnswer(subQuestionId, newAnswer);
    };

    const renderVitalSigns = () => {
        if (!question.vitalSigns) return null;
        const vs = question.vitalSigns;
        return (
            <div className={styles.vitalSigns}>
                <h5>Vital Signs</h5>
                <div className={styles.vitalsGrid}>
                    {vs.bp && <div><strong>BP:</strong> {vs.bp}</div>}
                    {vs.hr && <div><strong>HR:</strong> {vs.hr} {vs.hrRhythm && `(${vs.hrRhythm})`}</div>}
                    {vs.rr && <div><strong>RR:</strong> {vs.rr}</div>}
                    {vs.temp && <div><strong>Temp:</strong> {vs.temp}°C</div>}
                    {vs.spo2 && <div><strong>SpO2:</strong> {vs.spo2}%</div>}
                    {vs.bloodGlucose && <div><strong>BG:</strong> {vs.bloodGlucose} mg/dL</div>}
                </div>
            </div>
        );
    };

    const renderLabValues = () => {
        if (!question.labValues) return null;
        return (
            <div className={styles.labValues}>
                <h5>Lab Values</h5>
                <div className={styles.labsGrid}>
                    {Object.entries(question.labValues).map(([key, value]) => (
                        <div key={key}><strong>{key}:</strong> {value}</div>
                    ))}
                </div>
            </div>
        );
    };

    const renderSubQuestion = (subQ: CaseStudySubQuestion) => {
        const userAnswer = subAnswers[subQ.id];

        const isOptionCorrect = (optionId: string): boolean => {
            if (Array.isArray(subQ.correctAnswer)) {
                return subQ.correctAnswer.includes(optionId);
            }
            return subQ.correctAnswer === optionId;
        };

        const isUserSelectionCorrect = (optionId: string): boolean | null => {
            if (!showResults) return null;
            if (subQ.subQuestionType === 'sata') {
                const userSelected = Array.isArray(userAnswer) && userAnswer.includes(optionId);
                const shouldBeSelected = isOptionCorrect(optionId);
                return userSelected === shouldBeSelected;
            }
            return userAnswer === optionId && isOptionCorrect(optionId);
        };

        return (
            <div key={subQ.id} className={styles.subQuestion}>
                <div className={styles.subQuestionHeader}>
                    <span className={styles.focusBadge}>{subQ.focusArea}</span>
                    <span className={styles.questionNumber}>Question {subQ.questionOrder}</span>
                </div>

                <p className={styles.subQuestionText}>{subQ.questionText}</p>

                <div className={styles.subOptions}>
                    {subQ.options.map(option => {
                        const isSelected = subQ.subQuestionType === 'sata'
                            ? Array.isArray(userAnswer) && userAnswer.includes(option.id)
                            : userAnswer === option.id;

                        const correct = isUserSelectionCorrect(option.id);

                        if (subQ.subQuestionType === 'sata') {
                            return (
                                <label
                                    key={option.id}
                                    className={`${styles.subOption} ${styles.sataSubOption} ${isSelected ? styles.selected : ''} ${showResults && isOptionCorrect(option.id) ? styles.correct : ''} ${showResults && isSelected && !isOptionCorrect(option.id) ? styles.incorrect : ''}`}
                                >
                                    <input
                                        type="checkbox"
                                        checked={isSelected}
                                        onChange={() => !showResults && handleSataToggle(subQ.id, option.id)}
                                        disabled={showResults}
                                    />
                                    <span className={styles.optionLabel}>{option.id}. {option.text}</span>
                                </label>
                            );
                        }

                        return (
                            <button
                                key={option.id}
                                className={`${styles.subOption} ${isSelected ? styles.selected : ''} ${showResults && isOptionCorrect(option.id) ? styles.correct : ''} ${showResults && isSelected && !isOptionCorrect(option.id) ? styles.incorrect : ''}`}
                                onClick={() => !showResults && handleSubAnswer(subQ.id, option.id)}
                                disabled={showResults}
                            >
                                <span className={styles.optionRadio}>{isSelected ? '●' : '○'}</span>
                                <span className={styles.optionLabel}>{option.id}. {option.text}</span>
                            </button>
                        );
                    })}
                </div>

                {showResults && subQ.rationale && (
                    <div className={styles.subRationale}>
                        💡 {subQ.rationale}
                    </div>
                )}
            </div>
        );
    };

    const sortedSubQuestions = [...question.subQuestions].sort((a, b) => a.questionOrder - b.questionOrder);

    return (
        <div className={`${styles.questionCard} ${styles.caseStudyCard}`}>
            <div className={styles.questionHeader}>
                <span className={`${styles.badge} ${styles.caseStudy}`}>📋 Case Study</span>
                {question.difficulty && (
                    <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                        {question.difficulty}
                    </span>
                )}
            </div>

            <h3 className={styles.title}>{question.title}</h3>

            {/* Case Information Panel */}
            <div className={styles.casePanel}>
                <div className={styles.patientInfo}>
                    <h4>👤 Patient Information</h4>
                    <p>{question.patientInfo}</p>
                </div>

                {question.history && (
                    <div className={styles.historySection}>
                        <h5>📜 History</h5>
                        <p>{question.history}</p>
                    </div>
                )}

                <div className={styles.clinicalData}>
                    {renderVitalSigns()}
                    {renderLabValues()}
                </div>

                {question.assessmentFindings && (
                    <div className={styles.assessmentSection}>
                        <h5>🔍 Assessment Findings</h5>
                        <p>{question.assessmentFindings}</p>
                    </div>
                )}

                <div className={styles.conditionTag}>
                    <strong>Primary Condition:</strong> {question.primaryCondition}
                </div>
            </div>

            {/* Sub Questions Navigation */}
            <div className={styles.subQuestionNav}>
                {sortedSubQuestions.map((sq, index) => (
                    <button
                        key={sq.id}
                        className={`${styles.navDot} ${currentSubQuestion === index ? styles.active : ''} ${subAnswers[sq.id] ? styles.answered : ''}`}
                        onClick={() => setCurrentSubQuestion(index)}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Current Sub Question */}
            {renderSubQuestion(sortedSubQuestions[currentSubQuestion])}

            {/* Navigation Buttons */}
            <div className={styles.subQuestionButtons}>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentSubQuestion(Math.max(0, currentSubQuestion - 1))}
                    disabled={currentSubQuestion === 0}
                >
                    ← Previous
                </button>
                <span className={styles.questionProgress}>
                    {currentSubQuestion + 1} of {sortedSubQuestions.length}
                </span>
                <button
                    className={styles.navButton}
                    onClick={() => setCurrentSubQuestion(Math.min(sortedSubQuestions.length - 1, currentSubQuestion + 1))}
                    disabled={currentSubQuestion === sortedSubQuestions.length - 1}
                >
                    Next →
                </button>
            </div>

            {showResults && question.rationale && (
                <div className={styles.rationale}>
                    <strong>📚 Overall Case Rationale:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.rationale }} />
                </div>
            )}
        </div>
    );
}
