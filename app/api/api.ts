import { type ZodType } from "zod";

import type { ShowFilters, TMDBMovie } from "../types/movie";
import type { TMDBGenre } from "../types/movie";
import { TMDBSearchMovieResponseSchema } from "../types/schemas";
import { TMDBGenreListResponseSchema } from "../types/schemas";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN;

export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly url: string,
    statusText: string,
  ) {
    super(`${status} ${statusText}: ${url}`);
    this.name = "ApiError";
  }
}

const options = {
  method: "GET",
  headers: { accept: "application/json", Authorization: `Bearer ${API_TOKEN}` },
};

const apiFetch = async <T>(url: string, schema: ZodType<T>): Promise<T> => {
  const response = await fetch(url, options);

  if (!response.ok) {
    throw new ApiError(response.status, url, response.statusText);
  }

  return schema.parse(await response.json());
};

export const fetchMovies = async (
  filters: ShowFilters = {},
): Promise<TMDBMovie[]> => {
  if (filters.title) {
    const response = await apiFetch(
      `${BASE_URL}/search/movie?query=${encodeURIComponent(filters.title)}&page=1&language=en-US`,
      TMDBSearchMovieResponseSchema,
    );

    return response.results;
  }

  if (filters.genre) {
    const response = await apiFetch(
      `${BASE_URL}/discover/movie?with_genres=${filters.genre}&language=en-US`,

      TMDBSearchMovieResponseSchema,
    );

    return response.results;
  }

  return [];
};

export const fetchGenres = async (): Promise<TMDBGenre[]> => {
  const response = await apiFetch(
    `${BASE_URL}/genre/movie/list?language=en-US`,
    TMDBGenreListResponseSchema,
  );

  return response.genres;
};
