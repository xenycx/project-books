export const CATEGORY_IDS = {
  'წიგნები': 291,
  'აქსესუარები': 402,
  'სასკოლო': 619,
  'საახალწლო': 634,
  'სათამაშოები': 525,
} as const;

export type CategoryId = typeof CATEGORY_IDS[keyof typeof CATEGORY_IDS];

export interface Book {
  id: number;
  name: string;
  min_picture: string;
  is_new: number;
  is_bestseller: number;
  variations: Array<{
    price: number;
    discount: number;
    stock_count?: number;  // Add this line
  }>;
  author?: Author;
  category?: {
    id: number;
    name: string;
    description?: string;
  };
}

// src/types.ts
export interface BookDetails extends Book {
  isbn?: string;
  publisher?: string;
  translator?: string;
  language?: string;
  description?: string;
  details?: {
    desc?: string;
    youtube_link?: string;
    soundcloud_link?: string;
    book_link?: string;
  };
  category?: {
    id: number;
    name: string;
    description?: string;
  };
  variations: Array<{
    price: number;
    discount: number;
    specs?: Array<{
      value: string;
      element: {
        label: string;
      };
    }>;
  }>;
}

export interface Author {
  id: number;
  fullname: string;
  img?: string;
  country?: string;
  description?: string;
  books?: Book[];
  translations?: Array<{
    id: number;
    author_id: number;
    locale: string;
    country: string;
    fullname: string;
    description: string;
  }>;
  year_start?: string;
  year_end?: string;
  best_of_week?: number;
  best_of_week_books?: any;
}

export interface AuthorApiResponse {
  current_page: number;
  data: Author[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface ApiResponse {
  data: Book[];
  last_page: number;
}

export interface BookWithKey extends Book {
  uniqueKey?: string;
}