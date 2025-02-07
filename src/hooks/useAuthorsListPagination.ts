import { useState, useCallback } from 'react';
import { Author } from '../types';
import { authorService } from '../services/authorService';

interface UseAuthorsReturn {
  authors: Author[];
  loading: boolean;
  hasMore: boolean;
  fetchAuthors: () => Promise<void>;
  resetAuthors: () => void;
}

export const useAuthors = (): UseAuthorsReturn => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const resetAuthors = useCallback(() => {
    setAuthors([]);
    setPage(1);
    setHasMore(true);
  }, []);

  const fetchAuthors = useCallback(async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const response = await authorService.getAuthors(page);
      const newAuthors = response.data.data;
      
      setAuthors(prevAuthors => {
        // Create a Map of existing authors using their IDs
        const existingAuthors = new Map(prevAuthors.map(author => [author.id, author]));
        
        // Add new authors, avoiding duplicates
        newAuthors.forEach(author => {
          if (!existingAuthors.has(author.id)) {
            existingAuthors.set(author.id, author);
          }
        });
        
        return Array.from(existingAuthors.values());
      });
      
      setHasMore(page < response.data.last_page);
      setPage(prev => prev + 1);
    } catch (error) {
      console.error('Error fetching authors:', error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }, [loading, hasMore, page]);

  return { authors, loading, hasMore, fetchAuthors, resetAuthors };
};