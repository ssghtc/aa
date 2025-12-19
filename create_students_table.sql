-- Create Students Table
create table if not exists students (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Students
alter table students enable row level security;

-- Policies for Students
create policy "Enable read access for all users" on students for select using (true);
create policy "Enable insert access for all users" on students for insert with check (true);
create policy "Enable update access for all users" on students for update using (true);
create policy "Enable delete access for all users" on students for delete using (true);
