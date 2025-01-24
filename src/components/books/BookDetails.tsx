import { ArrowLeft } from 'lucide-react';
import { BookDetails } from '../../types';

interface BookDetailsViewProps {
  book: BookDetails;
  darkMode: boolean;
  onClose: () => void;
  onAuthorClick: (authorId: number) => void;
  loadingBookDetails: boolean;
}

export const BookDetailsView = ({ 
  book, 
  darkMode, 
  onClose, 
  onAuthorClick,
  loadingBookDetails 
}: BookDetailsViewProps) => {
  if (loadingBookDetails) {
    return (
      <div className={`fixed inset-0 z-50 flex items-center justify-center ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
          darkMode ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'
        }`} />
      </div>
    );
  }

  return (
    <div className={`w-full ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="container mx-auto px-4 py-8">
        <button
          onClick={onClose}
          className={`mb-6 px-4 py-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-800 hover:bg-gray-700' 
              : 'bg-white hover:bg-gray-100'
          } flex items-center gap-2`}
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Books
        </button>

        <div className={`${darkMode ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-xl p-6`}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <img
                src={book.min_picture}
                alt={book.name}
                className="w-full rounded-lg shadow-lg"
              />
            </div>

            <div>
              <h1 className="text-2xl font-bold mb-4">{book.name}</h1>
              
              {book.author && (
                <p 
                  className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 cursor-pointer hover:underline`}
                  onClick={() => book.author && onAuthorClick(book.author.id)}
                >
                  By {book.author.fullname}
                </p>
              )}

              <div className="flex items-center gap-4 mb-6">
                <p className="text-2xl font-bold">
                  ₾{book.variations[0]?.price.toFixed(2)}
                </p>
                {book.variations[0]?.discount > 0 && (
                  <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                    -{book.variations[0].discount}%
                  </span>
                )}
              </div>

              <div className="space-y-4 mb-6">
                {book.variations[0]?.specs?.map((spec, index) => (
                  spec.value && (
                    <div key={index} className="flex gap-2">
                      <span className={`font-semibold ${darkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                        {spec.element.label}:
                      </span>
                      <span>{spec.value}</span>
                    </div>
                  )
                ))}
              </div>

              <div className="flex gap-3 mb-6">
                {book.is_new === 1 && (
                  <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                    ახალი
                  </span>
                )}
                {book.is_bestseller === 1 && (
                  <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                    ბესთსელერი
                  </span>
                )}
              </div>

              {book.description && (
                <div 
                  className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none mt-6`}
                  dangerouslySetInnerHTML={{ __html: book.description }}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};