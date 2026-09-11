import { TMDBGenre } from "../types/movie";
import { TMDBGenreListResponseSchema } from "../types/schemas";
import { request } from "./client";

export const fetchGenres = async (): Promise<TMDBGenre[]> => {
  const { genres } = await request(
    "/genre/movie/list",
    TMDBGenreListResponseSchema,
  );

  return genres;
};
