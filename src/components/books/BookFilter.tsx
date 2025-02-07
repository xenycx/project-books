import React from 'react';
import { CATEGORY_IDS } from '../../types';

interface BookFilterProps {
  selectedCategoryId: number | null;
  onCategoryChange: (categoryId: number | null) => void;
}

const BookFilter: React.FC<BookFilterProps> = ({ selectedCategoryId, onCategoryChange }) => {
  return (
    <div className="book-filter">
      <button
        key="all"
        className={`filter-button ${!selectedCategoryId ? 'active' : ''}`}
        onClick={() => onCategoryChange(null)}
      >
        ყველა
      </button>
      {Object.entries(CATEGORY_IDS).map(([name, id]) => (
        <button
          key={id}
          className={`filter-button ${selectedCategoryId === id ? 'active' : ''}`}
          onClick={() => onCategoryChange(id)}
        >
          {name}
        </button>
      ))}
    </div>
  );
};

export default BookFilter;
