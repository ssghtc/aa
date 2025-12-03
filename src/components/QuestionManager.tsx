import React, { useState } from 'react';
import { Question, Subject, QuestionType, DiagramElement, ClozeElement, MatrixColumn, MatrixRow, OrderingItem } from '@/types';
import { supabase } from '@/lib/supabaseClient';

interface QuestionManagerProps {
    questions: Question[];
    setQuestions: React.Dispatch<React.SetStateAction<Question[]>>;
    subjects: Subject[];
}

export default function QuestionManager({ questions, setQuestions, subjects }: QuestionManagerProps) {
    const [questionType, setQuestionType] = useState<QuestionType>('single');
    const [questionText, setQuestionText] = useState('');
    const [options, setOptions] = useState(['', '', '', '']);
    const [correctOptions, setCorrectOptions] = useState<number[]>([0]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedChapter, setSelectedChapter] = useState('');
    const [customId, setCustomId] = useState('');
    const [exhibitContent, setExhibitContent] = useState('');

    // Diagram-specific fields
    const [diagramType, setDiagramType] = useState<'flowchart' | 'labeled-diagram' | 'process-flow'>('flowchart');
    const [diagramElements, setDiagramElements] = useState<DiagramElement[]>([
        {
            id: 'step1',
            label: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            position: { x: 50, y: 20 }
        }
    ]);

    // Cloze-specific fields
    const [clozeText, setClozeText] = useState('');
    const [clozeElements, setClozeElements] = useState<ClozeElement[]>([]);

    // Matrix-specific fields
    const [matrixColumns, setMatrixColumns] = useState<MatrixColumn[]>([
        { id: 'col1', label: 'Anticipated' },
        { id: 'col2', label: 'Not Anticipated' }
    ]);
    const [matrixRows, setMatrixRows] = useState<MatrixRow[]>([
        { id: 'row1', text: '', correctColumnId: '' }
    ]);

    // Ordering-specific fields
    const [orderingItems, setOrderingItems] = useState<OrderingItem[]>([
        { id: 'item1', text: '' },
        { id: 'item2', text: '' },
        { id: 'item3', text: '' }
    ]);

    // Input-specific fields
    const [correctAnswerInput, setCorrectAnswerInput] = useState('');
    const [answerTolerance, setAnswerTolerance] = useState<number>(0);
    const [inputUnit, setInputUnit] = useState('');

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const toggleCorrectOption = (index: number) => {
        if (questionType === 'single') {
            setCorrectOptions([index]);
        } else {
            if (correctOptions.includes(index)) {
                if (correctOptions.length > 1) {
                    setCorrectOptions(correctOptions.filter(i => i !== index));
                }
            } else {
                setCorrectOptions([...correctOptions, index].sort());
            }
        }
    };

    // Diagram element handlers
    const addDiagramElement = () => {
        const newElement: DiagramElement = {
            id: `step${diagramElements.length + 1}`,
            label: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            position: { x: 50, y: 20 + (diagramElements.length * 120) }
        };
        setDiagramElements([...diagramElements, newElement]);
    };

    const removeDiagramElement = (index: number) => {
        if (diagramElements.length > 1) {
            setDiagramElements(diagramElements.filter((_, i) => i !== index));
        }
    };

    const updateDiagramElement = (index: number, field: keyof DiagramElement, value: any) => {
        const newElements = [...diagramElements];
        newElements[index] = { ...newElements[index], [field]: value };
        setDiagramElements(newElements);
    };

    const updateDiagramElementOption = (elementIndex: number, optionIndex: number, value: string) => {
        const newElements = [...diagramElements];
        const newOptions = [...newElements[elementIndex].options];
        newOptions[optionIndex] = value;
        newElements[elementIndex] = { ...newElements[elementIndex], options: newOptions };
        setDiagramElements(newElements);
    };

    // Cloze element handlers
    const addClozeBlank = () => {
        const nextId = (clozeElements.length + 1).toString();
        setClozeText(prev => prev + ` {{${nextId}}} `);
        setClozeElements([...clozeElements, {
            id: nextId,
            options: ['', '', '', ''],
            correctAnswer: ''
        }]);
    };

    const updateClozeElementOption = (elementIndex: number, optionIndex: number, value: string) => {
        const newElements = [...clozeElements];
        const newOptions = [...newElements[elementIndex].options];
        newOptions[optionIndex] = value;
        newElements[elementIndex] = { ...newElements[elementIndex], options: newOptions };
        setClozeElements(newElements);
    };

    const updateClozeElementCorrectAnswer = (elementIndex: number, value: string) => {
        const newElements = [...clozeElements];
        newElements[elementIndex] = { ...newElements[elementIndex], correctAnswer: value };
        setClozeElements(newElements);
    };

    // Matrix element handlers
    const addMatrixRow = () => {
        setMatrixRows([...matrixRows, { id: `row${matrixRows.length + 1}`, text: '', correctColumnId: '' }]);
    };

    const removeMatrixRow = (index: number) => {
        if (matrixRows.length > 1) {
            setMatrixRows(matrixRows.filter((_, i) => i !== index));
        }
    };

    const updateMatrixRow = (index: number, field: keyof MatrixRow, value: string) => {
        const newRows = [...matrixRows];
        newRows[index] = { ...newRows[index], [field]: value };
        setMatrixRows(newRows);
    };

    const updateMatrixColumn = (index: number, value: string) => {
        const newCols = [...matrixColumns];
        newCols[index] = { ...newCols[index], label: value };
        setMatrixColumns(newCols);
    };

    // Ordering handlers
    const addOrderingItem = () => {
        setOrderingItems([...orderingItems, { id: `item${orderingItems.length + 1}`, text: '' }]);
    };

    const removeOrderingItem = (index: number) => {
        if (orderingItems.length > 2) {
            setOrderingItems(orderingItems.filter((_, i) => i !== index));
        }
    };

    const updateOrderingItem = (index: number, value: string) => {
        const newItems = [...orderingItems];
        newItems[index] = { ...newItems[index], text: value };
        setOrderingItems(newItems);
    };

    const handleAddQuestion = async () => {
        if (!questionText || !selectedSubject || !selectedChapter) {
            alert('Please fill all required fields');
            return;
        }

        if (questionType === 'diagram') {
            const hasEmptyLabels = diagramElements.some(el => !el.label.trim());
            const hasEmptyOptions = diagramElements.some(el => el.options.some(opt => !opt.trim()));
            const hasNoCorrectAnswer = diagramElements.some(el => !el.correctAnswer);

            if (hasEmptyLabels || hasEmptyOptions || hasNoCorrectAnswer) {
                alert('Please fill all diagram element fields and select correct answers');
                return;
            }
        } else if (questionType === 'cloze') {
            if (!clozeText.trim()) {
                alert('Please enter the text for the fill-in-the-blanks question');
                return;
            }
            const hasEmptyOptions = clozeElements.some(el => el.options.some(opt => !opt.trim()));
            const hasNoCorrectAnswer = clozeElements.some(el => !el.correctAnswer);

            if (hasEmptyOptions || hasNoCorrectAnswer) {
                alert('Please fill all options and select correct answers for all blanks');
                return;
            }
        } else if (questionType === 'matrix') {
            const hasEmptyRows = matrixRows.some(row => !row.text.trim());
            const hasNoCorrectAnswer = matrixRows.some(row => !row.correctColumnId);
            const hasEmptyCols = matrixColumns.some(col => !col.label.trim());

            if (hasEmptyRows || hasNoCorrectAnswer || hasEmptyCols) {
                alert('Please fill all matrix rows, columns and select correct answers');
                return;
            }
        } else if (questionType === 'ordering') {
            if (orderingItems.some(item => !item.text.trim())) {
                alert('Please fill all ordering items');
                return;
            }
        } else if (questionType === 'input') {
            if (!correctAnswerInput.trim()) {
                alert('Please enter the correct answer');
                return;
            }
        } else if (options.some(opt => !opt)) {
            alert('Please fill all options');
            return;
        }

        const newQuestionData = {
            type: questionType,
            text: questionText,
            options: (['diagram', 'cloze', 'matrix', 'ordering', 'input'].includes(questionType)) ? [] : options,
            correct_options: (['diagram', 'cloze', 'matrix', 'ordering', 'input'].includes(questionType)) ? [] : correctOptions,
            subject_id: selectedSubject,
            chapter_id: selectedChapter,
            exhibit_content: exhibitContent.trim() || null,
            diagram_type: questionType === 'diagram' ? diagramType : null,
            diagram_elements: questionType === 'diagram' ? diagramElements : null,
            cloze_text: questionType === 'cloze' ? clozeText : null,
            cloze_elements: questionType === 'cloze' ? clozeElements : null,
            matrix_columns: questionType === 'matrix' ? matrixColumns : null,
            matrix_rows: questionType === 'matrix' ? matrixRows : null,
            ordering_items: questionType === 'ordering' ? orderingItems : null,
            correct_answer_input: questionType === 'input' ? correctAnswerInput : null,
            answer_tolerance: questionType === 'input' ? (answerTolerance || 0) : null,
            input_unit: questionType === 'input' ? inputUnit : null
        };

        const { data, error } = await supabase
            .from('questions')
            .insert([newQuestionData])
            .select();

        if (error) {
            console.error('Error saving question:', error);
            alert('Error saving question: ' + error.message);
            return;
        }

        if (data) {
            const savedQuestion = data[0];
            const newQuestion: Question = {
                id: savedQuestion.id,
                type: savedQuestion.type,
                text: savedQuestion.text,
                options: savedQuestion.options || [],
                correctOptions: savedQuestion.correct_options || [],
                subjectId: savedQuestion.subject_id,
                chapterId: savedQuestion.chapter_id,
                exhibitContent: savedQuestion.exhibit_content,
                diagramUrl: savedQuestion.diagram_url,
                diagramType: savedQuestion.diagram_type,
                diagramElements: savedQuestion.diagram_elements,
                clozeText: savedQuestion.cloze_text,
                clozeElements: savedQuestion.cloze_elements,
                matrixColumns: savedQuestion.matrix_columns,
                matrixRows: savedQuestion.matrix_rows,
                orderingItems: savedQuestion.ordering_items,
                correctOrder: savedQuestion.correct_order,
                correctAnswerInput: savedQuestion.correct_answer_input,
                answerTolerance: savedQuestion.answer_tolerance,
                inputUnit: savedQuestion.input_unit
            };
            setQuestions([...questions, newQuestion]);
        }

        // Reset form
        setQuestionText('');
        setCustomId('');
        setOptions(['', '', '', '']);
        setCorrectOptions([0]);
        setExhibitContent('');

        // Reset diagram
        setDiagramElements([{
            id: 'step1',
            label: '',
            options: ['', '', '', ''],
            correctAnswer: '',
            position: { x: 50, y: 20 }
        }]);

        // Reset cloze
        setClozeText('');
        setClozeElements([]);

        // Reset matrix
        setMatrixRows([{ id: 'row1', text: '', correctColumnId: '' }]);
        setMatrixColumns([
            { id: 'col1', label: 'Anticipated' },
            { id: 'col2', label: 'Not Anticipated' }
        ]);

        // Reset ordering
        setOrderingItems([
            { id: 'item1', text: '' },
            { id: 'item2', text: '' },
            { id: 'item3', text: '' }
        ]);

        // Reset input
        setCorrectAnswerInput('');
        setAnswerTolerance(0);
        setInputUnit('');
    };

    const activeSubject = subjects.find(s => s.id === selectedSubject);

    return (
        <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '2rem'
            }}>
                <div>
                    <h2 style={{ fontSize: '2.5rem', fontWeight: '800', lineHeight: 1.2 }} className="text-gradient">
                        Question Bank
                    </h2>
                    <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                        Create and manage your assessment content
                    </p>
                </div>
                <div style={{
                    background: 'var(--bg-card)',
                    padding: '0.5rem 1rem',
                    borderRadius: 'var(--radius-lg)',
                    border: 'var(--glass-border)',
                    fontSize: '0.9rem',
                    color: 'var(--text-accent)'
                }}>
                    Total Questions: {questions.length}
                </div>
            </div>

            <div style={{
                background: 'var(--bg-card)',
                padding: '2.5rem',
                borderRadius: 'var(--radius-lg)',
                border: 'var(--glass-border)',
                marginBottom: '3rem',
                boxShadow: 'var(--shadow-md)',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    width: '300px',
                    height: '300px',
                    background: 'radial-gradient(circle at 70% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 60%)',
                    pointerEvents: 'none'
                }} />

                <h3 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ background: 'var(--gradient-primary)', width: '8px', height: '32px', borderRadius: '4px', display: 'block' }}></span>
                    Create New Question
                </h3>

                {/* Question Type Selector */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.75rem', color: 'var(--text-secondary)', fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        Question Type
                    </label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem' }}>
                        {(['single', 'multiple', 'diagram', 'cloze', 'matrix', 'ordering', 'input'] as const).map(type => (
                            <button
                                key={type}
                                onClick={() => {
                                    setQuestionType(type);
                                    setCorrectOptions([0]);
                                }}
                                style={{
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    border: questionType === type ? '2px solid #a855f7' : '2px solid var(--border-color)',
                                    background: questionType === type ? 'rgba(168, 85, 247, 0.1)' : 'transparent',
                                    color: questionType === type ? 'white' : 'var(--text-secondary)',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    fontWeight: 600,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    flexDirection: 'column'
                                }}
                            >
                                <span style={{ fontSize: '1.5rem' }}>
                                    {type === 'single' ? '◉' : type === 'multiple' ? '☑' : type === 'diagram' ? '📊' : type === 'cloze' ? '📝' : type === 'matrix' ? '▦' : type === 'ordering' ? '⇅' : '⌨'}
                                </span>
                                {type === 'single' ? 'Single Choice' : type === 'multiple' ? 'Multiple Choice' : type === 'diagram' ? 'Interactive Flowchart' : type === 'cloze' ? 'Fill in Blanks' : type === 'matrix' ? 'Matrix Table' : type === 'ordering' ? 'Ordering' : 'Input/Calc'}
                            </button>
                        ))}
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Subject</label>
                        <select
                            value={selectedSubject}
                            onChange={(e) => {
                                setSelectedSubject(e.target.value);
                                setSelectedChapter('');
                            }}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                outline: 'none',
                                cursor: 'pointer'
                            }}
                        >
                            <option value="">Select Subject</option>
                            {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Chapter</label>
                        <select
                            value={selectedChapter}
                            onChange={(e) => setSelectedChapter(e.target.value)}
                            disabled={!selectedSubject}
                            style={{
                                width: '100%',
                                padding: '1rem',
                                borderRadius: 'var(--radius-md)',
                                background: 'var(--bg-secondary)',
                                border: '1px solid var(--border-color)',
                                color: 'white',
                                opacity: !selectedSubject ? 0.5 : 1,
                                outline: 'none',
                                cursor: !selectedSubject ? 'not-allowed' : 'pointer'
                            }}
                        >
                            <option value="">Select Chapter</option>
                            {activeSubject?.chapters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                        </select>
                    </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Custom ID (Optional)</label>
                    <input
                        type="text"
                        value={customId}
                        onChange={(e) => setCustomId(e.target.value)}
                        placeholder="e.g., MATH-101-A"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            outline: 'none',
                            fontFamily: 'monospace'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        {questionType === 'cloze' ? 'Instructions' : 'Question Text'}
                    </label>
                    <textarea
                        value={questionText}
                        onChange={(e) => setQuestionText(e.target.value)}
                        rows={3}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            resize: 'vertical',
                            minHeight: '100px',
                            fontSize: '1rem'
                        }}
                        placeholder={questionType === 'cloze' ? "e.g., Complete the following sentences from the list of options." : "Type your question here..."}
                    />
                </div>

                {/* Exhibit Content */}
                <div style={{ marginBottom: '2rem' }}>
                    <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                        Exhibit Content (Optional)
                    </label>
                    <textarea
                        value={exhibitContent}
                        onChange={(e) => setExhibitContent(e.target.value)}
                        rows={4}
                        style={{
                            width: '100%',
                            padding: '1rem',
                            borderRadius: 'var(--radius-md)',
                            background: 'var(--bg-secondary)',
                            border: '1px solid var(--border-color)',
                            color: 'white',
                            resize: 'vertical',
                            fontSize: '0.9rem'
                        }}
                        placeholder="Enter content for the exhibit popup (e.g., lab results, charts, history)..."
                    />
                </div>

                {/* Cloze-specific fields */}
                {questionType === 'cloze' && (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Paragraph Text</label>
                                <button
                                    onClick={addClozeBlank}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(56, 189, 248, 0.1)',
                                        border: '1px solid rgba(56, 189, 248, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#38bdf8',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}
                                >
                                    + Insert Blank
                                </button>
                            </div>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                                Use the "Insert Blank" button to add a placeholder like <code>{'{{1}}'}</code> where you want a dropdown.
                            </p>
                            <textarea
                                value={clozeText}
                                onChange={(e) => setClozeText(e.target.value)}
                                rows={6}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    resize: 'vertical',
                                    fontSize: '1rem',
                                    fontFamily: 'monospace',
                                    lineHeight: 1.6
                                }}
                                placeholder="The client has most likely developed {{1}}, the nurse should immediately take action to {{2}}..."
                            />
                        </div>

                        {clozeElements.length > 0 && (
                            <div style={{ marginBottom: '2rem' }}>
                                <h4 style={{ color: 'var(--text-accent)', fontWeight: 600, marginBottom: '1rem' }}>
                                    Configure Blanks
                                </h4>
                                <div style={{ display: 'grid', gap: '1rem' }}>
                                    {clozeElements.map((element, idx) => (
                                        <div key={element.id} style={{
                                            background: 'var(--bg-secondary)',
                                            padding: '1.5rem',
                                            borderRadius: 'var(--radius-md)',
                                            border: '1px solid var(--border-color)'
                                        }}>
                                            <div style={{ marginBottom: '1rem', fontWeight: 600, color: '#38bdf8' }}>
                                                Blank {`{{${element.id}}}`}
                                            </div>

                                            <div style={{ marginBottom: '1rem' }}>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    Dropdown Options
                                                </label>
                                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                                    {element.options.map((opt, optIdx) => (
                                                        <input
                                                            key={optIdx}
                                                            type="text"
                                                            value={opt}
                                                            onChange={(e) => updateClozeElementOption(idx, optIdx, e.target.value)}
                                                            placeholder={`Option ${optIdx + 1}`}
                                                            style={{
                                                                padding: '0.75rem',
                                                                borderRadius: 'var(--radius-sm)',
                                                                background: 'var(--bg-primary)',
                                                                border: '1px solid var(--border-color)',
                                                                color: 'white',
                                                                outline: 'none'
                                                            }}
                                                        />
                                                    ))}
                                                </div>
                                            </div>

                                            <div>
                                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                                    Correct Answer
                                                </label>
                                                <select
                                                    value={element.correctAnswer}
                                                    onChange={(e) => updateClozeElementCorrectAnswer(idx, e.target.value)}
                                                    style={{
                                                        width: '100%',
                                                        padding: '0.75rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid #22c55e',
                                                        color: 'white',
                                                        outline: 'none',
                                                        cursor: 'pointer'
                                                    }}
                                                >
                                                    <option value="">Select correct answer...</option>
                                                    {element.options.filter(opt => opt.trim()).map((opt, optIdx) => (
                                                        <option key={optIdx} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {/* Matrix-specific fields */}
                {questionType === 'matrix' && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                Matrix Configuration
                            </label>
                        </div>

                        {/* Column Headers */}
                        <div style={{ marginBottom: '1.5rem', background: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                Column Headers
                            </label>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                {matrixColumns.map((col, idx) => (
                                    <input
                                        key={col.id}
                                        type="text"
                                        value={col.label}
                                        onChange={(e) => updateMatrixColumn(idx, e.target.value)}
                                        placeholder={`Column ${idx + 1}`}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--bg-primary)',
                                            border: '1px solid var(--border-color)',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Rows */}
                        <div style={{ marginBottom: '1rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Rows</label>
                                <button
                                    onClick={addMatrixRow}
                                    style={{
                                        padding: '0.25rem 0.75rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: '4px',
                                        color: '#22c55e',
                                        cursor: 'pointer',
                                        fontSize: '0.8rem'
                                    }}
                                >
                                    + Add Row
                                </button>
                            </div>

                            <div style={{ display: 'grid', gap: '1rem' }}>
                                {matrixRows.map((row, idx) => (
                                    <div key={row.id} style={{
                                        display: 'grid',
                                        gridTemplateColumns: '2fr 1fr auto',
                                        gap: '1rem',
                                        alignItems: 'center',
                                        background: 'var(--bg-secondary)',
                                        padding: '1rem',
                                        borderRadius: 'var(--radius-md)'
                                    }}>
                                        <input
                                            type="text"
                                            value={row.text}
                                            onChange={(e) => updateMatrixRow(idx, 'text', e.target.value)}
                                            placeholder="Enter row text (e.g., Establish vascular access)"
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />

                                        <select
                                            value={row.correctColumnId}
                                            onChange={(e) => updateMatrixRow(idx, 'correctColumnId', e.target.value)}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid #22c55e',
                                                color: 'white',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">Select Answer</option>
                                            {matrixColumns.map(col => (
                                                <option key={col.id} value={col.id}>{col.label}</option>
                                            ))}
                                        </select>

                                        {matrixRows.length > 1 && (
                                            <button
                                                onClick={() => removeMatrixRow(idx)}
                                                style={{
                                                    padding: '0.5rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    borderRadius: '4px',
                                                    color: '#ef4444',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Ordering-specific fields */}
                {questionType === 'ordering' && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                Ordering Items (In Correct Order)
                            </label>
                            <button
                                onClick={addOrderingItem}
                                style={{
                                    padding: '0.5rem 1rem',
                                    background: 'rgba(34, 197, 94, 0.1)',
                                    border: '1px solid rgba(34, 197, 94, 0.3)',
                                    borderRadius: 'var(--radius-md)',
                                    color: '#22c55e',
                                    cursor: 'pointer',
                                    fontSize: '0.9rem',
                                    fontWeight: 600
                                }}
                            >
                                + Add Item
                            </button>
                        </div>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                            Enter the items in the correct sequence. They will be shuffled for the student.
                        </p>
                        <div style={{ display: 'grid', gap: '0.75rem' }}>
                            {orderingItems.map((item, idx) => (
                                <div key={item.id} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                                    <span style={{ color: 'var(--text-secondary)', width: '20px' }}>{idx + 1}.</span>
                                    <input
                                        type="text"
                                        value={item.text}
                                        onChange={(e) => updateOrderingItem(idx, e.target.value)}
                                        placeholder={`Step ${idx + 1}`}
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            borderRadius: 'var(--radius-sm)',
                                            background: 'var(--bg-secondary)',
                                            border: '1px solid var(--border-color)',
                                            color: 'white',
                                            outline: 'none'
                                        }}
                                    />
                                    {orderingItems.length > 2 && (
                                        <button
                                            onClick={() => removeOrderingItem(idx)}
                                            style={{
                                                padding: '0.5rem',
                                                background: 'rgba(239, 68, 68, 0.1)',
                                                border: '1px solid rgba(239, 68, 68, 0.3)',
                                                borderRadius: '4px',
                                                color: '#ef4444',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Input-specific fields */}
                {questionType === 'input' && (
                    <div style={{ marginBottom: '2rem' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Correct Answer
                                </label>
                                <input
                                    type="text"
                                    value={correctAnswerInput}
                                    onChange={(e) => setCorrectAnswerInput(e.target.value)}
                                    placeholder="e.g., 4.6"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    Unit (Optional)
                                </label>
                                <input
                                    type="text"
                                    value={inputUnit}
                                    onChange={(e) => setInputUnit(e.target.value)}
                                    placeholder="e.g., units/hr"
                                    style={{
                                        width: '100%',
                                        padding: '0.75rem',
                                        borderRadius: 'var(--radius-sm)',
                                        background: 'var(--bg-secondary)',
                                        border: '1px solid var(--border-color)',
                                        color: 'white',
                                        outline: 'none'
                                    }}
                                />
                            </div>
                        </div>
                        <div style={{ marginTop: '1rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                Numeric Tolerance (Optional)
                            </label>
                            <input
                                type="number"
                                value={answerTolerance}
                                onChange={(e) => setAnswerTolerance(parseFloat(e.target.value))}
                                placeholder="e.g., 0.1"
                                step="0.1"
                                style={{
                                    width: '100%',
                                    padding: '0.75rem',
                                    borderRadius: 'var(--radius-sm)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    outline: 'none'
                                }}
                            />
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
                                If the answer is numeric, this allows for a range of correct answers (e.g., Answer ± Tolerance).
                            </p>
                        </div>
                    </div>
                )}

                {/* Diagram-specific fields */}
                {questionType === 'diagram' && (
                    <>
                        <div style={{ marginBottom: '2rem' }}>
                            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Diagram Type</label>
                            <select
                                value={diagramType}
                                onChange={(e) => setDiagramType(e.target.value as any)}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    borderRadius: 'var(--radius-md)',
                                    background: 'var(--bg-secondary)',
                                    border: '1px solid var(--border-color)',
                                    color: 'white',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="flowchart">Flowchart</option>
                                <option value="labeled-diagram">Labeled Diagram</option>
                                <option value="process-flow">Process Flow</option>
                            </select>
                        </div>

                        <div style={{ marginBottom: '2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <label style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', fontWeight: 600 }}>
                                    Interactive Elements ({diagramElements.length})
                                </label>
                                <button
                                    onClick={addDiagramElement}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(34, 197, 94, 0.1)',
                                        border: '1px solid rgba(34, 197, 94, 0.3)',
                                        borderRadius: 'var(--radius-md)',
                                        color: '#22c55e',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem',
                                        fontWeight: 600
                                    }}
                                >
                                    + Add Step
                                </button>
                            </div>

                            {diagramElements.map((element, elemIdx) => (
                                <div key={element.id} style={{
                                    background: 'var(--bg-secondary)',
                                    padding: '1.5rem',
                                    borderRadius: 'var(--radius-md)',
                                    marginBottom: '1rem',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                        <h4 style={{ color: 'var(--text-accent)', fontWeight: 600 }}>Step {elemIdx + 1}</h4>
                                        {diagramElements.length > 1 && (
                                            <button
                                                onClick={() => removeDiagramElement(elemIdx)}
                                                style={{
                                                    padding: '0.25rem 0.75rem',
                                                    background: 'rgba(239, 68, 68, 0.1)',
                                                    border: '1px solid rgba(239, 68, 68, 0.3)',
                                                    borderRadius: '4px',
                                                    color: '#ef4444',
                                                    cursor: 'pointer',
                                                    fontSize: '0.8rem'
                                                }}
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            Step Label
                                        </label>
                                        <input
                                            type="text"
                                            value={element.label}
                                            onChange={(e) => updateDiagramElement(elemIdx, 'label', e.target.value)}
                                            placeholder="e.g., Step 1: Initial Assessment"
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid var(--border-color)',
                                                color: 'white',
                                                outline: 'none'
                                            }}
                                        />
                                    </div>

                                    <div style={{ marginBottom: '1rem' }}>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            Dropdown Options
                                        </label>
                                        <div style={{ display: 'grid', gap: '0.5rem' }}>
                                            {element.options.map((opt, optIdx) => (
                                                <input
                                                    key={optIdx}
                                                    type="text"
                                                    value={opt}
                                                    onChange={(e) => updateDiagramElementOption(elemIdx, optIdx, e.target.value)}
                                                    placeholder={`Option ${optIdx + 1}`}
                                                    style={{
                                                        padding: '0.75rem',
                                                        borderRadius: 'var(--radius-sm)',
                                                        background: 'var(--bg-primary)',
                                                        border: '1px solid var(--border-color)',
                                                        color: 'white',
                                                        outline: 'none'
                                                    }}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                                            Correct Answer
                                        </label>
                                        <select
                                            value={element.correctAnswer}
                                            onChange={(e) => updateDiagramElement(elemIdx, 'correctAnswer', e.target.value)}
                                            style={{
                                                width: '100%',
                                                padding: '0.75rem',
                                                borderRadius: 'var(--radius-sm)',
                                                background: 'var(--bg-primary)',
                                                border: '1px solid #22c55e',
                                                color: 'white',
                                                outline: 'none',
                                                cursor: 'pointer'
                                            }}
                                        >
                                            <option value="">Select correct answer...</option>
                                            {element.options.filter(opt => opt.trim()).map((opt, idx) => (
                                                <option key={idx} value={opt}>{opt}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Options for single/multiple choice */}
                {['single', 'multiple'].includes(questionType) && (
                    <div style={{ marginBottom: '2.5rem' }}>
                        <label style={{ display: 'block', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                            Answer Options <span style={{ opacity: 0.6 }}>(Select correct answers)</span>
                        </label>
                        <div style={{ display: 'grid', gap: '1rem' }}>
                            {options.map((opt, idx) => {
                                const isSelected = correctOptions.includes(idx);
                                return (
                                    <div key={idx} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '1rem',
                                        padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)',
                                        background: isSelected ? 'rgba(34, 197, 94, 0.05)' : 'transparent',
                                        transition: 'background 0.2s'
                                    }}>
                                        <div
                                            onClick={() => toggleCorrectOption(idx)}
                                            style={{
                                                width: '24px',
                                                height: '24px',
                                                borderRadius: questionType === 'single' ? '50%' : '6px',
                                                border: isSelected ? '2px solid #22c55e' : '2px solid var(--text-secondary)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                cursor: 'pointer',
                                                flexShrink: 0,
                                                background: isSelected ? '#22c55e' : 'transparent',
                                                transition: 'all 0.2s'
                                            }}
                                        >
                                            {isSelected && <span style={{ color: 'white', fontSize: '0.8rem' }}>✓</span>}
                                        </div>
                                        <input
                                            type="text"
                                            value={opt}
                                            onChange={(e) => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            style={{
                                                flex: 1,
                                                padding: '1rem',
                                                borderRadius: 'var(--radius-md)',
                                                background: 'var(--bg-secondary)',
                                                border: isSelected ? '1px solid #22c55e' : '1px solid var(--border-color)',
                                                color: 'white',
                                                outline: 'none',
                                                transition: 'all 0.2s'
                                            }}
                                        />
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                <button
                    className="btn btn-primary"
                    style={{
                        width: '100%',
                        padding: '1rem',
                        fontSize: '1.1rem',
                        letterSpacing: '0.5px'
                    }}
                    onClick={handleAddQuestion}
                >
                    Add Question to Bank
                </button>
            </div>

            <div>
                <h3 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 600 }}>Recent Questions</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                    {questions.slice().reverse().map(q => (
                        <div key={q.id} style={{
                            padding: '2rem',
                            background: 'var(--bg-card)',
                            borderRadius: 'var(--radius-lg)',
                            border: 'var(--glass-border)',
                            transition: 'transform 0.2s',
                            position: 'relative'
                        }}>
                            <div style={{
                                position: 'absolute',
                                top: '2rem',
                                right: '2rem',
                                display: 'flex',
                                gap: '0.5rem'
                            }}>
                                <span style={{
                                    fontSize: '0.75rem',
                                    padding: '0.25rem 0.75rem',
                                    background: q.type === 'single' ? 'rgba(56, 189, 248, 0.1)' : q.type === 'multiple' ? 'rgba(168, 85, 247, 0.1)' : q.type === 'diagram' ? 'rgba(34, 197, 94, 0.1)' : q.type === 'cloze' ? 'rgba(244, 114, 182, 0.1)' : q.type === 'matrix' ? 'rgba(251, 146, 60, 0.1)' : 'rgba(99, 102, 241, 0.1)',
                                    color: q.type === 'single' ? '#38bdf8' : q.type === 'multiple' ? '#a855f7' : q.type === 'diagram' ? '#22c55e' : q.type === 'cloze' ? '#f472b6' : q.type === 'matrix' ? '#fb923c' : '#6366f1',
                                    borderRadius: '20px',
                                    fontWeight: 600,
                                    border: q.type === 'single' ? '1px solid rgba(56, 189, 248, 0.2)' : q.type === 'multiple' ? '1px solid rgba(168, 85, 247, 0.2)' : q.type === 'diagram' ? '1px solid rgba(34, 197, 94, 0.2)' : q.type === 'cloze' ? '1px solid rgba(244, 114, 182, 0.2)' : q.type === 'matrix' ? '1px solid rgba(251, 146, 60, 0.2)' : '1px solid rgba(99, 102, 241, 0.2)'
                                }}>
                                    {q.type === 'single' ? 'Single Choice' : q.type === 'multiple' ? 'Multiple Choice' : q.type === 'diagram' ? 'Interactive Flowchart' : q.type === 'cloze' ? 'Fill in Blanks' : q.type === 'matrix' ? 'Matrix Table' : q.type === 'ordering' ? 'Ordering' : 'Input/Calc'}
                                </span>
                                {q.exhibitContent && (
                                    <span style={{
                                        fontSize: '0.75rem',
                                        padding: '0.25rem 0.75rem',
                                        background: 'rgba(14, 165, 233, 0.1)',
                                        color: '#0ea5e9',
                                        borderRadius: '20px',
                                        fontWeight: 600,
                                        border: '1px solid rgba(14, 165, 233, 0.2)'
                                    }}>
                                        Exhibit
                                    </span>
                                )}
                            </div>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                    <span style={{
                                        fontSize: '0.8rem',
                                        padding: '0.25rem 0.5rem',
                                        background: 'rgba(255, 255, 255, 0.05)',
                                        color: 'var(--text-secondary)',
                                        borderRadius: '4px',
                                        fontFamily: 'monospace'
                                    }}>
                                        {q.id}
                                    </span>
                                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>•</span>
                                    <span style={{ color: '#94a3b8', fontSize: '0.9rem', fontWeight: 500 }}>
                                        {subjects.find(s => s.id === q.subjectId)?.name}
                                        <span style={{ margin: '0 0.5rem', opacity: 0.5 }}>/</span>
                                        {subjects.find(s => s.id === q.subjectId)?.chapters.find(c => c.id === q.chapterId)?.name}
                                    </span>
                                </div>
                            </div>

                            <p style={{ fontWeight: 600, fontSize: '1.1rem', marginBottom: '1.5rem', lineHeight: 1.5 }}>{q.text}</p>

                            {q.type === 'diagram' ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📊</span>
                                        <div>
                                            <p style={{ fontWeight: 600, color: 'var(--text-accent)' }}>
                                                {q.diagramType === 'flowchart' ? 'Flowchart' : q.diagramType === 'labeled-diagram' ? 'Labeled Diagram' : 'Process Flow'}
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {q.diagramElements?.length || 0} interactive steps
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : q.type === 'cloze' ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>📝</span>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#f472b6' }}>
                                                Fill in the Blanks
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {q.clozeElements?.length || 0} blanks to fill
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : q.type === 'matrix' ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>▦</span>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#fb923c' }}>
                                                Matrix Table
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {q.matrixRows?.length || 0} rows, {q.matrixColumns?.length || 0} columns
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : q.type === 'ordering' ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⇅</span>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#6366f1' }}>
                                                Ordering Question
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                {q.orderingItems?.length || 0} items to sort
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : q.type === 'input' ? (
                                <div style={{
                                    padding: '1.5rem',
                                    background: 'rgba(255,255,255,0.02)',
                                    borderRadius: 'var(--radius-md)',
                                    border: '1px solid var(--border-color)'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                                        <span style={{ fontSize: '1.5rem' }}>⌨</span>
                                        <div>
                                            <p style={{ fontWeight: 600, color: '#6366f1' }}>
                                                Input/Calculation
                                            </p>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                                                Answer: {q.correctAnswerInput} {q.inputUnit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                    {q.options.map((opt, idx) => {
                                        const isCorrect = q.correctOptions.includes(idx);
                                        return (
                                            <div key={idx} style={{
                                                padding: '0.75rem 1rem',
                                                background: isCorrect ? 'rgba(34, 197, 94, 0.1)' : 'rgba(255, 255, 255, 0.02)',
                                                border: isCorrect ? '1px solid rgba(34, 197, 94, 0.3)' : '1px solid var(--border-color)',
                                                borderRadius: '8px',
                                                color: isCorrect ? '#4ade80' : 'var(--text-secondary)',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '0.5rem'
                                            }}>
                                                <span style={{
                                                    width: '20px',
                                                    height: '20px',
                                                    borderRadius: '50%',
                                                    background: isCorrect ? '#4ade80' : 'rgba(255,255,255,0.1)',
                                                    color: isCorrect ? '#0f172a' : 'transparent',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontSize: '0.7rem',
                                                    fontWeight: 'bold'
                                                }}>
                                                    {String.fromCharCode(65 + idx)}
                                                </span>
                                                {opt}
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
