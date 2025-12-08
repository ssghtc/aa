export interface Chapter {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
    chapters: Chapter[];
}

export type QuestionType =
    | 'single' | 'multiple' | 'diagram' | 'cloze' | 'matrix' | 'ordering' | 'input'
    | 'sentence_completion' | 'drag_drop_priority' | 'compare_classify'
    | 'expected_not_expected' | 'indicated_not_indicated' | 'sata'
    | 'priority_action' | 'case_study';

export interface DiagramElement {
    id: string;
    label: string;
    description?: string;
    options: string[];
    correctAnswer: string;
    position: { x: number; y: number };
}

export interface ClozeElement {
    id: string;
    options: string[];
    correctAnswer: string;
}

export interface MatrixRow {
    id: string;
    text: string;
    correctColumnId: string;
}

export interface MatrixColumn {
    id: string;
    label: string;
}

export interface OrderingItem {
    id: string;
    text: string;
}

// Clinical Types Definitions
export interface DropdownGroup { id: string; options: string[]; correctAnswer: string; }
export interface DragDropItem { id: string; text: string; requiresFollowup: boolean; }
export interface DropZone { id: string; label: string; }
export interface ClassificationCondition { id: string; name: string; }
export interface ClassificationCharacteristic { id: string; text: string; appliesTo: string[]; }
export interface ExpectedFinding { id: string; text: string; isExpected: boolean; }
export interface IndicatedIntervention { id: string; text: string; isIndicated: boolean; rationale?: string; }
export interface SataOption { id: string; text: string; isCorrect: boolean; }
export interface PriorityActionOption { id: string; text: string; priorityRank: number; }
export interface CaseStudySubQuestion {
    id: string;
    questionOrder: number;
    focusArea: string;
    questionText: string;
    subQuestionType: string;
    options: any[];
    correctAnswer: any;
    rationale?: string;
}

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options: string[];
    correctOptions: number[]; // Array of indices for correct answers
    subjectId: string;
    chapterId: string;
    difficulty?: 'easy' | 'medium' | 'hard';
    rationale?: string;
    scenario?: string;

    // Optional Exhibit Content (for Case Studies)
    exhibitContent?: string;

    // For diagram questions
    diagramUrl?: string;
    diagramType?: 'flowchart' | 'labeled-diagram' | 'process-flow';
    diagramElements?: DiagramElement[];

    // For cloze questions
    clozeText?: string;
    clozeElements?: ClozeElement[];

    // For matrix questions
    matrixColumns?: MatrixColumn[];
    matrixRows?: MatrixRow[];

    // For ordering questions
    orderingItems?: OrderingItem[]; // The items in the correct order (for storage) or initial order
    correctOrder?: string[]; // Array of item IDs in the correct order

    // For input/calculation questions
    correctAnswerInput?: string; // The numeric or text answer
    answerTolerance?: number; // Optional tolerance for numeric answers
    inputUnit?: string; // e.g., "ml/hr", "mg"

    // Clinical Question Specific Fields
    sentenceTemplate?: string;
    dropdownGroups?: DropdownGroup[];

    dragDropItems?: DragDropItem[];
    dragDropZones?: DropZone[];

    compareConditions?: ClassificationCondition[];
    compareCharacteristics?: ClassificationCharacteristic[];

    expectedFindings?: ExpectedFinding[];
    conditionName?: string;

    indicatedInterventions?: IndicatedIntervention[];
    clinicalSituation?: string;

    sataOptions?: SataOption[];
    sataPrompt?: string;

    priorityActions?: PriorityActionOption[];
    emergencyScenario?: string;

    casePatientInfo?: string;
    caseHistory?: string;
    caseVitals?: any;
    caseLabs?: any;
    caseAssessment?: string;
    casePrimaryCondition?: string;
    caseSubQuestions?: CaseStudySubQuestion[];
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}
