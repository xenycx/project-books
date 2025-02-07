import { useState, useCallback } from 'react';
import { Author } from '../types';
import { authorService } from '../services/authorService';

interface UseAuthorsSearchReturn {
  searchAuthors: (query: string) => Promise<Author[]>;
}

export const useAuthorsSearch = (): UseAuthorsSearchReturn => {
  const searchAuthors = useCallback(async (query: string) => {
    try {
      const response = await authorService.searchAuthors(query);
      return response.data.data;
    } catch (error) {
      console.error('Error searching authors:', error);
      return [];
    }
  }, []);

  return { searchAuthors };
};