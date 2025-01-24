import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import { Moon, Sun, BookOpen, Search, ArrowLeft } from 'lucide-react';
import { Book, ApiResponse, Author, BookWithKey, BookDetails } from './types';

function App() {
  
  const [books, setBooks] = useState<BookWithKey[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [darkMode, setDarkMode] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    books: Book[];
    authors: Author[];
  }>({ books: [], authors: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const { ref, inView } = useInView();
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [loadingBookDetails, setLoadingBookDetails] = useState(false);

  const handleSearch = useCallback(async () => {
    if (!searchQuery) return;

    setIsSearching(true);
    try {
      const [booksResponse, authorsResponse] = await Promise.all([
        axios.get<ApiResponse>(`https://apiv1.biblusi.ge/api/book`, {
          params: { q: searchQuery },
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.6',
          }
        }),
        axios.get<{ data: Author[] }>(`https://apiv1.biblusi.ge/api/author`, {
          params: { q: searchQuery },
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.6',
          }
        })
      ]);

      setSearchResults({
        books: booksResponse.data.data,
        authors: authorsResponse.data.data
      });
    } catch (error) {
      console.error('Error searching:', error);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  const handleBookClick = useCallback(async (book: Book) => {
    setLoadingBookDetails(true);
    try {
      const response = await axios.get<BookDetails>(
        `https://apiv1.biblusi.ge/api/book/${book.id}`,
        {
          params: {
            author: 1,
            category: 1,
            rate: 1
          },
          headers: {
            'Accept': 'application/json',
            'Accept-Language': 'en-US,en;q=0.6',
          }
        }
      );
      setSelectedBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoadingBookDetails(false);
    }
  }, []);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get<ApiResponse>(`https://apiv1.biblusi.ge/api/book`, {
        params: {
          page,
          per_page: 12,
          order: 'created_at',
          sort: 'desc'
        },
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.6',
        }
      });

      const booksWithUniqueKeys = response.data.data.map(book => ({
        ...book,
        uniqueKey: `${book.id}-${page}`
      }));

      setBooks(prev => [...prev, ...booksWithUniqueKeys]);
      setPage(prev => prev + 1);
      setHasMore(page < response.data.last_page);
    } catch (error) {
      console.error('Error fetching books:', error);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    if (inView && hasMore && !loading && !searchQuery && !selectedAuthor) {
      fetchBooks();
    }
  }, [inView, hasMore, loading, searchQuery, selectedAuthor, fetchBooks]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchQuery) {
        handleSearch();
      } else {
        setSearchResults({ books: [], authors: [] });
        setIsSearching(false);
        setSelectedAuthor(null);
        setAuthorBooks([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, handleSearch]);

  const handleAuthorClick = async (author: Author) => {
    setSelectedAuthor(author);
    setLoading(true);
    try {
      const response = await axios.get<Author>(`https://apiv1.biblusi.ge/api/author/${author.id}`, {
        headers: {
          'Accept': 'application/json',
          'Accept-Language': 'en-US,en;q=0.6',
        }
      });
      
      if (response.data.books) {
        setAuthorBooks(response.data.books);
      }
    } catch (error) {
      console.error('Error fetching author books:', error);
    } finally {
      setLoading(false);
    }
  };

  const BookDetailsView = () => {
    if (!selectedBook) return null;

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
      <div className={`fixed inset-0 z-50 overflow-y-auto ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 py-8">
          <button
            onClick={() => setSelectedBook(null)}
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
              {/* Left column - Image */}
              <div>
                <img
                  src={selectedBook.min_picture}
                  alt={selectedBook.name}
                  className="w-full rounded-lg shadow-lg"
                />
              </div>

              {/* Right column - Book details */}
              <div>
                <h1 className="text-2xl font-bold mb-4">{selectedBook.name}</h1>
                
                {selectedBook.author && (
                  <p 
                    className={`text-lg ${darkMode ? 'text-gray-300' : 'text-gray-600'} mb-4 cursor-pointer hover:underline`}
                    onClick={() => {
                      setSelectedBook(null);
                      handleAuthorClick(selectedBook.author!);
                    }}
                  >
                    By {selectedBook.author.fullname}
                  </p>
                )}

                <div className="flex items-center gap-4 mb-6">
                  <p className="text-2xl font-bold">
                    ₾{selectedBook.variations[0]?.price.toFixed(2)}
                  </p>
                  {selectedBook.variations[0]?.discount > 0 && (
                    <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-semibold">
                      -{selectedBook.variations[0].discount}%
                    </span>
                  )}
                </div>

                {/* Book specifications */}
                <div className="space-y-4 mb-6">
                  {selectedBook.variations[0]?.specs?.map((spec, index) => (
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

                {/* Status badges */}
                <div className="flex gap-3 mb-6">
                  {selectedBook.is_new === 1 && (
                    <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm">
                      New
                    </span>
                  )}
                  {selectedBook.is_bestseller === 1 && (
                    <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                      Bestseller
                    </span>
                  )}
                </div>

                {/* Description */}
                {selectedBook.description && (
                  <div 
                    className={`prose ${darkMode ? 'prose-invert' : ''} max-w-none mt-6`}
                    dangerouslySetInnerHTML={{ __html: selectedBook.description }}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const displayedBooks = selectedAuthor 
    ? authorBooks.map(book => ({ ...book, uniqueKey: `author-${book.id}` }))
    : (searchQuery 
        ? searchResults.books.map(book => ({ ...book, uniqueKey: `search-${book.id}` }))
        : books);

  return (
    <div className={`min-h-screen transition-colors duration-200 ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {selectedBook && <BookDetailsView />}
      {/* Header */}
      <header className={`fixed top-0 w-full z-50 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md`}>
  <div className="container mx-auto px-4 py-4 flex flex-col gap-4">
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <BookOpen className="w-6 h-6" />
        <h1 className="text-xl font-bold">Biblusi Books</h1>
      </div>
      
      {/* Move search input here */}
      {!selectedAuthor && !selectedBook && (
        <div className="relative flex-1 mx-4">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search books and authors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 rounded-lg ${
              darkMode 
                ? 'bg-gray-700 text-white placeholder-gray-400 border-gray-600' 
                : 'bg-white text-gray-900 placeholder-gray-500 border-gray-300'
            } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
        </div>
      )}
      
    <div className="flex items-center gap-4">
      {(selectedAuthor || selectedBook) && (
        <button
          onClick={() => {
            setSelectedAuthor(null);
            setAuthorBooks([]);
            setSelectedBook(null);
            setSearchQuery('');
          }}
          className={`px-4 py-2 rounded-lg ${
            darkMode 
              ? 'bg-gray-700 hover:bg-gray-600' 
              : 'bg-gray-100 hover:bg-gray-200'
          }`}
        >
          Back to All Books
        </button>
      )}
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'}`}
      >
        {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
      </button>
    </div>
    </div>
  </div>
</header>

      {/* Main Content */}
      <main className="container mx-auto px-4 pt-32 pb-12">
        {selectedAuthor && (
          <div className="mb-8">
            <div className={`${
              darkMode ? 'bg-gray-800' : 'bg-white'
            } rounded-lg shadow-lg p-6 mb-8`}>
              <div className="flex items-start gap-6">
                {selectedAuthor.img && (
                  <img
                    src={selectedAuthor.img}
                    alt={selectedAuthor.fullname}
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h2 className="text-2xl font-bold mb-2">{selectedAuthor.fullname}</h2>
                  {selectedAuthor.country && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-4`}>
                      {selectedAuthor.country}
                    </p>
                  )}
                  {selectedAuthor.description && (
                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {selectedAuthor.description}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <h3 className="text-xl font-bold mb-4">Books by {selectedAuthor.fullname}</h3>
          </div>
        )}

        {/* Authors Section (only show when searching) */}
        {searchQuery && searchResults.authors.length > 0 && !selectedAuthor && (
          <div className="mb-8">
            <h2 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Authors
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {searchResults.authors.map((author) => (
                <div
                  key={author.id}
                  className={`${
                    darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
                  } rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer`}
                  onClick={() => handleAuthorClick(author)}
                >
                  {author.img && (
                    <div className="aspect-square relative overflow-hidden">
                      <img
                        src={author.img}
                        alt={author.fullname}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{author.fullname}</h3>
                    {author.country && (
                      <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                        {author.country}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Books Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayedBooks.map((book) => (
            <div
              key={book.uniqueKey || book.id}
              onClick={() => handleBookClick(book)}
              className={`${
                darkMode ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:bg-gray-50'
              } rounded-lg shadow-lg overflow-hidden transition-transform duration-200 hover:-translate-y-1 cursor-pointer`}
            >
              <div className="aspect-[3/4] relative overflow-hidden">
                <img
                  src={book.min_picture}
                  alt={book.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {book.is_new === 1 && (
                  <span className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    New
                  </span>
                )}
                {book.is_bestseller === 1 && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
                    Bestseller
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold text-lg mb-2 line-clamp-2">{book.name}</h2>
                {book.author && !selectedAuthor && (
                  <p 
                    className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'} mb-2 cursor-pointer hover:underline`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleAuthorClick(book.author!);
                    }}
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
          ))}
        </div>

        {/* Loading indicator */}
        <div ref={ref} className="mt-8 text-center">
          {(loading || isSearching) && (
            <div className={`inline-block h-8 w-8 animate-spin rounded-full border-4 ${
              darkMode ? 'border-white border-t-transparent' : 'border-gray-900 border-t-transparent'
            }`} />
          )}
        </div>
      </main>
    </div>
  );
}

export default App;