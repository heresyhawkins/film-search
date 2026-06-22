export interface ShowFilters {
  title?: string;
  genre?: string;
  page?: number;
  limit?: number;
}

interface TVMazeShowImage {
  medium?: string;
  original?: string;
}

export interface TVMazeShow {
  id: number;
  name: string;
  genres: string[];
  image?: TVMazeShowImage;
  premiered: string;
  rating?: {
    average: number;
  };
  status: string;
  summary?: string;
  network?: {
    name: string;
  };
  webChannel?: {
    name: string;
  };
}

export interface TVMazeSearchResult {
  score: number;
  show: TVMazeShow;
}
