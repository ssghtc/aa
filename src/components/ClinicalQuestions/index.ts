// Clinical Questions Components
export { default as ClinicalQuestionRenderer } from './ClinicalQuestionRenderer';
export { default as SentenceCompletionQuestion } from './SentenceCompletionQuestion';
export { default as DragDropPriorityQuestion } from './DragDropPriorityQuestion';
export { default as CompareClassifyQuestion } from './CompareClassifyQuestion';
export { default as ExpectedNotExpectedQuestion } from './ExpectedNotExpectedQuestion';
export { default as IndicatedNotIndicatedQuestion } from './IndicatedNotIndicatedQuestion';
export { default as SataQuestion } from './SataQuestion';
export { default as PriorityActionQuestion } from './PriorityActionQuestion';
export { default as CaseStudyQuestion } from './CaseStudyQuestion';

// Re-export types
export type {
    ClinicalQuestionType,
    ClinicalQuestion,
    ClinicalAnswer,
    SentenceCompletionQuestion as SentenceCompletionQuestionType,
    DragDropPriorityQuestion as DragDropPriorityQuestionType,
    CompareClassifyQuestion as CompareClassifyQuestionType,
    ExpectedNotExpectedQuestion as ExpectedNotExpectedQuestionType,
    IndicatedNotIndicatedQuestion as IndicatedNotIndicatedQuestionType,
    SataQuestion as SataQuestionType,
    PriorityActionQuestion as PriorityActionQuestionType,
    CaseStudyQuestion as CaseStudyQuestionType,
} from '@/types/clinical';
