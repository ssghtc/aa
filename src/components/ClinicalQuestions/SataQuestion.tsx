'use client';

import React, { useState } from 'react';
import type { SataQuestion, SataAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: SataQuestion;
    onAnswer?: (answer: SataAnswer) => void;
    showResults?: boolean;
}

export default function SataQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const handleToggle = (optionId: string) => {
        const newSelected = selectedIds.includes(optionId)
            ? selectedIds.filter(id => id !== optionId)
            : [...selectedIds, optionId];

        setSelectedIds(newSelected);
        onAnswer?.({ selectedIds: newSelected });
    };

    const getScore = () => {
        const correctOptions = question.options.filter(o => o.isCorrect);
        const correctlySelected = selectedIds.filter(id =>
            question.options.find(o => o.id === id)?.isCorrect
        );
        const incorrectlySelected = selectedIds.filter(id =>
            !question.options.find(o => o.id === id)?.isCorrect
        );

        return {
            correct: correctlySelected.length,
            total: correctOptions.length,
            incorrect: incorrectlySelected.length
        };
    };

    const score = showResults ? getScore() : null;

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Select All That Apply</span>
                <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3 className={styles.title}>{question.title}</h3>

            {question.scenario && (
                <div className={styles.scenario}>
                    <strong>Clinical Scenario:</strong>
                    <p>{question.scenario}</p>
                </div>
            )}

            <p className={styles.prompt}>{question.prompt}</p>

            <div className={styles.optionsList}>
                {question.options.map(option => {
                    const isSelected = selectedIds.includes(option.id);
                    const showCorrect = showResults && option.isCorrect;
                    const showIncorrect = showResults && isSelected && !option.isCorrect;
                    const missedCorrect = showResults && !isSelected && option.isCorrect;

                    return (
                        <label
                            key={option.id}
                            className={`${styles.sataOption} ${isSelected ? styles.selected : ''} ${showCorrect && isSelected ? styles.correct : ''} ${showIncorrect ? styles.incorrect : ''} ${missedCorrect ? styles.missed : ''}`}
                        >
                            <input
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => !showResults && handleToggle(option.id)}
                                disabled={showResults}
                                className={styles.checkbox}
                            />
                            <span className={styles.checkboxCustom}>
                                {isSelected ? '☑' : '☐'}
                            </span>
                            <span className={styles.optionText}>{option.text}</span>
                            {showResults && (
                                <span className={styles.optionStatus}>
                                    {option.isCorrect ? '✓ Correct' : isSelected ? '✗ Incorrect' : ''}
                                </span>
                            )}
                        </label>
                    );
                })}
            </div>

            {showResults && score && (
                <div className={styles.scoreBox}>
                    <span className={styles.scoreLabel}>Score:</span>
                    <span className={styles.scoreValue}>{score.correct}/{score.total} correct</span>
                    {score.incorrect > 0 && (
                        <span className={styles.incorrectCount}>({score.incorrect} incorrect selections)</span>
                    )}
                </div>
            )}

            {showResults && question.rationale && (
                <div className={styles.rationale}>
                    <strong>📚 Rationale:</strong>
                    <p>{question.rationale}</p>
                </div>
            )}
        </div>
    );
}
