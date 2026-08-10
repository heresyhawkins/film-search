import { type ZodType } from "zod";

import type { ShowFilters, TMDBSearchMovieResponse } from "../types/movie";
import type { TMDBGenre } from "../types/movie";
import {
  TMDBGenreListResponseSchema,
  TMDBSearchMovieResponseSchema,
} from "../types/schemas";

if (!process.env.NEXT_PUBLIC_API_URL || !process.env.NEXT_PUBLIC_API_TOKEN) {
  throw new Error("NEXT_PUBLIC_API_URL and NEXT_PUBLIC_API_TOKEN must be set");
}

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
  page?: number,
  filters: ShowFilters = {},
): Promise<TMDBSearchMovieResponse> => {
  if (filters.title) {
    const url = new URL(`${BASE_URL}/search/movie`);
    url.searchParams.set("query", filters.title);
    url.searchParams.set("page", String(page));

    const response = await apiFetch(`${url}`, TMDBSearchMovieResponseSchema);

    return response;
  }

  if (filters.genre) {
    const url = new URL(`${BASE_URL}/discover/movie`);
    url.searchParams.set("with_genres", String(filters.genre));
    url.searchParams.set("page", String(page));

    const response = await apiFetch(`${url}`, TMDBSearchMovieResponseSchema);

    return response;
  }

  const response = await apiFetch(
    `${BASE_URL}/discover/movie?page=${page}&language=en-US`,
    TMDBSearchMovieResponseSchema,
  );

  return response;
};

export const fetchGenres = async (): Promise<TMDBGenre[]> => {
  const response = await apiFetch(
    `${BASE_URL}/genre/movie/list?language=en-US`,
    TMDBGenreListResponseSchema,
  );

  return response.genres;
};
