-- Add client_needs column to questions table
-- This replaces the difficulty column with NCLEX Client Needs categories

-- For traditional questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS client_needs TEXT;

-- Add comment to explain the column
COMMENT ON COLUMN questions.client_needs IS 'NCLEX Client Needs Category: management_of_care, safety_infection_control, health_promotion_maintenance, psychosocial_integrity, basic_care_comfort, pharmacological_parenteral_therapies, reduction_risk_potential, physiological_adaptation, clinical_judgment, recognize_cues, analyze_cues, prioritize_hypotheses, generate_solutions, take_actions, evaluate_outcomes';

-- For clinical questions table (if it exists)
ALTER TABLE clinical_questions 
ADD COLUMN IF NOT EXISTS client_needs TEXT;

COMMENT ON COLUMN clinical_questions.client_needs IS 'NCLEX Client Needs Category';

-- Optional: You can drop the old difficulty column if you no longer need it
-- ALTER TABLE questions DROP COLUMN IF EXISTS difficulty;
-- ALTER TABLE clinical_questions DROP COLUMN IF EXISTS difficulty;
