# Table Support in Explanations/Rationales

## Overview
The rationale field now works **exactly like the exhibit field** - it's a rich HTML editor that preserves all formatting including tables, bold text, lists, and more!

## How to Use

### Paste Tables from Excel/Word ⭐
1. **Copy a table** from Excel, Word, Google Sheets, or any application
2. **Paste it directly** into the "Rationale (Answer Explanation)" field
3. **The table is preserved** as HTML automatically!
   - All formatting is maintained
   - Tables display with beautiful styling
   - No conversion needed - it just works!

**Example:**
Copy this table from Excel:
```
Parameter    Normal Range    Patient Value
pH           7.35-7.45       7.28
PaCO2        35-45 mmHg      58 mmHg
HCO3         22-26 mEq/L     28 mEq/L
```

Paste it → It appears as a formatted table immediately!

### Rich Text Editing
The rationale field supports:
- ✅ **Tables** - Paste from Excel/Word
- ✅ **Bold, Italic, Underline** - Use Ctrl+B, Ctrl+I, Ctrl+U
- ✅ **Lists** - Bullet points and numbered lists
- ✅ **Links** - Add hyperlinks
- ✅ **Formatted text** - All HTML formatting is preserved

### How It Works
The rationale field uses a `contentEditable` div (same technology as the exhibit field):
- It's a rich HTML editor built into the browser
- All HTML content is preserved exactly as pasted
- Tables, formatting, and structure are maintained
- Changes are saved when you click outside the field (onBlur event)

### Technical Implementation
- **Component**: QuestionManager.tsx
- **Field Type**: contentEditable div with dangerouslySetInnerHTML
- **Behavior**: Same as exhibit field
- **Storage**: HTML content stored directly in the database
- **Display**: Rendered with dangerouslySetInnerHTML in all question components



### Method 2: Write HTML Directly
You can also write HTML table code directly in the explanation field:

```html
<table>
  <thead>
    <tr>
      <th>Parameter</th>
      <th>Normal Range</th>
      <th>Patient Value</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>pH</td>
      <td>7.35-7.45</td>
      <td>7.28</td>
    </tr>
    <tr>
      <td>PaCO2</td>
      <td>35-45 mmHg</td>
      <td>58 mmHg</td>
    </tr>
    <tr>
      <td>HCO3</td>
      <td>22-26 mEq/L</td>
      <td>28 mEq/L</td>
    </tr>
  </tbody>
</table>
```

## Table Styling
Tables are automatically styled with:
- Dark theme colors matching the application
- Bordered cells with proper padding
- Header rows with purple/blue background
- Alternating row colors for better readability
- Hover effects on rows
- Responsive design

## Technical Details
- Tables are rendered using `dangerouslySetInnerHTML` in React
- CSS styling is applied globally and in the ClinicalQuestions module
- All HTML content is sanitized by the browser's built-in security

## Components Updated
The following components now support HTML tables in rationales:
1. QuestionManager.tsx
2. SentenceCompletionQuestion.tsx
3. SataQuestion.tsx
4. PriorityActionQuestion.tsx
5. IndicatedNotIndicatedQuestion.tsx
6. ExpectedNotExpectedQuestion.tsx
7. DragDropPriorityQuestion.tsx
8. CompareClassifyQuestion.tsx
9. CaseStudyQuestion.tsx

## Example Use Cases
- Lab value comparisons
- Medication dosage charts
- Vital signs tracking
- Assessment findings
- Differential diagnosis tables
- Treatment protocols
