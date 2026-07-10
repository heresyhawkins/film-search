import { z } from "zod";

import {
  TMDBGenreSchema,
  TMDBMovieSchema,
  TMDBSearchMovieResponseSchema,
  TMDBSearchTVResponseSchema,
  TMDBTVShowSchema,
} from "./schemas";

export interface ShowFilters {
  title?: string;
  genre?: number;
  page?: number;
  limit?: number;
}

export type TMDBMovie = z.infer<typeof TMDBMovieSchema>;

export type TMDBSearchMovieResponse = z.infer<
  typeof TMDBSearchMovieResponseSchema
>;

export type TMDBTVShow = z.infer<typeof TMDBTVShowSchema>;

export type TMDBSearchTVResponse = z.infer<typeof TMDBSearchTVResponseSchema>;

export type TMDBMediaItem = TMDBMovie | TMDBTVShow;
export type TMDBSearchResponse = TMDBSearchMovieResponse | TMDBSearchTVResponse;

export type TMDBGenre = z.infer<typeof TMDBGenreSchema>;
