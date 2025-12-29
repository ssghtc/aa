-- Update Supabase schema to add missing columns
-- This adds: scenario, client_needs, custom_id, exhibits, and difficulty (for backward compatibility)

-- Add scenario column (supports HTML content)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS scenario TEXT;

COMMENT ON COLUMN questions.scenario IS 'HTML content for question scenario/context - supports tables and formatted text';

-- Add client_needs column (replaces difficulty)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS client_needs TEXT;

COMMENT ON COLUMN questions.client_needs IS 'NCLEX Client Needs Category: management_of_care, safety_infection_control, health_promotion_maintenance, psychosocial_integrity, basic_care_comfort, pharmacological_parenteral_therapies, reduction_risk_potential, physiological_adaptation, clinical_judgment, recognize_cues, analyze_cues, prioritize_hypotheses, generate_solutions, take_actions, evaluate_outcomes';

-- Add custom_id column for user-defined question IDs
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS custom_id TEXT;

COMMENT ON COLUMN questions.custom_id IS 'User-defined custom ID for the question';

-- Add exhibits column (JSONB array)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS exhibits JSONB DEFAULT '[]'::jsonb;

COMMENT ON COLUMN questions.exhibits IS 'Array of exhibit objects with id, title, and content (HTML)';

-- Add difficulty column for backward compatibility (optional)
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS difficulty TEXT;

COMMENT ON COLUMN questions.difficulty IS 'Legacy difficulty field - use client_needs instead';

-- Update RLS policies to include update and delete
DROP POLICY IF EXISTS "Enable update access for all users" ON questions;
DROP POLICY IF EXISTS "Enable delete access for all users" ON questions;

CREATE POLICY "Enable update access for all users" ON questions 
FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Enable delete access for all users" ON questions 
FOR DELETE USING (true);

-- Same updates for clinical_questions table if it exists
DO $$ 
BEGIN
    IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'clinical_questions') THEN
        ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS scenario TEXT;
        ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
        ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS custom_id TEXT;
        ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS exhibits JSONB DEFAULT '[]'::jsonb;
        ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS difficulty TEXT;
        
        -- Update RLS policies
        DROP POLICY IF EXISTS "Enable update access for all users" ON clinical_questions;
        DROP POLICY IF EXISTS "Enable delete access for all users" ON clinical_questions;
        
        CREATE POLICY "Enable update access for all users" ON clinical_questions 
        FOR UPDATE USING (true) WITH CHECK (true);
        
        CREATE POLICY "Enable delete access for all users" ON clinical_questions 
        FOR DELETE USING (true);
    END IF;
END $$;

-- Create index on custom_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_questions_custom_id ON questions(custom_id);
CREATE INDEX IF NOT EXISTS idx_questions_client_needs ON questions(client_needs);

-- Verify the changes
SELECT column_name, data_type, is_nullable
FROM information_schema.columns
WHERE table_name = 'questions'
AND column_name IN ('scenario', 'client_needs', 'custom_id', 'exhibits', 'difficulty', 'rationale')
ORDER BY column_name;
