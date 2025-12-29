'use client';

import React, { useState } from 'react';
import { ClinicalQuestionRenderer } from '@/components/ClinicalQuestions';
import type { ClinicalQuestion } from '@/types/clinical';
import type { Question } from '@/types';
import styles from './clinical.module.css';

// Combined question type
type DisplayQuestion = (ClinicalQuestion | Question) & { displayType: string };

// Sample questions for ALL types
const allSampleQuestions: DisplayQuestion[] = [
    // 1. Single Choice
    {
        id: 'q1',
        type: 'single',
        text: 'A patient with heart failure is prescribed furosemide (Lasix). Which laboratory value should the nurse monitor most closely?',
        options: ['Serum sodium', 'Serum potassium', 'Blood glucose', 'Hemoglobin A1C'],
        correctOptions: [1],
        subjectId: '1',
        chapterId: '1',
        rationale: 'Furosemide is a loop diuretic that causes potassium loss. Hypokalemia can lead to dangerous cardiac arrhythmias.',
        displayType: 'traditional'
    },
    // 2. Multiple Choice
    {
        id: 'q2',
        type: 'multiple',
        text: 'Which of the following are signs of digoxin toxicity? Select all that apply.',
        options: ['Nausea and vomiting', 'Yellow-green visual halos', 'Bradycardia', 'Hypertension', 'Confusion'],
        correctOptions: [0, 1, 2, 4],
        subjectId: '1',
        chapterId: '1',
        rationale: 'Digoxin toxicity presents with GI symptoms, visual disturbances, cardiac effects (bradycardia), and neurological symptoms.',
        displayType: 'traditional'
    },
    // 3. Diagram/Flowchart
    {
        id: 'q3',
        type: 'diagram',
        text: 'Complete the nursing process flowchart by selecting the correct action for each step.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        diagramType: 'flowchart',
        diagramElements: [
            {
                id: 'step1',
                label: 'Assessment Phase',
                options: ['Collect subjective data', 'Implement interventions', 'Evaluate outcomes', 'Write care plan'],
                correctAnswer: 'Collect subjective data',
                position: { x: 50, y: 20 }
            },
            {
                id: 'step2',
                label: 'Diagnosis Phase',
                options: ['Identify patient problems', 'Administer medications', 'Document findings', 'Discharge patient'],
                correctAnswer: 'Identify patient problems',
                position: { x: 50, y: 40 }
            },
            {
                id: 'step3',
                label: 'Planning Phase',
                options: ['Set measurable goals', 'Perform physical exam', 'Review lab results', 'Call physician'],
                correctAnswer: 'Set measurable goals',
                position: { x: 50, y: 60 }
            }
        ],
        rationale: 'The nursing process follows a systematic approach: Assessment → Diagnosis → Planning → Implementation → Evaluation.',
        displayType: 'traditional'
    },
    // 4. Fill in the Blanks (Cloze)
    {
        id: 'q4',
        type: 'cloze',
        text: 'Complete the statement about insulin administration.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        clozeText: 'Regular insulin has an onset of [1] and should be administered [2] before meals. It is the only insulin that can be given [3].',
        clozeElements: [
            {
                id: '1',
                options: ['30-60 minutes', '2-4 hours', '10-15 minutes', '6-8 hours'],
                correctAnswer: '30-60 minutes'
            },
            {
                id: '2',
                options: ['30 minutes', 'immediately', '2 hours', '4 hours'],
                correctAnswer: '30 minutes'
            },
            {
                id: '3',
                options: ['intravenously', 'subcutaneously only', 'intramuscularly', 'orally'],
                correctAnswer: 'intravenously'
            }
        ],
        rationale: 'Regular insulin has a 30-60 minute onset, should be given 30 min before meals, and is the only IV-compatible insulin.',
        displayType: 'traditional'
    },
    // 5. Matrix Table
    {
        id: 'q5',
        type: 'matrix',
        text: 'Match each medication side effect to the appropriate category.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        matrixColumns: [
            { id: 'col1', label: 'Anticipated' },
            { id: 'col2', label: 'Not Anticipated' }
        ],
        matrixRows: [
            { id: 'row1', text: 'Dry mouth with atropine', correctColumnId: 'col1' },
            { id: 'row2', text: 'Bradycardia with atropine', correctColumnId: 'col2' },
            { id: 'row3', text: 'Urinary retention with atropine', correctColumnId: 'col1' },
            { id: 'row4', text: 'Increased salivation with atropine', correctColumnId: 'col2' }
        ],
        rationale: 'Atropine is an anticholinergic that causes dry mouth, urinary retention, and tachycardia (not bradycardia or increased salivation).',
        displayType: 'traditional'
    },
    // 6. Ordering
    {
        id: 'q6',
        type: 'ordering',
        text: 'Place the steps of donning PPE in the correct order.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        orderingItems: [
            { id: 'item1', text: 'Perform hand hygiene' },
            { id: 'item2', text: 'Put on gown' },
            { id: 'item3', text: 'Put on mask/respirator' },
            { id: 'item4', text: 'Put on eye protection' },
            { id: 'item5', text: 'Put on gloves' }
        ],
        correctOrder: ['item1', 'item2', 'item3', 'item4', 'item5'],
        rationale: 'Correct PPE donning order: Hand hygiene → Gown → Mask → Eye protection → Gloves.',
        displayType: 'traditional'
    },
    // 7. Input/Calculation
    {
        id: 'q7',
        type: 'input',
        text: 'A patient is ordered 1000 mL of Normal Saline to infuse over 8 hours. The IV tubing has a drop factor of 15 gtts/mL. Calculate the drip rate in drops per minute. (Round to the nearest whole number)',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        correctAnswerInput: '31',
        answerTolerance: 1,
        inputUnit: 'gtts/min',
        rationale: 'Formula: (Volume × Drop Factor) ÷ Time in minutes = (1000 × 15) ÷ 480 = 31.25 ≈ 31 gtts/min',
        displayType: 'traditional'
    },
    // 8. Sentence Completion (Clinical)
    {
        id: 'c1',
        questionType: 'sentence_completion',
        title: 'Multiple Sclerosis Treatment',
        instruction: 'Complete the following sentence by choosing from the lists of options.',
        scenario: 'A 32-year-old female presents with visual disturbances, numbness in extremities, and fatigue.',
        rationale: 'MS exacerbations are treated with high-dose corticosteroids to reduce inflammation.',
        clientNeeds: 'management_of_care',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Multiple Sclerosis',
        clinicalFocus: 'Treatment',
        sentenceTemplate: 'A patient with {{1}} presenting with acute exacerbation should receive {{2}} as initial treatment.',
        dropdownGroups: [
            { id: '1', options: ['Multiple Sclerosis', 'Myasthenia Gravis', 'Guillain-Barré', 'Parkinson Disease'], correctAnswer: 'Multiple Sclerosis' },
            { id: '2', options: ['IV methylprednisolone', 'Oral methotrexate', 'Plasma exchange only', 'Acetylcholinesterase inhibitors'], correctAnswer: 'IV methylprednisolone' }
        ],
        displayType: 'clinical'
    },
    // 9. Drag-Drop Priority (Clinical)
    {
        id: 'c2',
        questionType: 'drag_drop_priority',
        title: 'Traumatic Brain Injury Assessment',
        instruction: 'Drag findings requiring immediate follow-up to the priority zone.',
        scenario: 'Patient arrives in ED after motor vehicle accident.',
        rationale: 'Signs of basilar skull fracture and neurological deterioration require immediate intervention.',
        clientNeeds: 'reduction_risk_potential',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Traumatic Brain Injury',
        clinicalFocus: 'Prioritization',
        items: [
            { id: '1', text: 'Battle sign (bruising behind ears)', requiresFollowup: true },
            { id: '2', text: 'GCS dropped from 14 to 10', requiresFollowup: true },
            { id: '3', text: 'Clear fluid draining from nose', requiresFollowup: true },
            { id: '4', text: 'Mild headache rated 3/10', requiresFollowup: false },
            { id: '5', text: 'Blood pressure 128/78 mmHg', requiresFollowup: false },
            { id: '6', text: 'Unilateral pupil dilation', requiresFollowup: true }
        ],
        dropZones: [
            { id: 'priority', label: 'Immediate Follow-up Required' },
            { id: 'monitor', label: 'Continue Monitoring' }
        ],
        minPriorityItems: 3,
        maxPriorityItems: 5,
        displayType: 'clinical'
    },
    // 10. Compare & Classify (Clinical)
    {
        id: 'c3',
        questionType: 'compare_classify',
        title: 'Epidural vs Subdural Hematoma',
        instruction: 'Classify each characteristic to the correct hematoma type.',
        scenario: 'Nurse caring for patients with different types of intracranial bleeding.',
        rationale: 'Epidural hematomas are arterial and rapid. Subdural hematomas are venous and slower.',
        clientNeeds: 'physiological_adaptation',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Intracranial Hemorrhage',
        clinicalFocus: 'Differentiating',
        conditions: [
            { id: 'epidural', name: 'Epidural Hematoma' },
            { id: 'subdural', name: 'Subdural Hematoma' }
        ],
        characteristics: [
            { id: '1', text: 'Lucid interval followed by rapid deterioration', appliesTo: ['epidural'] },
            { id: '2', text: 'Arterial bleeding source', appliesTo: ['epidural'] },
            { id: '3', text: 'More common in elderly', appliesTo: ['subdural'] },
            { id: '4', text: 'Lens-shaped on CT', appliesTo: ['epidural'] },
            { id: '5', text: 'Crescent-shaped on CT', appliesTo: ['subdural'] }
        ],
        allowMultiple: false,
        displayType: 'clinical'
    },
    // 11. Expected vs Not Expected (Clinical)
    {
        id: 'c4',
        questionType: 'expected_not_expected',
        title: 'Increased Intracranial Pressure Findings',
        instruction: 'Identify if each finding is expected or not expected.',
        scenario: 'Patient with severe TBI being monitored in ICU. ICP readings consistently above 20 mmHg.',
        rationale: 'Cushing\'s triad is a late sign of increased ICP.',
        clientNeeds: 'physiological_adaptation',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Increased ICP',
        clinicalFocus: 'Recognition',
        conditionName: 'increased intracranial pressure',
        findings: [
            { id: '1', text: 'Cushing\'s triad (hypertension, bradycardia, irregular breathing)', isExpected: true },
            { id: '2', text: 'Dilated, nonreactive pupil on affected side', isExpected: true },
            { id: '3', text: 'Projectile vomiting without nausea', isExpected: true },
            { id: '4', text: 'Tachycardia and hypotension', isExpected: false },
            { id: '5', text: 'Decreased level of consciousness', isExpected: true }
        ],
        displayType: 'clinical'
    },
    // 12. Indicated vs Not Indicated (Clinical)
    {
        id: 'c5',
        questionType: 'indicated_not_indicated',
        title: 'Interventions for Increased ICP',
        instruction: 'Specify if each intervention is indicated or not indicated.',
        clientNeeds: 'reduction_risk_potential',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Increased ICP',
        clinicalFocus: 'Management',
        clinicalSituation: 'Patient with TBI and persistently elevated ICP above 22 mmHg',
        rationale: 'ICP interventions include head elevation, avoiding neck flexion, maintaining normothermia.',
        interventions: [
            { id: '1', text: 'Elevate head of bed to 30 degrees', isIndicated: true, rationale: 'Promotes venous drainage' },
            { id: '2', text: 'Administer IV mannitol as ordered', isIndicated: true, rationale: 'Osmotic diuretic reduces edema' },
            { id: '3', text: 'Cluster nursing care activities', isIndicated: false, rationale: 'Clustering increases ICP' },
            { id: '4', text: 'Suction airway vigorously q2h', isIndicated: false, rationale: 'Aggressive suctioning increases ICP' },
            { id: '5', text: 'Maintain neck in neutral position', isIndicated: true, rationale: 'Prevents jugular compression' }
        ],
        displayType: 'clinical'
    },
    // 13. SATA (Clinical)
    {
        id: 'c6',
        questionType: 'sata',
        title: 'ARDS Management',
        instruction: 'Select all appropriate nursing interventions.',
        scenario: '52-year-old with severe pneumonia developed ARDS. FiO2 80%, PEEP 12, PaO2 58 mmHg.',
        rationale: 'ARDS management includes lung-protective ventilation, prone positioning, conservative fluids.',
        clientNeeds: 'physiological_adaptation',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'ARDS',
        clinicalFocus: 'Critical Care',
        prompt: 'Which interventions are appropriate for this ARDS patient?',
        options: [
            { id: '1', text: 'Position patient prone for 16 hours daily', isCorrect: true },
            { id: '2', text: 'Maintain tidal volume at 6-8 mL/kg ideal body weight', isCorrect: true },
            { id: '3', text: 'Administer liberal IV fluids to maintain CVP >12', isCorrect: false },
            { id: '4', text: 'Monitor for pneumothorax and barotrauma', isCorrect: true },
            { id: '5', text: 'Implement deep sedation and possible paralysis as ordered', isCorrect: true }
        ],
        minCorrectForPartial: 3,
        displayType: 'clinical'
    },
    // 14. Priority Action (Clinical)
    {
        id: 'c7',
        questionType: 'priority_action',
        title: 'DKA Emergency',
        instruction: 'Which is the priority nursing action?',
        scenario: 'Patient with Type 1 diabetes admitted with DKA.',
        rationale: 'Fluid resuscitation is first priority in DKA to restore circulating volume.',
        clientNeeds: 'physiological_adaptation',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'DKA',
        clinicalFocus: 'Emergency',
        emergencyScenario: 'Blood glucose 580 mg/dL, pH 7.18, Kussmaul respirations, BP 88/54, HR 118',
        actions: [
            { id: '1', text: 'Administer regular insulin IV bolus immediately', priorityRank: 3 },
            { id: '2', text: 'Initiate 0.9% normal saline IV bolus 1L over 1 hour', priorityRank: 1 },
            { id: '3', text: 'Draw arterial blood gas and electrolytes', priorityRank: 4 },
            { id: '4', text: 'Insert urinary catheter to monitor output', priorityRank: 2 }
        ],
        correctActionId: '2',
        displayType: 'clinical'
    },
    // 15. Case Study (Clinical)
    {
        id: 'c8',
        questionType: 'case_study',
        title: 'Ischemic Stroke Management',
        instruction: 'Answer questions based on the case study.',
        rationale: 'Tests comprehensive knowledge of stroke assessment, treatment, and complications.',
        clientNeeds: 'physiological_adaptation',
        subjectId: '1',
        chapterId: '1',
        clinicalTopic: 'Ischemic Stroke',
        clinicalFocus: 'Comprehensive',
        patientInfo: '68-year-old male with sudden onset right-sided weakness and speech difficulty 90 minutes ago.',
        history: 'PMH: Hypertension (poorly controlled), Type 2 Diabetes, Atrial fibrillation (not on anticoagulation)',
        vitalSigns: { bp: '178/96', hr: 88, hrRhythm: 'irregularly irregular', rr: 18, temp: 37.0, spo2: 96, bloodGlucose: 186 },
        labValues: { INR: 1.0, PTT: 28, Platelets: '245,000', Creatinine: 1.1 },
        assessmentFindings: 'Right facial droop, right arm drift, slurred speech, NIHSS score 12. CT head shows no hemorrhage.',
        primaryCondition: 'Ischemic Stroke',
        subQuestions: [
            {
                id: 'sq1',
                questionOrder: 1,
                focusArea: 'assessment',
                questionText: 'Based on assessment findings, which type of stroke is most likely?',
                subQuestionType: 'single_choice',
                options: [
                    { id: 'a', text: 'Hemorrhagic stroke' },
                    { id: 'b', text: 'Ischemic stroke - likely cardioembolic' },
                    { id: 'c', text: 'Transient ischemic attack' },
                    { id: 'd', text: 'Subarachnoid hemorrhage' }
                ],
                correctAnswer: 'b',
                rationale: 'Atrial fibrillation and CT ruling out hemorrhage suggest cardioembolic ischemic stroke.'
            },
            {
                id: 'sq2',
                questionOrder: 2,
                focusArea: 'interventions',
                questionText: 'Which criteria must be met before tPA administration? Select all that apply.',
                subQuestionType: 'sata',
                options: [
                    { id: 'a', text: 'Symptom onset within 4.5 hours', isCorrect: true },
                    { id: 'b', text: 'CT scan negative for hemorrhage', isCorrect: true },
                    { id: 'c', text: 'Blood pressure below 185/110 mmHg', isCorrect: true },
                    { id: 'd', text: 'Patient must be NPO for 8 hours', isCorrect: false }
                ],
                correctAnswer: ['a', 'b', 'c'],
                rationale: 'tPA criteria include timing, absence of hemorrhage, and BP control.'
            }
        ],
        displayType: 'clinical'
    }
];

export default function ClinicalQuestionsPage() {
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});

    const currentQuestion = allSampleQuestions[currentQuestionIndex];

    const questionTypeLabels: Record<string, string> = {
        'single': 'Single Choice',
        'multiple': 'Multiple Choice',
        'diagram': 'Flowchart',
        'cloze': 'Fill Blanks',
        'matrix': 'Matrix',
        'ordering': 'Ordering',
        'input': 'Input/Calc',
        'sentence_completion': 'Sentence Comp.',
        'drag_drop_priority': 'Drag Priority',
        'compare_classify': 'Compare/Classify',
        'expected_not_expected': 'Expected/Not',
        'indicated_not_indicated': 'Indicated/Not',
        'sata': 'SATA',
        'priority_action': 'Priority Action',
        'case_study': 'Case Study'
    };

    const renderTraditionalQuestion = (question: Question) => {
        const isMultiple = question.type === 'multiple';
        const userAnswer = userAnswers[question.id] || (isMultiple ? [] : null);

        const handleOptionClick = (index: number) => {
            if (showResults) return;
            if (isMultiple) {
                const current = Array.isArray(userAnswer) ? userAnswer : [];
                const newAnswer = current.includes(index) ? current.filter((i: number) => i !== index) : [...current, index];
                setUserAnswers({ ...userAnswers, [question.id]: newAnswer });
            } else {
                setUserAnswers({ ...userAnswers, [question.id]: index });
            }
        };

        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>{questionTypeLabels[question.type]}</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                {question.scenario && <div className={styles.scenario}><strong>Scenario:</strong> {question.scenario}</div>}

                <div className={styles.optionsContainer}>
                    {question.options.map((option, index) => {
                        const isSelected = isMultiple ? Array.isArray(userAnswer) && userAnswer.includes(index) : userAnswer === index;
                        const isCorrect = question.correctOptions.includes(index);
                        const showCorrectness = showResults;
                        return (
                            <div key={index} className={`${styles.option} ${isSelected ? styles.selected : ''} ${showCorrectness ? (isCorrect ? styles.correct : isSelected ? styles.incorrect : '') : ''}`} onClick={() => handleOptionClick(index)}>
                                <div className={styles.optionIndicator}>
                                    {isMultiple ? (
                                        <div className={`${styles.checkbox} ${isSelected ? styles.checked : ''}`}>{isSelected && '✓'}</div>
                                    ) : (
                                        <div className={`${styles.radio} ${isSelected ? styles.checked : ''}`} />
                                    )}
                                </div>
                                <span className={styles.optionText}>{option}</span>
                                {showCorrectness && isCorrect && <span className={styles.correctMark}>✓</span>}
                            </div>
                        );
                    })}
                </div>
                {showResults && question.rationale && <div className={styles.rationale}><strong>Rationale:</strong> {question.rationale}</div>}
            </div>
        );
    };

    return (
        <div className={styles.page}>
            <header className={styles.header}>
                <h1 className={styles.pageTitle}>All Question Types Demo</h1>
                <p className={styles.subtitle}>15 question types for comprehensive nursing education</p>
            </header>

            <nav className={styles.questionNav}>
                {allSampleQuestions.map((q, index) => {
                    const type = 'questionType' in q ? q.questionType : q.type;
                    return (
                        <button key={q.id} className={`${styles.navTab} ${currentQuestionIndex === index ? styles.active : ''}`} onClick={() => { setCurrentQuestionIndex(index); setShowResults(false); }}>
                            <span className={styles.tabNumber}>{index + 1}</span>
                            <span className={styles.tabType}>{questionTypeLabels[type] || type}</span>
                        </button>
                    );
                })}
            </nav>

            <main className={styles.questionContainer}>
                {currentQuestion.displayType === 'clinical' ? (
                    <ClinicalQuestionRenderer question={currentQuestion as ClinicalQuestion} showResults={showResults} onAnswer={(answer) => console.log('Answer:', answer)} />
                ) : (
                    renderTraditionalQuestion(currentQuestion as Question)
                )}

                <div className={styles.controls}>
                    <button className={`${styles.controlBtn} ${styles.prevBtn}`} onClick={() => { setCurrentQuestionIndex(Math.max(0, currentQuestionIndex - 1)); setShowResults(false); }} disabled={currentQuestionIndex === 0}>← Previous</button>
                    <button className={`${styles.controlBtn} ${styles.checkBtn}`} onClick={() => setShowResults(!showResults)}>{showResults ? 'Hide Answers' : 'Check Answers'}</button>
                    <button className={`${styles.controlBtn} ${styles.nextBtn}`} onClick={() => { setCurrentQuestionIndex(Math.min(allSampleQuestions.length - 1, currentQuestionIndex + 1)); setShowResults(false); }} disabled={currentQuestionIndex === allSampleQuestions.length - 1}>Next →</button>
                </div>
            </main>
        </div>
    );
}
