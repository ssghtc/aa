# Scenario Context Field Update

## Overview
Updated the "Scenario Context" field to work like the Rationale and Exhibit fields - with rich HTML editing support including tables.

## Changes Made

### 1. Question Manager Component (`src/components/QuestionManager.tsx`)
✅ **Changed from**: Simple `<input>` field
✅ **Changed to**: `contentEditable` div with `dangerouslySetInnerHTML`

**Features:**
- Rich HTML editing
- Paste tables directly from Excel/Word
- Auto-saves on blur (when you click outside)
- Minimum height: 100px
- Styled consistently with rationale field

### 2. Clinical Question Components
Updated scenario rendering in all clinical question components to support HTML:

✅ `SentenceCompletionQuestion.tsx`
✅ `SataQuestion.tsx`
✅ `ExpectedNotExpectedQuestion.tsx`
✅ `DragDropPriorityQuestion.tsx`
✅ `CompareClassifyQuestion.tsx`

**Changed from**: `<p>{question.scenario}</p>`
**Changed to**: `<p dangerouslySetInnerHTML={{ __html: question.scenario }} />`

### 3. CSS Styling (`ClinicalQuestions.module.css`)
✅ Added comprehensive table styling to `.scenario` section:
- Table borders and padding
- Header row styling (purple/blue background)
- Alternating row colors
- Hover effects
- Responsive design

### 4. Database Schema (`update_supabase_schema.sql`)
✅ Created comprehensive SQL migration file that adds:
- `scenario` column (TEXT) - supports HTML content
- `client_needs` column (TEXT) - NCLEX categories
- `custom_id` column (TEXT) - user-defined IDs
- `exhibits` column (JSONB) - array of exhibits
- `difficulty` column (TEXT) - backward compatibility

✅ Includes:
- Column comments with documentation
- Indexes for performance
- RLS policies for update/delete
- Verification query

## How It Works

### In the UI:
1. **Open** Question Manager
2. **Find** "Scenario Context (Optional)" field
3. **Paste** tables or formatted content directly
4. **Click outside** the field to save
5. **Done!** Content is saved as HTML

### Example Usage:

**Copy this table from Excel:**
```
Vital Sign    Normal Range    Patient Value
BP            120/80          160/95
HR            60-100          110
Temp          36.5-37.5°C     38.2°C
```

**Paste into Scenario field** → It appears as a formatted table immediately!

### In the Database:

The scenario field stores HTML content:
```sql
scenario: '<table><thead><tr><th>Vital Sign</th>...</tr></thead>...</table>'
```

## Database Migration

### Run this in Supabase SQL Editor:

```sql
-- Add scenario column
ALTER TABLE questions ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS scenario TEXT;

-- Add other missing columns
ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS custom_id TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS exhibits JSONB DEFAULT '[]'::jsonb;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_custom_id ON questions(custom_id);
CREATE INDEX IF NOT EXISTS idx_questions_client_needs ON questions(client_needs);
```

Or simply run the entire `update_supabase_schema.sql` file.

## Features

### Scenario Field Now Supports:
- ✅ **Tables** - Paste from Excel/Word
- ✅ **Bold, Italic, Underline** - Use Ctrl+B, Ctrl+I, Ctrl+U
- ✅ **Lists** - Bullet points and numbered lists
- ✅ **Links** - Add hyperlinks
- ✅ **Formatted text** - All HTML formatting is preserved
- ✅ **Multi-line content** - No character limits

### Display Features:
- ✅ Tables render with beautiful styling
- ✅ Purple/blue header rows
- ✅ Alternating row colors
- ✅ Hover effects
- ✅ Responsive design
- ✅ Consistent with rationale field styling

## Technical Details

### Field Implementation:
```tsx
<div
    contentEditable
    suppressContentEditableWarning
    onBlur={(e) => setScenario(e.currentTarget.innerHTML)}
    dangerouslySetInnerHTML={{ __html: scenario }}
    style={{
        width: '100%',
        minHeight: '100px',
        padding: '0.75rem',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        color: 'white',
        overflow: 'auto',
        outline: 'none'
    }}
    className="scenario-editor"
/>
```

### Display Implementation:
```tsx
{question.scenario && (
    <div className={styles.scenario}>
        <strong>Clinical Scenario:</strong>
        <p dangerouslySetInnerHTML={{ __html: question.scenario }} />
    </div>
)}
```

## Files Modified

1. `src/components/QuestionManager.tsx` - Scenario input field
2. `src/components/ClinicalQuestions/SentenceCompletionQuestion.tsx`
3. `src/components/ClinicalQuestions/SataQuestion.tsx`
4. `src/components/ClinicalQuestions/ExpectedNotExpectedQuestion.tsx`
5. `src/components/ClinicalQuestions/DragDropPriorityQuestion.tsx`
6. `src/components/ClinicalQuestions/CompareClassifyQuestion.tsx`
7. `src/components/ClinicalQuestions/ClinicalQuestions.module.css`

## Files Created

1. `update_supabase_schema.sql` - Comprehensive database migration

## Next Steps

1. ✅ **Run the database migration** in Supabase SQL Editor
2. ✅ **Test the scenario field** - paste a table and see it work!
3. ✅ **Create questions** with rich scenario content
4. ✅ **View questions** and see formatted scenarios

## Summary

Both **Rationale** and **Scenario** fields now work exactly like the **Exhibit** field:
- Rich HTML editing
- Table support
- Formatted content
- Auto-save on blur
- Beautiful styling

All three fields use the same `contentEditable` technology for a consistent user experience! 🎉
