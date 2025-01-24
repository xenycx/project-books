// src/components/books/BookCard.tsx
import { Book } from '../../types';
import { useCallback } from 'react';

interface BookCardProps {
  book: Book;
  onBookClick: (book: Book) => void;
  onAuthorClick?: (authorId: number) => void;
  darkMode: boolean;
  showAuthor?: boolean;
}

export const BookCard = ({ book, onBookClick, onAuthorClick, darkMode, showAuthor = true }: BookCardProps) => {
  const handleAuthorClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (book.author && onAuthorClick) {
      onAuthorClick(book.author.id);
    }
  }, [book.author, onAuthorClick]);

  return (
    <div
      onClick={() => onBookClick(book)}
      className={`${
        darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
      } rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer`}
    >
      <div className="relative aspect-[3/4] overflow-hidden">
  <img
    src={book.min_picture}
    alt={book.name}
    className="w-full h-full object-cover"
    loading="lazy"
  />
  {book.is_new === 1 && (
    <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
      ახალი
    </span>
  )}
  {book.is_bestseller === 1 && (
    <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
      ბესთსელერი
    </span>
  )}
  {book.variations?.[0]?.stock_count && (
    <span className="absolute bottom-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
      მარაგში: {book.variations[0].stock_count}
    </span>
  )}
</div>
      <div className="p-4">
        <h2 className="font-semibold text-lg mb-2 line-clamp-2">{book.name}</h2>
        {showAuthor && book.author && (
          <p 
            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 cursor-pointer hover:underline`}
            onClick={handleAuthorClick}
          >
            {book.author.fullname}
          </p>
        )}
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">
            ₾{book.variations[0]?.price.toFixed(2)}
          </p>
          {book.variations[0]?.discount > 0 && (
            <span className="bg-red-100 text-red-800 text-xs font-semibold px-2 py-1 rounded">
              -{book.variations[0].discount}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
};