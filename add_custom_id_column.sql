ALTER TABLE questions 
ADD COLUMN IF NOT EXISTS custom_id TEXT;

ALTER TABLE clinical_questions 
ADD COLUMN IF NOT EXISTS custom_id TEXT;
