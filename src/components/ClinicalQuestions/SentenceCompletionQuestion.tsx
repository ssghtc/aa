'use client';

import React, { useState } from 'react';
import type { SentenceCompletionQuestion, SentenceCompletionAnswer } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: SentenceCompletionQuestion;
    onAnswer?: (answer: SentenceCompletionAnswer) => void;
    showResults?: boolean;
}

export default function SentenceCompletionQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [answers, setAnswers] = useState<Record<string, string>>({});

    const handleSelect = (groupId: string, value: string) => {
        const newAnswers = { ...answers, [groupId]: value };
        setAnswers(newAnswers);
        onAnswer?.({ answers: newAnswers });
    };

    const renderSentence = () => {
        const parts = question.sentenceTemplate.split(/(\{\{\d+\}\})/g);

        return parts.map((part, index) => {
            const match = part.match(/\{\{(\d+)\}\}/);
            if (match) {
                const groupId = match[1];
                const group = question.dropdownGroups.find(g => g.id === groupId);
                if (!group) return null;

                const isCorrect = showResults && answers[groupId] === group.correctAnswer;
                const isWrong = showResults && answers[groupId] && answers[groupId] !== group.correctAnswer;

                return (
                    <select
                        key={index}
                        className={`${styles.dropdown} ${isCorrect ? styles.correct : ''} ${isWrong ? styles.incorrect : ''}`}
                        value={answers[groupId] || ''}
                        onChange={(e) => handleSelect(groupId, e.target.value)}
                        disabled={showResults}
                    >
                        <option value="">Select...</option>
                        {group.options.map((option, i) => (
                            <option key={i} value={option}>{option}</option>
                        ))}
                    </select>
                );
            }
            return <span key={index}>{part}</span>;
        });
    };

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Sentence Completion</span>
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

            <div className={styles.sentenceArea}>
                {renderSentence()}
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
