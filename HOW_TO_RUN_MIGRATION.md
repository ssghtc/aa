# 🚨 URGENT: Client Needs Not Saving - Database Migration Required!

## Problem
The `client_needs` column doesn't exist in your Supabase database yet, so it can't save!

## Solution
You MUST run the SQL migration in Supabase to add the missing columns.

---

## 📋 STEP-BY-STEP INSTRUCTIONS

### Step 1: Open Supabase Dashboard
1. Go to https://supabase.com
2. Login to your account
3. Select your project

### Step 2: Open SQL Editor
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New query"** button

### Step 3: Copy and Paste This SQL

```sql
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
```

### Step 4: Run the Query
1. Click the **"Run"** button (or press Ctrl+Enter)
2. Wait for "Success" message
3. You should see: "Success. No rows returned"

### Step 5: Verify It Worked
Run this verification query:

```sql
SELECT 
    table_name,
    column_name,
    data_type
FROM information_schema.columns
WHERE table_name IN ('questions', 'clinical_questions')
AND column_name IN ('client_needs', 'scenario')
ORDER BY table_name, column_name;
```

You should see 4 rows:
- `clinical_questions` | `client_needs` | `text`
- `clinical_questions` | `scenario` | `text`
- `questions` | `client_needs` | `text`
- `questions` | `scenario` | `text`

---

## ✅ After Running Migration

### Test It:
1. Go back to your app at http://localhost:3000
2. Create a new question
3. Select a Client Needs Category
4. Add Scenario Context
5. Save the question
6. Refresh the page
7. **Verify** the Client Needs and Scenario are now showing!

---

## 🎯 Quick Copy-Paste Version

**Just copy this entire block and paste into Supabase SQL Editor:**

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS scenario TEXT;
CREATE INDEX IF NOT EXISTS idx_questions_client_needs ON questions(client_needs);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_client_needs ON clinical_questions(client_needs);
```

---

## 📸 Visual Guide

### Where to Find SQL Editor in Supabase:

```
Supabase Dashboard
├── Project Dashboard
├── Table Editor
├── Authentication
├── Storage
├── Edge Functions
├── 📝 SQL Editor  ← CLICK HERE!
├── Database
└── Settings
```

### What You'll See:

```
┌─────────────────────────────────────────┐
│ SQL Editor                              │
│                                         │
│ [New query]  [Snippets]  [History]     │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ 1  ALTER TABLE questions            │ │
│ │ 2  ADD COLUMN IF NOT EXISTS...      │ │
│ │ 3                                   │ │
│ │                                     │ │
│ └─────────────────────────────────────┘ │
│                                         │
│              [Run] [Format]             │
└─────────────────────────────────────────┘
```

---

## ⚠️ Important Notes

1. **This is safe**: The `IF NOT EXISTS` clause means it won't break anything if columns already exist
2. **No data loss**: This only adds columns, doesn't delete anything
3. **Instant**: Takes less than 1 second to run
4. **Required**: Your app won't work properly without this!

---

## 🔍 Troubleshooting

### If you get "permission denied":
- Make sure you're logged in as the project owner
- Check you selected the correct project

### If you get "table does not exist":
- Run the main schema creation first (`supabase_schema.sql`)
- Make sure you're in the right project

### If columns already exist:
- That's fine! The `IF NOT EXISTS` will skip them
- No error will occur

---

## 📝 Files Reference

The SQL is also available in these files:
1. `URGENT_RUN_THIS_IN_SUPABASE.sql` - Quick version
2. `update_supabase_schema.sql` - Complete version with all columns
3. `add_client_needs_column.sql` - Client needs only

---

## Summary

🚨 **YOU MUST RUN THE SQL MIGRATION IN SUPABASE!**

Without it:
- ❌ Client Needs won't save
- ❌ Scenario won't save
- ❌ Fields won't display in question list

After running it:
- ✅ Client Needs saves and displays
- ✅ Scenario saves and displays
- ✅ Everything works perfectly!

**Go to Supabase SQL Editor NOW and run the migration!** 🚀
