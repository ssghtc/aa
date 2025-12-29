# Client Needs Category Update

## Overview
Changed the "Difficulty Level" field to "Client Needs Category" with NCLEX-style categories.

## Changes Made

### 1. Type Definitions (`src/types/index.ts`)
✅ Added `ClientNeedsCategory` type with 15 NCLEX categories:

**Client Needs Categories:**
- Management of Care
- Safety and Infection Control
- Health Promotion and Maintenance
- Psychosocial Integrity
- Basic Care and Comfort
- Pharmacological and Parenteral Therapies
- Reduction of Risk Potential
- Physiological Adaptation

**Clinical Judgment Categories:**
- Clinical Judgment (Overall)
- Recognize Cues
- Analyze Cues
- Prioritize Hypotheses
- Generate Solutions
- Take Actions
- Evaluate Outcomes

✅ Updated `Question` interface:
- Removed: `difficulty?: 'easy' | 'medium' | 'hard'`
- Added: `clientNeeds?: ClientNeedsCategory`

### 2. Question Manager Component (`src/components/QuestionManager.tsx`)
✅ Updated imports to include `ClientNeedsCategory`
✅ Changed state variable from `difficulty` to `clientNeeds`
✅ Updated dropdown with all 15 NCLEX categories organized in optgroups
✅ Fixed all references throughout the component:
  - Reset function
  - Edit question function
  - Save to database (uses `client_needs` column)
  - Local state management

### 3. Database Migration (`add_client_needs_column.sql`)
✅ Created SQL migration file to add `client_needs` column
✅ Includes comments explaining the valid values
✅ Works for both `questions` and `clinical_questions` tables

### 4. Utility Functions (`src/utils/clientNeeds.ts`)
✅ Created helper functions:
  - `getClientNeedsLabel()` - Get display name
  - `getClientNeedsDescription()` - Get full description
  - `getClientNeedsColor()` - Get color for UI display
✅ Includes all NCLEX descriptions as provided

## How to Use

### In the UI:
1. Open Question Manager
2. Look for "Client Needs Category" dropdown (where "Difficulty Level" used to be)
3. Select from 15 NCLEX categories organized in two groups
4. Save the question

### In the Database:
Run the migration SQL:
```sql
-- Execute this in Supabase SQL Editor
\i add_client_needs_column.sql
```

Or manually:
```sql
ALTER TABLE questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
ALTER TABLE clinical_questions ADD COLUMN IF NOT EXISTS client_needs TEXT;
```

### In Code:
```typescript
import { getClientNeedsLabel, getClientNeedsDescription } from '@/utils/clientNeeds';

// Get display name
const label = getClientNeedsLabel(question.clientNeeds);
// Returns: "Management of Care"

// Get description
const desc = getClientNeedsDescription(question.clientNeeds);
// Returns: "Provides and directs nursing care that enhances..."

// Get color for badges
const color = getClientNeedsColor(question.clientNeeds);
// Returns: "#3b82f6"
```

## Category Descriptions

Each category has a full NCLEX description:

**Management of Care**: Provides and directs nursing care that enhances the care delivery setting to protect the client and health care personnel.

**Safety and Infection Control**: Protects clients and health care personnel from health and environmental hazards.

**Health Promotion and Maintenance**: Provides and directs nursing care of the client that incorporates knowledge of expected growth and development principles, prevention and/or early detection of health problems and strategies to achieve optimal health.

**Psychosocial Integrity**: Provides and directs nursing care that promotes and supports the emotional, mental and social well-being of the client experiencing stressful events, as well as clients with acute or chronic mental illness.

**Basic Care and Comfort**: Provides comfort to clients and assistance in the performance of activities of daily living.

**Pharmacological and Parenteral Therapies**: Provides care related to the administration of medications and parenteral therapies.

**Reduction of Risk Potential**: Reduces the likelihood that clients will develop complications or health problems related to existing conditions, treatments or procedures.

**Physiological Adaptation**: Manages and provides care for clients with acute, chronic or life-threatening physical health conditions.

**Clinical Judgment**: The observed outcome of critical thinking and decision-making. It is an iterative process that uses nursing knowledge to observe and assess presenting situations, identify a prioritized client concern, and generate the best possible evidence-based solution in order to deliver safe client care.

**Recognize Cues**: Identify relevant and important information from different sources (e.g., medical history, vital signs).

**Analyze Cues**: Organizing and linking the recognized cues to the client's clinical presentation.

**Prioritize Hypotheses**: Evaluating and ranking hypotheses according to priority (urgency, likelihood, risk, difficulty, time, etc.).

**Generate Solutions**: Identifying expected outcomes and using hypotheses to define a set of interventions for the expected outcomes.

**Take Actions**: Implementing the solution(s) that address(es) the highest priorities.

**Evaluate Outcomes**: Comparing observed outcomes against expected outcomes.

## Next Steps

1. ✅ Run the database migration in Supabase
2. ✅ Test creating/editing questions with new categories
3. ✅ Update any reporting/analytics to use client_needs instead of difficulty
4. ✅ Consider adding category badges/colors in question display

## Backward Compatibility

- Old questions with `difficulty` field will still work
- The `difficulty` column can be kept or dropped (commented out in migration)
- New questions will use `client_needs` field
