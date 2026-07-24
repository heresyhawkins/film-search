import { z } from "zod";

import {
  TMDBGenreSchema,
  TMDBMovieSchema,
  TMDBSearchMovieResponseSchema,
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

export type TMDBGenre = z.infer<typeof TMDBGenreSchema>;
