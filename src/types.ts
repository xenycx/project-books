export interface Book {
  id: number;
  name: string;
  min_picture: string;
  is_new: number;
  is_bestseller: number;
  variations: Array<{
    price: number;
    discount: number;
  }>;
  author?: Author;
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
}

export interface ApiResponse {
  data: Book[];
  last_page: number;
}

export interface BookWithKey extends Book {
  uniqueKey?: string;
}