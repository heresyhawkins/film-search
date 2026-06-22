import { ShowFilters } from "../types/movie";

const BASE_URL = "https://api.tvmaze.com";

export const fetchShows = async (filters: ShowFilters = {}): Promise<any> => {
  let url: string;

  if (filters.title) {
    url = `${BASE_URL}/search/shows?q=${encodeURIComponent(filters.title)}`;
  } else if (filters.genre) {
    url = `${BASE_URL}/shows?genre=${encodeURIComponent(filters.genre)}`;
  } else {
    return [];
  }

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Error API: ${response.status}`);
  }

  const data = await response.json();
  return data;
};
