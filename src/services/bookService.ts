// src/services/bookService.ts
import { api } from './api';
import { ApiResponse, BookDetails } from '../types';

export const bookService = {
   getBooks: (page: number, params = {}) => 
      api.get<ApiResponse>('/book', {
        params: {
          page,
          per_page: 12,
          order: 'created_at',
          sort: 'desc',
          ...params
        }
      }),

  searchBooks: (query: string) =>
    api.get<ApiResponse>('/book', {
      params: { q: query }
    }),

  getBookDetails: (id: number) =>
    api.get<BookDetails>(`/book/${id}`, {
      params: {
        author: 1,
        category: 1,
        rate: 1
      }
    })
};