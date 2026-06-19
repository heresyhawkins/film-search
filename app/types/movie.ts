interface NameEntry {
  name: string;
  language: string | null;
  type: string;
}

interface Genre {
  name: string;
}

interface Country {
  name: string;
}

export interface Movie {
  id: number;
  name: string;
  names?: NameEntry[];
  genres?: Genre[];
  countries?: Country[];
  year: number;
  description: string;
  poster?: { url: string; previewUrl: "string" };
  rating?: {
    kp?: number;
    imdb?: number;
    filmCritics?: number;
    russianFilmCritics?: number;
    await?: number;
  };
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
