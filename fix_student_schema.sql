-- Run this script to fix the database schema without errors

-- 1. Add password column if it's missing (Safe to run multiple times)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'students' AND column_name = 'password') THEN
        ALTER TABLE students ADD COLUMN password text;
    END IF;
END $$;

-- 2. Update any existing students to have a default password
UPDATE students SET password = 'password123' WHERE password IS NULL OR password = '';

-- 3. (Optional) If you are still having Policy errors, run these lines to recreate them cleanly:
-- DROP POLICY IF EXISTS "Enable read access for all users" ON students;
-- DROP POLICY IF EXISTS "Enable insert access for all users" ON students;
-- DROP POLICY IF EXISTS "Enable update access for all users" ON students;
-- DROP POLICY IF EXISTS "Enable delete access for all users" ON students;
-- 
-- CREATE POLICY "Enable read access for all users" ON students FOR SELECT USING (true);
-- CREATE POLICY "Enable insert access for all users" ON students FOR INSERT WITH CHECK (true);
-- CREATE POLICY "Enable update access for all users" ON students FOR UPDATE USING (true);
-- CREATE POLICY "Enable delete access for all users" ON students FOR DELETE USING (true);
