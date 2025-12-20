-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Subjects Table
create table if not exists subjects (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Chapters Table
create table if not exists chapters (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  subject_id uuid references subjects(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Questions Table
create table if not exists questions (
  id uuid default uuid_generate_v4() primary key,
  type text not null check (type in ('single', 'multiple', 'diagram', 'cloze', 'matrix', 'ordering', 'input')),
  text text not null,
  options jsonb default '[]'::jsonb,
  correct_options jsonb default '[]'::jsonb,
  subject_id uuid references subjects(id) on delete cascade not null,
  chapter_id uuid references chapters(id) on delete cascade not null,
  
  -- Optional Exhibit Content
  exhibit_content text,

  -- Diagram specific
  diagram_url text,
  diagram_type text check (diagram_type in ('flowchart', 'labeled-diagram', 'process-flow')),
  diagram_elements jsonb,

  -- Cloze specific
  cloze_text text,
  cloze_elements jsonb,

  -- Matrix specific
  matrix_columns jsonb,
  matrix_rows jsonb,

  -- Ordering specific
  ordering_items jsonb,
  correct_order jsonb,

  -- Input specific
  correct_answer_input text,
  answer_tolerance numeric,
  input_unit text,
  rationale text,

  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS (Row Level Security)
alter table subjects enable row level security;
alter table chapters enable row level security;
alter table questions enable row level security;

-- Create policies (Allow public access for now as per "make it work" request)
-- Note: In a production app, you should restrict these policies.

create policy "Enable read access for all users" on subjects for select using (true);
create policy "Enable insert access for all users" on subjects for insert with check (true);

create policy "Enable read access for all users" on chapters for select using (true);
create policy "Enable insert access for all users" on chapters for insert with check (true);

create policy "Enable read access for all users" on questions for select using (true);
create policy "Enable insert access for all users" on questions for insert with check (true);
