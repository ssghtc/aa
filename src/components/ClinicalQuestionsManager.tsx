'use client';

import React, { useState } from 'react';
import { ClinicalQuestionRenderer } from '@/components/ClinicalQuestions';
import type { ClinicalQuestion } from '@/types/clinical';
import type { Question } from '@/types';
import styles from '@/app/clinical/clinical.module.css';

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
    // 3. Diagram/Flowchart - Advanced Cardiac Life Support (ACLS)
    {
        id: 'q3',
        type: 'diagram',
        text: 'Complete the Adult Cardiac Arrest Algorithm for a shockable rhythm (VF/pVT).',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        diagramType: 'flowchart',
        diagramElements: [
            {
                id: 'step1',
                label: 'Start CPR',
                description: 'Give oxygen, attach monitor/defibrillator',
                options: ['Check rhythm', 'Administer Epinephrine', 'Intubate', 'Check pulse'],
                correctAnswer: 'Check rhythm',
                position: { x: 50, y: 10 }
            },
            {
                id: 'step2',
                label: 'Rhythm is Shockable (VF/pVT)',
                description: 'Verify VF or pVT on monitor',
                options: ['Administer Amiodarone', 'Defibrillate', 'Continue CPR 2 min', 'Give Epinephrine'],
                correctAnswer: 'Defibrillate',
                position: { x: 50, y: 30 }
            },
            {
                id: 'step3',
                label: 'Post-Shock',
                description: 'After first shock delivery',
                options: ['Check pulse immediately', 'Resume CPR for 2 minutes', 'Check rhythm', 'Give Epinephrine'],
                correctAnswer: 'Resume CPR for 2 minutes',
                position: { x: 50, y: 50 }
            },
            {
                id: 'step4',
                label: 'Drug Therapy',
                description: 'During CPR after 2nd shock',
                options: ['Administer Epinephrine 1mg', 'Administer Atropine 0.5mg', 'Administer Adenosine 6mg', 'Administer Magnesium'],
                correctAnswer: 'Administer Epinephrine 1mg',
                position: { x: 50, y: 70 }
            }
        ],
        rationale: 'The AHA ACLS algorithm for VF/pVT prioritizes early defibrillation and high-quality CPR. Pulse checks are done after 2-minute CPR cycles, not immediately post-shock. Epinephrine is given every 3-5 minutes.',
        displayType: 'traditional'
    },
    // 4. Fill in the Blanks (Cloze) - Arterial Blood Gas Analysis
    {
        id: 'q4',
        type: 'cloze',
        text: 'Interpret the following Arterial Blood Gas (ABG) content.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        clozeText: 'A patient with COPD presents with shortness of breath. ABG results: pH 7.32, PaCO2 58 mmHg, HCO3 28 mEq/L. This indicates [1]. The primary disturbance is [2], and the compensation is [3].',
        clozeElements: [
            {
                id: '1',
                options: ['Respiratory Acidosis', 'Respiratory Alkalosis', 'Metabolic Acidosis', 'Metabolic Alkalosis'],
                correctAnswer: 'Respiratory Acidosis'
            },
            {
                id: '2',
                options: ['Respiratory', 'Metabolic', 'Mixed', 'Idiopathic'],
                correctAnswer: 'Respiratory'
            },
            {
                id: '3',
                options: ['Uncompensated', 'Partially Compensated', 'Fully Compensated', 'None'],
                correctAnswer: 'Partially Compensated'
            }
        ],
        rationale: 'pH < 7.35 indicates acidosis. PaCO2 > 45 indicates respiratory cause. Elevated HCO3 (> 26) indicates metabolic compensation. Since pH is not yet normal, it is partially compensated.',
        displayType: 'traditional'
    },
    // 5. Matrix Table - Insulin Onset, Peak, and Duration
    {
        id: 'q5',
        type: 'matrix',
        text: 'Match each insulin type to its correct pharmacokinetic properties.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        matrixColumns: [
            { id: 'rapid', label: 'Rapid Acting (Lispro/Aspart)' },
            { id: 'short', label: 'Short Acting (Regular)' },
            { id: 'inter', label: 'Intermediate (NPH)' },
            { id: 'long', label: 'Long Acting (Glargine)' }
        ],
        matrixRows: [
            { id: 'row1', text: 'Onset: 15 minutes', correctColumnId: 'rapid' },
            { id: 'row2', text: 'Peak: 4-12 hours', correctColumnId: 'inter' },
            { id: 'row3', text: 'No pronounced peak', correctColumnId: 'long' },
            { id: 'row4', text: 'Only type for IV use', correctColumnId: 'short' },
            { id: 'row5', text: 'Duration: 24 hours', correctColumnId: 'long' }
        ],
        rationale: 'Rapid-acting insulins act within 15 mins. Regular insulin is the only IV insulin. NPH peaks in 4-12 hours. Long-acting insulins (Lantus) have no peak and last ~24 hours.',
        displayType: 'traditional'
    },
    // 6. Ordering - Blood Transfusion Procedure
    {
        id: 'q6',
        type: 'ordering',
        text: 'Place the steps of administering a blood transfusion in the correct order.',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        orderingItems: [
            { id: 'step1', text: 'Verify physician order and patient consent' },
            { id: 'step2', text: 'Obtain baseline vital signs' },
            { id: 'step3', text: 'Verify blood product with second nurse at bedside' },
            { id: 'step4', text: 'Prime tubing with 0.9% Normal Saline only' },
            { id: 'step5', text: 'Start transfusion slowly (2 mL/min) and stay with patient for 15 mins' }
        ],
        correctOrder: ['step1', 'step4', 'step2', 'step3', 'step5'],
        rationale: 'Order: Check Order/Consent -> Prime tubing (can be done while waiting) -> Vitals -> Dual Verification -> Start Slow. Note: Some protocols allow priming before patient check, but verification must happen immediately before spiking unit to patient.',
        displayType: 'traditional'
    },
    // 7. Input/Calculation - Weight-based IV Drip (Dopamine)
    {
        id: 'q7',
        type: 'input',
        text: 'A patient weighing 80 kg is ordered Dopamine at 5 mcg/kg/min for hemodynamic support. The infusion bag contains 400 mg of Dopamine in 250 mL of D5W. Calculate the flow rate in mL/hr. (Round to the nearest whole number)',
        options: [],
        correctOptions: [],
        subjectId: '1',
        chapterId: '1',
        correctAnswerInput: '15',
        answerTolerance: 1,
        inputUnit: 'mL/hr',
        rationale: 'Step 1: Calculate dosage per minute: 80 kg x 5 mcg/kg/min = 400 mcg/min.\nStep 2: Convert to mg: 400 mcg/min = 0.4 mg/min.\nStep 3: Calculate concentration: 400 mg / 250 mL = 1.6 mg/mL.\nStep 4: Calculate rate: 0.4 mg/min / 1.6 mg/mL = 0.25 mL/min.\nStep 5: Convert to mL/hr: 0.25 mL/min x 60 min/hr = 15 mL/hr.',
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

export default function ClinicalQuestionsManager() {
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
        // Route to specific renderers based on question type
        if (question.type === 'diagram' && question.diagramElements) {
            return renderDiagramQuestion(question);
        } else if (question.type === 'cloze' && question.clozeElements) {
            return renderClozeQuestion(question);
        } else if (question.type === 'matrix' && question.matrixRows && question.matrixColumns) {
            return renderMatrixQuestion(question);
        } else if (question.type === 'ordering' && question.orderingItems) {
            return renderOrderingQuestion(question);
        } else if (question.type === 'input') {
            return renderInputQuestion(question);
        }

        // Default: Single/Multiple choice
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

    const renderDiagramQuestion = (question: Question) => {
        const answers = userAnswers[question.id] || {};
        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>Flowchart</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '1.5rem' }}>
                    {question.diagramElements?.map((element) => (
                        <div key={element.id} style={{ background: 'var(--bg-secondary)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                            <h4 style={{ color: 'var(--accent-primary)', marginBottom: '0.5rem' }}>{element.label}</h4>
                            {element.description && <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1rem' }}>{element.description}</p>}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                                {element.options.map((option, idx) => {
                                    const isSelected = answers[element.id] === option;
                                    const isCorrect = element.correctAnswer === option;
                                    return (
                                        <button
                                            key={idx}
                                            style={{
                                                padding: '0.75rem',
                                                borderRadius: '8px',
                                                border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-color)'}`,
                                                background: showResults && isCorrect ? 'var(--success-bg)' : showResults && isSelected && !isCorrect ? 'var(--error-bg)' : isSelected ? 'var(--accent-primary-light)' : 'var(--bg-primary)',
                                                color: 'var(--text-primary)',
                                                cursor: showResults ? 'default' : 'pointer',
                                                transition: 'all 0.2s'
                                            }}
                                            onClick={() => !showResults && setUserAnswers({ ...userAnswers, [question.id]: { ...answers, [element.id]: option } })}
                                        >
                                            {option}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
                {showResults && question.rationale && <div className={styles.rationale}><strong>Rationale:</strong> {question.rationale}</div>}
            </div>
        );
    };

    const renderClozeQuestion = (question: Question) => {
        const answers = userAnswers[question.id] || {};
        const parts = question.clozeText?.split(/(\[\d+\])/g) || [];

        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>Fill in the Blanks</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                <div style={{ fontSize: '1.1rem', lineHeight: '2', marginTop: '1.5rem' }}>
                    {parts.map((part, idx) => {
                        const match = part.match(/\[(\d+)\]/);
                        if (match) {
                            const elementId = match[1];
                            const element = question.clozeElements?.find(e => e.id === elementId);
                            if (!element) return null;

                            const selected = answers[elementId];
                            const isCorrect = selected === element.correctAnswer;

                            return (
                                <select
                                    key={idx}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        borderRadius: '6px',
                                        border: `2px solid ${showResults && isCorrect ? 'var(--success)' : showResults && selected && !isCorrect ? 'var(--error)' : 'var(--border-color)'}`,
                                        background: showResults && isCorrect ? 'var(--success-bg)' : showResults && selected && !isCorrect ? 'var(--error-bg)' : 'var(--bg-secondary)',
                                        color: 'var(--text-primary)',
                                        fontSize: '1rem',
                                        margin: '0 0.25rem'
                                    }}
                                    value={selected || ''}
                                    onChange={(e) => !showResults && setUserAnswers({ ...userAnswers, [question.id]: { ...answers, [elementId]: e.target.value } })}
                                    disabled={showResults}
                                >
                                    <option value="">Select...</option>
                                    {element.options.map((opt, i) => (
                                        <option key={i} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            );
                        }
                        return <span key={idx}>{part}</span>;
                    })}
                </div>
                {showResults && question.rationale && <div className={styles.rationale}><strong>Rationale:</strong> {question.rationale}</div>}
            </div>
        );
    };

    const renderMatrixQuestion = (question: Question) => {
        const answers = userAnswers[question.id] || {};
        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>Matrix Table</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                <div style={{ overflowX: 'auto', marginTop: '1.5rem' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '1rem', textAlign: 'left', borderBottom: '2px solid var(--border-color)' }}></th>
                                {question.matrixColumns?.map(col => (
                                    <th key={col.id} style={{ padding: '1rem', textAlign: 'center', borderBottom: '2px solid var(--border-color)', color: 'var(--accent-primary)' }}>{col.label}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {question.matrixRows?.map(row => (
                                <tr key={row.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                                    <td style={{ padding: '1rem', fontWeight: 500 }}>{row.text}</td>
                                    {question.matrixColumns?.map(col => {
                                        const isSelected = answers[row.id] === col.id;
                                        const isCorrect = row.correctColumnId === col.id;
                                        return (
                                            <td key={col.id} style={{ padding: '1rem', textAlign: 'center' }}>
                                                <input
                                                    type="radio"
                                                    name={row.id}
                                                    checked={isSelected}
                                                    onChange={() => !showResults && setUserAnswers({ ...userAnswers, [question.id]: { ...answers, [row.id]: col.id } })}
                                                    style={{
                                                        width: '20px',
                                                        height: '20px',
                                                        accentColor: showResults && isCorrect ? 'var(--success)' : 'var(--accent-primary)'
                                                    }}
                                                    disabled={showResults}
                                                />
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {showResults && question.rationale && <div className={styles.rationale}><strong>Rationale:</strong> {question.rationale}</div>}
            </div>
        );
    };

    const renderOrderingQuestion = (question: Question) => {
        const currentOrder = userAnswers[question.id] || question.orderingItems?.map(item => item.id) || [];

        const moveItem = (fromIndex: number, toIndex: number) => {
            if (showResults) return;
            const newOrder = [...currentOrder];
            const [moved] = newOrder.splice(fromIndex, 1);
            newOrder.splice(toIndex, 0, moved);
            setUserAnswers({ ...userAnswers, [question.id]: newOrder });
        };

        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>Ordering</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1.5rem' }}>
                    {currentOrder.map((itemId: string, index: number) => {
                        const item = question.orderingItems?.find(i => i.id === itemId);
                        if (!item) return null;
                        const correctIndex = question.correctOrder?.indexOf(itemId) ?? -1;
                        const isCorrectPosition = showResults && index === correctIndex;

                        return (
                            <div key={itemId} style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1rem',
                                padding: '1rem',
                                background: isCorrectPosition ? 'var(--success-bg)' : showResults ? 'var(--error-bg)' : 'var(--bg-secondary)',
                                border: `2px solid ${isCorrectPosition ? 'var(--success)' : showResults ? 'var(--error)' : 'var(--border-color)'}`,
                                borderRadius: '8px'
                            }}>
                                <span style={{
                                    minWidth: '32px',
                                    height: '32px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    background: 'var(--accent-primary)',
                                    color: 'white',
                                    borderRadius: '50%',
                                    fontWeight: 'bold'
                                }}>{index + 1}</span>
                                <span style={{ flex: 1 }}>{item.text}</span>
                                {!showResults && (
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button
                                            onClick={() => moveItem(index, index - 1)}
                                            disabled={index === 0}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--accent-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: index === 0 ? 'not-allowed' : 'pointer',
                                                opacity: index === 0 ? 0.5 : 1
                                            }}
                                        >↑</button>
                                        <button
                                            onClick={() => moveItem(index, index + 1)}
                                            disabled={index === currentOrder.length - 1}
                                            style={{
                                                padding: '0.5rem 1rem',
                                                background: 'var(--accent-primary)',
                                                color: 'white',
                                                border: 'none',
                                                borderRadius: '6px',
                                                cursor: index === currentOrder.length - 1 ? 'not-allowed' : 'pointer',
                                                opacity: index === currentOrder.length - 1 ? 0.5 : 1
                                            }}
                                        >↓</button>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
                {showResults && question.rationale && <div className={styles.rationale}><strong>Rationale:</strong> {question.rationale}</div>}
            </div>
        );
    };

    const renderInputQuestion = (question: Question) => {
        const answer = userAnswers[question.id] || '';
        const numericAnswer = parseFloat(answer);
        const correctAnswer = parseFloat(question.correctAnswerInput || '0');
        const tolerance = question.answerTolerance || 0;
        const isCorrect = !isNaN(numericAnswer) && Math.abs(numericAnswer - correctAnswer) <= tolerance;

        return (
            <div className={styles.questionCard}>
                <div className={styles.questionHeader}>
                    <span className={styles.questionType}>Input/Calculation</span>
                    {question.clientNeeds && <span className={`${styles.difficulty} ${styles[question.clientNeeds]}`}>{question.clientNeeds}</span>}
                </div>
                <h2 className={styles.questionTitle}>{question.text}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '1.5rem' }}>
                    <input
                        type="number"
                        value={answer}
                        onChange={(e) => !showResults && setUserAnswers({ ...userAnswers, [question.id]: e.target.value })}
                        style={{
                            padding: '1rem',
                            fontSize: '1.1rem',
                            borderRadius: '8px',
                            border: `2px solid ${showResults && isCorrect ? 'var(--success)' : showResults && answer ? 'var(--error)' : 'var(--border-color)'}`,
                            background: showResults && isCorrect ? 'var(--success-bg)' : showResults && answer ? 'var(--error-bg)' : 'var(--bg-secondary)',
                            color: 'var(--text-primary)',
                            width: '200px'
                        }}
                        placeholder="Enter your answer"
                        disabled={showResults}
                    />
                    {question.inputUnit && <span style={{ fontSize: '1.1rem', fontWeight: 500, color: 'var(--text-secondary)' }}>{question.inputUnit}</span>}
                </div>
                {showResults && (
                    <div style={{ marginTop: '1.5rem', padding: '1rem', background: 'var(--bg-secondary)', borderRadius: '8px' }}>
                        <p style={{ marginBottom: '0.5rem' }}><strong>Your answer:</strong> {answer || 'Not answered'}</p>
                        <p><strong>Correct answer:</strong> {question.correctAnswerInput} {question.inputUnit}</p>
                    </div>
                )}
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
