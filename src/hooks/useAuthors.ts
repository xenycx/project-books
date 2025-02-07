import { useState, useCallback } from 'react';
import { Author } from '../types';
import { authorService } from '../services/authorService';

interface UseAuthorsReturn {
  selectedAuthor: Author | null;
  setSelectedAuthor: (author: Author | null) => void;
  getAuthorDetails: (id: number) => Promise<Author | null>;
}

export const useAuthors = (): UseAuthorsReturn => {
  const [selectedAuthor, setSelectedAuthor] = useState<Author | null>(null);

  const getAuthorDetails = useCallback(async (id: number) => {
    try {
      const response = await authorService.getAuthorDetails(id);
      return response.data;
    } catch (error) {
      console.error('Error fetching author details:', error);
      return null;
    }
  }, []);

  return { selectedAuthor, setSelectedAuthor, getAuthorDetails };
};