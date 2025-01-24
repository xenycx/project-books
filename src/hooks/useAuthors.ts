import { useState, useCallback } from 'react';
import { Author } from '../types';
import { authorService } from '../services/authorService';

export const useAuthors = () => {
  const [authors, setAuthors] = useState<Author[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const searchAuthors = useCallback(async (query: string) => {
    if (!query) {
      setAuthors([]);
      return;
    }

    setLoading(true);
    try {
      const response = await authorService.searchAuthors(query);
      setAuthors(response.data.data);
    } catch (error) {
      console.error('Error searching authors:', error);
      setAuthors([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const getAuthorDetails = useCallback(async (id: number) => {
    setLoading(true);
    try {
      const response = await authorService.getAuthorDetails(id);
      setSelectedAuthor(response.data);
      return response.data;
    } catch (error) {
      console.error('Error fetching author details:', error);
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    authors,
    loading,
    selectedAuthor,
    searchAuthors,
    getAuthorDetails,
    setSelectedAuthor
  };
};