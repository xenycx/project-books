import axios from 'axios';
import { AuthorApiResponse, Author } from '../types';

const API_URL = 'https://apiv1.biblusi.ge/api';

const headers = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.7',
  'cache-control': 'no-cache',
  'pragma': 'no-cache',
  'Referer': 'https://biblusi.ge/',
};

export const authorService = {
  getAuthors: (page: number = 1) => {
    return axios.get<AuthorApiResponse>(`${API_URL}/author`, {
      params: { page },
      headers
    });
  },

  searchAuthors: (query: string) =>
    axios.get<AuthorApiResponse>(`${API_URL}/author`, {
      params: { q: query },
      headers
    }),

  getAuthorDetails: (id: number) =>
    axios.get<Author>(`${API_URL}/author/${id}`, { headers })
};