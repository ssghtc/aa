export interface Chapter {
    id: string;
    name: string;
}

export interface Subject {
    id: string;
    name: string;
    chapters: Chapter[];
}

export type QuestionType = 'single' | 'multiple' | 'diagram' | 'cloze' | 'matrix' | 'ordering' | 'input';

export interface DiagramElement {
    id: string;
    label: string;
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

export interface Question {
    id: string;
    type: QuestionType;
    text: string;
    options: string[];
    correctOptions: number[]; // Array of indices for correct answers
    subjectId: string;
    chapterId: string;

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
}

export interface Blog {
    id: string;
    title: string;
    content: string;
    author: string;
    date: string;
}
