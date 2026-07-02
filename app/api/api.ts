import { type ZodType } from "zod";

import type { ShowFilters, TVMazeShow } from "../types/movie";
import {
  TVMazeSearchResultArraySchema,
  TVMazeShowArraySchema,
} from "../types/schemas";

const BASE_URL = "https://api.tvmaze.com";

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

const apiFetch = async <T>(url: string, schema: ZodType<T>): Promise<T> => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new ApiError(response.status, url, response.statusText);
  }

  return schema.parse(await response.json());
};

export const fetchShows = async (
  filters: ShowFilters = {},
): Promise<TVMazeShow[]> => {
  if (filters.title) {
    const results = await apiFetch(
      `${BASE_URL}/search/shows?q=${encodeURIComponent(filters.title)}`,
      TVMazeSearchResultArraySchema,
    );

    return results.map((item) => item.show);
  }

  if (filters.genre) {
    return apiFetch(
      `${BASE_URL}/shows?genre=${encodeURIComponent(filters.genre)}`,
      TVMazeShowArraySchema,
    );
  }

  return [];
};
