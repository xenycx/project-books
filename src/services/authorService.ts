import { api } from './api';
import { Author } from '../types';

export const authorService = {
  searchAuthors: (query: string) =>
    api.get<{
      current_page: number;
      data: Author[];
      total: number;
    }>('/author', {
      params: { q: query }
    }),

  getAuthorDetails: (id: number) =>
    api.get<Author>(`/author/${id}`)
};