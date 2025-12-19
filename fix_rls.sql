-- Enable Update and Delete for Subjects
create policy "Enable update access for all users" on subjects for update using (true);
create policy "Enable delete access for all users" on subjects for delete using (true);

-- Enable Update and Delete for Chapters
create policy "Enable update access for all users" on chapters for update using (true);
create policy "Enable delete access for all users" on chapters for delete using (true);

-- Enable Update and Delete for Questions
create policy "Enable update access for all users" on questions for update using (true);
create policy "Enable delete access for all users" on questions for delete using (true);

-- Enable Update and Delete for Clinical Questions (if tables exist)
-- Note: You might need to check if these tables have RLS enabled. If so, add policies similar to above.
-- Example: update clinical_questions, sentence_completion_questions, etc.
