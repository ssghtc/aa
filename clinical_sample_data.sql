-- =====================================================
-- SAMPLE CLINICAL QUESTIONS DATA
-- Run this AFTER running clinical_questions_schema.sql
-- =====================================================

-- First, ensure we have a subject and chapter for Neurological Nursing
INSERT INTO subjects (id, name) VALUES 
  ('a1b2c3d4-1111-2222-3333-444455556666', 'Medical-Surgical Nursing')
ON CONFLICT (id) DO NOTHING;

INSERT INTO chapters (id, name, subject_id) VALUES 
  ('b1c2d3e4-1111-2222-3333-444455556666', 'Neurological Disorders', 'a1b2c3d4-1111-2222-3333-444455556666')
ON CONFLICT (id) DO NOTHING;

-- =====================================================
-- 1. SENTENCE-COMPLETION CLINICAL REASONING QUESTION
-- Multiple Sclerosis diagnosis → corticosteroids
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'sentence_completion',
  'Multiple Sclerosis Treatment',
  'Complete the following sentence by choosing from the lists of options.',
  'A 32-year-old female presents with visual disturbances, numbness in extremities, and fatigue that has progressively worsened over the past month.',
  'Multiple sclerosis exacerbations are typically treated with high-dose corticosteroids to reduce inflammation and shorten the duration of attacks.',
  'medium',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Multiple Sclerosis',
  'Diagnosis and Treatment'
);

INSERT INTO sentence_completion_questions (
  clinical_question_id, sentence_template, dropdown_groups
) VALUES (
  '11111111-1111-1111-1111-111111111111',
  'A patient diagnosed with {{1}} presenting with an acute exacerbation is expected to receive {{2}} as the initial treatment to {{3}}.',
  '[
    {"id": "1", "options": ["Multiple Sclerosis", "Myasthenia Gravis", "Guillain-Barré Syndrome", "Parkinson Disease"], "correct_answer": "Multiple Sclerosis"},
    {"id": "2", "options": ["IV methylprednisolone", "Oral methotrexate", "Plasma exchange only", "Acetylcholinesterase inhibitors"], "correct_answer": "IV methylprednisolone"},
    {"id": "3", "options": ["reduce inflammation and shorten attack duration", "prevent future relapses", "reverse demyelination permanently", "increase dopamine levels"], "correct_answer": "reduce inflammation and shorten attack duration"}
  ]'::JSONB
);

-- =====================================================
-- 2. DRAG-AND-DROP PRIORITY FINDINGS QUESTION
-- Basilar skull fracture signs
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  'drag_drop_priority',
  'Traumatic Brain Injury Priority Assessment',
  'Drag the findings that require immediate follow-up to the priority zone.',
  'A patient arrives in the emergency department after a motor vehicle accident. The nurse is performing the initial assessment.',
  'Signs of basilar skull fracture (Battle sign, raccoon eyes, CSF leak) and neurological deterioration require immediate intervention due to risk of brain herniation.',
  'hard',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Traumatic Brain Injury',
  'Clinical Prioritization'
);

INSERT INTO drag_drop_priority_questions (
  clinical_question_id, items, drop_zones, min_priority_items, max_priority_items
) VALUES (
  '22222222-2222-2222-2222-222222222222',
  '[
    {"id": "1", "text": "Battle sign (bruising behind ears)", "requires_followup": true},
    {"id": "2", "text": "Glasgow Coma Scale dropped from 14 to 10", "requires_followup": true},
    {"id": "3", "text": "Clear fluid draining from nose", "requires_followup": true},
    {"id": "4", "text": "Periorbital ecchymosis (raccoon eyes)", "requires_followup": true},
    {"id": "5", "text": "Mild headache rated 3/10", "requires_followup": false},
    {"id": "6", "text": "Blood pressure 128/78 mmHg", "requires_followup": false},
    {"id": "7", "text": "Unilateral pupil dilation", "requires_followup": true},
    {"id": "8", "text": "Small scalp laceration with controlled bleeding", "requires_followup": false}
  ]'::JSONB,
  '[
    {"id": "priority", "label": "Immediate Follow-up Required"},
    {"id": "monitor", "label": "Continue Monitoring"}
  ]'::JSONB,
  3,
  6
);

-- =====================================================
-- 3. COMPARE-AND-CLASSIFY QUESTION
-- Epidural vs Subdural hematoma
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  'compare_classify',
  'Epidural vs Subdural Hematoma',
  'For each characteristic, specify if it applies to Epidural Hematoma or Subdural Hematoma.',
  'The nurse is caring for patients with different types of intracranial bleeding following head trauma.',
  'Epidural hematomas are arterial (often from middle meningeal artery), develop rapidly, and show a classicallucid interval. Subdural hematomas are venous, develop more slowly, and are common in elderly/alcoholics.',
  'medium',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Intracranial Hemorrhage',
  'Differentiating Diseases'
);

INSERT INTO compare_classify_questions (
  clinical_question_id, conditions, characteristics, allow_multiple
) VALUES (
  '33333333-3333-3333-3333-333333333333',
  '[
    {"id": "epidural", "name": "Epidural Hematoma"},
    {"id": "subdural", "name": "Subdural Hematoma"}
  ]'::JSONB,
  '[
    {"id": "1", "text": "Lucid interval followed by rapid deterioration", "applies_to": ["epidural"]},
    {"id": "2", "text": "Arterial bleeding source", "applies_to": ["epidural"]},
    {"id": "3", "text": "More common in elderly and chronic alcoholics", "applies_to": ["subdural"]},
    {"id": "4", "text": "Lens-shaped (biconvex) appearance on CT", "applies_to": ["epidural"]},
    {"id": "5", "text": "Crescent-shaped appearance on CT", "applies_to": ["subdural"]},
    {"id": "6", "text": "Venous bleeding source", "applies_to": ["subdural"]},
    {"id": "7", "text": "Often associated with temporal bone fracture", "applies_to": ["epidural"]},
    {"id": "8", "text": "Gradual onset of symptoms over hours to days", "applies_to": ["subdural"]}
  ]'::JSONB,
  false
);

-- =====================================================
-- 4. EXPECTED VS NOT EXPECTED FINDINGS QUESTION
-- Increased ICP
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'expected_not_expected',
  'Increased Intracranial Pressure Findings',
  'For each finding, click whether it is expected or not expected with increased ICP.',
  'A patient with a severe traumatic brain injury is being monitored in the ICU. The ICP monitor shows readings consistently above 20 mmHg.',
  'Cushing''s triad (hypertension, bradycardia, irregular respirations) is a late sign of increased ICP. Early signs include headache, altered LOC, and pupillary changes.',
  'medium',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Increased Intracranial Pressure',
  'Recognizing Dangerous Symptoms'
);

INSERT INTO expected_finding_questions (
  clinical_question_id, condition_name, findings
) VALUES (
  '44444444-4444-4444-4444-444444444444',
  'increased intracranial pressure',
  '[
    {"id": "1", "text": "Cushing''s triad (hypertension, bradycardia, irregular breathing)", "is_expected": true},
    {"id": "2", "text": "Dilated, nonreactive pupil on the affected side", "is_expected": true},
    {"id": "3", "text": "Projectile vomiting without nausea", "is_expected": true},
    {"id": "4", "text": "Tachycardia and hypotension", "is_expected": false},
    {"id": "5", "text": "Decreased level of consciousness", "is_expected": true},
    {"id": "6", "text": "Papilledema on fundoscopic exam", "is_expected": true},
    {"id": "7", "text": "Hyperactive deep tendon reflexes", "is_expected": false},
    {"id": "8", "text": "Decorticate or decerebrate posturing", "is_expected": true}
  ]'::JSONB
);

-- =====================================================
-- 5. INDICATED VS NOT INDICATED INTERVENTION QUESTION
-- Increased ICP Management
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'indicated_not_indicated',
  'Interventions for Increased ICP',
  'For each intervention, specify if it is indicated or not indicated.',
  'A patient with traumatic brain injury has ICP consistently above 22 mmHg despite initial interventions.',
  'Interventions for increased ICP include head elevation, avoiding neck flexion, maintaining normothermia, osmotic therapy, and controlled hyperventilation. Avoid actions that increase ICP.',
  'hard',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Increased Intracranial Pressure',
  'Correct Management'
);

INSERT INTO indicated_intervention_questions (
  clinical_question_id, clinical_situation, interventions
) VALUES (
  '55555555-5555-5555-5555-555555555555',
  'Patient with traumatic brain injury and persistently elevated ICP above 22 mmHg',
  '[
    {"id": "1", "text": "Elevate head of bed to 30 degrees", "is_indicated": true, "rationale": "Promotes venous drainage from the brain"},
    {"id": "2", "text": "Administer IV mannitol as ordered", "is_indicated": true, "rationale": "Osmotic diuretic reduces cerebral edema"},
    {"id": "3", "text": "Cluster nursing care activities", "is_indicated": false, "rationale": "Clustering activities increases ICP; space out care"},
    {"id": "4", "text": "Maintain the neck in neutral position", "is_indicated": true, "rationale": "Prevents jugular vein compression"},
    {"id": "5", "text": "Suction the airway vigorously q2h", "is_indicated": false, "rationale": "Aggressive suctioning increases ICP; limit to 10 seconds"},
    {"id": "6", "text": "Maintain normothermia (avoid fever)", "is_indicated": true, "rationale": "Fever increases cerebral metabolic demand"},
    {"id": "7", "text": "Encourage frequent Valsalva maneuvers for bowel movements", "is_indicated": false, "rationale": "Valsalva maneuver increases ICP"},
    {"id": "8", "text": "Administer hypertonic saline as ordered", "is_indicated": true, "rationale": "Draws fluid from brain tissue to reduce edema"}
  ]'::JSONB
);

-- =====================================================
-- 6. SATA SAFETY & MONITORING QUESTION
-- Guillain-Barré Syndrome Complications
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'sata',
  'Guillain-Barré Syndrome Monitoring',
  'Select all findings the nurse should monitor for in a patient with Guillain-Barré Syndrome.',
  'A 45-year-old patient was admitted with progressive ascending weakness and areflexia diagnosed as Guillain-Barré Syndrome. The weakness began in the legs 3 days ago and is now affecting the trunk.',
  'GBS can cause rapidly ascending paralysis that may affect respiratory muscles. Monitor for respiratory failure, autonomic dysfunction, and aspiration risk.',
  'hard',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Guillain-Barré Syndrome',
  'Complications and Safety'
);

INSERT INTO sata_questions (
  clinical_question_id, prompt, options, min_correct_for_partial
) VALUES (
  '66666666-6666-6666-6666-666666666666',
  'Which findings should the nurse monitor for in this patient with Guillain-Barré Syndrome? Select all that apply.',
  '[
    {"id": "1", "text": "Decreasing vital capacity and respiratory distress", "is_correct": true},
    {"id": "2", "text": "Cardiac dysrhythmias and blood pressure fluctuations", "is_correct": true},
    {"id": "3", "text": "Hyperreflexia and spasticity", "is_correct": false},
    {"id": "4", "text": "Difficulty swallowing and aspiration risk", "is_correct": true},
    {"id": "5", "text": "Urinary retention", "is_correct": true},
    {"id": "6", "text": "Cognitive decline and memory loss", "is_correct": false},
    {"id": "7", "text": "Deep vein thrombosis", "is_correct": true},
    {"id": "8", "text": "Severe neuropathic pain", "is_correct": true}
  ]'::JSONB,
  4
);

-- =====================================================
-- 7. PRIORITY ACTION QUESTION
-- Intracranial Hemorrhage after tPA
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  'priority_action',
  'Post-tPA Hemorrhage Emergency',
  'Which is the priority nursing action?',
  'A patient received tPA for ischemic stroke 45 minutes ago. The nurse notices sudden onset of severe headache, new neurological deficits, and blood pressure of 210/120 mmHg.',
  'These signs suggest intracranial hemorrhage, a life-threatening complication of tPA. The priority is to stop the tPA infusion immediately and prepare for emergent interventions.',
  'hard',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Ischemic Stroke',
  'Critical Thinking Under Emergency'
);

INSERT INTO priority_action_questions (
  clinical_question_id, emergency_scenario, actions, correct_action_id
) VALUES (
  '77777777-7777-7777-7777-777777777777',
  'Patient develops severe headache, new neurological deficits, and severely elevated BP 45 minutes after tPA administration',
  '[
    {"id": "1", "text": "Document the findings and reassess in 15 minutes", "priority_rank": 5},
    {"id": "2", "text": "Stop the tPA infusion immediately", "priority_rank": 1},
    {"id": "3", "text": "Administer ordered PRN antihypertensive medication", "priority_rank": 3},
    {"id": "4", "text": "Notify the physician/rapid response team", "priority_rank": 2},
    {"id": "5", "text": "Prepare for emergent CT scan", "priority_rank": 4},
    {"id": "6", "text": "Increase the IV fluid rate", "priority_rank": 6}
  ]'::JSONB,
  '2'
);

-- =====================================================
-- 8. CASE STUDY MULTI-ITEM QUESTION
-- Ischemic Stroke Case
-- =====================================================
INSERT INTO clinical_questions (
  id, question_type, title, instruction, scenario, rationale, difficulty,
  subject_id, chapter_id, clinical_topic, clinical_focus
) VALUES (
  '88888888-8888-8888-8888-888888888888',
  'case_study',
  'Ischemic Stroke Management Case Study',
  'Answer the following questions based on the case study.',
  NULL,  -- Detailed scenario is in the case_study_questions table
  'This case study tests comprehensive knowledge of ischemic stroke assessment, treatment, and complication management.',
  'hard',
  'a1b2c3d4-1111-2222-3333-444455556666',
  'b1c2d3e4-1111-2222-3333-444455556666',
  'Ischemic Stroke',
  'Comprehensive Case Management'
);

INSERT INTO case_study_questions (
  id, clinical_question_id, patient_info, history, vital_signs, lab_values, 
  assessment_findings, primary_condition
) VALUES (
  'cc888888-8888-8888-8888-888888888888',
  '88888888-8888-8888-8888-888888888888',
  '68-year-old male brought to ED by family who witnessed sudden onset of right-sided weakness and speech difficulty 90 minutes ago.',
  'Past medical history: Hypertension (poorly controlled), Type 2 Diabetes, Atrial fibrillation (not on anticoagulation), Former smoker',
  '{"bp": "178/96", "hr": 88, "hr_rhythm": "irregularly irregular", "rr": 18, "temp": 37.0, "spo2": 96, "blood_glucose": 186}'::JSONB,
  '{"inr": 1.0, "ptt": 28, "platelets": 245000, "creatinine": 1.1}'::JSONB,
  'Right facial droop, right arm drift, slurred speech (dysarthria), NIHSS score 12. CT head shows no hemorrhage. Alert and oriented x3.',
  'Ischemic Stroke'
);

-- Case Study Sub-Questions
INSERT INTO case_study_sub_questions (
  case_study_id, question_order, focus_area, question_text, sub_question_type, options, correct_answer, rationale
) VALUES 
(
  'cc888888-8888-8888-8888-888888888888',
  1,
  'assessment',
  'Based on the assessment findings, which type of stroke is most likely?',
  'single_choice',
  '[
    {"id": "a", "text": "Hemorrhagic stroke"},
    {"id": "b", "text": "Ischemic stroke - likely cardioembolic"},
    {"id": "c", "text": "Transient ischemic attack"},
    {"id": "d", "text": "Subarachnoid hemorrhage"}
  ]'::JSONB,
  '"b"'::JSONB,
  'The patient''s atrial fibrillation, sudden onset, and CT ruling out hemorrhage strongly suggest cardioembolic ischemic stroke.'
),
(
  'cc888888-8888-8888-8888-888888888888',
  2,
  'interventions',
  'The physician orders tPA. Which criteria must be met before administration? Select all that apply.',
  'sata',
  '[
    {"id": "a", "text": "Symptom onset within 4.5 hours", "is_correct": true},
    {"id": "b", "text": "CT scan negative for hemorrhage", "is_correct": true},
    {"id": "c", "text": "Blood pressure below 185/110 mmHg", "is_correct": true},
    {"id": "d", "text": "INR below 1.7", "is_correct": true},
    {"id": "e", "text": "Blood glucose between 50-400 mg/dL", "is_correct": true},
    {"id": "f", "text": "Patient must be NPO for 8 hours", "is_correct": false}
  ]'::JSONB,
  '["a", "b", "c", "d", "e"]'::JSONB,
  'tPA criteria include timing, absence of hemorrhage on CT, BP control, normal coagulation, and acceptable glucose levels.'
),
(
  'cc888888-8888-8888-8888-888888888888',
  3,
  'priorities',
  'After initiating tPA, which is the priority nursing assessment?',
  'priority',
  '[
    {"id": "a", "text": "Monitor blood pressure every 15 minutes for the first 2 hours"},
    {"id": "b", "text": "Check pupil reactions every hour"},
    {"id": "c", "text": "Assess bowel sounds every 4 hours"},
    {"id": "d", "text": "Measure urine output every shift"}
  ]'::JSONB,
  '"a"'::JSONB,
  'Frequent BP monitoring is critical during and after tPA to prevent hemorrhagic transformation. BP must remain below 180/105.'
),
(
  'cc888888-8888-8888-8888-888888888888',
  4,
  'complications',
  'Two hours after tPA, the patient becomes lethargic and develops new left-sided weakness. Which complication should the nurse suspect?',
  'single_choice',
  '[
    {"id": "a", "text": "Stroke progression"},
    {"id": "b", "text": "Hemorrhagic transformation"},
    {"id": "c", "text": "Seizure activity"},
    {"id": "d", "text": "Medication reaction"}
  ]'::JSONB,
  '"b"'::JSONB,
  'New neurological deficits after tPA, especially with altered LOC, should raise immediate concern for hemorrhagic transformation.'
),
(
  'cc888888-8888-8888-8888-888888888888',
  5,
  'diagnostics',
  'Which diagnostic test should be ordered first for this complication?',
  'single_choice',
  '[
    {"id": "a", "text": "MRI brain with contrast"},
    {"id": "b", "text": "CT head without contrast"},
    {"id": "c", "text": "Lumbar puncture"},
    {"id": "d", "text": "EEG"}
  ]'::JSONB,
  '"b"'::JSONB,
  'Non-contrast CT is the fastest way to identify intracranial hemorrhage and guides emergent management.'
),
(
  'cc888888-8888-8888-8888-888888888888',
  6,
  'evaluation',
  'For long-term stroke prevention in this patient, which intervention is most important?',
  'single_choice',
  '[
    {"id": "a", "text": "Initiation of anticoagulation therapy for atrial fibrillation"},
    {"id": "b", "text": "Daily aspirin therapy alone"},
    {"id": "c", "text": "Smoking cessation counseling"},
    {"id": "d", "text": "Low-sodium diet education"}
  ]'::JSONB,
  '"a"'::JSONB,
  'The patient''s atrial fibrillation was the likely cause of the cardioembolic stroke. Anticoagulation is essential for secondary prevention.'
);
