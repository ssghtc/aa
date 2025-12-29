'use client';

import React, { useState } from 'react';
import type { ExpectedNotExpectedQuestion, ExpectedNotExpectedAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: ExpectedNotExpectedQuestion;
    onAnswer?: (answer: ExpectedNotExpectedAnswer) => void;
    showResults?: boolean;
}

export default function ExpectedNotExpectedQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [answers, setAnswers] = useState<Record<string, boolean>>({});

    const handleSelect = (findingId: string, isExpected: boolean) => {
        const newAnswers = { ...answers, [findingId]: isExpected };
        setAnswers(newAnswers);
        onAnswer?.({ answers: newAnswers });
    };

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Expected vs Not Expected</span>
                <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3 className={styles.title}>{question.title}</h3>
            <p className={styles.instruction}>
                {question.instruction} <strong>{question.conditionName}</strong>
            </p>

            {question.scenario && (
                <div className={styles.scenario}>
                    <strong>Clinical Scenario:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.scenario }} />
                </div>
            )}

            <div className={styles.findingsGrid}>
                <div className={styles.gridHeader}>
                    <div className={styles.findingColumn}>Finding</div>
                    <div className={styles.expectedColumn}>Expected</div>
                    <div className={styles.notExpectedColumn}>Not Expected</div>
                </div>

                {question.findings.map(finding => {
                    const userAnswer = answers[finding.id];
                    const hasAnswered = userAnswer !== undefined;
                    const isCorrect = showResults && hasAnswered && userAnswer === finding.isExpected;
                    const isWrong = showResults && hasAnswered && userAnswer !== finding.isExpected;

                    return (
                        <div
                            key={finding.id}
                            className={`${styles.gridRow} ${isCorrect ? styles.correct : ''} ${isWrong ? styles.incorrect : ''}`}
                        >
                            <div className={styles.findingText}>{finding.text}</div>
                            <div className={styles.optionCell}>
                                <button
                                    className={`${styles.toggleButton} ${userAnswer === true ? styles.selected : ''} ${showResults && finding.isExpected ? styles.correctAnswer : ''}`}
                                    onClick={() => !showResults && handleSelect(finding.id, true)}
                                    disabled={showResults}
                                >
                                    ✓
                                </button>
                            </div>
                            <div className={styles.optionCell}>
                                <button
                                    className={`${styles.toggleButton} ${userAnswer === false ? styles.selected : ''} ${showResults && !finding.isExpected ? styles.correctAnswer : ''}`}
                                    onClick={() => !showResults && handleSelect(finding.id, false)}
                                    disabled={showResults}
                                >
                                    ✗
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>

            {showResults && question.rationale && (
                <div className={styles.rationale}>
                    <strong>📚 Rationale:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.rationale }} />
                </div>
            )}
        </div>
    );
}
