-- Insert sample subjects and chapters
-- This will create some initial data so you can start adding questions

-- Insert subjects
INSERT INTO subjects (id, name) VALUES 
  ('550e8400-e29b-41d4-a716-446655440001', 'Mathematics'),
  ('550e8400-e29b-41d4-a716-446655440002', 'Physics'),
  ('550e8400-e29b-41d4-a716-446655440003', 'Nursing');

-- Insert chapters for Mathematics
INSERT INTO chapters (id, name, subject_id) VALUES 
  ('650e8400-e29b-41d4-a716-446655440001', 'Algebra', '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440002', 'Calculus', '550e8400-e29b-41d4-a716-446655440001'),
  ('650e8400-e29b-41d4-a716-446655440003', 'Geometry', '550e8400-e29b-41d4-a716-446655440001');

-- Insert chapters for Physics
INSERT INTO chapters (id, name, subject_id) VALUES 
  ('650e8400-e29b-41d4-a716-446655440004', 'Mechanics', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440005', 'Optics', '550e8400-e29b-41d4-a716-446655440002'),
  ('650e8400-e29b-41d4-a716-446655440006', 'Thermodynamics', '550e8400-e29b-41d4-a716-446655440002');

-- Insert chapters for Nursing
INSERT INTO chapters (id, name, subject_id) VALUES 
  ('650e8400-e29b-41d4-a716-446655440007', 'Fundamentals', '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440008', 'Pharmacology', '550e8400-e29b-41d4-a716-446655440003'),
  ('650e8400-e29b-41d4-a716-446655440009', 'Medical-Surgical', '550e8400-e29b-41d4-a716-446655440003');
