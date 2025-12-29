"use client";

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import DashboardStats from '@/components/DashboardStats';
import QuestionManager from '@/components/QuestionManager';
import BlogManager from '@/components/BlogManager';
import SubjectManager from '@/components/SubjectManager';
import PreviewSection from '@/components/PreviewSection';
import StudentManager from '@/components/StudentManager';
import ClinicalQuestionsManager from '@/components/ClinicalQuestionsManager';
import ComingSoon from '@/components/ComingSoon';
import { Question, Blog, Subject } from '@/types';
import { supabase } from '@/lib/supabaseClient';

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Mock Data / State
  // State
  const [questions, setQuestions] = useState<Question[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);

      // Fetch Subjects and Chapters
      const { data: subjectsData, error: subjectsError } = await supabase
        .from('subjects')
        .select('*, chapters(*)');

      if (subjectsError) throw subjectsError;

      if (subjectsData) {
        setSubjects(subjectsData);
      }

      // Fetch Questions
      const { data: questionsData, error: questionsError } = await supabase
        .from('questions')
        .select('*');

      if (questionsError) throw questionsError;

      if (questionsData) {
        const formattedQuestions: Question[] = questionsData.map(q => ({
          ...q,
          subjectId: q.subject_id,
          chapterId: q.chapter_id,
          correctOptions: q.correct_options,
          clientNeeds: q.client_needs,
          customId: q.custom_id,
          exhibitContent: q.exhibit_content,
          diagramUrl: q.diagram_url,
          diagramType: q.diagram_type,
          diagramElements: q.diagram_elements,
          clozeText: q.cloze_text,
          clozeElements: q.cloze_elements,
          matrixColumns: q.matrix_columns,
          matrixRows: q.matrix_rows,
          orderingItems: q.ordering_items,
          correctOrder: q.correct_order,
          correctAnswerInput: q.correct_answer_input,
          answerTolerance: q.answer_tolerance,
          inputUnit: q.input_unit
        }));
        setQuestions(formattedQuestions);
      }

    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardStats questions={questions} blogs={blogs} subjects={subjects} />;
      case 'questions':
        return <QuestionManager questions={questions} setQuestions={setQuestions} subjects={subjects} />;
      case 'clinical':
        return <ClinicalQuestionsManager />;
      case 'blogs':
        return <BlogManager blogs={blogs} setBlogs={setBlogs} />;
      case 'subjects':
        return <SubjectManager subjects={subjects} setSubjects={setSubjects} />;
      case 'students':
        return <StudentManager />;
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
