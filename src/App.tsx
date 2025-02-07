import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Book, Author, BookDetails } from './types';
import { bookService } from './services/bookService';
import { authorService } from './services/authorService';
import { useBooks } from './hooks/useBooks';
import { useAuthors as useAuthorsList } from './hooks/useAuthorsListPagination';
import { useAuthors as useAuthorDetails } from './hooks/useAuthors';
import { useDarkMode } from './store/darkModeStore';
import { CategoryList } from './components/books/CategoryList';
import { BookCard } from './components/books/BookCard';

function App() {
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);
  const { books, loading: loadingBooks, hasMore: hasMoreBooks, fetchBooks } = useBooks(selectedCategoryId || undefined);
  const { authors, loading: loadingAuthors, hasMore: hasMoreAuthors, fetchAuthors } = useAuthorsList();
  const { getAuthorDetails, selectedAuthor, setSelectedAuthor } = useAuthorDetails();
  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    books: Book[];
    authors: Author[];
  }>({ books: [], authors: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const { ref: booksRef, inView: booksInView } = useInView();

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults({ books: [], authors: [] });
      setIsSearching(false);
      return;
    }
  
    setIsSearching(true);
    try {
      const [booksResponse, authorsResponse] = await Promise.all([
        bookService.searchBooks(query),
        authorService.searchAuthors(query)
      ]);
  
      setSearchResults({
        books: booksResponse.data.data,
        authors: authorsResponse.data.data
      });
    } catch (error) {
      console.error('Error searching:', error);
      setSearchResults({ books: [], authors: [] });
    } finally {
      setIsSearching(false);
    }
  }, []);

  const handleBookClick = useCallback(async (book: Book) => {
    // Book click handler can be implemented later
    console.log('Book clicked:', book);
  }, []);

  const handleAuthorClick = useCallback(async (authorOrId: Author | number) => {
    try {
      const authorId = typeof authorOrId === 'number' ? authorOrId : authorOrId.id;
      const authorDetails = await getAuthorDetails(authorId);
      if (authorDetails) {
        setSelectedAuthor(authorDetails);
        setAuthorBooks(authorDetails.books || []);
      }
    } catch (error) {
      console.error('Error fetching author details:', error);
    }
  }, [getAuthorDetails, setSelectedAuthor]);

  useEffect(() => {
    if (!books.length && !loadingBooks && !searchQuery && !selectedAuthor) {
      fetchBooks();
    }
  }, [books.length, loadingBooks, searchQuery, selectedAuthor, fetchBooks, selectedCategoryId]);

  useEffect(() => {
    if (booksInView && hasMoreBooks && !loadingBooks && !searchQuery && !selectedAuthor) {
      fetchBooks();
    }
  }, [booksInView, hasMoreBooks, loadingBooks, searchQuery, selectedAuthor, fetchBooks]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[250px,1fr] gap-8">
            <aside className="lg:sticky lg:top-8 lg:h-[calc(100vh-4rem)]">
              <CategoryList 
                onSelectCategory={setSelectedCategoryId}
                selectedCategoryId={selectedCategoryId}
                darkMode={darkMode}
              />
            </aside>
            
            <main className="space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {books.map((book) => (
                  <BookCard
                    key={book.id}
                    book={book}
                    onBookClick={handleBookClick}
                    onAuthorClick={handleAuthorClick}
                    darkMode={darkMode}
                  />
                ))}
              </div>
              
              {loadingBooks && (
                <div className="flex justify-center">
                  <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              
              <div ref={booksRef} />
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;