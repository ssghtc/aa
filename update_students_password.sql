-- Add password column to students table
alter table students add column if not exists password text;

-- Optional: Set default password for existing students (if any)
update students set password = 'password123' where password is null;

-- Make password required effectively for new rows (though we can't easily add NOT NULL to existing without default, strictly speaking we just added it as nullable then can alter)
-- For this app, we will enforce it in the UI/Logic.
