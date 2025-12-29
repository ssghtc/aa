'use client';

import React, { useState } from 'react';
import type { DragDropPriorityQuestion, DragDropAnswer, DragDropItem } from '@/types/clinical';
import styles from './ClinicalQuestions.module.css';

interface Props {
    question: DragDropPriorityQuestion;
    onAnswer?: (answer: DragDropAnswer) => void;
    showResults?: boolean;
}

export default function DragDropPriorityQuestionComponent({ question, onAnswer, showResults = false }: Props) {
    const [priorityItems, setPriorityItems] = useState<string[]>([]);
    const [monitorItems, setMonitorItems] = useState<string[]>(question.items.map(i => i.id));
    const [draggedItem, setDraggedItem] = useState<string | null>(null);

    const handleDragStart = (itemId: string) => {
        setDraggedItem(itemId);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
    };

    const handleDropToPriority = () => {
        if (!draggedItem) return;

        if (!priorityItems.includes(draggedItem)) {
            const newPriority = [...priorityItems, draggedItem];
            const newMonitor = monitorItems.filter(id => id !== draggedItem);
            setPriorityItems(newPriority);
            setMonitorItems(newMonitor);
            onAnswer?.({ priorityItems: newPriority, monitorItems: newMonitor });
        }
        setDraggedItem(null);
    };

    const handleDropToMonitor = () => {
        if (!draggedItem) return;

        if (!monitorItems.includes(draggedItem)) {
            const newMonitor = [...monitorItems, draggedItem];
            const newPriority = priorityItems.filter(id => id !== draggedItem);
            setMonitorItems(newMonitor);
            setPriorityItems(newPriority);
            onAnswer?.({ priorityItems: newPriority, monitorItems: newMonitor });
        }
        setDraggedItem(null);
    };

    const getItem = (id: string): DragDropItem | undefined => {
        return question.items.find(i => i.id === id);
    };

    const isCorrectPlacement = (itemId: string, inPriority: boolean): boolean | null => {
        if (!showResults) return null;
        const item = getItem(itemId);
        if (!item) return null;
        return item.requiresFollowup === inPriority;
    };

    const renderItem = (itemId: string, inPriority: boolean) => {
        const item = getItem(itemId);
        if (!item) return null;

        const correct = isCorrectPlacement(itemId, inPriority);

        return (
            <div
                key={itemId}
                className={`${styles.dragItem} ${correct === true ? styles.correct : ''} ${correct === false ? styles.incorrect : ''}`}
                draggable={!showResults}
                onDragStart={() => handleDragStart(itemId)}
            >
                <span className={styles.dragHandle}>⋮⋮</span>
                {item.text}
                {showResults && (
                    <span className={styles.resultIcon}>
                        {correct ? '✓' : '✗'}
                    </span>
                )}
            </div>
        );
    };

    return (
        <div className={styles.questionCard}>
            <div className={styles.questionHeader}>
                <span className={styles.badge}>Priority Findings</span>
                {question.difficulty && (
                    <span className={`${styles.difficulty} ${styles[question.difficulty]}`}>
                        {question.difficulty}
                    </span>
                )}
            </div>

            <h3 className={styles.title}>{question.title}</h3>
            <p className={styles.instruction}>{question.instruction}</p>

            {question.scenario && (
                <div className={styles.scenario}>
                    <strong>Clinical Scenario:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.scenario }} />
                </div>
            )}

            <div className={styles.dragDropContainer}>
                <div
                    className={`${styles.dropZone} ${styles.priorityZone}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDropToPriority}
                >
                    <h4>🚨 Immediate Follow-up Required</h4>
                    <div className={styles.itemsContainer}>
                        {priorityItems.map(id => renderItem(id, true))}
                        {priorityItems.length === 0 && (
                            <p className={styles.placeholder}>Drag items here</p>
                        )}
                    </div>
                </div>

                <div
                    className={`${styles.dropZone} ${styles.monitorZone}`}
                    onDragOver={handleDragOver}
                    onDrop={handleDropToMonitor}
                >
                    <h4>📋 Continue Monitoring</h4>
                    <div className={styles.itemsContainer}>
                        {monitorItems.map(id => renderItem(id, false))}
                    </div>
                </div>
            </div>

            {showResults && question.rationale && (
                <div className={styles.rationale}>
                    <strong>📚 Rationale:</strong>
                    <p dangerouslySetInnerHTML={{ __html: question.rationale }} />
                </div>
            )}
        </div>
    );
}
