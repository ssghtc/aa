// =====================================================
// CLINICAL QUESTION TYPES
// =====================================================

export type ClinicalQuestionType =
    | 'sentence_completion'      // 1. Sentence-Completion Clinical Reasoning
    | 'drag_drop_priority'       // 2. Drag-and-Drop Priority Findings
    | 'compare_classify'         // 3. Compare-and-Classify
    | 'expected_not_expected'    // 4. Expected vs Not Expected Findings
    | 'indicated_not_indicated'  // 5. Indicated vs Not Indicated Intervention
    | 'sata'                     // 6. Select-All-That-Apply
    | 'priority_action'          // 7. Priority Action
    | 'case_study';              // 8. Case-Study Multi-Item

export type Difficulty = 'easy' | 'medium' | 'hard';

// Base interface for all clinical questions
export interface ClinicalQuestionBase {
    id: string;
    questionType: ClinicalQuestionType;
    title: string;
    instruction: string;
    scenario?: string;
    rationale?: string;
    difficulty?: Difficulty;
    subjectId: string;
    chapterId: string;
    clinicalTopic?: string;
    clinicalFocus?: string;
    createdAt?: string;
    updatedAt?: string;
}

// =====================================================
// 1. SENTENCE-COMPLETION QUESTION
// =====================================================
export interface DropdownGroup {
    id: string;
    options: string[];
    correctAnswer: string;
}

export interface SentenceCompletionQuestion extends ClinicalQuestionBase {
    questionType: 'sentence_completion';
    sentenceTemplate: string;  // e.g., "A patient with {{1}} is expected to receive {{2}}."
    dropdownGroups: DropdownGroup[];
}

// =====================================================
// 2. DRAG-DROP PRIORITY QUESTION
// =====================================================
export interface DragDropItem {
    id: string;
    text: string;
    requiresFollowup: boolean;
}

export interface DropZone {
    id: string;
    label: string;
}

export interface DragDropPriorityQuestion extends ClinicalQuestionBase {
    questionType: 'drag_drop_priority';
    items: DragDropItem[];
    dropZones: DropZone[];
    minPriorityItems?: number;
    maxPriorityItems?: number;
}

// =====================================================
// 3. COMPARE-CLASSIFY QUESTION
// =====================================================
export interface Condition {
    id: string;
    name: string;
}

export interface Characteristic {
    id: string;
    text: string;
    appliesTo: string[];  // Array of condition IDs
}

export interface CompareClassifyQuestion extends ClinicalQuestionBase {
    questionType: 'compare_classify';
    conditions: Condition[];
    characteristics: Characteristic[];
    allowMultiple?: boolean;
}

// =====================================================
// 4. EXPECTED VS NOT EXPECTED QUESTION
// =====================================================
export interface Finding {
    id: string;
    text: string;
    isExpected: boolean;
}

export interface ExpectedNotExpectedQuestion extends ClinicalQuestionBase {
    questionType: 'expected_not_expected';
    conditionName: string;
    findings: Finding[];
}

// =====================================================
// 5. INDICATED VS NOT INDICATED QUESTION
// =====================================================
export interface Intervention {
    id: string;
    text: string;
    isIndicated: boolean;
    rationale?: string;
}

export interface IndicatedNotIndicatedQuestion extends ClinicalQuestionBase {
    questionType: 'indicated_not_indicated';
    clinicalSituation: string;
    interventions: Intervention[];
}

// =====================================================
// 6. SATA (SELECT ALL THAT APPLY) QUESTION
// =====================================================
export interface SataOption {
    id: string;
    text: string;
    isCorrect: boolean;
}

export interface SataQuestion extends ClinicalQuestionBase {
    questionType: 'sata';
    prompt: string;
    options: SataOption[];
    minCorrectForPartial?: number;
}

// =====================================================
// 7. PRIORITY ACTION QUESTION
// =====================================================
export interface ActionOption {
    id: string;
    text: string;
    priorityRank: number;
}

export interface PriorityActionQuestion extends ClinicalQuestionBase {
    questionType: 'priority_action';
    emergencyScenario: string;
    actions: ActionOption[];
    correctActionId: string;
}

// =====================================================
// 8. CASE STUDY QUESTION
// =====================================================
export interface VitalSigns {
    bp?: string;
    hr?: number;
    hrRhythm?: string;
    rr?: number;
    temp?: number;
    spo2?: number;
    bloodGlucose?: number;
}

export type SubQuestionType = 'single_choice' | 'multiple_choice' | 'sata' | 'priority' | 'drag_drop' | 'expected_finding';
export type FocusArea = 'assessment' | 'diagnostics' | 'interventions' | 'complications' | 'priorities' | 'evaluation';

export interface CaseStudySubQuestionOption {
    id: string;
    text: string;
    isCorrect?: boolean;  // For SATA type
}

export interface CaseStudySubQuestion {
    id: string;
    questionOrder: number;
    focusArea: FocusArea;
    questionText: string;
    subQuestionType: SubQuestionType;
    options: CaseStudySubQuestionOption[];
    correctAnswer: string | string[];  // Single ID or array of IDs
    rationale?: string;
}

export interface CaseStudyQuestion extends ClinicalQuestionBase {
    questionType: 'case_study';
    patientInfo: string;
    history?: string;
    vitalSigns?: VitalSigns;
    labValues?: Record<string, string | number>;
    assessmentFindings?: string;
    primaryCondition: string;
    subQuestions: CaseStudySubQuestion[];
}

// =====================================================
// UNION TYPE FOR ALL CLINICAL QUESTIONS
// =====================================================
export type ClinicalQuestion =
    | SentenceCompletionQuestion
    | DragDropPriorityQuestion
    | CompareClassifyQuestion
    | ExpectedNotExpectedQuestion
    | IndicatedNotIndicatedQuestion
    | SataQuestion
    | PriorityActionQuestion
    | CaseStudyQuestion;

// =====================================================
// USER ANSWER TYPES
// =====================================================
export interface SentenceCompletionAnswer {
    answers: Record<string, string>;  // { "1": "selected option", "2": "selected option" }
}

export interface DragDropAnswer {
    priorityItems: string[];  // IDs of items placed in priority zone
    monitorItems: string[];   // IDs of items placed in monitor zone
}

export interface CompareClassifyAnswer {
    classifications: Record<string, string>;  // { characteristicId: conditionId }
}

export interface ExpectedNotExpectedAnswer {
    answers: Record<string, boolean>;  // { findingId: userAnswer (true = expected) }
}

export interface IndicatedNotIndicatedAnswer {
    answers: Record<string, boolean>;  // { interventionId: userAnswer (true = indicated) }
}

export interface SataAnswer {
    selectedIds: string[];  // Array of selected option IDs
}

export interface PriorityActionAnswer {
    selectedActionId: string;
}

export interface CaseStudyAnswer {
    subAnswers: Record<string, string | string[]>;  // { subQuestionId: answer(s) }
}

export type ClinicalAnswer =
    | SentenceCompletionAnswer
    | DragDropAnswer
    | CompareClassifyAnswer
    | ExpectedNotExpectedAnswer
    | IndicatedNotIndicatedAnswer
    | SataAnswer
    | PriorityActionAnswer
    | CaseStudyAnswer;

// =====================================================
// SCORING/RESULTS
// =====================================================
export interface QuestionResult {
    questionId: string;
    isCorrect: boolean;
    score: number;       // 0-100
    maxScore: number;
    feedback?: string;
}

export interface CaseStudyResult extends QuestionResult {
    subResults: QuestionResult[];
}
