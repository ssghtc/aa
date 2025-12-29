'use client';

import React, { useState } from 'react';
import type { PriorityActionQuestion, PriorityActionAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: PriorityActionQuestion;
    onAnswer?: (answer: PriorityActionAnswer) => void;
    showResults?: boolean;
}

export default function PriorityActionQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [selectedActionId, setSelectedActionId] = useState<string | null>(null);

    const handleSelect = (actionId: string) => {
        setSelectedActionId(actionId);
        onAnswer?.({ selectedActionId: actionId });
    };

    const sortedActions = [...question.actions].sort((a, b) => a.priorityRank - b.priorityRank);

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={`${styles.badge} ${styles.urgent}`}>⚡ Priority Action</span>
                <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                    {question.difficulty}
                </span>
            </div>

            <h3 className={styles.title}>{question.title}</h3>
            <p className={styles.instruction}>{question.instruction}</p>

            <div className={`${styles.scenario} ${styles.emergency}`}>
                <strong>🚨 Emergency Scenario:</strong>
                <p>{question.emergencyScenario}</p>
            </div>

            <div className={styles.actionsList}>
                {question.actions.map(action => {
                    const isSelected = selectedActionId === action.id;
                    const isCorrect = showResults && action.id === question.correctActionId;
                    const isWrongSelection = showResults && isSelected && action.id !== question.correctActionId;

                    return (
                        <button
                            key={action.id}
                            className={`${styles.actionOption} ${isSelected ? styles.selected : ''} ${isCorrect ? styles.correctAction : ''} ${isWrongSelection ? styles.incorrectAction : ''}`}
                            onClick={() => !showResults && handleSelect(action.id)}
                            disabled={showResults}
                        >
                            <span className={styles.actionRadio}>
                                {isSelected ? '●' : '○'}
                            </span>
                            <span className={styles.actionText}>{action.text}</span>
                            {showResults && isCorrect && (
                                <span className={styles.priorityBadge}>Priority #1</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {showResults && (
                <div className={styles.priorityExplanation}>
                    <strong>📋 Priority Order:</strong>
                    <ol className={styles.priorityList}>
                        {sortedActions.map((action, index) => (
                            <li key={action.id} className={action.id === question.correctActionId ? styles.topPriority : ''}>
                                {action.text}
                            </li>
                        ))}
                    </ol>
                </div>
            )}

            {showResults && question.rationale && (
                <div className={styles.rationale}>
                    <strong>📚 Rationale:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.rationale }} />
                </div>
            )}
        </div>
    );
}
