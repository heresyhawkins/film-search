import { type ZodType } from "zod";

import type {
  ShowFilters,
  TMDBGenre,
  TMDBSearchMovieResponse,
} from "../types/movie";
import {
  TMDBGenreListResponseSchema,
  TMDBSearchMovieResponseSchema,
} from "../types/schemas";

const BASE_URL = import.meta.env.VITE_API_URL;
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

if (!BASE_URL || !API_TOKEN) {
  throw new Error("VITE_API_URL and VITE_API_TOKEN must be set");
}

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

// Params whose value is null/undefined/empty are skipped, so callers can pass optional filters as-is.
type QueryParams = Record<string, string | number | null | undefined>;

const request = async <T>(
  path: string,
  params: QueryParams,
  schema: ZodType<T>,
): Promise<T> => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");

  for (const [key, value] of Object.entries(params)) {
    if (value != null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  }

  const response = await fetch(url, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${API_TOKEN}`,
    },
  });

  if (!response.ok) {
    throw new ApiError(response.status, url.toString(), response.statusText);
  }

  return schema.parse(await response.json());
};

// TMDB has no endpoint that accepts a free-text query and a genre filter together:
// /search/movie ignores `with_genres` and /discover/movie ignores `query`. A title
// search therefore takes precedence over a genre filter, matching the exclusive UI.
export const fetchMovies = (
  page = 1,
  filters: ShowFilters = {},
): Promise<TMDBSearchMovieResponse> => {
  if (filters.title) {
    return request(
      "/search/movie",
      { query: filters.title, page },
      TMDBSearchMovieResponseSchema,
    );
  }

  return request(
    "/discover/movie",
    { with_genres: filters.genre, page },
    TMDBSearchMovieResponseSchema,
  );
};

export const fetchGenres = async (): Promise<TMDBGenre[]> => {
  const { genres } = await request(
    "/genre/movie/list",
    {},
    TMDBGenreListResponseSchema,
  );

  return genres;
};
