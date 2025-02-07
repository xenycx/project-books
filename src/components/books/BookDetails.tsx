import { BookDetails } from '../../types';

interface BookDetailsViewProps {
  book: BookDetails;
  darkMode: boolean;
  onAuthorClick: (authorId: number) => void;
  loadingBookDetails: boolean;
}

export const BookDetailsView = ({ 
  book, 
  darkMode, 
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
              <h1 className={`text-2xl font-bold mb-4 ${darkMode ? 'text-gray-100' : 'text-gray-900'}`}>
                {book.name}
              </h1>
              
              {book.author && (
                <p 
                  className={`text-lg mb-4 cursor-pointer hover:underline
                    ${darkMode ? 'text-gray-300 hover:text-blue-400' : 'text-gray-600 hover:text-blue-600'}`}
                  onClick={() => book.author && onAuthorClick(book.author.id)}
                >
                  By {book.author.fullname}
                </p>
              )}
              <div className="flex items-center gap-4 mb-6">
                <p className={`text-2xl font-bold ${darkMode ? 'text-blue-400' : 'text-blue-600'}`}>
                  ₾{book.variations[0]?.price.toFixed(2)}
                </p>
                {book.variations[0]?.discount > 0 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${darkMode ? 'bg-red-900/50 text-red-300' : 'bg-red-100 text-red-800'}`}>
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
                      <span className={darkMode ? 'text-gray-300' : 'text-gray-700'}>
                        {spec.value}
                      </span>
                    </div>
                  )
                ))}
              </div>
              <div className="flex gap-3 mb-6">
                {book.is_new === 1 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${darkMode ? 'bg-green-900/50 text-green-300' : 'bg-green-500 text-white'}`}>
                    ახალი
                  </span>
                )}
                {book.is_bestseller === 1 && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium
                    ${darkMode ? 'bg-yellow-900/50 text-yellow-300' : 'bg-yellow-500 text-white'}`}>
                    ბესთსელერი
                  </span>
                )}
              </div>
              {book.description && (
                <div 
                  className={`prose max-w-none mt-6 ${darkMode ? 'prose-invert prose-p:text-gray-300 prose-headings:text-gray-100' : ''}`}
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