import React from 'react';
import categories from '../../categories.json';

interface CategoryListProps {
  onSelectCategory: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
  darkMode: boolean;
}

export const CategoryList: React.FC<CategoryListProps> = ({ onSelectCategory, selectedCategoryId, darkMode }) => {
  return (
    <div className="category-list">
      <button
        className={`category-button ${selectedCategoryId === null ? 'active' : ''}`}
        onClick={() => onSelectCategory(null)}
      >
        All
      </button>
      {categories.map((category) => (
        <button
          key={category.id}
          className={`category-button ${selectedCategoryId === category.id ? 'active' : ''}`}
          onClick={() => onSelectCategory(category.id)}
        >
          {category.name}
        </button>
      ))}
    </div>
  );
};
