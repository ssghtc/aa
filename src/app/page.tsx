"use client";

import React, { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import QuestionManager from '@/components/QuestionManager';
import BlogManager from '@/components/BlogManager';
import SubjectManager from '@/components/SubjectManager';
import PreviewSection from '@/components/PreviewSection';
import ComingSoon from '@/components/ComingSoon';
import { Question, Blog, Subject } from '@/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock Data / State
  const [questions, setQuestions] = useState<Question[]>([
    {
      id: 'SAMPLE-FLOW-001',
      type: 'diagram',
      text: 'Complete the emergency department triage flowchart by selecting the appropriate conditions and actions.',
      options: [],
      correctOptions: [],
      subjectId: '1',
      chapterId: 'c1',
      diagramType: 'flowchart',
      diagramElements: [
        {
          id: 'step1',
          label: 'Step 1: Initial Assessment',
          options: ['Airway obstruction', 'Minor laceration', 'Chest pain', 'Headache'],
          correctAnswer: 'Airway obstruction',
          position: { x: 50, y: 20 }
        },
        {
          id: 'step2',
          label: 'Step 2: Potential Condition',
          options: ['Hypertension', 'Emergency', 'Routine checkup', 'Observation'],
          correctAnswer: 'Emergency',
          position: { x: 50, y: 140 }
        },
        {
          id: 'step3',
          label: 'Step 3: Required Action',
          options: ['Discharge', 'Wait in lobby', 'Immediate intervention', 'Schedule appointment'],
          correctAnswer: 'Immediate intervention',
          position: { x: 50, y: 260 }
        },
        {
          id: 'step4',
          label: 'Step 4: Treatment Priority',
          options: ['Low priority', 'Medium priority', 'High priority', 'No priority'],
          correctAnswer: 'High priority',
          position: { x: 50, y: 380 }
        }
      ]
    },
    {
      id: 'SAMPLE-CLOZE-001',
      type: 'cloze',
      text: 'Complete the sentences regarding the client\'s condition.',
      options: [],
      correctOptions: [],
      subjectId: '1',
      chapterId: 'c1',
      clozeText: 'The client has most likely developed {{1}}, the nurse should immediately take action to {{2}} to prevent the most serious complication of {{3}}.',
      clozeElements: [
        {
          id: '1',
          options: ['hyperglycemia', 'hypovolemic shock', 'hypertension', 'anemia'],
          correctAnswer: 'hypovolemic shock'
        },
        {
          id: '2',
          options: ['increase fluids', 'decrease the abdominal pain', 'administer insulin', 'monitor heart rate'],
          correctAnswer: 'decrease the abdominal pain'
        },
        {
          id: '3',
          options: ['esophageal erosion', 'cardiac arrest', 'kidney failure', 'seizure'],
          correctAnswer: 'esophageal erosion'
        }
      ]
    },
    {
      id: 'SAMPLE-MATRIX-001',
      type: 'matrix',
      text: 'For each possible order or prescription from the primary healthcare provider (PHCP), click to indicate if it is anticipated or not anticipated.',
      options: [],
      correctOptions: [],
      subjectId: '1',
      chapterId: 'c1',
      matrixColumns: [
        { id: 'anticipated', label: 'Anticipated' },
        { id: 'not_anticipated', label: 'Not Anticipated' }
      ],
      matrixRows: [
        { id: 'row1', text: 'Establish a vascular access device', correctColumnId: 'anticipated' },
        { id: 'row2', text: 'Administer Intravenous (IV) pantoprazole', correctColumnId: 'anticipated' },
        { id: 'row3', text: 'Prepare the client for a barium enema', correctColumnId: 'not_anticipated' },
        { id: 'row4', text: 'Obtain the client\'s hemoglobin and hematocrit (H&H)', correctColumnId: 'anticipated' },
        { id: 'row5', text: 'Administer Intravenous (IV) ketorolac', correctColumnId: 'not_anticipated' },
        { id: 'row6', text: 'Insertion of a nasogastric tube (NGT)', correctColumnId: 'not_anticipated' }
      ]
    },
    {
      id: 'SAMPLE-ORDERING-001',
      type: 'ordering',
      text: 'The nurse is teaching a 9-year-old child with asthma how to use a metered-dose inhaler (MDI). Place the instructions in the appropriate order. All options must be used.',
      options: [],
      correctOptions: [],
      subjectId: '1',
      chapterId: 'c1',
      orderingItems: [
        { id: 'step1', text: 'Remove the cap from the MDI and shake the inhaler well.' },
        { id: 'step2', text: 'Breathe out all the way.' },
        { id: 'step3', text: 'Place the inhaler in your mouth and close your lips around it.' },
        { id: 'step4', text: 'Press down on the inhaler while breathing in slowly and deeply.' },
        { id: 'step5', text: 'Hold your breath for 10 seconds.' },
        { id: 'step6', text: 'Breathe out slowly.' }
      ]
    },
    {
      id: 'SAMPLE-INPUT-001',
      type: 'input',
      text: 'The nurse is caring for a client who has a prescription for a continuous infusion of regular insulin at 0.2 units/kg/hr IV. The client weighs 51 lb (23.2 kg). How many units/hr should the nurse administer to the client? Record your answer using 1 decimal place.',
      options: [],
      correctOptions: [],
      subjectId: '1',
      chapterId: 'c1',
      correctAnswerInput: '4.6',
      answerTolerance: 0.1,
      inputUnit: 'units/hr'
    },
    {
      id: 'SAMPLE-EXHIBIT-001',
      type: 'multiple',
      text: 'A client with a history of degenerative arthritis is being discharged home following an exacerbation of chronic obstructive pulmonary disease. After reviewing the discharge medications, the nurse should educate the client about which topics? Select all that apply. Click on the exhibit button for additional information.',
      options: [
        'Dryness of the mouth and throat may occur',
        'Ringing in the ears is an expected, transient side effect',
        'The albuterol canister should not be shaken before use',
        'The health care provider should be notified if stools are black and tarry',
        'Tiotropium capsules should not be swallowed'
      ],
      correctOptions: [0, 3, 4],
      subjectId: '1',
      chapterId: 'c1',
      exhibitContent: "Discharge Medications:\n\nAlbuterol: 2 puffs every 4-6 hours as needed\nPrednisone: 40 mg PO daily\nNaproxen: 220 mg PO twice daily\nTiotropium: 1 capsule inhaled daily"
    }
  ]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([
    { id: '1', name: 'Mathematics', chapters: [{ id: 'c1', name: 'Algebra' }, { id: 'c2', name: 'Calculus' }] },
    { id: '2', name: 'Physics', chapters: [{ id: 'c3', name: 'Mechanics' }, { id: 'c4', name: 'Optics' }] }
  ]);

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats questions={questions} blogs={blogs} subjects={subjects} />;
      case 'questions':
        return <QuestionManager questions={questions} setQuestions={setQuestions} subjects={subjects} />;
      case 'blogs':
        return <BlogManager blogs={blogs} setBlogs={setBlogs} />;
      case 'subjects':
        return <SubjectManager subjects={subjects} setSubjects={setSubjects} />;
      case 'webinars':
        return <ComingSoon title="Live Webinars" description="Schedule and manage live interactive sessions with your students. Features will include screen sharing, live chat, and recording archives." icon="🎥" />;
      case 'classes':
        return <ComingSoon title="Online Classes" description="Organize your virtual classroom. Manage schedules, attendance, and course materials for your online batches." icon="🎓" />;
      case 'preview':
        return <PreviewSection questions={questions} blogs={blogs} />;
      default:
        return <DashboardStats questions={questions} blogs={blogs} subjects={subjects} />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      <main style={{
        marginLeft: '280px',
        flex: 1,
        padding: '2rem',
        overflowY: 'auto',
        height: '100vh'
      }}>
        <div className="container">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}
