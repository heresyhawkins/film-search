import { MoviesResponse, MovieFilters } from "../types/movie";

const API_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export async function fetchMovies(
  filters: MovieFilters = {},
): Promise<MoviesResponse> {
  const params = new URLSearchParams();

  if (filters.year) params.append("year", String(filters.year));
  if (filters.genre)
    params.append("genres.name", filters.genre.toLocaleLowerCase());
  if (filters.page) params.append("page", String(filters.page));
  params.append("limit", String(filters.limit ?? 10));

  const url = `${API_URL}/movie?${params.toString()}`;

  const response = await fetch(url, {
    headers: {
      "X-API-Key": API_TOKEN,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Ошибка API: ${response.status}`);
  }

  return response.json();
}
