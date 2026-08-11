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

type QueryParams = Record<string, string | number | null | undefined>;

const request = async <T>(
  path: string,
  schema: ZodType<T>,
  params?: QueryParams,
): Promise<T> => {
  const url = new URL(`${BASE_URL}${path}`);
  url.searchParams.set("language", "en-US");

  if (params) {
    for (const [key, value] of Object.entries(params)) {
      if (value != null && value !== "") {
        url.searchParams.set(key, String(value));
      }
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

export const fetchMovies = (
  page = 1,
  filters: ShowFilters = {},
): Promise<TMDBSearchMovieResponse> => {
  if (filters.title) {
    return request("/search/movie", TMDBSearchMovieResponseSchema, {
      query: filters.title,
      page,
    });
  }

  return request("/discover/movie", TMDBSearchMovieResponseSchema, {
    with_genres: filters.genre,
    page,
  });
};

export const fetchGenres = async (): Promise<TMDBGenre[]> => {
  const { genres } = await request(
    "/genre/movie/list",
    TMDBGenreListResponseSchema,
  );

  return genres;
};
