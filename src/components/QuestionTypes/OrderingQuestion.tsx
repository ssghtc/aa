import React, { useState, useEffect } from 'react';
import { Question, OrderingItem } from '@/types';

interface OrderingQuestionProps {
    question: Question;
    onAnswer: (currentOrder: string[]) => void;
}

export default function OrderingQuestion({ question, onAnswer }: OrderingQuestionProps) {
    const [items, setItems] = useState<OrderingItem[]>([]);

    useEffect(() => {
        if (question.orderingItems) {
            // Initialize with the items. In a real app, you might want to shuffle them here
            // if they are stored in the correct order. For now, we assume they come in
            // whatever order they should be displayed initially.
            // Let's shuffle them for the student view if it's the first load
            const shuffled = [...question.orderingItems].sort(() => Math.random() - 0.5);
            setItems(shuffled);
        }
    }, [question.orderingItems]);

    const moveItem = (index: number, direction: 'up' | 'down') => {
        const newItems = [...items];
        if (direction === 'up' && index > 0) {
            [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
        } else if (direction === 'down' && index < newItems.length - 1) {
            [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
        }
        setItems(newItems);
        onAnswer(newItems.map(item => item.id));
    };

    return (
        <div style={{
            background: '#f8fafc',
            padding: '2rem',
            borderRadius: '12px',
            border: '2px solid #e2e8f0'
        }}>
            <p style={{ marginBottom: '1rem', color: '#64748b', fontSize: '0.9rem' }}>
                Drag or use arrows to place the options in the correct order.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {items.map((item, index) => (
                    <div key={item.id} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        background: 'white',
                        padding: '1rem',
                        borderRadius: '8px',
                        border: '1px solid #cbd5e1',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
                    }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                            <button
                                onClick={() => moveItem(index, 'up')}
                                disabled={index === 0}
                                style={{
                                    border: 'none',
                                    background: index === 0 ? '#f1f5f9' : '#e0f2fe',
                                    color: index === 0 ? '#cbd5e1' : '#0284c7',
                                    cursor: index === 0 ? 'default' : 'pointer',
                                    borderRadius: '4px',
                                    padding: '0.25rem',
                                    fontSize: '0.8rem',
                                    lineHeight: 1
                                }}
                            >
                                ▲
                            </button>
                            <button
                                onClick={() => moveItem(index, 'down')}
                                disabled={index === items.length - 1}
                                style={{
                                    border: 'none',
                                    background: index === items.length - 1 ? '#f1f5f9' : '#e0f2fe',
                                    color: index === items.length - 1 ? '#cbd5e1' : '#0284c7',
                                    cursor: index === items.length - 1 ? 'default' : 'pointer',
                                    borderRadius: '4px',
                                    padding: '0.25rem',
                                    fontSize: '0.8rem',
                                    lineHeight: 1
                                }}
                            >
                                ▼
                            </button>
                        </div>
                        <div style={{ flex: 1, fontSize: '1rem', color: '#334155' }}>
                            {item.text}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
