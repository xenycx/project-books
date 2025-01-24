// src/services/api.ts
import axios from 'axios';

export const api = axios.create({
  baseURL: 'https://apiv1.biblusi.ge/api',
  headers: {
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.6',
  }
});