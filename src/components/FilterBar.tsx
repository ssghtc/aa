import React from 'react';

interface FilterBarProps {
    categories: string[];
    selectedCategory: string;
    onSelectCategory: (category: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({ categories, selectedCategory, onSelectCategory }) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            flexWrap: 'wrap',
            gap: '0.75rem',
            marginBottom: '3rem'
        }}>
            {categories.map(category => (
                <button
                    key={category}
                    onClick={() => onSelectCategory(category)}
                    style={{
                        padding: '0.5rem 1.25rem',
                        borderRadius: '2rem',
                        border: selectedCategory === category
                            ? '1px solid transparent'
                            : '1px solid var(--border-color)',
                        background: selectedCategory === category
                            ? 'var(--gradient-primary)'
                            : 'var(--bg-secondary)',
                        color: selectedCategory === category
                            ? 'white'
                            : 'var(--text-secondary)',
                        cursor: 'pointer',
                        fontSize: '0.95rem',
                        fontWeight: 500,
                        transition: 'all 0.2s ease',
                        boxShadow: selectedCategory === category
                            ? 'var(--shadow-glow)'
                            : 'none'
                    }}
                >
                    {category}
                </button>
            ))}
        </div>
    );
};

export default FilterBar;
