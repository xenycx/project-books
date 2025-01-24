export interface Book {
  id: number;
  name: string;
  pictures: string[];
  min_picture: string;
  author: Author | null;
  p: number;
  is_bestseller: number;
  is_new: number;
  variations: Variation[];
}

export interface Author {
  id: number;
  fullname: string;
  img: string;
  description: string;
  country: string;
  year_start: string;
  year_end: string | null;
  books?: Book[];
}

export interface Variation {
  id: number;
  price: number;
  discount: number;
  discount_value: number;
}

export interface ApiResponse {
  current_page: number;
  data: Book[];
  last_page: number;
  total: number;
}