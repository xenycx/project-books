// src/hooks/useBooks.ts
import { useState, useEffect, useCallback, useRef } from 'react';
import { Book } from '../types';
import { bookService } from '../services/bookService';

interface UseBooksReturn {
  books: Book[];
  loading: boolean;
  hasMore: boolean;
  fetchBooks: () => Promise<void>;
  resetBooks: () => void;
}

export const useBooks = (categoryId?: number): UseBooksReturn => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const currentCategoryRef = useRef(categoryId);

  const resetBooks = useCallback(() => {
    setBooks([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const fetchBooks = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await bookService.getBooks(page, categoryId);
      const newBooks = response.data.data;
      
      setBooks(prevBooks => {
        // For first page or category change, replace all books
        if (page === 1) {
          return newBooks;
        }
        
        // For subsequent pages, merge while avoiding duplicates
        const existingBooks = new Map(prevBooks.map(book => [book.id, book]));
        newBooks.forEach(book => {
          if (!existingBooks.has(book.id)) {
            existingBooks.set(book.id, book);
          }
        });
        
        return Array.from(existingBooks.values());
      });
      
      setHasMore(newBooks.length > 0 && page < (response.data.last_page || 1));
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching books:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page, categoryId]);

  // Handle category changes
  useEffect(() => {
    if (currentCategoryRef.current !== categoryId) {
      currentCategoryRef.current = categoryId;
      setBooks([]);
      setPage(1);
      setHasMore(true);
      
      const loadNewCategory = async () => {
        if (!loading) {
          setLoading(true);
          try {
            const response = await bookService.getBooks(1, categoryId);
            const newBooks = response.data.data;
            setBooks(newBooks);
            setHasMore(newBooks.length > 0 && 1 < (response.data.last_page || 1));
            setPage(2);
          } catch (error) {
            console.error('Error fetching books for new category:', error);
            setHasMore(false);
          } finally {
            setLoading(false);
          }
        }
      };
      loadNewCategory();
    }
  }, [categoryId, loading]);

  return { 
    books, 
    loading, 
    hasMore, 
    fetchBooks, 
    resetBooks,
  };
};