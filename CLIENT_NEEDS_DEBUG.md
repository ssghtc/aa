# Client Needs Debugging Guide

## Why Client Needs Is Not Saving

### Root Cause
The `client_needs` column does not exist in your Supabase database tables yet!

### What's Happening
1. You select a Client Needs Category in the UI ✅
2. The app tries to save it to Supabase ❌
3. Supabase rejects it because the column doesn't exist ❌
4. The save fails silently (no error shown to user) ❌
5. When you reload, the field is empty ❌

---

## The Fix (3 Steps)

### Step 1: Run SQL Migration in Supabase

**Go to Supabase Dashboard → SQL Editor → Paste this:**

```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS scenario TEXT;
```

**Click "Run"**

### Step 2: Verify Columns Exist

**Run this query:**

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'questions' 
AND column_name IN ('client_needs', 'scenario');
```

**You should see:**
```
client_needs | text
scenario     | text
```

### Step 3: Test in Your App

1. Refresh your app at http://localhost:3000
2. Create a new question
3. Select "Management of Care" in Client Needs
4. Save
5. Reload page
6. **Verify** it's still selected!

---

## How to Check If Migration Is Needed

### Option 1: Check Supabase Table Editor
1. Go to Supabase Dashboard
2. Click "Table Editor"
3. Select "questions" table
4. Look at column headers
5. If you DON'T see "client_needs" → **Migration needed!**

### Option 2: Run This Query
```sql
SELECT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'questions' 
    AND column_name = 'client_needs'
);
```

**Result:**
- `true` → Column exists, no migration needed
- `false` → **Migration needed!**

---

## What Each File Does

### Code Files (Already Working)
- ✅ `QuestionManager.tsx` - UI and save logic
- ✅ `types/index.ts` - TypeScript types
- ✅ `utils/clientNeeds.ts` - Display utilities

### SQL Files (Need to Run in Supabase)
- 🔴 `URGENT_RUN_THIS_IN_SUPABASE.sql` - **RUN THIS NOW!**
- 🔴 `update_supabase_schema.sql` - Complete migration
- 🔴 `add_client_needs_column.sql` - Client needs only

---

## Common Mistakes

### ❌ Mistake 1: Not Running Migration
**Problem**: Created SQL files but didn't run them in Supabase
**Solution**: Open Supabase SQL Editor and run the SQL

### ❌ Mistake 2: Running in Wrong Project
**Problem**: Ran migration in wrong Supabase project
**Solution**: Verify you're in the correct project (check project name)

### ❌ Mistake 3: Not Refreshing App
**Problem**: Ran migration but didn't refresh the app
**Solution**: Hard refresh (Ctrl+Shift+R) or restart dev server

---

## Verification Checklist

After running migration, verify:

- [ ] SQL ran without errors in Supabase
- [ ] Verification query shows columns exist
- [ ] App refreshed (Ctrl+Shift+R)
- [ ] Created new question with Client Needs selected
- [ ] Saved successfully (no console errors)
- [ ] Reloaded page
- [ ] Client Needs still shows in dropdown
- [ ] Client Needs displays in question list (green box)

---

## Console Error Messages

### If you see this error:
```
column "client_needs" of relation "questions" does not exist
```
**Meaning**: Migration not run yet
**Fix**: Run the SQL migration in Supabase

### If you see this error:
```
null value in column "client_needs" violates not-null constraint
```
**Meaning**: Column exists but has NOT NULL constraint
**Fix**: Run this to remove constraint:
```sql
ALTER TABLE questions ALTER COLUMN client_needs DROP NOT NULL;
```

### If you see no errors but data doesn't save:
**Meaning**: RLS (Row Level Security) policy issue
**Fix**: Check RLS policies allow INSERT/UPDATE

---

## Quick Test Script

Run this in browser console (F12) after saving a question:

```javascript
// Check if client_needs was saved
const checkClientNeeds = async () => {
    const { data, error } = await supabase
        .from('questions')
        .select('id, client_needs')
        .order('created_at', { ascending: false })
        .limit(1);
    
    console.log('Latest question:', data);
    console.log('Client Needs:', data?.[0]?.client_needs);
    
    if (!data?.[0]?.client_needs) {
        console.error('❌ Client Needs not saved!');
    } else {
        console.log('✅ Client Needs saved successfully!');
    }
};

checkClientNeeds();
```

---

## Summary

### The Problem
Database columns don't exist → Can't save data

### The Solution
Run SQL migration in Supabase → Creates columns → Data saves

### The Steps
1. Open Supabase SQL Editor
2. Paste SQL from `URGENT_RUN_THIS_IN_SUPABASE.sql`
3. Click Run
4. Refresh your app
5. Test it!

**DO THIS NOW!** Your app code is perfect, it just needs the database columns! 🚀
