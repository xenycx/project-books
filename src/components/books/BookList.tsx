import { Book } from '../../types';
import { BookCard } from './BookCard';
import { LoadingIndicator } from '../common/LoadingIndicator';
import { useEffect } from 'react';

interface BookListProps {
  books: Book[];
  darkMode: boolean;
  onBookClick: (book: Book) => void;
  onAuthorClick: (authorId: number) => void;
  loading?: boolean;
  loadingRef?: (node?: Element | null) => void;
  selectedAuthor?: boolean;
}

export const BookList: React.FC<BookListProps> = ({ 
  books, 
  darkMode, 
  onBookClick,
  onAuthorClick,
  loading,
  loadingRef,
  selectedAuthor
}) => {
  // Ensure loadingRef is always visible in viewport
  useEffect(() => {
    const options = {
      root: null,
      rootMargin: '200px', // Load more content before user reaches the bottom
      threshold: 0.1,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && loadingRef) {
          loadingRef(entry.target);
        }
      });
    }, options);

    const target = document.querySelector('#loading-trigger');
    if (target) {
      observer.observe(target);
    }

    return () => {
      if (target) {
        observer.unobserve(target);
      }
    };
  }, [loadingRef]);

  // Initial loading state
  if (books.length === 0 && loading) {
    return <LoadingIndicator darkMode={darkMode} />;
  }

  // No results state
  if (books.length === 0 && !loading) {
    return (
      <div className={`text-center py-8 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
        წიგნები ვერ მოიძებნა
      </div>
    );
  }

  return (
    <div className="space-y-6 px-4">
      {books.length > 0 && (
        <h2 className={`text-xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          {selectedAuthor ? 'ავტორის წიგნები' : 'წიგნები'}
        </h2>
      )}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-4 sm:gap-6 auto-rows-fr">
        {books.map((book) => (
          <BookCard
            key={book.id}
            book={book}
            darkMode={darkMode}
            onBookClick={onBookClick}
            onAuthorClick={onAuthorClick}
            showAuthor={!selectedAuthor}
          />
        ))}
      </div>
      
      {/* Loading trigger for infinite scroll */}
      <div 
        id="loading-trigger"
        ref={loadingRef}
        className={`
          py-8 flex justify-center items-center min-h-[100px]
          transition-opacity duration-300 ease-in-out
          ${loading ? 'opacity-100' : 'opacity-0'}
        `}
      >
        <div className={`
          animate-spin rounded-full h-10 w-10 
          border-4 border-t-transparent
          ${darkMode ? 'border-white' : 'border-blue-600'}
        `} />
      </div>
    </div>
  );
};