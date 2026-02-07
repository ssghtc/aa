# Single Choice Question Form - Complete Analysis

## Current Implementation Status

### ✅ **Currently Implemented Sections**

1. **Question Text Display** (Line 615-617)
   - Shows the main question text
   - Located in `.questionText` div

2. **Options Display** (Line 618-638)
   - Shows all answer options (A, B, C, D, etc.)
   - Radio button style selection
   - Visual feedback for selected option
   - Letter labels (A, B, C, D)

3. **Explanation Panel** (Line 641-660)
   - Shows after answer is selected (in practice mode)
   - Contains:
     - Educational Objective section
     - Scenario display
     - Rationale box with HTML content

### ❌ **Missing/Incomplete Sections**

Based on the database schema and question types, the following sections are **NOT** currently displayed:

1. **Scenario/Case Context**
   - **Database Field**: `scenario` (text)
   - **Current Status**: Only shown in Educational Objective section
   - **Should Display**: Prominently at the top of the question, before the question text
   - **Purpose**: Provides clinical context for the question

2. **Exhibits**
   - **Database Field**: `exhibits` (JSONB array)
   - **Structure**: `[{id, title, content}]`
   - **Current Status**: NOT displayed at all
   - **Should Display**: As tabs or accordion above/beside the question
   - **Purpose**: Shows lab values, charts, patient records, etc.

3. **Custom Question ID**
   - **Database Field**: `custom_id` (text)
   - **Current Status**: Only shown in results table
   - **Should Display**: In the question header during exam
   - **Purpose**: Helps students reference specific questions

4. **Client Needs Category**
   - **Database Field**: `client_needs` (text)
   - **Current Status**: Only shown in results table
   - **Should Display**: As a badge/tag on the question
   - **Purpose**: Shows NCLEX category (e.g., "Pharmacological and Parenteral Therapies")

5. **Question Type Indicator**
   - **Database Field**: `type` (text)
   - **Current Status**: Not displayed
   - **Should Display**: As a badge (e.g., "Single Choice", "Multiple Choice")
   - **Purpose**: Clarifies how many answers to select

6. **Exhibit Content (Legacy)**
   - **Database Field**: `exhibit_content` (text)
   - **Current Status**: NOT displayed
   - **Should Display**: Similar to exhibits array
   - **Purpose**: Backward compatibility

## Detailed Section Breakdown

### 1. **Question Header Section** (Should Include)
```
┌─────────────────────────────────────────────────────────┐
│ Question 5 of 10          ID: NCLEX-001          [Flag] │
│ Type: Single Choice    Category: Pharmacological Therapy│
└─────────────────────────────────────────────────────────┘
```

### 2. **Scenario Section** (Currently Missing)
```
┌─────────────────────────────────────────────────────────┐
│ 📋 Clinical Scenario                                     │
│                                                          │
│ A 68-year-old male brought to ED by family who          │
│ witnessed sudden onset of right-sided weakness and       │
│ speech difficulty 90 minutes ago.                        │
└─────────────────────────────────────────────────────────┘
```

### 3. **Exhibits Section** (Currently Missing)
```
┌─────────────────────────────────────────────────────────┐
│ 📊 Exhibits                                              │
│ ┌──────────┬──────────┬──────────┬──────────┐          │
│ │ Chart    │ Vitals   │ Labs     │ Orders   │          │
│ └──────────┴──────────┴──────────┴──────────┘          │
│                                                          │
│ [Active Tab Content Displayed Here]                     │
│ BP: 178/96 mmHg                                         │
│ HR: 88 bpm (irregularly irregular)                      │
│ RR: 18/min                                              │
│ SpO2: 96%                                               │
└─────────────────────────────────────────────────────────┘
```

### 4. **Question Text** (Currently Implemented ✅)
```
┌─────────────────────────────────────────────────────────┐
│ Based on the assessment findings, which type of stroke   │
│ is most likely?                                          │
└─────────────────────────────────────────────────────────┘
```

### 5. **Answer Options** (Currently Implemented ✅)
```
┌─────────────────────────────────────────────────────────┐
│ ○ A. Hemorrhagic stroke                                 │
│ ● B. Ischemic stroke - likely cardioembolic             │
│ ○ C. Transient ischemic attack                          │
│ ○ D. Subarachnoid hemorrhage                            │
└─────────────────────────────────────────────────────────┘
```

### 6. **Explanation Panel** (Partially Implemented)
```
┌─────────────────────────────────────────────────────────┐
│ 📚 Detailed Explanation                                  │
│                                                          │
│ ✓ Educational Objective (Currently shown ✅)            │
│   Understand the core clinical concepts...               │
│                                                          │
│ ✓ Rationale (Currently shown ✅)                        │
│   The patient's atrial fibrillation, sudden onset...    │
│                                                          │
│ ✗ Correct Answer Highlight (Missing ❌)                 │
│   Should show which option is correct                    │
│                                                          │
│ ✗ Answer Feedback (Missing ❌)                          │
│   "Correct!" or "Incorrect. The correct answer is B"    │
└─────────────────────────────────────────────────────────┘
```

## Database Schema Reference

### Questions Table Fields
```sql
- id (uuid)
- type (text) - 'single', 'multiple', 'sata', etc.
- text (text) - Main question text ✅ DISPLAYED
- options (jsonb) - Array of answer options ✅ DISPLAYED
- correct_options (jsonb) - Array of correct indices ❌ NOT SHOWN DURING EXAM
- subject_id (uuid) ✅ USED FOR FILTERING
- chapter_id (uuid) ✅ USED FOR FILTERING
- exhibit_content (text) ❌ NOT DISPLAYED
- rationale (text) ✅ DISPLAYED IN EXPLANATION
- scenario (text) ⚠️ PARTIALLY DISPLAYED (only in objective)
- custom_id (text) ⚠️ ONLY IN RESULTS
- client_needs (text) ⚠️ ONLY IN RESULTS
- exhibits (jsonb) ❌ NOT DISPLAYED
```

### Exhibits Structure
```json
[
  {
    "id": "chart",
    "title": "Patient Chart",
    "content": "68-year-old male, History of HTN..."
  },
  {
    "id": "vitals",
    "title": "Vital Signs",
    "content": "BP: 178/96, HR: 88 (irregular)..."
  },
  {
    "id": "labs",
    "title": "Laboratory Results",
    "content": "INR: 1.0, PTT: 28, Platelets: 245,000..."
  }
]
```

## Recommended Implementation Changes

### Priority 1: Add Exhibits Display
**Location**: Above question text, in question panel
**Code Location**: Line 614 (before questionText div)

### Priority 2: Add Scenario Display
**Location**: Above question text, below exhibits
**Code Location**: Line 614 (before questionText div)

### Priority 3: Enhance Question Header
**Location**: In testingHeader section
**Code Location**: Line 574-582

### Priority 4: Add Client Needs Badge
**Location**: Near question header
**Code Location**: Line 574-582

### Priority 5: Add Answer Feedback
**Location**: In explanation panel
**Code Location**: Line 641-660

## Example Complete Question Display

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER                                                        │
│ Q: 5/10  ID: NCLEX-MS-001  [Single Choice]  [🏷️ Pharm]  [⚑] │
├──────────────────────────────────────────────────────────────┤
│ EXHIBITS (Tabs)                                               │
│ [Chart] [Vitals] [Labs] [Orders]                             │
│ ┌────────────────────────────────────────────────────────┐   │
│ │ BP: 178/96 mmHg | HR: 88 (irregular) | RR: 18         │   │
│ │ Temp: 37.0°C | SpO2: 96% | Glucose: 186 mg/dL         │   │
│ └────────────────────────────────────────────────────────┘   │
├──────────────────────────────────────────────────────────────┤
│ SCENARIO                                                      │
│ 📋 A 68-year-old male brought to ED by family who            │
│    witnessed sudden onset of right-sided weakness...          │
├──────────────────────────────────────────────────────────────┤
│ QUESTION                                                      │
│ Based on the assessment findings, which type of stroke        │
│ is most likely?                                               │
│                                                               │
│ OPTIONS                                                       │
│ ○ A. Hemorrhagic stroke                                      │
│ ● B. Ischemic stroke - likely cardioembolic                  │
│ ○ C. Transient ischemic attack                               │
│ ○ D. Subarachnoid hemorrhage                                 │
├──────────────────────────────────────────────────────────────┤
│ EXPLANATION (After Answer Selected)                          │
│ ✓ Correct!                                                   │
│                                                               │
│ Educational Objective:                                        │
│ Understand stroke classification based on etiology...         │
│                                                               │
│ Rationale:                                                    │
│ The patient's atrial fibrillation, sudden onset, and CT      │
│ ruling out hemorrhage strongly suggest cardioembolic...       │
└──────────────────────────────────────────────────────────────┘
```

## Summary of Missing Features

1. ❌ **Exhibits Display** - Critical for case-based questions
2. ❌ **Scenario Display** - Should be prominent, not buried
3. ❌ **Custom ID in Header** - Currently only in results
4. ❌ **Client Needs Badge** - Currently only in results
5. ❌ **Question Type Badge** - Not shown anywhere
6. ❌ **Answer Feedback** - No "Correct/Incorrect" message
7. ❌ **Correct Answer Highlight** - Should show in explanation

## Next Steps

1. Update the student exam page to include all missing sections
2. Add proper styling for exhibits (tabs or accordion)
3. Add scenario section with distinct styling
4. Enhance question header with all metadata
5. Add answer feedback in explanation panel
6. Test with sample questions containing exhibits
