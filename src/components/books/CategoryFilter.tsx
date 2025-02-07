import { useState, useEffect } from 'react';
import { fetchCategories } from '../../services/api';

interface Category {
  id: number;
  name: string;
  children?: Category[];
  parent_id: number | null;
  color?: string;
  is_book?: number;
  book_count?: number;
  image?: string;
}

interface CategoryWithChildren extends Category {
  children: Category[];
}

interface CategoryGroup {
  title: string;
  categories: Category[];
}

interface CategoryFilterProps {
  onCategorySelect: (categoryId: number | null) => void;
  selectedCategoryId: number | null;
  darkMode: boolean;
  className?: string;
}

const CategoryItem = ({ 
  category, 
  toggleCategory, 
  expandedCategories,
  onCategorySelect,
  selectedCategoryId,
  darkMode
}: { 
  category: Category;
  toggleCategory: (id: number) => void;
  expandedCategories: Set<number>;
  onCategorySelect: (id: number | null) => void;
  selectedCategoryId: number | null;
  darkMode: boolean;
}) => {
  const isSelected = selectedCategoryId === category.id;
  const hasChildren = category.children && category.children.length > 0;
  
  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    onCategorySelect(category.id);
  };

  return (
    <div className={`
      mb-2 rounded-lg overflow-hidden transition-all duration-200
      ${darkMode ? 'hover:bg-gray-700/50' : 'hover:bg-gray-100'}
      ${isSelected ? (darkMode ? 'ring-2 ring-blue-500/50' : 'ring-2 ring-blue-200') : ''}
    `}>
      <div 
        className={`
          flex items-center justify-between px-4 py-3 cursor-pointer transition-all duration-200
          ${isSelected ? (
            darkMode ? 
              'bg-gradient-to-r from-blue-900/50 to-gray-800 text-white font-medium' : 
              'bg-gradient-to-r from-blue-50 to-white text-blue-600 font-medium'
          ) : ''}
          ${darkMode ? 'text-gray-200' : 'text-gray-700'}
          ${darkMode ? 'hover:bg-gray-600/50' : 'hover:bg-blue-50/50'}
          group
        `}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-selected={isSelected}
      >
        <div className="flex items-center space-x-3 flex-1 min-w-0">
          {category.image && (
            <img 
              src={category.image} 
              alt="" 
              className="w-6 h-6 object-contain rounded"
            />
          )}
          <div className="flex-1 min-w-0">
            <span className="truncate block">{category.name}</span>
            {category.book_count !== undefined && category.book_count > 0 && (
              <span className={`text-sm mt-0.5 block
                ${isSelected ? 
                  (darkMode ? 'text-blue-300' : 'text-blue-500') : 
                  (darkMode ? 'text-gray-400' : 'text-gray-500')}
              `}>
                {category.book_count} წიგნი
              </span>
            )}
          </div>
        </div>
        {hasChildren && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              toggleCategory(category.id);
            }}
            className={`p-1.5 rounded-full transition-all duration-200 
              ${expandedCategories.has(category.id) ? 'transform rotate-180' : ''}
              ${darkMode ? 
                'hover:bg-gray-700 group-hover:bg-gray-700/50' : 
                'hover:bg-gray-100 group-hover:bg-blue-100/50'}
              ml-2 flex-shrink-0
            `}
            aria-label={expandedCategories.has(category.id) ? 'Collapse category' : 'Expand category'}
          >
            <svg 
              className={`w-4 h-4 transition-colors
                ${isSelected ?
                  (darkMode ? 'text-blue-300' : 'text-blue-500') :
                  (darkMode ? 'text-gray-400 group-hover:text-gray-300' : 'text-gray-500 group-hover:text-gray-600')}
              `}
              fill="none" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth="2.5" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        )}
      </div>
      {hasChildren && (
        <div className={`
          pl-4 overflow-hidden transition-all duration-200
          ${expandedCategories.has(category.id) ? 'max-h-screen opacity-100 py-2' : 'max-h-0 opacity-0'}
          ${darkMode ? 'bg-gray-800/50' : 'bg-gray-50'}
          ${isSelected ? (darkMode ? 'bg-gray-800' : 'bg-blue-50/50') : ''}
        `}>
          {category.children!.map(subCategory => (
            <CategoryItem
              key={subCategory.id}
              category={subCategory}
              toggleCategory={toggleCategory}
              expandedCategories={expandedCategories}
              onCategorySelect={onCategorySelect}
              selectedCategoryId={selectedCategoryId}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CategoryFilter: React.FC<CategoryFilterProps> = ({
  onCategorySelect,
  selectedCategoryId,
  darkMode,
  className = ''
}) => {
  const [categoryGroups, setCategoryGroups] = useState<CategoryGroup[]>([]);
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const data = await fetchCategories();
        const buildCategoryTree = (categories: Category[], parentId: number | null = null): Category[] => {
          const categoryMap = new Map(categories.map(cat => [cat.id, { ...cat, children: [] as Category[] }]));
          const rootCategories: CategoryWithChildren[] = [];

          categories.forEach(cat => {
            if (cat.parent_id === parentId) {
              rootCategories.push(categoryMap.get(cat.id) as CategoryWithChildren);
            } else if (cat.parent_id !== null && categoryMap.has(cat.parent_id)) {
              const parent = categoryMap.get(cat.parent_id) as CategoryWithChildren;
              parent.children = parent.children || [];
              parent.children.push(categoryMap.get(cat.id) as Category);
            }
          });

          return rootCategories;
        };

        const categoryTree = buildCategoryTree(data);
        const groups: CategoryGroup[] = [
          {
            title: "წიგნები",
            categories: categoryTree.filter(cat => cat.is_book === 1)
          },
          {
            title: "სასწავლო",
            categories: categoryTree.filter(cat => 
              cat.name.includes('სასკოლო') || 
              cat.name.includes('სასწავლო'))
          },
          {
            title: "სათამაშოები და გართობა",
            categories: categoryTree.filter(cat => 
              cat.name.includes('სათამაშო') || 
              cat.name.includes('თამაშ'))
          },
          {
            title: "აქსესუარები",
            categories: categoryTree.filter(cat => 
              cat.name.includes('აქსესუარ') ||
              cat.parent_id === 402)
          }
        ];

        const filteredGroups = groups.filter(group => group.categories.length > 0);
        setCategoryGroups(filteredGroups);

        // Only set default category if none is selected and component is mounting
        if (selectedCategoryId === null) {
          const books = filteredGroups.find(g => g.title === "წიგნები");
          if (books && books.categories.length > 0) {
            onCategorySelect(books.categories[0].id);
          }
        }

        setLoading(false);
      } catch (error) {
        console.error('Error loading categories:', error);
        setLoading(false);
      }
    };

    loadCategories();
  }, [onCategorySelect, selectedCategoryId]);

  const toggleCategory = (categoryId: number) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  if (loading) {
    return (
      <div className={`${className} p-4 ${darkMode ? 'text-gray-200' : 'text-gray-700'}`}>
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="space-y-3">
              <div className="h-5 bg-gray-300 rounded w-1/2"></div>
              <div className="pl-4 space-y-2">
                <div className="h-12 bg-gray-300 rounded-lg w-full"></div>
                <div className="h-12 bg-gray-300 rounded-lg w-full opacity-75"></div>
                <div className="h-12 bg-gray-300 rounded-lg w-full opacity-50"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`p-4 space-y-8 ${className}`}>
      {categoryGroups.map(group => (
        <div key={group.title} className="space-y-3">
          <h3 className={`
            text-lg font-semibold px-4
            ${darkMode ? 'text-gray-200' : 'text-gray-800'}
          `}>
            {group.title}
          </h3>
          <div className="space-y-1">
            {group.categories.map(category => (
              <CategoryItem
                key={category.id}
                category={category}
                toggleCategory={toggleCategory}
                expandedCategories={expandedCategories}
                onCategorySelect={onCategorySelect}
                selectedCategoryId={selectedCategoryId}
                darkMode={darkMode}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export { CategoryFilter };