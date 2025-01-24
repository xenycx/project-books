import { useState, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { Book, Author, BookDetails } from './types';
import { Layout } from './components/layout/Layout';
import { BookList } from './components/books/BookList';
import { AuthorList } from './components/authors/AuthorList';
import { authorService } from './services/authorService';
import { BookDetailsView } from './components/books/BookDetails';
import { useBooks } from './hooks/useBooks';
import { useAuthors } from './hooks/useAuthors';
import { useDarkMode } from './store/darkModeStore';
import { bookService } from './services/bookService';
import { AuthorDetails } from './components/authors/AuthorDetails';

function App() {
  const { books, loading, hasMore, fetchBooks } = useBooks();
  const { 
    getAuthorDetails, 
    selectedAuthor, 
    setSelectedAuthor 
  } = useAuthors();

  const { darkMode, toggleDarkMode } = useDarkMode();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{
    books: Book[];
    authors: Author[];
  }>({ books: [], authors: [] });
  const [isSearching, setIsSearching] = useState(false);
  const [authorBooks, setAuthorBooks] = useState<Book[]>([]);
  const { ref, inView } = useInView();
  const [selectedBook, setSelectedBook] = useState<BookDetails | null>(null);
  const [loadingBookDetails, setLoadingBookDetails] = useState(false);

  const handleSearch = useCallback(async (query: string) => {
    if (!query) {
      setSearchResults({ books: [], authors: [] });
      setIsSearching(false);
      return;
    }
  
    setIsSearching(true);
    try {
      // Parallel API calls for both books and authors
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
    setLoadingBookDetails(true);
    try {
      const response = await bookService.getBookDetails(book.id);
      setSelectedBook(response.data);
    } catch (error) {
      console.error('Error fetching book details:', error);
    } finally {
      setLoadingBookDetails(false);
    }
  }, []);

  const handleAuthorClick = useCallback(async (authorOrId: Author | number) => {
    try {
      const authorId = typeof authorOrId === 'number' ? authorOrId : authorOrId.id;
      const authorDetails = await getAuthorDetails(authorId);
      if (authorDetails) {
        setSelectedAuthor(authorDetails);
        // Books are included in author details
        setAuthorBooks(authorDetails.books || []);
      }
    } catch (error) {
      console.error('Error fetching author details:', error);
    }
  }, [getAuthorDetails]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(searchQuery);
    }, 300); // Debounce search
  
    return () => clearTimeout(timeoutId);
  }, [searchQuery, handleSearch]);

  useEffect(() => {
    if (inView && hasMore && !loading && !searchQuery && !selectedAuthor) {
      fetchBooks();
    }
  }, [inView, hasMore, loading, searchQuery, selectedAuthor, fetchBooks]);

  const displayedBooks = selectedAuthor 
    ? authorBooks
    : searchQuery 
      ? searchResults.books
      : books;

      return (
        <Layout
          darkMode={darkMode}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          onDarkModeToggle={toggleDarkMode}
          onBackClick={selectedAuthor || selectedBook ? () => {
            setSelectedAuthor(null);
            setAuthorBooks([]);
            setSelectedBook(null);
            setSearchQuery('');
          } : undefined}
          showSearch={true}
        >
          <div className="container mx-auto">
            {selectedAuthor ? (
              <AuthorDetails
                author={selectedAuthor}
                books={authorBooks}
                darkMode={darkMode}
                onClose={() => setSelectedAuthor(null)}
                onBookClick={handleBookClick}
              />
            ) : selectedBook ? (
              <BookDetailsView
                book={selectedBook}
                darkMode={darkMode}
                onClose={() => setSelectedBook(null)}
                onAuthorClick={handleAuthorClick}
                loadingBookDetails={loadingBookDetails}
              />
            ) : (
              <>
                {searchQuery && searchResults.authors.length > 0 && (
                  <AuthorList
                    authors={searchResults.authors}
                    darkMode={darkMode}
                    onAuthorClick={handleAuthorClick}
                  />
                )}
                <BookList
                  books={displayedBooks}
                  darkMode={darkMode}
                  onBookClick={handleBookClick}
                  onAuthorClick={handleAuthorClick}
                  loading={loading || isSearching}
                  loadingRef={ref}
                  selectedAuthor={!!selectedAuthor}
                />
              </>
            )}
          </div>
        </Layout>
      );
}

export default App;