// src/hooks/useBooks.ts
import { useState, useCallback } from 'react';
import { BookWithKey } from '../types';
import { bookService } from '../services/bookService';

export const useBooks = () => {
  const [books, setBooks] = useState<BookWithKey[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchBooks = useCallback(async () => {
    try {
      setLoading(true);
      const response = await bookService.getBooks(page);

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

  return { books, loading, hasMore, fetchBooks };
};