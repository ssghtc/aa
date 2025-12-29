-- ⚠️ URGENT: RUN THIS IN SUPABASE SQL EDITOR NOW! ⚠️
-- This adds the missing client_needs and scenario columns

-- Add client_needs column to questions table
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS client_needs TEXT;

-- Add scenario column to questions table  
ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS scenario TEXT;

-- Add client_needs column to clinical_questions table
ALTER TABLE clinical_questions 
ADD COLUMN IF NOT EXISTS client_needs TEXT;

-- Add scenario column to clinical_questions table
ALTER TABLE clinical_questions 
ADD COLUMN IF NOT EXISTS scenario TEXT;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_questions_client_needs ON questions(client_needs);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_client_needs ON clinical_questions(client_needs);

-- Verify the columns were added
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('questions', 'clinical_questions')
AND column_name IN ('client_needs', 'scenario')
ORDER BY table_name, column_name;
