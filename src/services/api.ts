// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://apiv1.biblusi.ge/api',
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.6',
  }
});

export const fetchCategories = async () => {
  try {
    const response = await api.get('/category');
    return response.data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};