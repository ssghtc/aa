-- Add rationale column to questions table if it doesn't exist
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'rationale') THEN 
        ALTER TABLE questions ADD COLUMN rationale text; 
    END IF; 
END $$;
