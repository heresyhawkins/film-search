import { ShowFilters, TMDBSearchMovieResponse } from "../types/movie";
import { TMDBSearchMovieResponseSchema } from "../types/schemas";
import { request } from "./client";

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
