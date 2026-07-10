import { z } from "zod";

export const TMDBMovieSchema = z.object({
  id: z.number(),
  title: z.string(),
  original_title: z.string().optional(),
  overview: z.string().nullable(),
  poster_path: z.string().nullable(),
  backdrop_path: z.string().nullable(),
  release_date: z.string().nullable(),
  vote_average: z.number(),
  genre_ids: z.array(z.number()),
  adult: z.boolean().optional(),
  popularity: z.number().optional(),
});

export const TMDBSearchMovieResponseSchema = z.object({
  page: z.number(),
  results: z.array(TMDBMovieSchema),
  total_pages: z.number(),
  total_results: z.number(),
});

export const TMDBGenreSchema = z.object({
  id: z.number(),
  name: z.string(),
});

export const TMDBGenreListResponseSchema = z.object({
  genres: z.array(TMDBGenreSchema),
});
