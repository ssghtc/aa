-- =====================================================
-- CLINICAL REASONING QUESTIONS SCHEMA FOR SUPABASE
-- =====================================================
-- This schema adds 8 new clinical question types for nursing/medical education

-- First, update the existing questions table type constraint to include new types
-- Run this only if you want to modify existing table (otherwise skip to new tables)

-- ALTER TABLE questions DROP CONSTRAINT IF EXISTS questions_type_check;
-- ALTER TABLE questions ADD CONSTRAINT questions_type_check CHECK (
--   type IN (
--     'single', 'multiple', 'diagram', 'cloze', 'matrix', 'ordering', 'input',
--     'sentence_completion', 'drag_drop_priority', 'compare_classify', 
--     'expected_not_expected', 'indicated_not_indicated', 'sata', 
--     'priority_action', 'case_study'
--   )
-- );

-- =====================================================
-- TABLE: clinical_questions (Main table for all clinical question types)
-- =====================================================
CREATE TABLE IF NOT EXISTS clinical_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  
  -- Question Type
  question_type TEXT NOT NULL CHECK (question_type IN (
    'sentence_completion',      -- 1. Sentence-Completion Clinical Reasoning
    'drag_drop_priority',       -- 2. Drag-and-Drop Priority Findings
    'compare_classify',         -- 3. Compare-and-Classify
    'expected_not_expected',    -- 4. Expected vs Not Expected Findings
    'indicated_not_indicated',  -- 5. Indicated vs Not Indicated Intervention
    'sata',                     -- 6. Select-All-That-Apply
    'priority_action',          -- 7. Priority Action
    'case_study'                -- 8. Case-Study Multi-Item
  )),
  
  -- Common Fields
  title TEXT NOT NULL,
  instruction TEXT NOT NULL,  -- e.g., "Complete the following sentence..."
  scenario TEXT,              -- Clinical scenario/case description
  rationale TEXT,             -- Explanation of correct answer
  difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')) DEFAULT 'medium',
  
  -- Topic Classification
  subject_id UUID REFERENCES subjects(id) ON DELETE CASCADE NOT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE NOT NULL,
  clinical_topic TEXT,        -- e.g., "Multiple Sclerosis", "Stroke", "TBI"
  clinical_focus TEXT,        -- e.g., "Diagnosis", "Treatment", "Complications"
  
  -- Metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: sentence_completion_questions
-- Type 1: Sentence-Completion Clinical Reasoning Questions
-- Format: "Complete the following sentence by choosing from the lists of options."
-- =====================================================
CREATE TABLE IF NOT EXISTS sentence_completion_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- The sentence template with placeholders like {{1}}, {{2}}
  -- Example: "A patient with {{1}} is expected to receive {{2}} as initial treatment."
  sentence_template TEXT NOT NULL,
  
  -- Dropdown groups stored as JSONB array
  -- Format: [{"id": "1", "options": ["option1", "option2"], "correct_answer": "option1"}, ...]
  dropdown_groups JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: drag_drop_priority_questions
-- Type 2: Drag-and-Drop Priority Findings Questions
-- Format: "Drag the findings that require immediate follow-up."
-- =====================================================
CREATE TABLE IF NOT EXISTS drag_drop_priority_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- All available findings/items
  -- Format: [{"id": "1", "text": "Altered Glasgow Coma Scale", "requires_followup": true}, ...]
  items JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- Categories/zones for drag-drop
  -- Format: [{"id": "priority", "label": "Immediate Follow-up Required"}, {"id": "not_priority", "label": "Monitor Only"}]
  drop_zones JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- How many items should be in priority zone
  min_priority_items INTEGER DEFAULT 1,
  max_priority_items INTEGER DEFAULT 5,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: compare_classify_questions
-- Type 3: Compare-and-Classify Questions
-- Format: "For each characteristic, specify if it applies to ___ or ___."
-- =====================================================
CREATE TABLE IF NOT EXISTS compare_classify_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- The conditions/diseases being compared
  -- Format: [{"id": "1", "name": "Epidural Hematoma"}, {"id": "2", "name": "Subdural Hematoma"}]
  conditions JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- Characteristics to classify
  -- Format: [{"id": "1", "text": "Lucid interval before deterioration", "applies_to": ["1"]}, ...]
  characteristics JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- Allow both (for characteristics that apply to multiple conditions)
  allow_multiple BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: expected_finding_questions
-- Type 4: Expected vs Not Expected Findings Questions
-- Format: "For each finding, click whether it is expected or not with [condition]."
-- =====================================================
CREATE TABLE IF NOT EXISTS expected_finding_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- The condition being evaluated
  condition_name TEXT NOT NULL,  -- e.g., "increased ICP"
  
  -- Findings to evaluate
  -- Format: [{"id": "1", "text": "Cushing's triad", "is_expected": true}, ...]
  findings JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: indicated_intervention_questions
-- Type 5: Indicated vs Not Indicated Intervention Questions
-- Format: "For each intervention, specify if it is indicated."
-- =====================================================
CREATE TABLE IF NOT EXISTS indicated_intervention_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- The clinical situation
  clinical_situation TEXT NOT NULL,  -- e.g., "Patient with increased ICP"
  
  -- Interventions to evaluate
  -- Format: [{"id": "1", "text": "Elevate head of bed 30 degrees", "is_indicated": true, "rationale": "..."}, ...]
  interventions JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: sata_questions
-- Type 6: Select-All-That-Apply (SATA) Safety & Monitoring Questions
-- Format: "Which findings should the nurse monitor for?"
-- =====================================================
CREATE TABLE IF NOT EXISTS sata_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- Question prompt
  prompt TEXT NOT NULL,  -- e.g., "Which findings should the nurse monitor for in a patient with Guillain-Barré?"
  
  -- Options with correct answers
  -- Format: [{"id": "1", "text": "Respiratory distress", "is_correct": true}, {"id": "2", "text": "Hyperreflexia", "is_correct": false}, ...]
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- Minimum correct selections required (for partial credit if applicable)
  min_correct_for_partial INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: priority_action_questions
-- Type 7: Priority Action Questions
-- Format: "Which is the priority action?"
-- =====================================================
CREATE TABLE IF NOT EXISTS priority_action_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- Clinical scenario (can also use scenario from parent clinical_questions table)
  emergency_scenario TEXT NOT NULL,
  
  -- Action options
  -- Format: [{"id": "1", "text": "Administer oxygen", "priority_rank": 2}, {"id": "2", "text": "Call physician", "priority_rank": 1}, ...]
  actions JSONB NOT NULL DEFAULT '[]'::JSONB,
  
  -- The ID of the highest priority action
  correct_action_id TEXT NOT NULL,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: case_study_questions
-- Type 8: Case-Study Multi-Item Questions
-- Format: 1 scenario → 5–6 questions testing different aspects
-- =====================================================
CREATE TABLE IF NOT EXISTS case_study_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  clinical_question_id UUID REFERENCES clinical_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- Main case details
  patient_info TEXT NOT NULL,         -- Demographics, chief complaint
  history TEXT,                        -- Medical history
  vital_signs JSONB,                  -- {"bp": "140/90", "hr": 88, "rr": 20, "temp": 37.2, "spo2": 96}
  lab_values JSONB,                   -- Relevant lab results
  assessment_findings TEXT,           -- Physical assessment findings
  
  -- Condition being tested
  primary_condition TEXT NOT NULL,    -- e.g., "Traumatic brain injury"
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- TABLE: case_study_sub_questions
-- Sub-questions for case studies (linked to case_study_questions)
-- =====================================================
CREATE TABLE IF NOT EXISTS case_study_sub_questions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  case_study_id UUID REFERENCES case_study_questions(id) ON DELETE CASCADE NOT NULL,
  
  -- Question details
  question_order INTEGER NOT NULL,    -- Order within the case study (1-6)
  focus_area TEXT NOT NULL CHECK (focus_area IN (
    'assessment', 'diagnostics', 'interventions', 'complications', 'priorities', 'evaluation'
  )),
  
  question_text TEXT NOT NULL,
  
  -- Question format within the case study
  sub_question_type TEXT NOT NULL CHECK (sub_question_type IN (
    'single_choice', 'multiple_choice', 'sata', 'priority', 'drag_drop', 'expected_finding'
  )),
  
  -- Options stored as JSONB
  -- Format depends on sub_question_type
  options JSONB NOT NULL DEFAULT '[]'::JSONB,
  correct_answer JSONB NOT NULL,      -- Can be single value or array depending on type
  rationale TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY
-- =====================================================
ALTER TABLE clinical_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sentence_completion_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE drag_drop_priority_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE compare_classify_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE expected_finding_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicated_intervention_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE sata_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE priority_action_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_study_sub_questions ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- CREATE POLICIES (Public access for development)
-- =====================================================

-- Clinical Questions
CREATE POLICY "Enable read access for all users" ON clinical_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clinical_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clinical_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clinical_questions FOR DELETE USING (true);

-- Sentence Completion
CREATE POLICY "Enable read access for all users" ON sentence_completion_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sentence_completion_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON sentence_completion_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON sentence_completion_questions FOR DELETE USING (true);

-- Drag Drop Priority
CREATE POLICY "Enable read access for all users" ON drag_drop_priority_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON drag_drop_priority_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON drag_drop_priority_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON drag_drop_priority_questions FOR DELETE USING (true);

-- Compare Classify
CREATE POLICY "Enable read access for all users" ON compare_classify_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON compare_classify_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON compare_classify_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON compare_classify_questions FOR DELETE USING (true);

-- Expected Finding
CREATE POLICY "Enable read access for all users" ON expected_finding_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON expected_finding_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON expected_finding_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON expected_finding_questions FOR DELETE USING (true);

-- Indicated Intervention
CREATE POLICY "Enable read access for all users" ON indicated_intervention_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON indicated_intervention_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON indicated_intervention_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON indicated_intervention_questions FOR DELETE USING (true);

-- SATA
CREATE POLICY "Enable read access for all users" ON sata_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON sata_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON sata_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON sata_questions FOR DELETE USING (true);

-- Priority Action
CREATE POLICY "Enable read access for all users" ON priority_action_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON priority_action_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON priority_action_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON priority_action_questions FOR DELETE USING (true);

-- Case Study
CREATE POLICY "Enable read access for all users" ON case_study_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON case_study_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON case_study_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON case_study_questions FOR DELETE USING (true);

-- Case Study Sub Questions
CREATE POLICY "Enable read access for all users" ON case_study_sub_questions FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON case_study_sub_questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON case_study_sub_questions FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON case_study_sub_questions FOR DELETE USING (true);

-- =====================================================
-- CREATE INDEXES FOR BETTER PERFORMANCE
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_clinical_questions_type ON clinical_questions(question_type);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_subject ON clinical_questions(subject_id);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_chapter ON clinical_questions(chapter_id);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_topic ON clinical_questions(clinical_topic);

CREATE INDEX IF NOT EXISTS idx_sentence_completion_parent ON sentence_completion_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_drag_drop_parent ON drag_drop_priority_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_compare_classify_parent ON compare_classify_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_expected_finding_parent ON expected_finding_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_indicated_intervention_parent ON indicated_intervention_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_sata_parent ON sata_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_priority_action_parent ON priority_action_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_case_study_parent ON case_study_questions(clinical_question_id);
CREATE INDEX IF NOT EXISTS idx_case_study_sub_parent ON case_study_sub_questions(case_study_id);
