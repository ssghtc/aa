'use client';

import React from 'react';
import type { ClinicalQuestion, ClinicalAnswer } from '@/types/clinical';
import SentenceCompletionQuestionComponent from './SentenceCompletionQuestion';
import DragDropPriorityQuestionComponent from './DragDropPriorityQuestion';
import CompareClassifyQuestionComponent from './CompareClassifyQuestion';
import ExpectedNotExpectedQuestionComponent from './ExpectedNotExpectedQuestion';
import IndicatedNotIndicatedQuestionComponent from './IndicatedNotIndicatedQuestion';
import SataQuestionComponent from './SataQuestion';
import PriorityActionQuestionComponent from './PriorityActionQuestion';
import CaseStudyQuestionComponent from './CaseStudyQuestion';

interface Props {
    question: ClinicalQuestion;
    onAnswer?: (answer: ClinicalAnswer) => void;
    showResults?: boolean;
}

/**
 * Main component that renders any clinical question type
 * Automatically selects the correct component based on questionType
 */
export default function ClinicalQuestionRenderer({ question, onAnswer, showResults = false }: Props) {
    switch (question.questionType) {
        case 'sentence_completion':
            return (
                <SentenceCompletionQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'drag_drop_priority':
            return (
                <DragDropPriorityQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'compare_classify':
            return (
                <CompareClassifyQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'expected_not_expected':
            return (
                <ExpectedNotExpectedQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'indicated_not_indicated':
            return (
                <IndicatedNotIndicatedQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'sata':
            return (
                <SataQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'priority_action':
            return (
                <PriorityActionQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        case 'case_study':
            return (
                <CaseStudyQuestionComponent
                    question={question}
                    onAnswer={onAnswer}
                    showResults={showResults}
                />
            );

        default:
            return (
                <div style={{ padding: '2rem', color: '#ef4444' }}>
                    Unknown question type: {(question as ClinicalQuestion).questionType}
                </div>
            );
    }
}
