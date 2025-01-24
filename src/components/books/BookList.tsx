import { Book, BookWithKey } from '../../types';
import { BookCard } from './BookCard';

interface BookListProps {
  books: BookWithKey[];
  darkMode: boolean;
  onBookClick: (book: Book) => void;
  onAuthorClick: (authorId: number) => void;
  loading: boolean;
  loadingRef: (node?: Element | null) => void;
  selectedAuthor?: boolean;
}

export const BookList = ({
  books,
  darkMode,
  onBookClick,
  onAuthorClick,
  loading,
  loadingRef,
  selectedAuthor
}: BookListProps) => {
  return (
    <div className="py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard
            key={book.uniqueKey || book.id}
            book={book}
            darkMode={darkMode}
            onBookClick={onBookClick}
            onAuthorClick={onAuthorClick}
            showAuthor={!selectedAuthor}
          />
        ))}
      </div>

      <div ref={loadingRef} className="mt-8 text-center">
        {loading && (
          <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
            darkMode ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'
          }`} />
        )}
      </div>
    </div>
  );
};