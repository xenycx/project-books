import { X } from 'lucide-react';
import { Book } from '../../types';
import { Author } from '../../types';
import { BookCard } from '../books/BookCard';

interface AuthorDetailsProps {
  author: Author;
  books: Book[];
  darkMode: boolean;
  onClose: () => void;
  onBookClick: (book: Book) => void;
}

export const AuthorDetails = ({ author, books, darkMode, onClose, onBookClick }: AuthorDetailsProps) => {
  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onClose}
          className={`absolute top-4 right-4 p-2 rounded-full ${
            darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-100'
          }`}
        >
          <X className="w-6 h-6" />
        </button>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              {author.img && (
                <img
                  src={author.img}
                  alt={author.fullname}
                  className="w-full rounded-lg shadow-lg"
                />
              )}
              {author.country && (
                <p className={`text-lg mt-4 ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  <span className="font-semibold">ქვეყანა:</span> {author.country}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <h1 className="text-3xl font-bold mb-6">{author.fullname}</h1>
              {author.description && (
                <div 
                  className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none`}
                  dangerouslySetInnerHTML={{ __html: author.description }} 
                />
              )}
            </div>
          </div>

          {books.length > 0 && (
            <div className="mt-12">
              <h2 className="text-2xl font-bold mb-6">{author.fullname}ს წიგნები</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    darkMode={darkMode}
                    onBookClick={onBookClick}
                    showAuthor={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};