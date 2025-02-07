// src/components/books/BookCard.tsx
import { Book } from '../../types';
import { useCallback, useState } from 'react';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
  onAuthorClick?: (authorId: number) => void;
  darkMode: boolean;
  showAuthor?: boolean;
}

export const BookCard = ({ book, onBookClick, onAuthorClick, darkMode, showAuthor = true }: BookCardProps) => {
  const [imageLoading, setImageLoading] = useState(true);

  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.author && onAuthorClick) {
      onAuthorClick(book.author.id);
    }
  }, [book.author, onAuthorClick]);

  const price = book.variations?.[0]?.price;

  return (
    <div
      onClick={() => onBookClick(book)}
      className={`
        flex flex-col h-full rounded-xl cursor-pointer transition-all duration-200 overflow-hidden
        ${darkMode ? 'bg-gray-800/50 hover:bg-gray-700/50' : 'bg-white hover:bg-gray-50'}
        border ${darkMode ? 'border-gray-700' : 'border-gray-200'}
        hover:shadow-lg hover:-translate-y-1
        group
      `}
    >
      <div className="aspect-[3/4] w-full relative overflow-hidden bg-gray-100 dark:bg-gray-700/50">
        {book.min_picture && (
          <>
            {imageLoading && (
              <div className="absolute inset-0 animate-pulse bg-gray-200 dark:bg-gray-600/50" />
            )}
            <img
              src={book.min_picture}
              alt={book.name}
              className={`
                w-full h-full object-cover object-center transition-all duration-300
                ${imageLoading ? 'opacity-0 scale-105' : 'opacity-100 scale-100'}
                group-hover:scale-105
              `}
              loading="lazy"
              onLoad={() => setImageLoading(false)}
            />
          </>
        )}
        {!book.min_picture && (
          <div className={`w-full h-full flex items-center justify-center ${darkMode ? 'text-gray-600' : 'text-gray-400'}`}>
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
        )}
        {book.is_new === 1 && (
          <div className="absolute top-2 right-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
              ახალი
            </span>
          </div>
        )}
        {book.is_bestseller === 1 && (
          <div className="absolute top-2 left-2">
            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white shadow-md">
              ბესტსელერი
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col flex-grow p-4 space-y-2">
        <h3 className={`font-medium line-clamp-2 text-sm sm:text-base 
          ${darkMode ? 'text-gray-200 group-hover:text-white' : 'text-gray-800'}
          transition-colors duration-200
          ${imageLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-600 rounded' : ''}
        `}>
          {book.name}
        </h3>
        {showAuthor && book.author && (
          <button
            onClick={handleAuthorClick}
            className={`text-sm ${
              darkMode 
                ? 'text-gray-400 hover:text-blue-400' 
                : 'text-gray-600 hover:text-blue-600'
            } transition-colors duration-200 text-left overflow-hidden text-ellipsis hover:underline`}
          >
            {book.author.fullname}
          </button>
        )}
        {price && (
          <div className={`
            text-sm font-medium mt-auto 
            ${darkMode ? 'text-blue-400' : 'text-blue-600'}
            ${imageLoading ? 'animate-pulse bg-gray-200 dark:bg-gray-600 rounded w-16' : ''}
          `}>
            {!imageLoading && `${price} ₾`}
          </div>
        )}
      </div>
    </div>
  );
};