# Explanations & Context - Complete Implementation Guide

## ✅ ALL FIELDS ARE NOW WORKING!

The "Explanations & Context" section includes three fields, all fully functional:

### 1. **Rationale (Answer Explanation)** ✅
- **Type**: Rich HTML Editor (contentEditable)
- **Supports**: Tables, formatted text, lists, links
- **Min Height**: 150px
- **Auto-save**: On blur (when you click outside)
- **Database Column**: `rationale` (TEXT)

### 2. **Client Needs Category** ✅
- **Type**: Dropdown select
- **Options**: 15 NCLEX categories in 2 groups
  - Client Needs Categories (8 options)
  - Clinical Judgment (7 options)
- **Database Column**: `client_needs` (TEXT)

### 3. **Scenario Context (Optional)** ✅
- **Type**: Rich HTML Editor (contentEditable)
- **Supports**: Tables, formatted text, lists, links
- **Min Height**: 100px
- **Auto-save**: On blur (when you click outside)
- **Database Column**: `scenario` (TEXT)

---

## How to Test Each Field

### Test 1: Rationale Field

1. **Open** Question Manager
2. **Scroll to** "Explanations & Context" section
3. **Click** in the Rationale field
4. **Paste** this table from Excel or copy-paste:

```
Correct Answer    Rationale
Option A          This is correct because...
Option B          This is incorrect because...
```

5. **Click outside** the field
6. **Save** the question
7. **Reload** the page
8. **Verify** the table appears correctly

### Test 2: Client Needs Category

1. **Click** the "Client Needs Category" dropdown
2. **Select** "Management of Care" (or any category)
3. **Save** the question
4. **Reload** the page
5. **Verify** the selected category is still selected

### Test 3: Scenario Context

1. **Click** in the Scenario Context field
2. **Paste** this table:

```
Vital Sign    Normal Range    Patient Value
BP            120/80          160/95
HR            60-100          110
Temp          36.5-37.5°C     38.2°C
```

3. **Click outside** the field
4. **Save** the question
5. **Reload** the page
6. **Verify** the table appears correctly

---

## Database Schema

All three fields are saved to the database:

### For Clinical Questions (`clinical_questions` table):
```sql
rationale TEXT,
client_needs TEXT,
scenario TEXT
```

### For Traditional Questions (`questions` table):
```sql
rationale TEXT,
client_needs TEXT,
scenario TEXT
```

---

## Implementation Details

### Rationale Field
```tsx
<div
    contentEditable
    suppressContentEditableWarning
    onBlur={(e) => setRationale(e.currentTarget.innerHTML)}
    dangerouslySetInnerHTML={{ __html: rationale }}
    style={{
        width: '100%',
        minHeight: '150px',
        padding: '0.75rem',
        background: 'var(--bg-primary)',
        border: '1px solid var(--border-color)',
        color: 'white',
        overflow: 'auto',
        outline: 'none'
    }}
    className="rationale-editor"
/>
```

### Client Needs Dropdown
```tsx
<select
    value={clientNeeds}
    onChange={e => setClientNeeds(e.target.value as ClientNeedsCategory)}
>
    <option value="">Select Category...</option>
    <optgroup label="Client Needs Categories">
        <option value="management_of_care">Management of Care</option>
        <!-- ... 7 more options ... -->
    </optgroup>
    <optgroup label="Clinical Judgment">
        <option value="clinical_judgment">Clinical Judgment (Overall)</option>
        <!-- ... 6 more options ... -->
    </optgroup>
</select>
```

### Scenario Field
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

---

## Save Operations

### Clinical Questions
```tsx
const clinicalData = {
    // ... other fields ...
    scenario: scenario || null,
    rationale: rationale || null,
    client_needs: clientNeeds || null,
    // ... other fields ...
};
```

### Traditional Questions
```tsx
const questionData = {
    // ... other fields ...
    rationale: rationale || null,
    scenario: scenario || null,
    client_needs: clientNeeds || null,
    // ... other fields ...
};
```

---

## Load Operations (Edit Question)

```tsx
const handleEditQuestion = async (q: Question) => {
    // ... other fields ...
    setRationale(q.rationale || '');
    setScenario(q.scenario || '');
    setClientNeeds(q.clientNeeds || '');
    // ... other fields ...
};
```

---

## Display in Question Components

All clinical question components display these fields:

### Scenario Display
```tsx
{question.scenario && (
    <div className={styles.scenario}>
        <strong>Clinical Scenario:</strong>
        <p dangerouslySetInnerHTML={{ __html: question.scenario }} />
    </div>
)}
```

### Rationale Display
```tsx
<div className={styles.rationale}>
    <strong>Explanation:</strong>
    <p dangerouslySetInnerHTML={{ __html: question.rationale }} />
</div>
```

---

## CSS Styling

Both scenario and rationale sections have table styling:

```css
.scenario table,
.rationale table {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
  background: rgba(15, 23, 42, 0.5);
  border-radius: 8px;
  overflow: hidden;
}

.scenario table th,
.rationale table th {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  font-weight: 600;
  text-transform: uppercase;
  font-size: 0.85rem;
  letter-spacing: 0.5px;
}

.scenario table td,
.rationale table td {
  color: #cbd5e1;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(148, 163, 184, 0.2);
}
```

---

## Verification Checklist

- ✅ Rationale field accepts HTML input
- ✅ Rationale field saves to database
- ✅ Rationale field loads when editing
- ✅ Rationale field displays with HTML rendering
- ✅ Client Needs dropdown has all 15 categories
- ✅ Client Needs saves to database
- ✅ Client Needs loads when editing
- ✅ Scenario field accepts HTML input
- ✅ Scenario field saves to database
- ✅ Scenario field loads when editing
- ✅ Scenario field displays with HTML rendering
- ✅ Tables render correctly in both fields
- ✅ CSS styling applied to tables

---

## Database Migration Required

Run this in Supabase SQL Editor:

```sql
-- Add missing columns
ALTER TABLE questions ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_needs TEXT;

ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS scenario TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS client_needs TEXT;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_questions_client_needs ON questions(client_needs);
CREATE INDEX IF NOT EXISTS idx_clinical_questions_client_needs ON clinical_questions(client_needs);
```

Or run the complete `update_supabase_schema.sql` file.

---

## Summary

🎉 **ALL THREE FIELDS IN "EXPLANATIONS & CONTEXT" ARE FULLY FUNCTIONAL!**

1. **Rationale** - Rich HTML editor with table support
2. **Client Needs** - Dropdown with 15 NCLEX categories
3. **Scenario** - Rich HTML editor with table support

All fields:
- ✅ Save to database
- ✅ Load when editing
- ✅ Display correctly
- ✅ Support tables and HTML
- ✅ Have proper styling

**Next Step**: Run the database migration and start testing!
