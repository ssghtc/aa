import React, { useState } from 'react';
import { Question } from '@/types';

interface InputQuestionProps {
    question: Question;
    onAnswer: (value: string) => void;
}

export default function InputQuestion({ question, onAnswer }: InputQuestionProps) {
    const [value, setValue] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setValue(e.target.value);
        onAnswer(e.target.value);
        setIsSubmitted(false); // Reset submission state on change
    };

    const checkAnswer = () => {
        setIsSubmitted(true);
    };

    const isCorrect = () => {
        if (!question.correctAnswerInput) return false;

        // Check if it's numeric
        const numValue = parseFloat(value);
        const correctNum = parseFloat(question.correctAnswerInput);

        if (!isNaN(numValue) && !isNaN(correctNum)) {
            const tolerance = question.answerTolerance || 0;
            return Math.abs(numValue - correctNum) <= tolerance;
        }

        // Text comparison (case insensitive)
        return value.trim().toLowerCase() === question.correctAnswerInput.trim().toLowerCase();
    };

    return (
        <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '12px',
            border: '2px solid #e2e8f0'
        }}>
            <div style={{ marginBottom: '1.5rem' }}>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: '#475569', fontWeight: 500 }}>
                    Your Answer:
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                        type="text"
                        value={value}
                        onChange={handleChange}
                        placeholder="Type your answer here..."
                        style={{
                            padding: '0.75rem 1rem',
                            borderRadius: '8px',
                            border: '1px solid #cbd5e1',
                            fontSize: '1.1rem',
                            width: '200px',
                            outline: 'none'
                        }}
                    />
                    {question.inputUnit && (
                        <span style={{ color: '#64748b', fontWeight: 500 }}>{question.inputUnit}</span>
                    )}
                </div>
            </div>

            <button
                onClick={checkAnswer}
                style={{
                    padding: '0.5rem 1.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 600
                }}
            >
                Submit Answer
            </button>

            {isSubmitted && (
                <div style={{ marginTop: '1rem' }}>
                    {isCorrect() ? (
                        <div style={{ color: '#16a34a', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✓</span> Correct!
                        </div>
                    ) : (
                        <div style={{ color: '#dc2626', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span>✕</span> Incorrect. The correct answer is {question.correctAnswerInput} {question.inputUnit}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
