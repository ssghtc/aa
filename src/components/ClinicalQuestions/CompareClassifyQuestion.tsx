'use client';

import React, { useState } from 'react';
import type { CompareClassifyQuestion, CompareClassifyAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: CompareClassifyQuestion;
    onAnswer?: (answer: CompareClassifyAnswer) => void;
    showResults?: boolean;
}

export default function CompareClassifyQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [classifications, setClassifications] = useState<Record<string, string>>({});

    const handleSelect = (characteristicId: string, conditionId: string) => {
        const newClassifications = { ...classifications, [characteristicId]: conditionId };
        setClassifications(newClassifications);
        onAnswer?.({ classifications: newClassifications });
    };

    const isCorrect = (characteristicId: string, conditionId: string): boolean => {
        const characteristic = question.characteristics.find(c => c.id === characteristicId);
        return characteristic?.appliesTo.includes(conditionId) || false;
    };

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Compare & Classify</span>
                <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3 className={styles.title}>{question.title}</h3>
            <p className={styles.instruction}>{question.instruction}</p>

            {question.scenario && (
                <div className={styles.scenario}>
                    <strong>Clinical Scenario:</strong>
                    <p>{question.scenario}</p>
                </div>
            )}

            <div className={styles.compareTable}>
                <div className={styles.tableHeader}>
                    <div className={styles.characteristicHeader}>Characteristic</div>
                    {question.conditions.map(condition => (
                        <div key={condition.id} className={styles.conditionHeader}>
                            {condition.name}
                        </div>
                    ))}
                </div>

                {question.characteristics.map(characteristic => {
                    const selectedCondition = classifications[characteristic.id];
                    const showCorrectAnswer = showResults && selectedCondition;
                    const userIsCorrect = showCorrectAnswer && isCorrect(characteristic.id, selectedCondition);

                    return (
                        <div
                            key={characteristic.id}
                            className={`${styles.tableRow} ${showCorrectAnswer ? (userIsCorrect ? styles.correct : styles.incorrect) : ''}`}
                        >
                            <div className={styles.characteristicCell}>
                                {characteristic.text}
                            </div>
                            {question.conditions.map(condition => (
                                <div key={condition.id} className={styles.conditionCell}>
                                    <button
                                        className={`${styles.classifyButton} ${selectedCondition === condition.id ? styles.selected : ''}`}
                                        onClick={() => !showResults && handleSelect(characteristic.id, condition.id)}
                                        disabled={showResults}
                                    >
                                        {selectedCondition === condition.id ? '●' : '○'}
                                    </button>
                                    {showResults && characteristic.appliesTo.includes(condition.id) && selectedCondition !== condition.id && (
                                        <span className={styles.correctIndicator}>✓</span>
                                    )}
                                </div>
                            ))}
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
