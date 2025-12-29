'use client';

import React, { useState } from 'react';
import type { IndicatedNotIndicatedQuestion, IndicatedNotIndicatedAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: IndicatedNotIndicatedQuestion;
    onAnswer?: (answer: IndicatedNotIndicatedAnswer) => void;
    showResults?: boolean;
}

export default function IndicatedNotIndicatedQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [answers, setAnswers] = useState<Record<string, boolean>>({});

    const handleSelect = (interventionId: string, isIndicated: boolean) => {
        const newAnswers = { ...answers, [interventionId]: isIndicated };
        setAnswers(newAnswers);
        onAnswer?.({ answers: newAnswers });
    };

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Indicated vs Not Indicated</span>
                <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3 className={styles.title}>{question.title}</h3>
            <p className={styles.instruction}>{question.instruction}</p>

            <div className={styles.scenario}>
                <strong>Clinical Situation:</strong>
                <p>{question.clinicalSituation}</p>
            </div>

            <div className={styles.interventionsGrid}>
                <div className={styles.gridHeader}>
                    <div className={styles.interventionColumn}>Intervention</div>
                    <div className={styles.indicatedColumn}>Indicated</div>
                    <div className={styles.notIndicatedColumn}>Not Indicated</div>
                </div>

                {question.interventions.map(intervention => {
                    const userAnswer = answers[intervention.id];
                    const hasAnswered = userAnswer !== undefined;
                    const isCorrect = showResults && hasAnswered && userAnswer === intervention.isIndicated;
                    const isWrong = showResults && hasAnswered && userAnswer !== intervention.isIndicated;

                    return (
                        <div key={intervention.id}>
                            <div
                                className={`${styles.gridRow} ${isCorrect ? styles.correct : ''} ${isWrong ? styles.incorrect : ''}`}
                            >
                                <div className={styles.interventionText}>{intervention.text}</div>
                                <div className={styles.optionCell}>
                                    <button
                                        className={`${styles.toggleButton} ${styles.indicatedBtn} ${userAnswer === true ? styles.selected : ''} ${showResults && intervention.isIndicated ? styles.correctAnswer : ''}`}
                                        onClick={() => !showResults && handleSelect(intervention.id, true)}
                                        disabled={showResults}
                                    >
                                        ✓
                                    </button>
                                </div>
                                <div className={styles.optionCell}>
                                    <button
                                        className={`${styles.toggleButton} ${styles.notIndicatedBtn} ${userAnswer === false ? styles.selected : ''} ${showResults && !intervention.isIndicated ? styles.correctAnswer : ''}`}
                                        onClick={() => !showResults && handleSelect(intervention.id, false)}
                                        disabled={showResults}
                                    >
                                        ✗
                                    </button>
                                </div>
                            </div>
                            {showResults && intervention.rationale && (
                                <div className={styles.interventionRationale}>
                                    💡 {intervention.rationale}
                                </div>
                            )}
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
