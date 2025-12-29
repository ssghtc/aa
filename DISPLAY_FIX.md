# Client Needs & Scenario Display Fix

## ✅ FIXED! Both fields now show in the question list!

### Problem
After adding questions, the Client Needs Category and Scenario Context were not showing in the question list.

### Solution
Added display sections for both fields in the question list view, positioned before the rationale section.

---

## What Was Added

### 1. Client Needs Category Display ✅
- **Location**: Question list, before rationale
- **Styling**: Green background with left border
- **Format**: Uses `getClientNeedsLabel()` utility for proper formatting
- **Example**: "Management of Care", "Clinical Judgment", etc.

### 2. Scenario Context Display ✅
- **Location**: Question list, before rationale
- **Styling**: Orange background with left border
- **Format**: Renders HTML content with `dangerouslySetInnerHTML`
- **Supports**: Tables, formatted text, all HTML

---

## Display Order in Question List

Now when you view a question, you'll see:

1. **Question Text** (main question)
2. **Options** (if applicable)
3. **Client Needs Category** (if set) - Green box
4. **Scenario Context** (if set) - Orange box
5. **Rationale** (if set) - Purple box

---

## Visual Styling

### Client Needs Category
```tsx
Background: rgba(34, 197, 94, 0.1)  // Light green
Border: 4px solid #22c55e           // Green left border
Label Color: #4ade80                // Bright green
```

### Scenario Context
```tsx
Background: rgba(251, 146, 60, 0.1) // Light orange
Border: 4px solid #fb923c           // Orange left border
Label Color: #fdba74                // Bright orange
```

### Rationale
```tsx
Background: rgba(99, 102, 241, 0.1) // Light purple
Border: 4px solid #6366f1           // Purple left border
Label Color: #a5b4fc                // Bright purple
```

---

## Code Implementation

### Import Statement
```tsx
import { getClientNeedsLabel } from '@/utils/clientNeeds';
```

### Client Needs Display
```tsx
{q.clientNeeds && (
    <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(34, 197, 94, 0.1)',
        borderRadius: '6px',
        borderLeft: '4px solid #22c55e'
    }}>
        <p style={{ fontWeight: 600, color: '#4ade80', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
            Client Needs Category:
        </p>
        <div style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}>
            {getClientNeedsLabel(q.clientNeeds)}
        </div>
    </div>
)}
```

### Scenario Display
```tsx
{q.scenario && (
    <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(251, 146, 60, 0.1)',
        borderRadius: '6px',
        borderLeft: '4px solid #fb923c'
    }}>
        <p style={{ fontWeight: 600, color: '#fdba74', marginBottom: '0.25rem', fontSize: '0.9rem' }}>
            Scenario Context:
        </p>
        <div
            style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ __html: q.scenario }}
        />
    </div>
)}
```

---

## How to Test

1. **Open** http://localhost:3000
2. **Create a new question** or **edit an existing one**
3. **Set Client Needs Category**: Select "Management of Care"
4. **Add Scenario Context**: Paste a table or formatted text
5. **Save** the question
6. **Scroll down** to the question list
7. **Verify** you see:
   - ✅ Green box with "Client Needs Category: Management of Care"
   - ✅ Orange box with "Scenario Context:" and your formatted content
   - ✅ Purple box with "Rationale:" (if you added one)

---

## Example Display

```
┌─────────────────────────────────────────┐
│ Question: What is the priority action?  │
│                                         │
│ [Options A, B, C, D]                    │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Client Needs Category:              │ │ (Green)
│ │ Management of Care                  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Scenario Context:                   │ │ (Orange)
│ │ [Table with vital signs]            │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─────────────────────────────────────┐ │
│ │ Rationale:                          │ │ (Purple)
│ │ The correct answer is...            │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

---

## Files Modified

1. `src/components/QuestionManager.tsx`
   - Added import for `getClientNeedsLabel`
   - Added Client Needs display section
   - Added Scenario display section

---

## Features

### Client Needs Display:
- ✅ Shows only if category is set
- ✅ Uses utility function for proper formatting
- ✅ Green color scheme for easy identification
- ✅ Positioned before scenario and rationale

### Scenario Display:
- ✅ Shows only if scenario is set
- ✅ Renders HTML content (tables, formatting)
- ✅ Orange color scheme for easy identification
- ✅ Positioned before rationale

### Both Fields:
- ✅ Conditional rendering (only show if data exists)
- ✅ Consistent styling with rationale
- ✅ Responsive design
- ✅ Clear visual hierarchy

---

## Summary

🎉 **BOTH FIELDS NOW DISPLAY IN THE QUESTION LIST!**

When you add a question with:
- Client Needs Category → Shows in **green box**
- Scenario Context → Shows in **orange box**
- Rationale → Shows in **purple box**

All three fields are now visible in the question list with beautiful, color-coded styling!

**Test it now**: Create a question with all three fields and see them all display! 🚀
