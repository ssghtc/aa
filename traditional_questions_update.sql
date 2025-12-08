-- 1. Update 'questions' table to include missing fields
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS rationale text,
ADD COLUMN IF NOT EXISTS difficulty text CHECK (difficulty IN ('easy', 'medium', 'hard')),
ADD COLUMN IF NOT EXISTS scenario text;

-- 2. Create a specific demo Subject and Chapter to ensure insertion works
-- We use a DO block to get valid UUIDs or create them if needed
DO $$
DECLARE
  v_subject_id uuid;
  v_chapter_id uuid;
BEGIN
  -- Get or create Subject
  SELECT id INTO v_subject_id FROM subjects WHERE name = 'Clinical Demo Subject' LIMIT 1;
  IF v_subject_id IS NULL THEN
    INSERT INTO subjects (name) VALUES ('Clinical Demo Subject') RETURNING id INTO v_subject_id;
  END IF;

  -- Get or create Chapter
  SELECT id INTO v_chapter_id FROM chapters WHERE name = 'Clinical Demo Chapter' AND subject_id = v_subject_id LIMIT 1;
  IF v_chapter_id IS NULL THEN
    INSERT INTO chapters (name, subject_id) VALUES ('Clinical Demo Chapter', v_subject_id) RETURNING id INTO v_chapter_id;
  END IF;

  -- 3. Insert the 5 Updated Traditional Questions
  
  -- Q3: Diagram/Flowchart (ACLS)
  INSERT INTO questions (
    type, text, rationale, difficulty, subject_id, chapter_id,
    diagram_type, diagram_elements
  ) VALUES (
    'diagram',
    'Complete the Adult Cardiac Arrest Algorithm for a shockable rhythm (VF/pVT).',
    'The AHA ACLS algorithm for VF/pVT prioritizes early defibrillation and high-quality CPR. Pulse checks are done after 2-minute CPR cycles, not immediately post-shock. Epinephrine is given every 3-5 minutes.',
    'hard',
    v_subject_id,
    v_chapter_id,
    'flowchart',
    '[
      {
        "id": "step1",
        "label": "Start CPR",
        "description": "Give oxygen, attach monitor/defibrillator",
        "options": ["Check rhythm", "Administer Epinephrine", "Intubate", "Check pulse"],
        "correctAnswer": "Check rhythm",
        "position": {"x": 50, "y": 10}
      },
      {
        "id": "step2",
        "label": "Rhythm is Shockable (VF/pVT)",
        "description": "Verify VF or pVT on monitor",
        "options": ["Administer Amiodarone", "Defibrillate", "Continue CPR 2 min", "Give Epinephrine"],
        "correctAnswer": "Defibrillate",
        "position": {"x": 50, "y": 30}
      },
      {
        "id": "step3",
        "label": "Post-Shock",
        "description": "After first shock delivery",
        "options": ["Check pulse immediately", "Resume CPR for 2 minutes", "Check rhythm", "Give Epinephrine"],
        "correctAnswer": "Resume CPR for 2 minutes",
        "position": {"x": 50, "y": 50}
      },
      {
        "id": "step4",
        "label": "Drug Therapy",
        "description": "During CPR after 2nd shock",
        "options": ["Administer Epinephrine 1mg", "Administer Atropine 0.5mg", "Administer Adenosine 6mg", "Administer Magnesium"],
        "correctAnswer": "Administer Epinephrine 1mg",
        "position": {"x": 50, "y": 70}
      }
    ]'::jsonb
  );

  -- Q4: Fill in the Blanks (ABG)
  INSERT INTO questions (
    type, text, rationale, difficulty, subject_id, chapter_id,
    cloze_text, cloze_elements
  ) VALUES (
    'cloze',
    'Interpret the following Arterial Blood Gas (ABG) content.',
    'pH < 7.35 indicates acidosis. PaCO2 > 45 indicates respiratory cause. Elevated HCO3 (> 26) indicates metabolic compensation. Since pH is not yet normal, it is partially compensated.',
    'medium',
    v_subject_id,
    v_chapter_id,
    'A patient with COPD presents with shortness of breath. ABG results: pH 7.32, PaCO2 58 mmHg, HCO3 28 mEq/L. This indicates [1]. The primary disturbance is [2], and the compensation is [3].',
    '[
      {
        "id": "1",
        "options": ["Respiratory Acidosis", "Respiratory Alkalosis", "Metabolic Acidosis", "Metabolic Alkalosis"],
        "correctAnswer": "Respiratory Acidosis"
      },
      {
        "id": "2",
        "options": ["Respiratory", "Metabolic", "Mixed", "Idiopathic"],
        "correctAnswer": "Respiratory"
      },
      {
        "id": "3",
        "options": ["Uncompensated", "Partially Compensated", "Fully Compensated", "None"],
        "correctAnswer": "Partially Compensated"
      }
    ]'::jsonb
  );

  -- Q5: Matrix Table (Insulin)
  INSERT INTO questions (
    type, text, rationale, difficulty, subject_id, chapter_id,
    matrix_columns, matrix_rows
  ) VALUES (
    'matrix',
    'Match each insulin type to its correct pharmacokinetic properties.',
    'Rapid-acting insulins act within 15 mins. Regular insulin is the only IV insulin. NPH peaks in 4-12 hours. Long-acting insulins (Lantus) have no peak and last ~24 hours.',
    'medium',
    v_subject_id,
    v_chapter_id,
    '[
      {"id": "rapid", "label": "Rapid Acting (Lispro/Aspart)"},
      {"id": "short", "label": "Short Acting (Regular)"},
      {"id": "inter", "label": "Intermediate (NPH)"},
      {"id": "long", "label": "Long Acting (Glargine)"}
    ]'::jsonb,
    '[
      {"id": "row1", "text": "Onset: 15 minutes", "correctColumnId": "rapid"},
      {"id": "row2", "text": "Peak: 4-12 hours", "correctColumnId": "inter"},
      {"id": "row3", "text": "No pronounced peak", "correctColumnId": "long"},
      {"id": "row4", "text": "Only type for IV use", "correctColumnId": "short"},
      {"id": "row5", "text": "Duration: 24 hours", "correctColumnId": "long"}
    ]'::jsonb
  );

  -- Q6: Ordering (Blood Transfusion)
  INSERT INTO questions (
    type, text, rationale, difficulty, subject_id, chapter_id,
    ordering_items, correct_order
  ) VALUES (
    'ordering',
    'Place the steps of administering a blood transfusion in the correct order.',
    'Order: Check Order/Consent -> Prime tubing (can be done while waiting) -> Vitals -> Dual Verification -> Start Slow. Note: Some protocols allow priming before patient check, but verification must happen immediately before spiking unit to patient.',
    'hard',
    v_subject_id,
    v_chapter_id,
    '[
      {"id": "step1", "text": "Verify physician order and patient consent"},
      {"id": "step2", "text": "Obtain baseline vital signs"},
      {"id": "step3", "text": "Verify blood product with second nurse at bedside"},
      {"id": "step4", "text": "Prime tubing with 0.9% Normal Saline only"},
      {"id": "step5", "text": "Start transfusion slowly (2 mL/min) and stay with patient for 15 mins"}
    ]'::jsonb,
    '["step1", "step4", "step2", "step3", "step5"]'::jsonb
  );

  -- Q7: Input/Calculation (Dopamine)
  INSERT INTO questions (
    type, text, rationale, difficulty, subject_id, chapter_id,
    correct_answer_input, answer_tolerance, input_unit
  ) VALUES (
    'input',
    'A patient weighing 80 kg is ordered Dopamine at 5 mcg/kg/min for hemodynamic support. The infusion bag contains 400 mg of Dopamine in 250 mL of D5W. Calculate the flow rate in mL/hr. (Round to the nearest whole number)',
    'Step 1: Calculate dosage per minute: 80 kg x 5 mcg/kg/min = 400 mcg/min.\nStep 2: Convert to mg: 400 mcg/min = 0.4 mg/min.\nStep 3: Calculate concentration: 400 mg / 250 mL = 1.6 mg/mL.\nStep 4: Calculate rate: 0.4 mg/min / 1.6 mg/mL = 0.25 mL/min.\nStep 5: Convert to mL/hr: 0.25 mL/min x 60 min/hr = 15 mL/hr.',
    'hard',
    v_subject_id,
    v_chapter_id,
    '15',
    1,
    'mL/hr'
  );

END $$;
