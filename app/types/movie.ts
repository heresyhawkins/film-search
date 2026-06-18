export interface Movie {
  id: number;
  name: string;
  year: number;
  description: string;
  poster?: string;
  rating?: number;
}

export interface MoviesResponse {
  docs: Movie[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

export interface MovieFilters {
  year?: number;
  genre?: string;
  page?: number;
  limit?: number;
}
